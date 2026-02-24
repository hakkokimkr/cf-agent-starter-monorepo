import { createMiddleware } from 'hono/factory';
import type { Env, Variables } from '../types';
import { getDb } from '../lib/db';

/**
 * Database middleware - injects db instance into context
 */
export const dbMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  c.set('db', getDb(c.env));
  await next();
});
