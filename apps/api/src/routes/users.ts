import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { users, eq } from '@repo/database';
import type { Env, Variables } from '../types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /users - List all users
app.get('/', async (c) => {
  const db = c.get('db');
  const result = await db.select().from(users);
  return c.json({ data: result });
});

// GET /users/:id - Get user by ID
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (result.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }

  return c.json({ data: result[0] });
});

// POST /users - Create user
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
});

app.post('/', zValidator('json', createUserSchema), async (c) => {
  const db = c.get('db');
  const body = c.req.valid('json');

  const result = await db.insert(users).values(body).returning();

  return c.json({ data: result[0] }, 201);
});

// PATCH /users/:id - Update user
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

app.patch('/:id', zValidator('json', updateUserSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = c.req.valid('json');

  const result = await db
    .update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }

  return c.json({ data: result[0] });
});

// DELETE /users/:id - Delete user
app.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const result = await db.delete(users).where(eq(users.id, id)).returning();

  if (result.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }

  return c.json({ data: { deleted: true } });
});

export default app;
