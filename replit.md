# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

The primary user-facing app is **Webpage Editor**, a standalone React/Vite web app for selecting pre-made single-page HTML-style templates, editing copy and images, deleting unwanted blocks, previewing desktop/mobile layouts, and downloading generated HTML. It now supports both block-based templates and complete uploaded HTML page templates.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend app**: React + Vite (`artifacts/webpage-editor`)
- **Template sources**: built-in block templates plus full HTML templates generated from `attached_assets/*.html`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/webpage-editor run dev` — run the Webpage Editor frontend

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
