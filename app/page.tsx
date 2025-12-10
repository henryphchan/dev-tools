'use client';

import { tools } from '../lib/tools';
import { Logo } from '../components/icons';
import { LandingToolCard } from '../components/LandingToolCard';
import { useFavorites } from '../hooks/useFavorites';

export default function Home() {
  const { favorites, isLoaded } = useFavorites();
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <Logo className="w-4 h-4 text-brand" />
          Developer utilities you can bookmark and trust
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50">
            Welcome to Dev Tools
          </h1>
          <p className="max-w-3xl text-lg text-slate-300">
            Select a tool from the sidebar to get started. Each utility is designed for performance and privacy, running entirely in your browser.
          </p>
        </div>
      </header>

      {isLoaded && favoriteTools.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Favorite Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteTools.map((tool) => (
              <LandingToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">All Tools</h2>
          <span className="badge bg-brand/15 text-brand border-brand/30">{tools.length} tools</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <LandingToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
