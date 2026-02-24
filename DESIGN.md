# CF Monorepo Starter - Design Document

## Overview
Production-ready Cloudflare Workers monorepo starter template with Supabase, Drizzle ORM, Hono, and React.

## Directory Structure

```
cf-monorepo-starter/
├── apps/
│   ├── api/                    # Main Hono API (CF Workers)
│   ├── landing/                # Landing page (React Router v7)
│   ├── web/                    # Main web app (Vite SPA React)
│   └── worker-cron/            # Scheduled worker example
│
├── packages/
│   ├── database/               # Drizzle schema + migrations (shared)
│   ├── shared-types/           # Shared TypeScript types
│   ├── ui/                     # Shared UI components
│   └── config/                 # Shared configs (ESLint, TypeScript, etc.)
│
├── tooling/
│   ├── eslint/                 # ESLint config
│   └── typescript/             # TypeScript config
│
├── tests/
│   ├── api/                    # API tests (Vitest + Miniflare)
│   ├── e2e/                    # E2E tests (Playwright)
│   └── mocks/                  # Shared mocks/stubs
│
├── docs/
│   └── AGENTS.md               # AI Agent guide
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Technology Stack

### Infrastructure
- **Package Manager:** pnpm
- **Monorepo Tool:** Turborepo
- **Runtime:** Cloudflare Workers
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle

### Backend (apps/api)
- **Framework:** Hono
- **Type Sharing:** `hono/client` for RPC-style type inference
- **Features:**
  - REST API endpoints
  - Scheduled handlers (cron)
  - Queue consumers
  - R2 storage integration

### Frontend
- **Landing (apps/landing):** React Router v7 (SSR capable)
- **Web App (apps/web):** Vite + React SPA
- **Shared UI:** packages/ui

### Testing
- **Unit/Integration:** Vitest
- **API Testing:** Vitest + Miniflare (local CF runtime)
- **UI Testing:** Playwright Component Tests
- **E2E:** Playwright
- **Mocking:** MSW for HTTP, custom stubs for CF bindings

## Environment Strategy

### Database Instances
```
LOCAL:      Local Supabase (Docker) or Supabase local dev
STAGING:    Supabase staging project
PRODUCTION: Supabase production project
```

### Environment Variables
```
# .env.local
DATABASE_URL=postgresql://...local
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=...

# .env.staging
DATABASE_URL=postgresql://...staging
SUPABASE_URL=https://xxx.supabase.co

# .env.production
DATABASE_URL=postgresql://...production
SUPABASE_URL=https://yyy.supabase.co
```

### Cloudflare Bindings
```toml
# wrangler.toml
[vars]
ENVIRONMENT = "development"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "my-bucket"

[[queues.producers]]
queue = "my-queue"
binding = "MY_QUEUE"

[[queues.consumers]]
queue = "my-queue"
```

## Type Sharing Strategy

### Option 1: Hono Client (Recommended)
```typescript
// apps/api/src/index.ts
const app = new Hono()
  .get('/users/:id', async (c) => {
    return c.json({ id: c.req.param('id'), name: 'John' })
  })

export type AppType = typeof app

// apps/web/src/lib/api.ts
import { hc } from 'hono/client'
import type { AppType } from '@repo/api'

export const api = hc<AppType>('https://api.example.com')
// api.users[':id'].$get({ param: { id: '1' } }) - fully typed!
```

### Option 2: Shared Types Package
```typescript
// packages/shared-types/src/api.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface CreateUserRequest {
  name: string
  email: string
}
```

## Testing Strategy

### 1. API Tests (Vitest + Miniflare)
```typescript
// tests/api/users.test.ts
import { unstable_dev } from 'wrangler'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Users API', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('apps/api/src/index.ts', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('should return user by id', async () => {
    const res = await worker.fetch('/users/1')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('1')
  })
})
```

### 2. UI Component Tests (Playwright)
```typescript
// tests/ui/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from '@repo/ui'

test('renders button with text', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>)
  await expect(component).toContainText('Click me')
})
```

### 3. E2E Tests (Playwright)
```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test'

test('landing page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

### 4. Mock Strategy for Agent-Friendly Testing
```typescript
// tests/mocks/cf-bindings.ts
export const mockR2Bucket = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
}

export const mockQueue = {
  send: vi.fn(),
  sendBatch: vi.fn(),
}

// tests/mocks/supabase.ts
export const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  // ...
}
```

## Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "test:api": "vitest run --project api",
    "test:ui": "playwright test --project ui",
    "test:e2e": "playwright test --project e2e",
    "typecheck": "turbo typecheck",
    "lint": "turbo lint",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:push": "turbo db:push"
  }
}
```

## Implementation Phases

### Phase 1: Core Setup
- [x] Design document
- [ ] Initialize Turborepo + pnpm workspace
- [ ] Create tooling configs (ESLint, TypeScript)
- [ ] Create packages/database with Drizzle
- [ ] Create packages/shared-types

### Phase 2: Backend
- [ ] Create apps/api with Hono
- [ ] Add R2, Queue, Scheduled examples
- [ ] Setup wrangler.toml with environments

### Phase 3: Frontend
- [ ] Create apps/landing (React Router v7)
- [ ] Create apps/web (Vite SPA)
- [ ] Create packages/ui
- [ ] Connect frontend to API with hono/client

### Phase 4: Testing
- [ ] Setup Vitest for API tests
- [ ] Setup Playwright for UI/E2E tests
- [ ] Create mock utilities
- [ ] Add CI workflow

### Phase 5: Documentation
- [ ] Write AGENTS.md
- [ ] Write README.md
- [ ] Add example workflows

---

## Next Steps
Starting with Phase 1: Core Setup
