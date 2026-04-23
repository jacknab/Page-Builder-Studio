#!/usr/bin/env bash
# =============================================================================
#  Launchsite Deploy Script
#  Run from APP_DIR after copying code to the server.
#  Also use this script for subsequent updates — it rebuilds and reloads.
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ OK ]${NC}  $*"; }
die()   { echo -e "${RED}[FAIL]${NC}  $*" >&2; exit 1; }

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}     Launchsite Deploy                         ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Ensure we're in the project root
[[ -f "pnpm-workspace.yaml" ]] || die "Run this script from the project root (where pnpm-workspace.yaml lives)."

# Load .env so DATABASE_URL etc. are available for migrations
[[ -f ".env" ]] || die ".env not found. Run setup.sh first."
set -a; source .env; set +a

# ---------------------------------------------------------------------------
# 1. Install dependencies
# ---------------------------------------------------------------------------
info "Installing dependencies..."
pnpm install --frozen-lockfile
ok "Dependencies installed."

# ---------------------------------------------------------------------------
# 2. Run database migrations
# ---------------------------------------------------------------------------
info "Running database migrations..."
pnpm --filter @workspace/db run push
ok "Database schema up to date."

# ---------------------------------------------------------------------------
# 3. Build all packages
# ---------------------------------------------------------------------------
info "Building API server..."
pnpm --filter @workspace/api-server run build
ok "API server built."

info "Building site router..."
pnpm --filter @workspace/site-router run build
ok "Site router built."

info "Building nail-salon template..."
pnpm --filter @workspace/nail-salon-template run build
ok "Nail-salon template built."

info "Building frontend (webpage-editor)..."
pnpm --filter @workspace/webpage-editor run build
ok "Frontend built."

# ---------------------------------------------------------------------------
# 4. Ensure client sites directory exists
# ---------------------------------------------------------------------------
CLIENTS_DIR="${CLIENTS_DIR:-/var/www/clients}"
mkdir -p "$CLIENTS_DIR"
ok "Client sites directory: $CLIENTS_DIR"

# ---------------------------------------------------------------------------
# 5. Create log directories
# ---------------------------------------------------------------------------
mkdir -p /var/log/launchsite

# ---------------------------------------------------------------------------
# 6. Start / reload PM2 processes
# ---------------------------------------------------------------------------
info "Starting PM2 processes..."

if pm2 list | grep -q "launchsite-api"; then
  pm2 reload ecosystem.config.cjs --update-env
  ok "PM2 processes reloaded."
else
  pm2 start ecosystem.config.cjs
  ok "PM2 processes started."
fi

pm2 save
ok "PM2 process list saved."

# ---------------------------------------------------------------------------
# 7. Set up PM2 autostart on server reboot (only needs to run once)
# ---------------------------------------------------------------------------
if [[ ! -f /etc/systemd/system/pm2-root.service ]]; then
  info "Configuring PM2 autostart on reboot..."
  pm2 startup systemd -u root --hp /root | tail -1 | bash
  ok "PM2 will auto-start on reboot."
fi

# ---------------------------------------------------------------------------
# 8. Reload Nginx (picks up any updated static files)
# ---------------------------------------------------------------------------
info "Reloading Nginx..."
nginx -t && systemctl reload nginx
ok "Nginx reloaded."

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Deploy complete!                             ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "  App live at:      ${BLUE}https://${MAIN_DOMAIN:-your-domain}${NC}"
echo -e "  API health check: ${BLUE}https://${MAIN_DOMAIN:-your-domain}/api/health${NC}"
echo ""
echo -e "  PM2 status:       ${YELLOW}pm2 status${NC}"
echo -e "  API logs:         ${YELLOW}pm2 logs launchsite-api${NC}"
echo -e "  Router logs:      ${YELLOW}pm2 logs launchsite-router${NC}"
echo ""
echo -e "Client sites live at:"
echo -e "  Preview by ID:    ${BLUE}https://${MAIN_DOMAIN:-your-domain}/preview/{clientId}${NC}"
echo -e "  Subdomain:        ${BLUE}https://{slug}.${MAIN_DOMAIN:-your-domain}${NC}"
echo -e "  Custom domain:    point client DNS A record to this server's IP"
echo ""
echo -e "To deploy an update, pull new code and run: ${YELLOW}bash deploy.sh${NC}"
echo ""
