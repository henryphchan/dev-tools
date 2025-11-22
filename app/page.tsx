'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToolId, ToolInfo, tools } from '../lib/tools';
import { CursorArrowRaysIcon, SparklesIcon, StarIcon } from '../components/icons';

const FAVORITES_STORAGE_KEY = 'favoriteTools';

function filterTools(toolsToFilter: ToolInfo[], searchTerm: string) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return toolsToFilter;

  return toolsToFilter.filter(
    (tool) =>
      tool.title.toLowerCase().includes(term) ||
      tool.description.toLowerCase().includes(term) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(term))
  );
}

export default function Home() {
  const [favorites, setFavorites] = useState<ToolId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchScope, setSearchScope] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (error) {
        console.error('Unable to read favorites from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: ToolId) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id]));
  }, []);

  const favoriteTools = useMemo(() => tools.filter((tool) => favorites.includes(tool.id)), [favorites]);
  const filteredFavorites = useMemo(() => filterTools(favoriteTools, searchTerm), [favoriteTools, searchTerm]);

  const filteredTools = useMemo(() => {
    if (searchScope === 'favorites') {
      return filterTools(favoriteTools, searchTerm);
    }

    return filterTools(tools, searchTerm);
  }, [favoriteTools, searchScope, searchTerm]);

  const renderToolCard = useCallback(
    (tool: ToolInfo) => {
      const isFavorite = favorites.includes(tool.id);
      return (
        <Link
          key={tool.id}
          href={`/tools/${tool.slug}`}
          className="relative block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand/40 hover:bg-brand/5 transition"
        >
          <button
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleFavorite(tool.id);
            }}
            className={
              isFavorite
                ? 'absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand/50 bg-brand/10 text-brand shadow-[0_0_0_1px_rgba(14,165,233,0.25)]'
                : 'absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:border-brand/50 hover:text-brand'
            }
          >
            <StarIcon className={isFavorite ? 'w-4 h-4 text-brand fill-current' : 'w-4 h-4 text-slate-200 fill-transparent'} />
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 pr-12">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold">{tool.accent}</span>
              <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{tool.description}</p>
            </div>
            <span className="badge">{tool.badge}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-brand font-semibold">
            <CursorArrowRaysIcon className="w-4 h-4" />
            Open {tool.title}
          </div>
        </Link>
      );
    },
    [favorites, toggleFavorite]
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <header className="space-y-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <SparklesIcon className="w-4 h-4 text-brand" />
          Developer utilities you can bookmark and trust
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50">
            Dev Tools – free online formatters, converters, and calculators
          </h1>
          <p className="max-w-4xl mx-auto text-lg text-slate-300">
            Discover a searchable library of everyday developer helpers. Each tool has its own SEO-friendly URL so you can share, bookmark, or let search engines index the exact formatter, converter, or calculator you need.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-300">
          <span className="badge">SEO-ready tool pages</span>
          <span className="badge">Built with Next.js App Router</span>
          <span className="badge">Fast, client-side focus</span>
        </div>
      </header>

      <section className="section-card gradient-border space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Tool Library</p>
            <h2 className="text-2xl font-semibold text-white">Find the right formatter, converter, or calculator</h2>
            <p className="text-sm text-slate-300">Use the quick search or browse the curated list below. Each link opens a focused workspace for that tool.</p>
          </div>
          <span className="badge bg-brand/15 text-brand border-brand/30">{tools.length} tools</span>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400" htmlFor="tool-search">Quick search</label>
          <input
            id="tool-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search JSON, SQL, timezone, Base64..."
            className="w-full px-3 py-2"
          />
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">Scope</span>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
              <input
                type="radio"
                name="search-scope"
                value="all"
                checked={searchScope === 'all'}
                onChange={() => setSearchScope('all')}
                className="accent-brand"
              />
              All tools
            </label>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
              <input
                type="radio"
                name="search-scope"
                value="favorites"
                checked={searchScope === 'favorites'}
                onChange={() => setSearchScope('favorites')}
                className="accent-brand"
              />
              Favorites only
            </label>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Favorites</p>
                <h3 className="text-lg font-semibold text-white">Quick access to your starred tools</h3>
              </div>
              <span className="badge bg-brand/15 text-brand border-brand/30">{favorites.length} saved</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFavorites.map((tool) => renderToolCard(tool))}
              {filteredFavorites.length === 0 && (
                <p className="text-sm text-slate-300 sm:col-span-2 lg:col-span-3">No favorites match that search—try another keyword.</p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => renderToolCard(tool))}
          {filteredTools.length === 0 && (
            <p className="text-sm text-slate-300 sm:col-span-2 lg:col-span-3">No tools match that search—try another keyword like “JSON”, “SQL”, or “timezone”.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold text-center">Why Dev Tools</p>
        <h2 className="text-3xl font-semibold text-white text-center">Optimized for discoverability and focus</h2>
        <p className="max-w-4xl mx-auto text-center text-slate-300">
          Every utility has a descriptive title, dedicated URL, and shareable metadata so your teammates—and search engines—can jump directly into the exact workflow they need. Bookmark your favorites or link them in documentation without losing context.
        </p>
      </section>
    </main>
  );
}
