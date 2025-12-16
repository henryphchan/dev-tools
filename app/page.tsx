'use client';

import { tools } from '../lib/tools';
import { Logo, GitHubIcon } from '../components/icons';
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

      <section className="space-y-6 pt-6 border-t border-white/10">
        <h2 className="text-2xl font-semibold text-white">Open Source</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-300 mb-6">
            This project is open source and we welcome contributions from the community.
            If you find a bug or have a suggestion, please create an issue on GitHub.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/henryphchan/dev-tools/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-colors font-medium"
            >
              <GitHubIcon className="w-5 h-5" />
              View on GitHub
            </a>
            <a
              href="https://github.com/henryphchan/dev-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg transition-colors font-medium border border-brand/20"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </section>
    </div >
  );
}
