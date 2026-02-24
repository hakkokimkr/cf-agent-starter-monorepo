import { hc } from 'hono/client';
import type { AppType } from '@repo/api';

/**
 * Type-safe API client using Hono's client
 * 
 * Usage:
 *   const users = await api.api.users.$get();
 *   const data = await users.json();
 */
export const api = hc<AppType>(
  import.meta.env.DEV ? 'http://localhost:8787' : ''
);

/**
 * Alternative: Simple fetch wrapper for custom needs
 */
export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.DEV ? 'http://localhost:8787' : '';
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Request failed');
  }

  return response.json();
}
