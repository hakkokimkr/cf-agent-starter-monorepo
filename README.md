# CF Monorepo Starter

Production-ready Cloudflare Workers monorepo template with Supabase, Drizzle ORM, Hono, and React.

## Features

- ⚡ **Cloudflare Workers** - Deploy globally with zero cold starts
- 🗄️ **Supabase + Drizzle ORM** - Type-safe PostgreSQL queries
- 🔥 **Hono** - Ultrafast web framework with type-safe client
- ⚛️ **React** - Landing page + SPA with shared UI components
- 📦 **Turborepo** - Fast, incremental builds
- 🧪 **Testing** - Vitest, Playwright, and mock utilities
- 🤖 **AI-Agent Friendly** - Comprehensive AGENTS.md guide
- 🔄 **Version Tracking** - Easy updates from starter template

## Quick Start

```bash
# Clone
git clone https://github.com/hakkokimkr/cf-agent-starter-monorepo your-project
cd your-project

# Remove template marker (this is now your project, not the template)
rm .is-template-repo

# Install
pnpm install

# Setup environment
cp .env.example .env.local

# Initialize version tracking
echo '{"version":"2026-02-25-02","updated_at":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","notes":"Initial clone"}' | jq . > CURRENT_VERSION.json

# Start development
pnpm dev
```

## Project Structure

```
cf-monorepo-starter/
├── apps/
│   ├── api/              # Hono API (CF Workers)
│   ├── landing/          # Landing page (React Router v7)
│   └── web/              # Main web app (Vite SPA)
├── packages/
│   ├── database/         # Drizzle schema + migrations
│   ├── shared-types/     # Shared TypeScript types
│   └── ui/               # React components
├── tooling/              # ESLint, TypeScript configs
└── tests/                # API, E2E, and mock tests
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Cloudflare Workers |
| API Framework | Hono |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle |
| Frontend | React, React Router v7, Vite |
| Styling | Tailwind CSS |
| Monorepo | Turborepo, pnpm |
| Testing | Vitest, Playwright |

## Development

```bash
# Start all dev servers
pnpm dev

# Start specific app
pnpm --filter @repo/api dev
pnpm --filter @repo/web dev
pnpm --filter @repo/landing dev
```

## Database

```bash
# Generate migration
pnpm db:generate

# Apply to local database
pnpm db:push

# Open Drizzle Studio
pnpm --filter @repo/database db:studio
```

## Testing

```bash
# Run all tests
pnpm test

# API tests only
pnpm test:api

# UI component tests
pnpm test:ui

# E2E tests
pnpm test:e2e

# With coverage
pnpm test -- --coverage
```

## Type-Safe API Client

Use Hono's client for fully typed API calls:

```typescript
import { hc } from 'hono/client';
import type { AppType } from '@repo/api';

const api = hc<AppType>('/');

// Fully typed!
const users = await api.api.users.$get();
const data = await users.json();
```

## Deployment

### API (Cloudflare Workers)

```bash
# Staging
pnpm --filter @repo/api deploy:staging

# Production
pnpm --filter @repo/api deploy:production
```

### Landing / Web (Cloudflare Pages)

```bash
# Build
pnpm --filter @repo/landing build

# Deploy to CF Pages
wrangler pages deploy apps/landing/dist
```

## Environment Variables

Create `.env.local` for local development:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

For production, use Cloudflare secrets:

```bash
wrangler secret put DATABASE_URL
```

## Keeping Up-to-Date

This starter template is actively maintained. Check for updates regularly:

```bash
# Check for updates
bash scripts/check-starter-updates.sh
```

See [UPDATE_GUIDE.md](./UPDATE_GUIDE.md) for detailed instructions on:
- Checking current and latest versions
- Reviewing changelog
- Applying updates safely
- Version tracking

## AI Agent Guide

See [AGENTS.md](./AGENTS.md) for comprehensive AI coding agent instructions, including:
- Starter template update checks
- Directory structure
- Common tasks with code examples
- Testing patterns

See [CODE_STYLE.md](./CODE_STYLE.md) for coding conventions:
- File naming and structure
- Wrangler configuration patterns
- Route, schema, and component templates
- Import order and type safety
- Agent-friendly patterns and templates

## License

MIT
