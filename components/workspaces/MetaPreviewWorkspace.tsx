'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { MagnifyingGlassIcon } from '../icons';
import ToolCard from '../ToolCard';

interface MetaTag {
  attribute: 'name' | 'property';
  key: string;
  content: string;
}

interface MetaPreviewResult {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  metaTags: MetaTag[];
}

function PreviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow-brand">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="space-y-2 text-sm text-slate-200">{children}</div>
    </div>
  );
}

function GooglePreview({ data }: { data: MetaPreviewResult }) {
  const host = useMemo(() => {
    try {
      return new URL(data.url).hostname.replace(/^www\./, '');
    } catch {
      return data.url;
    }
  }, [data.url]);

  return (
    <div className="space-y-1">
      <p className="text-xs text-emerald-200 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        {host}
      </p>
      <p className="text-lg font-semibold text-[#4d90fe]">{data.title || 'Page Title'}</p>
      <p className="text-sm text-slate-200 leading-relaxed line-clamp-3">
        {data.description || 'No description found. Add a meta description tag for better search previews.'}
      </p>
    </div>
  );
}

function FacebookPreview({ data }: { data: MetaPreviewResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      {data.image ? (
        <div className="h-40 w-full overflow-hidden bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt="Facebook preview" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-xs text-slate-400">
          No social image found
        </div>
      )}
      <div className="space-y-1 p-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{data.siteName ?? 'Your Site'}</p>
        <p className="text-base font-semibold text-slate-50 line-clamp-2">{data.title || 'Page title'}</p>
        <p className="text-sm text-slate-200 line-clamp-2">
          {data.description || 'Meta description text is recommended for social sharing.'}
        </p>
      </div>
    </div>
  );
}

function WhatsappPreview({ data }: { data: MetaPreviewResult }) {
  return (
    <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/60 p-3 text-sm text-emerald-50">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-800/70 text-xs font-semibold">
          Link
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Whatsapp</p>
          <p className="font-semibold">{data.title || 'Title not detected'}</p>
          <p className="text-emerald-100/80 line-clamp-3">
            {data.description || 'Whatsapp cards often use the Open Graph title and description.'}
          </p>
          <p className="text-[11px] text-emerald-200/90">{data.url}</p>
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({ data }: { data: MetaPreviewResult }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950">
      {data.image && (
        <div className="h-32 w-full overflow-hidden border-b border-slate-800 bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt="LinkedIn preview" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="space-y-1 p-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{data.siteName ?? 'LinkedIn'}</p>
        <p className="font-semibold text-slate-50 line-clamp-2">{data.title || 'LinkedIn headline'}</p>
        <p className="text-sm text-slate-200 line-clamp-2">
          {data.description || 'Add Open Graph tags for richer LinkedIn link previews.'}
        </p>
        <p className="text-[11px] text-slate-400">{data.url}</p>
      </div>
    </div>
  );
}

export function MetaPreviewWorkspace({ tool }: { tool: ToolInfo }) {
  const [targetUrl, setTargetUrl] = useState('https://');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MetaPreviewResult | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/meta-preview?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to fetch metadata.');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolCard title={tool.title} description={tool.description} badge={tool.badge} accent={tool.accent}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="text-sm text-slate-200" htmlFor="target-url">
          Enter a URL to fetch and preview its meta tags
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="target-url"
            type="url"
            required
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand disabled:opacity-70"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            {loading ? 'Fetching...' : 'Fetch meta tags'}
          </button>
        </div>
      </form>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}

      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <PreviewCard title="Google Search">
              <GooglePreview data={result} />
            </PreviewCard>
            <PreviewCard title="Facebook">
              <FacebookPreview data={result} />
            </PreviewCard>
            <PreviewCard title="WhatsApp">
              <WhatsappPreview data={result} />
            </PreviewCard>
            <PreviewCard title="LinkedIn">
              <LinkedInPreview data={result} />
            </PreviewCard>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100">Detected meta tags</h3>
            <div className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-slate-900/50">
              {result.metaTags.length === 0 ? (
                <p className="p-3 text-sm text-slate-400">No meta tags were detected on this page.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/70 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Attribute</th>
                      <th className="px-3 py-2 font-semibold">Key</th>
                      <th className="px-3 py-2 font-semibold">Content</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-100">
                    {result.metaTags.map((tag, index) => (
                      <tr key={`${tag.key}-${index}`} className="align-top">
                        <td className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-400">{tag.attribute}</td>
                        <td className="px-3 py-2 font-medium text-slate-50">{tag.key}</td>
                        <td className="px-3 py-2 text-slate-200">{tag.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}
