import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';
import { fetcher } from '~/lib/api';

interface HealthStatus {
  status: string;
  environment: string;
  timestamp: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  async function checkHealth() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher<HealthStatus>('/health');
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check health');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to CF Monorepo Starter
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>API Health</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Checking...</p>
            ) : error ? (
              <div className="space-y-2">
                <p className="text-red-600">{error}</p>
                <Button onClick={checkHealth} size="sm">
                  Retry
                </Button>
              </div>
            ) : health ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">
                  Status: {health.status}
                </p>
                <p className="text-gray-500 text-sm">
                  Environment: {health.environment}
                </p>
                <p className="text-gray-400 text-xs">
                  {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ Cloudflare Workers</li>
              <li>✅ Hono API Framework</li>
              <li>✅ Supabase + Drizzle ORM</li>
              <li>✅ R2 Storage</li>
              <li>✅ Queues</li>
              <li>✅ Scheduled Tasks</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
