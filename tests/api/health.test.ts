import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { unstable_dev, type UnstableDevWorker } from 'wrangler';

describe('Health API', () => {
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

  it('should return health status', async () => {
    const response = await worker.fetch('/health');
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('environment', 'development');
    expect(data).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await worker.fetch('/unknown-route');
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error.code).toBe('NOT_FOUND');
  });
});
