'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { tools } from '../lib/tools';
import { CursorArrowRaysIcon, SparklesIcon } from '../components/icons';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(() => {
    const labels = tools.flatMap((tool) => [tool.badge, tool.accent]);
    return Array.from(new Set(labels)).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredTools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const hasActiveCategories = selectedCategories.length > 0;

    return tools.filter((tool) => {
      const matchesSearch =
        !term ||
        tool.title.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (!hasActiveCategories) return true;

      const toolCategories = [tool.badge, tool.accent];
      return selectedCategories.some((category) => toolCategories.includes(category));
    });
  }, [searchTerm, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

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
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = selectedCategories.includes(category);
              return (
                <button
                  type="button"
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`badge border ${
                    isActive
                      ? 'bg-brand/20 border-brand/40 text-brand'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:border-brand/30 hover:bg-brand/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
            {(searchTerm || selectedCategories.length > 0) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="relative block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand/40 hover:bg-brand/5 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
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
          ))}
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
