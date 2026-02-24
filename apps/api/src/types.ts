import type { Database } from '@repo/database';

/**
 * Cloudflare Workers environment bindings
 */
export interface Env {
  // Environment variables
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DATABASE_URL: string;

  // R2 Bucket
  STORAGE: R2Bucket;

  // Queue
  MY_QUEUE: Queue<QueueMessage>;

  // Hyperdrive (optional - for DB connection pooling)
  // HYPERDRIVE: Hyperdrive;
}

/**
 * Queue message types
 */
export interface QueueMessage {
  type: 'email' | 'notification' | 'webhook';
  payload: Record<string, unknown>;
  timestamp: number;
}

/**
 * Hono context variables
 */
export interface Variables {
  db: Database;
}
