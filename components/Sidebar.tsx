'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tools } from '../lib/tools';
import { SparklesIcon, MagnifyingGlassIcon } from './icons'; // Assuming MagnifyingGlassIcon exists or I'll add it

export function Sidebar() {
  const pathname = usePathname();
  const [filter, setFilter] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(tools.map((t) => t.badge));
    return Array.from(cats).sort();
  }, []);

  const filteredTools = useMemo(() => {
    const term = filter.toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.badge.toLowerCase().includes(term)
    );
  }, [filter]);

  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof tools> = {};
    categories.forEach((cat) => {
      const toolsInCat = filteredTools.filter((t) => t.badge === cat);
      if (toolsInCat.length > 0) {
        groups[cat] = toolsInCat;
      }
    });
    return groups;
  }, [categories, filteredTools]);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#0b1224] flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-slate-100 font-bold text-xl">
          <div className="p-1.5 bg-brand/20 rounded-lg text-brand">
            <SparklesIcon className="w-5 h-5" />
          </div>
          Dev Tools
        </Link>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 custom-scrollbar">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              {category}
            </h3>
            <ul className="space-y-1">
              {categoryTools.map((tool) => {
                const isActive = pathname === `/tools/${tool.slug}`;
                return (
                  <li key={tool.id}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-brand/10 text-brand font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {tool.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        
        {filteredTools.length === 0 && (
            <div className="px-2 text-sm text-slate-500">
                No tools found.
            </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-white/10">
          <p className="text-xs text-slate-600 text-center">
              &copy; {new Date().getFullYear()} Dev Tools
          </p>
      </div>
    </aside>
  );
}
