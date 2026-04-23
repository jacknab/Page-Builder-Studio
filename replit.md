# LaunchSite

## Overview

**LaunchSite** is a done-for-you website launch service (not a DIY builder). Clients pick a template, fill out an onboarding questionnaire (business info, services & prices, hours, Google listing URL, social links), and the platform launches their site. The platform is multi-tenant: each site is reachable on a launchsite subdomain (`<slug>.<PRIMARY_HOST>`) and optionally a customer-pointed custom domain (Host-header routed).

Three plans:

1. **Free** — 1 site on a launchsite subdomain.
2. **Domain Forward** — point an existing domain at a launched site (default for all new clients).
3. **Domain Purchase** — we buy and configure a domain via Namecheap (future).

## Stack

- **Monorepo**: pnpm workspaces (Node 24)
- **App**: Next.js 15 (App Router) at `artifacts/web`
- **DB**: PostgreSQL + Drizzle ORM, schema in `lib/db` (`@workspace/db`)
- **Styling**: Tailwind CSS v4
- **Auth**: JWT in httpOnly cookie (`launchsite_session`), bcrypt password hashing
- **Validation**: Zod

## Workflows

- **Start application** — `PORT=5000 pnpm --filter @workspace/web run dev` (single Next dev server)

## Routes

Public:

- `/` — marketing landing
- `/login`, `/signup`, `/forgot-password`, `/reset-password`

Authenticated client:

- `/onboarding` — 5-step questionnaire (template, business, services, hours, links)
- `/onboarding/edit` — edit content after launch
- `/dashboard` — site URLs, custom domain mapping, template switcher

Admin (`isAdmin = true`):

- `/admin` — list of all client sites
- `/admin/sites/[id]` — view/edit any site
- `/admin/plans` — manage the 3 plans

API:

- `/api/auth/{signup,login,logout,me,forgot-password,reset-password}`
- `/api/plans`, `/api/sites/me`, `/api/sites/me/template`, `/api/sites/me/domain`
- `/api/admin/sites`, `/api/admin/sites/[id]`, `/api/admin/plans`
- `/api/health`

## Multi-tenancy

`src/middleware.ts` inspects the `Host` header. Requests to `PRIMARY_HOST` (and Replit dev domains, localhost, `*.replit.dev`) hit the app shell. Anything else is rewritten to `/tenant-site/[host]/page.tsx`, which:

1. Looks up `sites.custom_domain = host`, OR
2. Strips the `.<PRIMARY_HOST>` suffix and looks up `sites.slug = subdomain`.

The matched site is rendered by selecting the correct React template from `src/templates/registry.tsx`.

Set `PRIMARY_HOST` in env to the apex domain (e.g. `launchsite.app`).

## Templates

React components in `src/templates/`. Each template is a `(content: SiteContent) => JSX` and is registered in `registry.tsx`. Currently shipping:

- `modern-services` — generic services landing
- `luxury-salon` — dark editorial layout for beauty/wellness

To add a template, write the component, add the entry to `TEMPLATES`.

## Onboarding content shape

`SiteContent` (in `lib/db/src/schema/sites.ts`) captures: business info, services list, weekly hours, Google listing URL, social links, brand colors. Stored as `jsonb` on `sites.content`.

## Seed

```
pnpm --filter @workspace/web run seed
```

Seeds the 3 plans and creates an admin user (`admin@launchsite.local` / `launchsite-admin` by default; override with `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`).

## Schema push

```
pnpm --filter @workspace/db run push
```

## Env

- `DATABASE_URL` — Postgres
- `JWT_SECRET` — JWT signing
- `PRIMARY_HOST` — apex hostname for tenant routing (defaults to `localhost` in dev)
