import { vi } from 'vitest';

/**
 * Mock R2 Bucket for testing
 */
export function createMockR2Bucket() {
  const storage = new Map<string, { body: ArrayBuffer; metadata: object }>();

  return {
    get: vi.fn(async (key: string) => {
      const item = storage.get(key);
      if (!item) return null;

      return {
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(item.body));
            controller.close();
          },
        }),
        httpEtag: `"${key}-etag"`,
        writeHttpMetadata: vi.fn((headers: Headers) => {
          headers.set('Content-Type', 'application/octet-stream');
        }),
      };
    }),

    put: vi.fn(async (key: string, body: ArrayBuffer, options?: { httpMetadata?: object }) => {
      storage.set(key, { body, metadata: options?.httpMetadata || {} });
      return { key };
    }),

    delete: vi.fn(async (key: string) => {
      storage.delete(key);
    }),

    list: vi.fn(async (options?: { prefix?: string; limit?: number }) => {
      const objects = Array.from(storage.entries())
        .filter(([key]) => !options?.prefix || key.startsWith(options.prefix))
        .slice(0, options?.limit || 100)
        .map(([key, item]) => ({
          key,
          size: item.body.byteLength,
          uploaded: new Date(),
        }));

      return { objects, truncated: false, cursor: undefined };
    }),

    // For test assertions
    _storage: storage,
    _reset: () => storage.clear(),
  };
}

/**
 * Mock Queue for testing
 */
export function createMockQueue<T>() {
  const messages: T[] = [];

  return {
    send: vi.fn(async (message: T) => {
      messages.push(message);
    }),

    sendBatch: vi.fn(async (batch: { body: T }[]) => {
      messages.push(...batch.map((m) => m.body));
    }),

    // For test assertions
    _messages: messages,
    _reset: () => {
      messages.length = 0;
    },
  };
}

/**
 * Create mock environment bindings
 */
export function createMockEnv() {
  return {
    ENVIRONMENT: 'development' as const,
    DATABASE_URL: 'postgresql://mock:mock@localhost:5432/test',
    STORAGE: createMockR2Bucket(),
    MY_QUEUE: createMockQueue(),
  };
}
