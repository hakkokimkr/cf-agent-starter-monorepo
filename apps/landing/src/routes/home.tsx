import { Link } from 'react-router';
import { Button } from '@repo/ui';
import { Layout } from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            CF Monorepo Starter
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Production-ready Cloudflare Workers monorepo template with Supabase,
            Drizzle ORM, Hono, and React.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Cloudflare Workers"
            description="Deploy globally on Cloudflare's edge network with zero cold starts."
          />
          <FeatureCard
            title="Supabase + Drizzle"
            description="Type-safe database queries with Drizzle ORM and Supabase PostgreSQL."
          />
          <FeatureCard
            title="Hono Framework"
            description="Ultrafast web framework with built-in type inference for API clients."
          />
          <FeatureCard
            title="R2 Storage"
            description="S3-compatible object storage with zero egress fees."
          />
          <FeatureCard
            title="Queues & Cron"
            description="Background jobs and scheduled tasks out of the box."
          />
          <FeatureCard
            title="Full Test Coverage"
            description="Vitest, Playwright, and MSW for comprehensive testing."
          />
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to start building?
          </h2>
          <pre className="bg-gray-950 text-green-400 p-4 rounded-lg inline-block text-left">
            {`npx create-cf-monorepo my-app
cd my-app
pnpm install
pnpm dev`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
