import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-white">
              CF Monorepo
            </Link>
            <div className="flex gap-6">
              <Link to="/features" className="text-gray-300 hover:text-white">
                Features
              </Link>
              <Link to="/docs" className="text-gray-300 hover:text-white">
                Docs
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>Built with Cloudflare Workers, Hono, Supabase, and React</p>
        </div>
      </footer>
    </div>
  );
}
