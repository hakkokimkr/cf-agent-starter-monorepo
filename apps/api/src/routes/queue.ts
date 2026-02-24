import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, Variables, QueueMessage } from '../types';

/**
 * Queue routes - Example of Queue usage
 */
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const sendMessageSchema = z.object({
  type: z.enum(['email', 'notification', 'webhook']),
  payload: z.record(z.unknown()),
});

// POST /queue/send - Send a message to the queue
app.post('/send', zValidator('json', sendMessageSchema), async (c) => {
  const body = c.req.valid('json');

  const message: QueueMessage = {
    ...body,
    timestamp: Date.now(),
  };

  await c.env.MY_QUEUE.send(message);

  return c.json({ data: { queued: true, timestamp: message.timestamp } });
});

// POST /queue/send-batch - Send multiple messages
const sendBatchSchema = z.object({
  messages: z.array(sendMessageSchema).min(1).max(100),
});

app.post('/send-batch', zValidator('json', sendBatchSchema), async (c) => {
  const { messages } = c.req.valid('json');

  const queueMessages: MessageSendRequest<QueueMessage>[] = messages.map((msg) => ({
    body: {
      ...msg,
      timestamp: Date.now(),
    },
  }));

  await c.env.MY_QUEUE.sendBatch(queueMessages);

  return c.json({ data: { queued: true, count: messages.length } });
});

export default app;
