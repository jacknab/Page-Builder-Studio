# Launchsite – Project Setup Document

## What This Is

**Launchsite** is a done-for-you website launch service for local service businesses — nail salons, hair salons, haircut studios, and barbershops. It is **not** a website builder or drag-and-drop editor. Clients pick a pre-made template, complete a short onboarding questionnaire (business info, services/prices, hours, Google listing, social links), and the service launches a finished website for them.

This repository contains two user-facing products:

1. **Webpage Editor** (`artifacts/webpage-editor`) — The main web app. Handles marketing homepage, signup, onboarding wizard, and the authenticated studio experience.
2. **Launchsite SSG** (`artifacts/launchsite`) — A separate static marketing site built with Vite + React + TypeScript. Every page is fully pre-rendered to HTML at build time (SSG). No SSR runtime. No backend. No SPA-only rendering.

---

## Monorepo Structure

```
/
├── artifacts/
│   ├── api-server/          Express 5 backend API
│   ├── launchsite/          Static marketing site (SSG)
│   ├── mockup-sandbox/      Vite component preview server (canvas tool)
│   └── webpage-editor/      Main React/Vite web app
├── lib/
│   ├── db/                  Drizzle ORM schema + migrations
│   ├── api-spec/            OpenAPI spec + Orval codegen
│   └── integrations/        Replit AI integration (OpenAI)
├── scripts/
│   └── post-merge.sh        Runs after task-agent merges
├── tsconfig.base.json       Shared TypeScript config
├── pnpm-workspace.yaml      Workspace + catalog deps
└── replit.md                This file
```

---

## Tech Stack

| Concern | Technology |
|---|---|
| Monorepo | pnpm workspaces |
| Node.js | 24 |
| TypeScript | 5.9 |
| Frontend framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + `@tailwindcss/vite` |
| Icons | lucide-react |
| Backend framework | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (v4), drizzle-zod |
| API codegen | Orval (from OpenAPI spec) |
| AI | OpenAI via Replit AI Integrations |

---

## Ports & Workflows

| Workflow | Command | Port | External |
|---|---|---|---|
| Start application | `webpage-editor` dev | 23795 | 80 |
| Start Backend | `api-server` dev | 8080 | 8080 |
| Start Launchsite | `launchsite` dev | 3000 | 3000 |
| mockup-sandbox | `mockup-sandbox` dev | 8081 | 8081 |

---

## Package 1: Webpage Editor (`artifacts/webpage-editor`)

The main web app. Built with React 19 + Vite 7 + Tailwind CSS v4.

### Routes

| Path | Description |
|---|---|
| `/` | Marketing homepage — positions Launchsite as a service |
| `/signup` | Account creation — redirects to `/onboarding` |
| `/onboarding` | 6-step onboarding wizard |
| `/app` | Authenticated studio / editor experience |
| `/admin` | Admin panel + AI template generation |

### Marketing Homepage (`/`)

- Repositions Launchsite as a launch service, not a builder
- Comparison strip: what we are vs. website builders
- 3-step process overview
- Onboarding preview mock
- CTA: "Launch my site"

### Onboarding Wizard (`/onboarding`)

6 steps, implemented in `src/pages/onboarding.tsx`. State is persisted to `localStorage` between steps via helpers in `src/lib/onboardingData.ts`.

| Step | Screen | Data collected |
|---|---|---|
| 1 | Template picker | Selected template |
| 2 | Business type | Nail Salon / Hair Salon / Haircut Studio / Barbershop |
| 3 | Business info | Name, tagline, description |
| 4 | Services & prices | Pre-populated per business type; price is free text |
| 5 | Hours | Open/close times per day, toggle open/closed |
| 6 | Google & social | Google listing URL, Instagram, Facebook, TikTok, Yelp |

**Preset services** (in `src/lib/onboardingData.ts`): each business type gets a default service list. Price field accepts `"$45"`, `"$30–$50"`, `"Call for details"`, or blank (hidden on site).

### Admin Panel (`/admin`)

Includes an **AI Generate** tab powered by OpenAI (via Replit AI Integrations). Generates fully-responsive HTML templates for four business styles (Luxury, Modern, Minimal, Bold). Templates are stored in the PostgreSQL `templates` table.

### Key Files

```
artifacts/webpage-editor/src/
├── App.tsx                  Route definitions
├── pages/
│   ├── landing.tsx          Marketing homepage
│   ├── onboarding.tsx       6-step onboarding wizard
│   └── home.tsx             Authenticated studio/editor
└── lib/
    └── onboardingData.ts    PRESET_SERVICES, DEFAULT_HOURS, types, localStorage helpers
```

---

## Package 2: Launchsite SSG (`artifacts/launchsite`)

A separate static marketing site. Every route outputs a complete HTML file at build time. No SSR runtime. No backend. No client-only rendering for page content.

### Routes & Pages

| Route | Page | Title |
|---|---|---|
| `/` | Home | "Your business website, done for you" |
| `/how-it-works` | How It Works | Step-by-step guide + FAQ |
| `/templates` | Templates | Grid of 8 template cards across 4 business types |

### SSG Build Pipeline

```
pnpm run build
```

Three sequential steps:

**Step 1 — Client bundle:**
```
vite build  →  dist/client/assets/  (JS + CSS)
              dist/client/index.html (template with <!--ssr-outlet-->)
```

**Step 2 — SSR bundle:**
```
vite build --ssr src/entry-server.tsx  →  dist/server/entry-server.js
```
`isSsrBuild` in `vite.config.ts` switches `outDir` to `dist/server` automatically.

**Step 3 — Prerender:**
```
node prerender.mjs
```
- Imports `render(url)` from `dist/server/entry-server.js`
- Calls `renderToString(<App url={url} />)` for each route
- Replaces `<!--ssr-outlet-->` with the rendered HTML string
- Replaces `<title>` and `<!--meta-description-->` with per-route values
- Writes output:
  - `dist/client/index.html` — Home page
  - `dist/client/how-it-works/index.html` — How It Works
  - `dist/client/templates/index.html` — Templates

Each output file is 19–35 KB of fully populated HTML with no placeholder content.

### Key Files

```
artifacts/launchsite/
├── index.html               Template with <!--ssr-outlet--> and <!--meta-description-->
├── vite.config.ts           isSsrBuild → switches outDir (client vs server)
├── prerender.mjs            Generates all static HTML files
└── src/
    ├── entry-client.tsx     hydrateRoot (prod) or createRoot (dev, empty root)
    ├── entry-server.tsx     Exports render(url) using renderToString
    ├── App.tsx              URL-based router: reads url prop (SSR) or window.location.pathname (client)
    ├── index.css            @import "tailwindcss" — only loaded by entry-client
    ├── components/
    │   └── Layout.tsx       Sticky nav + footer, <a href> links (no JS router)
    └── pages/
        ├── Home.tsx         Hero, comparison strip, 3-step overview, business types, CTA
        ├── HowItWorks.tsx   6-section onboarding breakdown + FAQ
        └── Templates.tsx    8 template cards (2 per business type) + features list
```

### Routing Approach

- **Dev:** Vite SPA mode — all routes serve `index.html`; `App.tsx` reads `window.location.pathname`
- **Production:** Each route is its own `index.html` file; standard `<a href>` navigation causes full page loads
- No `react-router-dom` dependency — URL matching is done directly in `App.tsx`

### CSS in SSR

`index.css` is only imported in `entry-client.tsx`. The SSR bundle (`entry-server.tsx`) has no CSS imports, keeping the server build clean. Tailwind v4 scans all `.tsx` template files during the client build.

### Client Hydration Strategy

```tsx
// entry-client.tsx
if (root.hasChildNodes()) {
  hydrateRoot(root, <App url={window.location.pathname} />);
} else {
  createRoot(root).render(<App url={window.location.pathname} />);
}
```

- `hasChildNodes()` — pre-rendered HTML is present → `hydrateRoot` (production)
- Empty root → `createRoot` (dev server, no SSR content)

---

---

## VPS Deployment

### Files

| File | Purpose |
|---|---|
| `setup.sh` | Run once on a fresh Ubuntu 22.04/24.04 VPS. Installs Node.js 24, pnpm, PM2, PostgreSQL 16, Nginx, Certbot, UFW. Prompts for domain, email, DB credentials. |
| `deploy.sh` | Run after copying code to the server. Installs deps, runs DB migrations, builds all packages, starts/reloads PM2, reloads Nginx. Also used for subsequent updates. |
| `ecosystem.config.cjs` | PM2 process config. Runs `launchsite-api` (port 8080) and `launchsite-router` (port 3002). |

### Server Setup Order

1. `sudo bash setup.sh` — run on the fresh VPS
2. Copy project files to the app directory (default `/opt/launchsite`)
3. `bash deploy.sh` — builds everything and starts PM2

### Nginx Routing (configured by setup.sh)

| Request | Handler |
|---|---|
| `launchsite.certxa.com/*` | Nginx serves built frontend; `/api/` → port 8080; `/preview/` → port 3002 |
| `*.launchsite.certxa.com` | Regex server block → port 3002 (site-router) |
| Any other domain (custom client domain) | `default_server` catch-all → port 3002 (site-router) |

### DNS records required

```
A    launchsite.certxa.com      <VPS IP>
A    *.launchsite.certxa.com    <VPS IP>   ← wildcard for client subdomains
```

For client custom domains: client adds an `A` record pointing their domain to the VPS IP, and you store it in `client_sites.custom_domain`.

### SSL

- Main domain: `certbot --nginx -d launchsite.certxa.com` (HTTP challenge, automated by setup.sh)
- Wildcard subdomains: requires DNS challenge — instructions printed by setup.sh

---

## Package 3: Site Router (`artifacts/site-router`)

A lightweight Express server (port 3002) that receives all client-site traffic and serves the correct static HTML files.

**How it resolves which client to serve:**
1. Reads the `Host` header from the incoming request
2. If host is `{slug}.launchsite.certxa.com` → looks up `client_sites.subdomain = slug`
3. Otherwise → looks up `client_sites.custom_domain = host`
4. Serves static files from `/var/www/clients/{clientId}/`

**Preview by ID (for admin use):**
- `GET /preview/{clientId}` or `GET /preview/{clientId}/path` → serves that client's site directly by database ID, no domain lookup needed

**Client site storage:** `/var/www/clients/{clientId}/` — one directory per client containing their built static HTML/CSS/JS files.

**Build:** `pnpm --filter @workspace/site-router run build`

---

## Database: `client_sites` Table

Stores everything about a client's website. Created by `lib/db/src/schema/clientSites.ts`.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | integer FK → users | |
| `subdomain` | text unique | e.g. `glamournails` → `glamournails.launchsite.certxa.com` |
| `custom_domain` | text unique | e.g. `glamournails.com` (set when client provides their domain) |
| `status` | text | `pending` / `building` / `live` |
| `template_id` | text | Which template they chose |
| `business_type` | text | nail-salon / hair-salon / haircut-studio / barbershop |
| `business_name` | text | |
| `tagline` | text | |
| `description` | text | |
| `phone` | text | |
| `address` | text | |
| `services_json` | text | JSON string of `{name, price}[]` |
| `hours_json` | text | JSON string of hours per day |
| `google_url` | text | |
| `instagram_url` | text | |
| `facebook_url` | text | |
| `tiktok_url` | text | |
| `yelp_url` | text | |

---

## Key Commands

```bash
# Install all workspace dependencies
pnpm install

# Run type checking across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# --- Webpage Editor ---
pnpm --filter @workspace/webpage-editor run dev       # dev server (port 23795)

# --- API Server ---
pnpm --filter @workspace/api-server run dev           # dev server (port 8080)

# --- Database ---
pnpm --filter @workspace/db run push                  # push schema changes (dev only)

# --- Launchsite SSG ---
pnpm --filter @workspace/launchsite run dev           # dev server (port 3000)
pnpm --filter @workspace/launchsite run build         # full SSG build → dist/client/

# --- API Codegen ---
pnpm --filter @workspace/api-spec run codegen         # regenerate API hooks + Zod schemas
```

---

## Environment & Secrets

- `AI_INTEGRATIONS_OPENAI_BASE_URL` — provided by Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_API_KEY` — provided by Replit AI Integrations
- `JWT_SECRET` — set in `[userenv.shared]` in `.replit`
- `DATABASE_URL` — provisioned by Replit PostgreSQL

OpenAI model in use: `gpt-5.4` (non-coding tasks).

---

## Positioning Note

Launchsite is a **service**, not a tool. Never describe it as a website builder, drag-and-drop editor, or DIY platform. The entire user experience (copy, CTAs, onboarding flow, marketing site) reflects this: the client answers questions, we build and launch the site.
