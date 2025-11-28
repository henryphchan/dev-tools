'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { ClipboardDocumentCheckIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const MAX_PREVIEW_DIMENSION = 420;

export function SvgPlaceholderWorkspace({ tool }: { tool: ToolInfo }) {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(32);
  const [text, setText] = useState('300 x 200');

  const sizeLabelRef = useRef(`${width} x ${height}`);

  useEffect(() => {
    const nextSizeLabel = `${width} x ${height}`;
    if (text.trim() === sizeLabelRef.current) {
      setText(nextSizeLabel);
    }
    sizeLabelRef.current = nextSizeLabel;
  }, [height, text, width]);

  const label = text.trim() || `${width} x ${height}`;

  const svgMarkup = useMemo(() => {
    const safeLabel = escapeHtml(label);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">\n  <rect width="100%" height="100%" fill="${backgroundColor}" />\n  <text x="50%" y="50%" fill="${textColor}" font-size="${fontSize}" font-family="'Inter', system-ui, -apple-system, sans-serif" dominant-baseline="middle" text-anchor="middle">${safeLabel}</text>\n</svg>`;
  }, [backgroundColor, fontSize, height, label, textColor, width]);

  const base64Svg = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    try {
      return window.btoa(unescape(encodeURIComponent(svgMarkup)));
    } catch (error) {
      console.error('Unable to encode SVG to Base64', error);
      return '';
    }
  }, [svgMarkup]);

  const dataUri = base64Svg ? `data:image/svg+xml;base64,${base64Svg}` : '';

  const { previewScale, previewWidth, previewHeight } = useMemo(() => {
    const maxDimension = Math.max(width, height) || 1;
    const scale = Math.min(1, MAX_PREVIEW_DIMENSION / maxDimension);
    const scaledWidth = Math.max(1, Math.round(width * scale));
    const scaledHeight = Math.max(1, Math.round(height * scale));

    return {
      previewScale: scale,
      previewWidth: scaledWidth,
      previewHeight: scaledHeight,
    };
  }, [height, width]);

  return (
    <ToolCard
      title="SVG Placeholder Generator"
      description={tool.description}
      badge={tool.badge}
      accent={tool.accent}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-width">
              Width (px)
            </label>
            <input
              id="placeholder-width"
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-height">
              Height (px)
            </label>
            <input
              id="placeholder-height"
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-font-size">
              Font size (px)
            </label>
            <input
              id="placeholder-font-size"
              type="number"
              min={6}
              value={fontSize}
              onChange={(e) => setFontSize(Math.max(6, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-bg">
              Background color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="placeholder-bg"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                aria-label="Choose background color"
                className="h-11 w-14"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-text-color">
              Text color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="placeholder-text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                aria-label="Choose text color"
                className="h-11 w-14"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-1 md:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="placeholder-text">
              Text (defaults to size)
            </label>
            <input
              id="placeholder-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`${width} x ${height}`}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">Live preview</p>
              <p className="text-xs text-slate-400">SVG rendered with your current settings.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">
                {width} × {height}
              </span>
              {previewScale < 1 && (
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-200">
                  Preview scaled to {Math.round(previewScale * 100)}%
                </span>
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
            <div className="flex items-center justify-center p-4">
              <svg
                role="img"
                width={previewWidth}
                height={previewHeight}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid slice"
              >
                <rect width="100%" height="100%" fill={backgroundColor} />
                <text
                  x="50%"
                  y="50%"
                  fill={textColor}
                  fontSize={fontSize}
                  fontFamily="Inter, system-ui, -apple-system, sans-serif"
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">HTML (inline SVG)</p>
                <p className="text-xs text-slate-400">Paste directly into your markup.</p>
              </div>
              <button
                onClick={() => copyToClipboard(svgMarkup)}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-white/30"
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" /> Copy
              </button>
            </div>
            <textarea value={svgMarkup} readOnly className="w-full font-mono text-xs leading-relaxed" aria-label="SVG HTML" />
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">SVG as Base64</p>
                <p className="text-xs text-slate-400">Use as an <code>img</code> source or CSS background.</p>
              </div>
              <button
                onClick={() => copyToClipboard(dataUri)}
                disabled={!dataUri}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" /> Copy
              </button>
            </div>
            <textarea
              value={dataUri || 'Base64 data will appear here once your SVG is ready.'}
              readOnly
              className="w-full font-mono text-xs leading-relaxed"
              aria-label="SVG Base64"
            />
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
