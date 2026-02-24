import { Hono } from 'hono';
import type { Env, Variables } from '../types';

/**
 * R2 Storage routes - Example of R2 bucket usage
 */
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /storage/:key - Get file
app.get('/:key', async (c) => {
  const key = c.req.param('key');
  const object = await c.env.STORAGE.get(key);

  if (!object) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'File not found' } }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, { headers });
});

// PUT /storage/:key - Upload file
app.put('/:key', async (c) => {
  const key = c.req.param('key');
  const body = await c.req.arrayBuffer();
  const contentType = c.req.header('Content-Type') || 'application/octet-stream';

  await c.env.STORAGE.put(key, body, {
    httpMetadata: { contentType },
  });

  return c.json({ data: { key, size: body.byteLength } }, 201);
});

// DELETE /storage/:key - Delete file
app.delete('/:key', async (c) => {
  const key = c.req.param('key');
  await c.env.STORAGE.delete(key);
  return c.json({ data: { deleted: true } });
});

// GET /storage - List files
app.get('/', async (c) => {
  const prefix = c.req.query('prefix') || '';
  const limit = parseInt(c.req.query('limit') || '100', 10);

  const listed = await c.env.STORAGE.list({ prefix, limit });

  return c.json({
    data: {
      objects: listed.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
      })),
      truncated: listed.truncated,
      cursor: listed.cursor,
    },
  });
});

export default app;
