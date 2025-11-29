'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { tools } from '../lib/tools';
import { Logo, XMarkIcon, GitHubIcon, LinkedInIcon } from './icons';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0b1224] border-r border-white/10">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-100 font-bold text-xl" onClick={onClose}>
          <div className="p-1.5 bg-brand/20 rounded-lg text-brand">
            <Logo className="w-5 h-5" />
          </div>
          Dev Tools
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
          {filter && (
            <button
              type="button"
              onClick={() => setFilter('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
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
                      onClick={onClose}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive
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
        <div className="flex justify-center gap-4 mb-4">
          <a
            href="https://github.com/henryphchan/dev-tools/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/henry-ph-chan/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-5 h-5" />
          </a>
        </div>
        <p className="text-xs text-slate-600 text-center">
          &copy; {new Date().getFullYear()} Dev Tools
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`relative z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      </div>
    </>
  );
}
