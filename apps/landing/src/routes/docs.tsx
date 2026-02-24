import { Layout } from '../components/Layout';

export default function DocsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Documentation</h1>

        <div className="prose prose-invert max-w-none">
          <h2>Getting Started</h2>
          <ol className="text-gray-300 space-y-4">
            <li>
              <strong>Clone the repository</strong>
              <pre className="bg-gray-950 p-3 rounded mt-2">
                git clone https://github.com/your/cf-monorepo-starter
              </pre>
            </li>
            <li>
              <strong>Install dependencies</strong>
              <pre className="bg-gray-950 p-3 rounded mt-2">pnpm install</pre>
            </li>
            <li>
              <strong>Set up environment variables</strong>
              <pre className="bg-gray-950 p-3 rounded mt-2">
                cp .env.example .env.local
              </pre>
            </li>
            <li>
              <strong>Start development servers</strong>
              <pre className="bg-gray-950 p-3 rounded mt-2">pnpm dev</pre>
            </li>
          </ol>

          <h2 className="mt-12">Environment Setup</h2>
          <h3>Local Development</h3>
          <p className="text-gray-300">
            For local development, you can use Supabase's local development
            setup:
          </p>
          <pre className="bg-gray-950 p-3 rounded mt-2 text-gray-300">
            {`# Start local Supabase
npx supabase start

# This will give you local DATABASE_URL, SUPABASE_URL, etc.`}
          </pre>

          <h3 className="mt-8">Cloudflare Bindings</h3>
          <p className="text-gray-300">
            R2, Queues, and other bindings are configured in{' '}
            <code>wrangler.toml</code>:
          </p>
          <pre className="bg-gray-950 p-3 rounded mt-2 text-gray-300 text-sm">
            {`[[r2_buckets]]
binding = "STORAGE"
bucket_name = "my-bucket"

[[queues.producers]]
queue = "my-queue"
binding = "MY_QUEUE"`}
          </pre>

          <h2 className="mt-12">Deployment</h2>
          <pre className="bg-gray-950 p-3 rounded mt-2 text-gray-300">
            {`# Deploy API to staging
pnpm --filter @repo/api deploy:staging

# Deploy API to production
pnpm --filter @repo/api deploy:production

# Deploy landing page
pnpm --filter @repo/landing build
# Then deploy dist/ to CF Pages`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}
