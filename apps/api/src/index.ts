import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';

import type { Env, Variables, QueueMessage } from './types';
import { dbMiddleware } from './middleware/db';
import usersRoutes from './routes/users';
import storageRoutes from './routes/storage';
import queueRoutes from './routes/queue';

// Create main app
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Database middleware for API routes
app.use('/api/*', dbMiddleware);

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.route('/api/users', usersRoutes);
app.route('/api/storage', storageRoutes);
app.route('/api/queue', queueRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: c.env.ENVIRONMENT === 'production' ? 'Internal server error' : err.message,
      },
    },
    500
  );
});

// Export app type for hono/client
export type AppType = typeof app;

// Export handlers
export default {
  // HTTP fetch handler
  fetch: app.fetch,

  // Scheduled (Cron) handler
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`Cron triggered at ${new Date(event.scheduledTime).toISOString()}`);

    // Example: Run different tasks based on cron schedule
    switch (event.cron) {
      case '0 * * * *': // Every hour
        ctx.waitUntil(hourlyTask(env));
        break;
      default:
        console.log(`Unknown cron schedule: ${event.cron}`);
    }
  },

  // Queue consumer handler
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    console.log(`Processing ${batch.messages.length} messages from queue`);

    for (const message of batch.messages) {
      try {
        await processQueueMessage(message.body, env);
        message.ack();
      } catch (error) {
        console.error('Failed to process message:', error);
        message.retry();
      }
    }
  },
};

// Helper functions
async function hourlyTask(env: Env): Promise<void> {
  console.log('Running hourly task...');
  // Add your hourly task logic here
  // Example: cleanup old data, send reports, etc.
}

async function processQueueMessage(message: QueueMessage, env: Env): Promise<void> {
  console.log(`Processing ${message.type} message from ${new Date(message.timestamp).toISOString()}`);

  switch (message.type) {
    case 'email':
      // Send email using a service like Resend, SendGrid, etc.
      console.log('Sending email:', message.payload);
      break;

    case 'notification':
      // Send push notification
      console.log('Sending notification:', message.payload);
      break;

    case 'webhook':
      // Call external webhook
      console.log('Calling webhook:', message.payload);
      break;

    default:
      console.log('Unknown message type');
  }
}
