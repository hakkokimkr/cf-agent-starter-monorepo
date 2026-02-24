import { Layout } from '../components/Layout';

export default function FeaturesPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Features</h1>

        <div className="space-y-12">
          <Section title="Monorepo Structure">
            <p>
              Powered by Turborepo for fast, incremental builds. Share code
              between apps with workspace packages.
            </p>
            <pre className="bg-gray-950 p-4 rounded-lg mt-4 text-sm text-gray-300 overflow-x-auto">
              {`cf-monorepo-starter/
├── apps/
│   ├── api/         # Hono API on CF Workers
│   ├── landing/     # Landing page (React Router v7)
│   └── web/         # Main app (Vite SPA)
├── packages/
│   ├── database/    # Drizzle schema
│   ├── shared-types/
│   └── ui/          # React components
└── tests/`}
            </pre>
          </Section>

          <Section title="Type-Safe API Client">
            <p>
              Use Hono's client for fully typed API calls without code
              generation.
            </p>
            <pre className="bg-gray-950 p-4 rounded-lg mt-4 text-sm text-gray-300 overflow-x-auto">
              {`import { hc } from 'hono/client';
import type { AppType } from '@repo/api';

const api = hc<AppType>('/');

// Fully typed!
const users = await api.api.users.$get();
const data = await users.json();`}
            </pre>
          </Section>

          <Section title="Database Migrations">
            <p>
              Use Drizzle Kit for type-safe migrations across all environments.
            </p>
            <pre className="bg-gray-950 p-4 rounded-lg mt-4 text-sm text-gray-300">
              {`# Generate migration
pnpm db:generate

# Apply to local
pnpm db:push

# Apply to production
DATABASE_URL=... pnpm db:migrate`}
            </pre>
          </Section>

          <Section title="Testing">
            <p>
              Comprehensive testing setup with Vitest, Playwright, and
              Miniflare.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-300 space-y-2">
              <li>API tests with Miniflare (local CF runtime)</li>
              <li>UI component tests with Playwright</li>
              <li>E2E tests with Playwright</li>
              <li>Mock utilities for agent-friendly testing</li>
            </ul>
          </Section>
        </div>
      </div>
    </Layout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </section>
  );
}
