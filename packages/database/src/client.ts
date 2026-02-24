import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Create a database client for Cloudflare Workers
 * Uses Hyperdrive for connection pooling when available
 */
export function createDb(connectionString: string) {
  const client = postgres(connectionString, {
    prepare: false, // Required for Hyperdrive
  });

  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
