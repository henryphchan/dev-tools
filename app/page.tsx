'use client';

import Link from 'next/link';
import { tools } from '../lib/tools';
import { CursorArrowRaysIcon, SparklesIcon } from '../components/icons';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <SparklesIcon className="w-4 h-4 text-brand" />
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

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">All Tools</h2>
          <span className="badge bg-brand/15 text-brand border-brand/30">{tools.length} tools</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group relative block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand/40 hover:bg-brand/5 transition"
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold">{tool.accent}</span>
                    <span className="badge group-hover:bg-brand/20 group-hover:text-brand transition-colors">{tool.badge}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-brand transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-brand font-medium transition-colors">
                  <CursorArrowRaysIcon className="w-4 h-4" />
                  Open Tool
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
