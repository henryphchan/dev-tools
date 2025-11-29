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
  sourceUrl?: string;
  responseStatus?: number;
  contentType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

const RECOMMENDED_TAGS: { attribute: MetaTag['attribute']; key: string; label: string }[] = [
  { attribute: 'property', key: 'og:title', label: 'Open Graph title' },
  { attribute: 'property', key: 'og:description', label: 'Open Graph description' },
  { attribute: 'property', key: 'og:image', label: 'Open Graph image' },
  { attribute: 'property', key: 'og:url', label: 'Open Graph URL' },
  { attribute: 'property', key: 'og:site_name', label: 'Open Graph site name' },
  { attribute: 'name', key: 'description', label: 'Meta description' },
  { attribute: 'name', key: 'twitter:card', label: 'Twitter card' },
  { attribute: 'name', key: 'twitter:title', label: 'Twitter title' },
  { attribute: 'name', key: 'twitter:description', label: 'Twitter description' },
  { attribute: 'name', key: 'twitter:image', label: 'Twitter image' },
];

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

function TwitterPreview({ data }: { data: MetaPreviewResult }) {
  const cardType = data.twitterCard || 'summary_large_image';
  const title = data.twitterTitle || data.title || 'Twitter card title';
  const description =
    data.twitterDescription || data.description || 'Add twitter:title and twitter:description to control card copy.';
  const image = data.twitterImage || data.image;

  return (
    <div className="overflow-hidden rounded-xl border border-sky-800/60 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-sky-100/80">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Twitter / X
        </span>
        <span className="rounded-full border border-sky-500/60 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-sky-100">
          {cardType}
        </span>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sky-200/80">
          {data.twitterSite || data.siteName || 'Account'}
          {data.twitterCreator && <span className="text-slate-500">•</span>}
          {data.twitterCreator}
        </div>
        {image ? (
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Twitter preview" className="h-40 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-800 text-xs text-slate-400">
            Provide twitter:image for a rich card
          </div>
        )}
        <div className="space-y-1 text-slate-50">
          <p className="text-base font-semibold line-clamp-2">{title}</p>
          <p className="text-sm text-slate-200/90 line-clamp-3">{description}</p>
          <p className="text-[11px] text-slate-400">{data.url}</p>
        </div>
      </div>
    </div>
  );
}

function ThreadsPreview({ data }: { data: MetaPreviewResult }) {
  const title = data.title || data.twitterTitle || 'Threads headline';
  const description = data.description || data.twitterDescription || 'Threads relies on Open Graph tags for link cards.';
  const image = data.image || data.twitterImage;

  return (
    <div className="rounded-xl border border-purple-700/50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 text-purple-50">
      <div className="flex items-center justify-between text-xs text-purple-200/80">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400" aria-hidden />
          Threads
        </span>
        <span className="rounded-full border border-purple-600/60 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-purple-50">
          OG preview
        </span>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-base font-semibold line-clamp-2">{title}</p>
        <p className="text-sm text-purple-100/90 line-clamp-3">{description}</p>
        {image ? (
          <div className="overflow-hidden rounded-lg border border-purple-800/70 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Threads preview" className="h-32 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-purple-800 text-xs text-purple-200/70">
            Add og:image or twitter:image for a visual card
          </div>
        )}
        <p className="text-[11px] text-purple-300/80">{data.url}</p>
      </div>
    </div>
  );
}

export function MetaPreviewWorkspace({ tool }: { tool: ToolInfo }) {
  const [targetUrl, setTargetUrl] = useState('https://');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MetaPreviewResult | null>(null);
  const [copied, setCopied] = useState(false);

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
      setCopied(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyMetaTags = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result.metaTags, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const missingTags = useMemo(() => {
    if (!result) return [] as typeof RECOMMENDED_TAGS;
    const hasTag = (tag: (typeof RECOMMENDED_TAGS)[number]) =>
      result.metaTags.some((meta) => meta.attribute === tag.attribute && meta.key.toLowerCase() === tag.key.toLowerCase());

    return RECOMMENDED_TAGS.filter((tag) => !hasTag(tag));
  }, [result]);

  const additionalSuggestions = useMemo(() => {
    if (!result) return [] as string[];
    const suggestions: string[] = [];

    if (!result.image) {
      suggestions.push('Add an Open Graph or Twitter image for rich previews.');
    }
    if (!result.description || result.description.length < 50) {
      suggestions.push('Write a descriptive meta description (50-160 characters).');
    }
    if (result.description && result.description.length > 200) {
      suggestions.push('Consider shortening the meta description to avoid truncation.');
    }
    if (!result.url?.includes('https://')) {
      suggestions.push('Prefer HTTPS URLs for better trust and sharing.');
    }

    return suggestions;
  }, [result]);

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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            <PreviewCard title="Twitter / X">
              <TwitterPreview data={result} />
            </PreviewCard>
            <PreviewCard title="Threads">
              <ThreadsPreview data={result} />
            </PreviewCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PreviewCard title="Actionable suggestions">
              <div className="space-y-2 text-sm">
                {missingTags.length === 0 && additionalSuggestions.length === 0 && (
                  <p className="text-slate-300">Your page already advertises the most common social and search tags.</p>
                )}
                {missingTags.length > 0 && (
                  <div>
                    <p className="font-semibold text-slate-100">Recommended tags to add</p>
                    <ul className="mt-1 space-y-1">
                      {missingTags.map((tag) => (
                        <li key={`${tag.attribute}-${tag.key}`} className="flex items-start gap-2 text-slate-200">
                          <span aria-hidden>⚠️</span>
                          <span>
                            <span className="font-semibold">{tag.key}</span> — {tag.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {additionalSuggestions.length > 0 && (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-100">Quality checks</p>
                    <ul className="space-y-1">
                      {additionalSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-200">
                          <span aria-hidden>💡</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </PreviewCard>

            <PreviewCard title="Fetch diagnostics">
              <dl className="grid grid-cols-3 gap-3 text-sm text-slate-200">
                <div className="col-span-3 sm:col-span-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Resolved URL</dt>
                  <dd className="break-all text-slate-100">{result.sourceUrl || result.url}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</dt>
                  <dd className="text-slate-100">{result.responseStatus ?? 'Unknown'}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Content-Type</dt>
                  <dd className="text-slate-100">{result.contentType ?? 'Unavailable'}</dd>
                </div>
              </dl>
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
            {result.metaTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={copyMetaTags}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-slate-100 transition hover:border-white/20"
                >
                  {copied ? 'Copied JSON to clipboard' : 'Copy meta tags as JSON'}
                </button>
                <p className="text-xs text-slate-400">Useful for debugging or sharing with teammates.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolCard>
  );
}
