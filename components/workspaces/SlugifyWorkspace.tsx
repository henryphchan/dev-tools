'use client';

import { useMemo, useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { ClipboardDocumentCheckIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function SlugifyWorkspace({ tool }: { tool: ToolInfo }) {
  const [input, setInput] = useState('Instant slugify for new landing pages');
  const [delimiter, setDelimiter] = useState('-');
  const [lowercase, setLowercase] = useState(true);

  const slugifyResult = useMemo(() => {
    const safeDelimiter = delimiter.trim() || '-';
    const escapedDelimiter = escapeRegExp(safeDelimiter);

    const normalized = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['’]/g, '')
      .replace(/[^A-Za-z0-9]+/g, safeDelimiter);

    const collapsed = normalized
      .replace(new RegExp(`${escapedDelimiter}{2,}`, 'g'), safeDelimiter)
      .replace(new RegExp(`^${escapedDelimiter}|${escapedDelimiter}$`, 'g'), '');

    const slug = lowercase ? collapsed.toLowerCase() : collapsed;

    return { slug, delimiter: safeDelimiter };
  }, [delimiter, input, lowercase]);

  const segments = useMemo(() => {
    if (!slugifyResult.slug) return [];
    return slugifyResult.slug.split(slugifyResult.delimiter).filter(Boolean);
  }, [slugifyResult]);

  return (
    <ToolCard headingLevel="h1" title="Slugify String" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="slugify-input">
            Text to slugify
          </label>
          <textarea
            id="slugify-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Launch Readme v2: Fast & Focused"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="slugify-delimiter">
              Delimiter
            </label>
            <input
              id="slugify-delimiter"
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              maxLength={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand/50 focus:outline-none"
              placeholder="-"
            />
            <p className="text-xs text-slate-400">Hyphen by default. Repeats are collapsed automatically.</p>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <div>
              <p className="font-semibold text-white">Lowercase output</p>
              <p className="text-xs text-slate-400">Keep slugs consistent for routing and file names.</p>
            </div>
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Slugified</p>
              <p className="text-xs text-slate-400">URL-safe string with punctuation removed</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/5 px-3 py-1">{slugifyResult.slug.length} chars</span>
              <button
                onClick={() => copyToClipboard(slugifyResult.slug)}
                disabled={!slugifyResult.slug}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-slate-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
              </button>
            </div>
          </div>

          <p className={`font-mono text-lg ${slugifyResult.slug ? 'text-white' : 'text-slate-500'}`}>
            {slugifyResult.slug || 'Enter text to generate a slug'}
          </p>

          {segments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {segments.map((segment, index) => (
                <span key={`${segment}-${index}`} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                  {segment}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
