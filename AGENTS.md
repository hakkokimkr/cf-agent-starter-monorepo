# AGENTS.md - AI Agent Guide

This document helps AI coding agents (Claude, Copilot, etc.) understand and work with this codebase effectively.

## Project Overview

A production-ready Cloudflare Workers monorepo with:
- **API**: Hono framework on CF Workers
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Frontend**: React (landing + web app)
- **Testing**: Vitest + Playwright

## Directory Structure

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
├── tooling/
│   ├── eslint/           # ESLint config
│   └── typescript/       # TypeScript configs
├── tests/
│   ├── api/              # API tests (Vitest + Miniflare)
│   ├── e2e/              # E2E tests (Playwright)
│   └── mocks/            # Mock utilities
└── docs/
```

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `apps/api/src/routes/`:
```typescript
// apps/api/src/routes/items.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, Variables } from '../types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get('/', async (c) => {
  const db = c.get('db');
  // ... query database
  return c.json({ data: [] });
});

export default app;
```

2. Register in `apps/api/src/index.ts`:
```typescript
import itemsRoutes from './routes/items';
app.route('/api/items', itemsRoutes);
```

3. Add tests in `tests/api/items.test.ts`

### Adding a New Database Table

1. Create schema in `packages/database/src/schema/`:
```typescript
// packages/database/src/schema/items.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

2. Export from `packages/database/src/schema/index.ts`:
```typescript
export * from './items';
```

3. Generate migration:
```bash
pnpm db:generate
```

### Adding a New UI Component

1. Create component in `packages/ui/src/components/`:
```typescript
// packages/ui/src/components/Badge.tsx
export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
```

2. Export from `packages/ui/src/components/index.ts`:
```typescript
export * from './Badge';
```

### Writing Tests

#### API Tests (Vitest + Miniflare)
```typescript
// tests/api/items.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { unstable_dev, type UnstableDevWorker } from 'wrangler';

describe('Items API', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('apps/api/src/index.ts', {
      experimental: { disableExperimentalWarning: true },
      vars: {
        ENVIRONMENT: 'development',
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      },
    });
  });

  afterAll(async () => {
    await worker?.stop();
  });

  it('should list items', async () => {
    const response = await worker.fetch('/api/items');
    expect(response.status).toBe(200);
  });
});
```

#### UI Component Tests (Playwright Component Testing)
```typescript
// tests/ui/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '@repo/ui';

test('renders button with text', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toContainText('Click me');
});
```

#### E2E Tests (Playwright)
```typescript
// tests/e2e/items.spec.ts
import { test, expect } from '@playwright/test';

test('should display items list', async ({ page }) => {
  await page.goto('/items');
  await expect(page.locator('h1')).toContainText('Items');
});
```

## Testing Without Real Environment

The mocks in `tests/mocks/` allow running tests without real CF bindings or database:

```typescript
import { createMockEnv } from '../mocks/cf-bindings';
import { createMockDatabase } from '../mocks/database';

const env = createMockEnv();
const db = createMockDatabase();

// Use in tests
await db.users.create({ email: 'test@example.com', name: 'Test' });
await env.STORAGE.put('key', new ArrayBuffer(10));
```

## Code Conventions

### TypeScript
- Strict mode enabled
- Use `type` imports for types: `import type { User } from '@repo/database'`
- Prefer `interface` for object shapes, `type` for unions/aliases

### API Responses
- Success: `{ data: T }`
- Error: `{ error: { code: string, message: string } }`
- Use Zod for validation with `@hono/zod-validator`

### Database
- UUIDs for primary keys
- `createdAt` and `updatedAt` timestamps on all tables
- Use transactions for multi-table operations

### Components
- Functional components with TypeScript
- Props interface named `{Component}Props`
- Use Tailwind CSS for styling

## Commands

```bash
# Development
pnpm dev              # Start all dev servers
pnpm --filter @repo/api dev    # Start API only

# Testing
pnpm test             # Run all tests
pnpm test:api         # API tests only
pnpm test:ui          # UI component tests
pnpm test:e2e         # E2E tests only

# Type checking
pnpm typecheck        # Check all packages

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Apply to local DB
pnpm db:migrate       # Apply to production

# Build & Deploy
pnpm build            # Build all
pnpm --filter @repo/api deploy:staging
pnpm --filter @repo/api deploy:production
```

## Environment Variables

Required for each environment:
- `DATABASE_URL` - PostgreSQL connection string
- Cloudflare bindings are configured in `wrangler.toml`

For testing:
- Tests use mocks by default (no real env needed)
- To test against real services, set `TEST_REAL_ENV=true`

## Troubleshooting

### Type errors in IDE
```bash
# Rebuild TypeScript
pnpm typecheck
```

### Database connection issues
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
pnpm --filter @repo/database db:studio
```

### Wrangler errors
```bash
# Update wrangler
pnpm update wrangler -r

# Clear cache
rm -rf apps/api/.wrangler
```
