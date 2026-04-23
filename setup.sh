#!/usr/bin/env bash
# =============================================================================
#  Launchsite VPS Setup Script
#  Run once on a fresh Ubuntu 22.04 / 24.04 VPS as root or with sudo.
#  After this script finishes, copy your code to APP_DIR then run deploy.sh.
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ OK ]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
die()   { echo -e "${RED}[FAIL]${NC}  $*" >&2; exit 1; }

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}     Launchsite VPS Setup                      ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

[[ $EUID -ne 0 ]] && die "Please run as root: sudo bash setup.sh"

# ---------------------------------------------------------------------------
# 1. Collect configuration
# ---------------------------------------------------------------------------
echo -e "${YELLOW}Configuration${NC}"
read -rp "  Main domain (e.g. launchsite.certxa.com): " MAIN_DOMAIN
[[ -z "$MAIN_DOMAIN" ]] && die "Domain cannot be empty."

read -rp "  Email for SSL certificate notices: "        SSL_EMAIL
[[ -z "$SSL_EMAIL" ]] && die "Email cannot be empty."

read -rp "  Database name   [launchsite]: "             DB_NAME;  DB_NAME="${DB_NAME:-launchsite}"
read -rp "  Database user   [launchsite]: "             DB_USER;  DB_USER="${DB_USER:-launchsite}"
read -rsp "  Database password (input hidden): "        DB_PASS;  echo ""
[[ -z "$DB_PASS" ]] && die "Database password cannot be empty."

read -rp "  App directory   [/opt/launchsite]: "        APP_DIR;  APP_DIR="${APP_DIR:-/opt/launchsite}"
read -rp "  Clients dir     [/var/www/clients]: "       CLIENTS_DIR; CLIENTS_DIR="${CLIENTS_DIR:-/var/www/clients}"

echo ""
echo -e "${YELLOW}Mailgun (for password reset emails)${NC}"
read -rsp "  Mailgun API key (leave blank to skip): "  MAILGUN_API_KEY; echo ""
if [[ -n "$MAILGUN_API_KEY" ]]; then
  read -rp "  Mailgun domain  (e.g. mg.yourdomain.com): " MAILGUN_DOMAIN
  read -rp "  From email      (e.g. noreply@launchsite.com): " MAILGUN_FROM_EMAIL
else
  warn "No Mailgun API key — password reset emails will not be sent until configured."
  MAILGUN_DOMAIN=""
  MAILGUN_FROM_EMAIL=""
fi

ESCAPED_DOMAIN=$(echo "$MAIN_DOMAIN" | sed 's/\./\\\\./g')
JWT_SECRET=$(openssl rand -hex 32)

echo ""
info "Domain       : $MAIN_DOMAIN"
info "App dir      : $APP_DIR"
info "Clients dir  : $CLIENTS_DIR"
info "DB           : $DB_NAME @ localhost (user: $DB_USER)"
[[ -n "$MAILGUN_API_KEY" ]] && info "Mailgun      : $MAILGUN_DOMAIN (from: $MAILGUN_FROM_EMAIL)"
echo ""
read -rp "Continue? [y/N]: " CONFIRM
[[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && die "Aborted."

# ---------------------------------------------------------------------------
# 2. System update
# ---------------------------------------------------------------------------
info "Updating system packages..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  curl git wget gnupg lsb-release ca-certificates \
  ufw nginx certbot python3-certbot-nginx \
  openssl
ok "System packages updated."

# ---------------------------------------------------------------------------
# 3. Node.js 24
# ---------------------------------------------------------------------------
info "Installing Node.js 24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | bash - >/dev/null 2>&1
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
NODE_VER=$(node --version)
ok "Node.js installed: $NODE_VER"

# ---------------------------------------------------------------------------
# 4. pnpm
# ---------------------------------------------------------------------------
info "Installing pnpm..."
npm install -g pnpm@latest --quiet
ok "pnpm installed: $(pnpm --version)"

# ---------------------------------------------------------------------------
# 5. PM2
# ---------------------------------------------------------------------------
info "Installing PM2..."
npm install -g pm2@latest --quiet
ok "PM2 installed."

# ---------------------------------------------------------------------------
# 6. PostgreSQL 16
# ---------------------------------------------------------------------------
info "Installing PostgreSQL 16..."
sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list'
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql-16
systemctl enable postgresql
systemctl start postgresql
ok "PostgreSQL 16 installed and running."

# ---------------------------------------------------------------------------
# 7. Database setup
# ---------------------------------------------------------------------------
info "Creating database and user..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN
    CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASS';
  END IF;
END \$\$;

SELECT 'CREATE DATABASE "$DB_NAME" OWNER "$DB_USER"'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')
\gexec

GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";
SQL
ok "Database '$DB_NAME' ready."

# ---------------------------------------------------------------------------
# 8. Directory structure
# ---------------------------------------------------------------------------
info "Creating directory structure..."
mkdir -p "$APP_DIR"
mkdir -p "$CLIENTS_DIR"
mkdir -p /var/log/launchsite
chown -R www-data:www-data "$CLIENTS_DIR"
chmod 755 "$CLIENTS_DIR"
ok "Directories created."

# ---------------------------------------------------------------------------
# 9. Environment file
# ---------------------------------------------------------------------------
info "Writing .env file..."
cat > "$APP_DIR/.env" <<ENV
NODE_ENV=production
PORT=8080

DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

JWT_SECRET=${JWT_SECRET}

MAIN_DOMAIN=${MAIN_DOMAIN}
CLIENTS_DIR=${CLIENTS_DIR}
APP_DIR=${APP_DIR}

MAILGUN_API_KEY=${MAILGUN_API_KEY}
MAILGUN_DOMAIN=${MAILGUN_DOMAIN}
MAILGUN_FROM_EMAIL=${MAILGUN_FROM_EMAIL}
ENV
chmod 600 "$APP_DIR/.env"
ok ".env written to $APP_DIR/.env"

# ---------------------------------------------------------------------------
# 10. Update ecosystem.config.cjs with real values
# ---------------------------------------------------------------------------
info "Updating PM2 ecosystem config..."
ECOSYSTEM="$APP_DIR/ecosystem.config.cjs"
if [[ -f "$ECOSYSTEM" ]]; then
  sed -i "s|launchsite.certxa.com|$MAIN_DOMAIN|g" "$ECOSYSTEM"
  sed -i "s|/var/www/clients|$CLIENTS_DIR|g"       "$ECOSYSTEM"
  ok "ecosystem.config.cjs updated."
else
  warn "ecosystem.config.cjs not found in $APP_DIR — update MAIN_DOMAIN and CLIENTS_DIR manually after deploying code."
fi

# ---------------------------------------------------------------------------
# 11. Nginx configuration
# ---------------------------------------------------------------------------
info "Configuring Nginx..."

cat > /etc/nginx/sites-available/launchsite <<'NGINXEOF'
# ─── Main application ────────────────────────────────────────────────────────
server {
    listen 80;
    server_name MAIN_DOMAIN_PLACEHOLDER;

    root APP_DIR_PLACEHOLDER/artifacts/webpage-editor/dist;
    index index.html;

    # API backend
    location /api/ {
        proxy_pass         http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # React SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# ─── Client subdomains: *.MAIN_DOMAIN_PLACEHOLDER ────────────────────────────
server {
    listen 80;
    server_name ~^(?<subdomain>.+)\.ESCAPED_DOMAIN_PLACEHOLDER$;

    # API calls made by the template JS (relative /api/… URLs)
    location /api/ {
        proxy_pass         http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Template and static assets via site-router
    location / {
        proxy_pass         http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

# ─── Custom client domains — catch-all ───────────────────────────────────────
server {
    listen 80 default_server;
    server_name _;

    # API calls made by the template JS
    location /api/ {
        proxy_pass         http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Template via site-router
    location / {
        proxy_pass         http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

sed -i "s|MAIN_DOMAIN_PLACEHOLDER|${MAIN_DOMAIN}|g"           /etc/nginx/sites-available/launchsite
sed -i "s|APP_DIR_PLACEHOLDER|${APP_DIR}|g"                   /etc/nginx/sites-available/launchsite
sed -i "s|ESCAPED_DOMAIN_PLACEHOLDER|${ESCAPED_DOMAIN}|g"     /etc/nginx/sites-available/launchsite

ln -sf /etc/nginx/sites-available/launchsite /etc/nginx/sites-enabled/launchsite
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
ok "Nginx configured and reloaded."

# ---------------------------------------------------------------------------
# 12. Firewall
# ---------------------------------------------------------------------------
info "Configuring UFW firewall..."
ufw --force reset >/dev/null
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow 22/tcp    comment 'SSH'
ufw allow 80/tcp    comment 'HTTP'
ufw allow 443/tcp   comment 'HTTPS'
ufw --force enable >/dev/null
ok "Firewall enabled (SSH, HTTP, HTTPS)."

# ---------------------------------------------------------------------------
# 13. SSL — main domain (requires DNS already pointing to this server)
# ---------------------------------------------------------------------------
info "Requesting SSL certificate for $MAIN_DOMAIN..."
if certbot --nginx -d "$MAIN_DOMAIN" \
    --non-interactive --agree-tos \
    --email "$SSL_EMAIL" --redirect 2>/dev/null; then
  ok "SSL certificate issued for $MAIN_DOMAIN."
else
  warn "SSL not issued yet — DNS may not be pointing to this server."
  warn "Once DNS is set, run: certbot --nginx -d $MAIN_DOMAIN --email $SSL_EMAIL --redirect"
fi

# ---------------------------------------------------------------------------
# 14. Wildcard SSL instructions
# ---------------------------------------------------------------------------
echo ""
echo -e "${YELLOW}━━━ Wildcard SSL (for *.${MAIN_DOMAIN}) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  Client subdomains need a wildcard cert. This requires a DNS challenge"
echo "  (adding a TXT record in your DNS provider). Run this when ready:"
echo ""
echo -e "  ${BLUE}certbot certonly --manual --preferred-challenges dns \\"
echo -e "    -d '${MAIN_DOMAIN}' -d '*.${MAIN_DOMAIN}' \\"
echo -e "    --email ${SSL_EMAIL} --agree-tos${NC}"
echo ""
echo "  Then update /etc/nginx/sites-available/launchsite to use the new cert."
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ---------------------------------------------------------------------------
# 15. DNS instructions
# ---------------------------------------------------------------------------
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "<your-server-ip>")
echo ""
echo -e "${YELLOW}━━━ DNS records to add in your DNS provider ━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  Type    Name                         Value"
echo "  A       ${MAIN_DOMAIN}               ${SERVER_IP}"
echo "  A       *.${MAIN_DOMAIN}             ${SERVER_IP}"
echo ""
echo "  For client custom domains, the client adds:"
echo "  A       @  (or their domain root)    ${SERVER_IP}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Setup complete!                              ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "Next — copy your project files to ${YELLOW}${APP_DIR}${NC} then run:"
echo ""
echo -e "  ${BLUE}cd ${APP_DIR} && bash deploy.sh${NC}"
echo ""
