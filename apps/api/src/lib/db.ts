import { createDb, type Database } from '@repo/database';
import type { Env } from '../types';

let db: Database | null = null;

/**
 * Get or create database connection
 * Reuses connection within the same request context
 */
export function getDb(env: Env): Database {
  if (!db) {
    // Use Hyperdrive if available, otherwise direct connection
    // const connectionString = env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL;
    const connectionString = env.DATABASE_URL;
    db = createDb(connectionString);
  }
  return db;
}
