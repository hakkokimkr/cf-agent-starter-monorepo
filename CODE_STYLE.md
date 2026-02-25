# Code Style Guide

Agent-friendly coding conventions for the CF Agent Starter Monorepo.

## 🎯 Goals

1. **Consistency**: Same patterns across the entire codebase
2. **Discoverability**: Easy to find and understand code structure
3. **AI-Friendly**: Clear patterns that agents can follow and extend

---

## 📁 File Structure

### Naming Conventions

```
✅ Good
apps/api/src/routes/users.ts
apps/api/src/middleware/auth.ts
packages/database/src/schema/posts.ts

❌ Bad
apps/api/src/routes/UserRoutes.ts
apps/api/src/middleware/AuthMiddleware.ts
packages/database/src/schema/PostsSchema.ts
```

**Rules:**
- Files: `kebab-case` (lowercase with hyphens)
- Directories: `kebab-case`
- Components: `PascalCase.tsx` only for React components

### Directory Structure

```
apps/api/src/
├── index.ts              # Entry point
├── types.ts              # Shared types for this app
├── routes/               # API routes
│   ├── index.ts          # Route aggregator
│   ├── users.ts
│   └── posts.ts
├── middleware/           # Hono middleware
│   ├── auth.ts
│   └── cors.ts
├── lib/                  # Utilities specific to this app
│   ├── db.ts
│   └── cache.ts
└── constants.ts          # App-specific constants
```

---

## 🔧 Wrangler Configuration

### Scheduled (Cron) Jobs

**Format:** One `[[schedules]]` block per cron expression

```toml
# ✅ Good: Clear, one expression per block
[[schedules]]
cron = "0 * * * *"        # Hourly

[[schedules]]
cron = "0 0 * * *"        # Daily at midnight

[[schedules]]
cron = "*/15 * * * *"     # Every 15 minutes

# ❌ Bad: Old v3 syntax (deprecated)
[triggers]
crons = ["0 * * * *", "0 0 * * *"]
```

**Comments:** Always add human-readable explanation

### Queue Configuration

```toml
# ✅ Good: Clear producer/consumer separation

# Queue Producer Binding
[[queues.producers]]
queue = "email-queue-dev"
binding = "EMAIL_QUEUE"

# Queue Consumer
[[queues.consumers]]
queue = "email-queue-dev"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "email-dlq-dev"

# ❌ Bad: No comments, unclear purpose
[[queues.producers]]
queue = "queue1"
binding = "Q1"
```

### Environment-Specific Config

```toml
# ✅ Good: Clear environment sections

# ===================
# Development (Default)
# ===================
name = "api-dev"

[vars]
ENVIRONMENT = "development"
LOG_LEVEL = "debug"

# ===================
# Staging Environment
# ===================
[env.staging]
name = "api-staging"

[env.staging.vars]
ENVIRONMENT = "staging"
LOG_LEVEL = "info"

# ===================
# Production Environment
# ===================
[env.production]
name = "api-production"

[env.production.vars]
ENVIRONMENT = "production"
LOG_LEVEL = "warn"
```

---

## 🛣️ Hono Routes

### Basic Route Pattern

```typescript
// ✅ Good: Clear, typed, documented

import { Hono } from 'hono';
import type { Env, Variables } from '../types';

/**
 * User management routes
 * 
 * GET    /users       - List users
 * POST   /users       - Create user
 * GET    /users/:id   - Get user by ID
 * PUT    /users/:id   - Update user
 * DELETE /users/:id   - Delete user
 */
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /users - List all users
app.get('/', async (c) => {
  const db = c.get('db');
  const users = await db.select().from(schema.users);
  
  return c.json({ 
    data: users,
    count: users.length 
  });
});

// POST /users - Create new user
app.post('/', async (c) => {
  const body = await c.req.json();
  // ... validation and creation
  return c.json({ data: newUser }, 201);
});

export default app;
```

### With Validation

```typescript
// ✅ Good: Inline schema, clear validation

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

app.post(
  '/',
  zValidator('json', createUserSchema),
  async (c) => {
    const validated = c.req.valid('json');
    // ... use validated data
    return c.json({ data: newUser }, 201);
  }
);
```

### Error Handling

```typescript
// ✅ Good: Consistent error responses

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });
  
  if (!user) {
    return c.json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND' 
    }, 404);
  }
  
  return c.json({ data: user });
});

// ❌ Bad: Inconsistent error format
app.get('/:id', async (c) => {
  // throws error instead of returning JSON
  if (!user) throw new Error('not found');
  return c.json(user); // no wrapper
});
```

---

## 🗄️ Database Schema

### Table Definition Pattern

```typescript
// ✅ Good: Clear, documented, consistent naming

import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

/**
 * Users table
 * Stores user accounts and authentication data
 */
export const users = pgTable('users', {
  // Primary key: UUID with auto-generation
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Auth fields
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  
  // Profile fields
  name: text('name').notNull(),
  bio: text('bio'),
  
  // Status
  emailVerified: boolean('email_verified').notNull().default(false),
  active: boolean('active').notNull().default(true),
  
  // Timestamps (required on all tables)
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Inferred types (always export both)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Relations Pattern

```typescript
// ✅ Good: Clear relations with comments

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  // User has many posts
  posts: many(posts),
  
  // User has many comments
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  // Post belongs to one user (author)
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  
  // Post has many comments
  comments: many(comments),
}));
```

---

## 🎨 React Components

### Component Structure

```typescript
// ✅ Good: Props interface, documented, typed

import type { ReactNode } from 'react';

interface ButtonProps {
  /** Button text or content */
  children: ReactNode;
  
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Click handler */
  onClick?: () => void;
}

/**
 * Button component
 * 
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## 📝 Comments

### When to Comment

```typescript
// ✅ Good: Comment WHY, not WHAT

// Use hash-based cache key to avoid collisions with user-provided keys
const cacheKey = `post:${hashId(id)}`;

// Retry with exponential backoff (max 3 attempts)
await retryWithBackoff(uploadFile, { maxAttempts: 3 });

// ❌ Bad: Comments that just repeat the code
// Get the user from database
const user = await db.query.users.findFirst();

// Set the name to John
user.name = 'John';
```

### File Headers

```typescript
// ✅ Good: Clear purpose, not boilerplate

/**
 * Authentication middleware
 * 
 * Validates JWT tokens and attaches user data to context.
 * Rejects requests with expired or invalid tokens.
 */

// ❌ Bad: Generic boilerplate
/**
 * @file auth.ts
 * @author John Doe
 * @date 2026-02-25
 */
```

---

## 🔤 Naming Conventions

### Variables & Functions

```typescript
// ✅ Good: Descriptive, clear intent
const activeUsers = await getActiveUsers();
const isEmailVerified = user.emailVerified;
const shouldSendNotification = user.preferences.notifications;

async function sendWelcomeEmail(userId: string) { }
function calculateTotalPrice(items: CartItem[]) { }

// ❌ Bad: Unclear, abbreviated
const au = await getAU();
const flag = user.ev;
function snd(id: string) { }
function calc(items: any[]) { }
```

### Constants

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE for constants
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_PAGE_SIZE = 20;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// ❌ Bad: Mixed case for constants
const maxUploadSize = 10485760;
const pageSize = 20;
```

### Types & Interfaces

```typescript
// ✅ Good: Clear, descriptive names
interface UserProfile {
  id: string;
  email: string;
  name: string;
}

type ApiResponse<T> = {
  data: T;
  error?: string;
};

// ❌ Bad: Generic, unclear
interface IUser { }
type Response = any;
```

---

## 🧪 Testing

### Test Structure

```typescript
// ✅ Good: Descriptive, arrange-act-assert

import { describe, it, expect } from 'vitest';

describe('User API', () => {
  describe('GET /users', () => {
    it('should return list of users', async () => {
      // Arrange
      const response = await fetch('/users');
      
      // Act
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data.data).toBeInstanceOf(Array);
    });
    
    it('should return empty array when no users exist', async () => {
      // ...
    });
  });
});
```

---

## 📦 Package Exports

```typescript
// ✅ Good: Barrel export with clear structure

// packages/shared-types/src/index.ts
export type { User, NewUser } from './user';
export type { Post, NewPost } from './post';
export type { ApiResponse, ApiError } from './api';

// ❌ Bad: Export everything with *
export * from './user';
export * from './post';
```

---

## 🚀 Import Order

```typescript
// ✅ Good: Grouped and sorted

// 1. External dependencies
import { Hono } from 'hono';
import { z } from 'zod';

// 2. Workspace packages
import { db } from '@repo/database';
import type { User } from '@repo/shared-types';

// 3. Relative imports
import { authMiddleware } from '../middleware/auth';
import type { Env } from '../types';

// ❌ Bad: Mixed order
import { authMiddleware } from '../middleware/auth';
import { Hono } from 'hono';
import type { User } from '@repo/shared-types';
```

---

## 📚 Type Safety

```typescript
// ✅ Good: Explicit types, avoid any
interface CreateUserInput {
  email: string;
  name: string;
  role: 'user' | 'admin';
}

async function createUser(input: CreateUserInput): Promise<User> {
  // ...
}

// ❌ Bad: any, implicit types
async function createUser(input: any) {
  // ...
}
```

---

## 🎯 Agent-Friendly Patterns

### Pattern Templates

When adding new features, follow these templates:

**New API Route:**
```typescript
// apps/api/src/routes/[resource].ts
import { Hono } from 'hono';
import type { Env, Variables } from '../types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /[resource]
app.get('/', async (c) => { /* ... */ });

// POST /[resource]
app.post('/', async (c) => { /* ... */ });

// GET /[resource]/:id
app.get('/:id', async (c) => { /* ... */ });

export default app;
```

**New Database Table:**
```typescript
// packages/database/src/schema/[table].ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const [table] = pgTable('[table]', {
  id: uuid('id').primaryKey().defaultRandom(),
  // ... fields
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type [Table] = typeof [table].$inferSelect;
export type New[Table] = typeof [table].$inferInsert;
```

**New React Component:**
```typescript
// packages/ui/src/components/[Component].tsx
import type { ReactNode } from 'react';

interface [Component]Props {
  children?: ReactNode;
}

export function [Component]({ children }: [Component]Props) {
  return <div>{children}</div>;
}
```

---

## ✅ Checklist

Before committing code, verify:

- [ ] File and variable names follow conventions
- [ ] All public APIs have type annotations
- [ ] Complex logic has explanatory comments
- [ ] Tests are updated
- [ ] No `any` types (use `unknown` if needed)
- [ ] Imports are grouped and sorted
- [ ] Error handling is consistent
- [ ] Code follows existing patterns in the codebase

---

## 🤖 For AI Agents

When modifying or extending this codebase:

1. **Read this guide first** before making changes
2. **Follow existing patterns** in similar files
3. **Add comments** for non-obvious logic
4. **Keep types strict** - avoid `any`
5. **Test your changes** with provided test utilities
6. **Update documentation** if adding new patterns

**Pro tip:** When unsure, look at existing code in the same directory for examples.
