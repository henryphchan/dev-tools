'use client';

import { useMemo, useState } from 'react';
import { encode, decode } from '../../lib/toon';
import { ToolInfo } from '../../lib/tools';
import { ArrowPathRoundedSquareIcon, ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

type ConversionResult = {
  output: string;
  error: string;
};

const exampleJson = {
  products: [
    {
      id: 101,
      in_stock: true,
      price: 299.99,
      product_name: 'Wireless Noise Cancelling Headphones',
      tags: ['audio', 'bluetooth', 'premium'],
    },
    {
      id: 102,
      in_stock: true,
      price: 145.5,
      product_name: 'Ergonomic Mechanical Keyboard',
      tags: ['peripherals', 'office', 'typing'],
    },
  ],
};

function convertJsonToToon(jsonText: string): ConversionResult {
  if (!jsonText.trim()) return { output: '', error: '' };

  try {
    const parsed = JSON.parse(jsonText);
    const toon = encode(parsed);

    return { output: toon.trimEnd(), error: '' };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unable to convert JSON to TOON',
    };
  }
}

function convertToonToJson(toonText: string): ConversionResult {
  if (!toonText.trim()) return { output: '', error: '' };

  try {
    const parsed = decode(toonText);
    const normalized = JSON.stringify(parsed, null, 2);
    if (typeof normalized !== 'string') {
      return { output: '', error: 'Result could not be stringified' };
    }

    return { output: normalized, error: '' };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unable to convert TOON to JSON',
    };
  }
}

export function JsonToonWorkspace({ tool }: { tool: ToolInfo }) {
  const formattedExample = useMemo(() => JSON.stringify(exampleJson, null, 2), []);
  const initialToon = useMemo(() => convertJsonToToon(formattedExample).output, [formattedExample]);

  const [jsonInput, setJsonInput] = useState(formattedExample);
  const [toonInput, setToonInput] = useState(initialToon);

  const [toonOutput, setToonOutput] = useState(initialToon);
  const [jsonOutput, setJsonOutput] = useState(() => convertToonToJson(initialToon).output);

  const [jsonError, setJsonError] = useState('');
  const [toonError, setToonError] = useState('');

  const handleJsonToToon = () => {
    const result = convertJsonToToon(jsonInput);
    setToonOutput(result.output);
    setJsonError(result.error);
    if (!result.error && result.output) {
      setToonInput(result.output);
    }
  };

  const handleToonToJson = () => {
    const result = convertToonToJson(toonInput);
    setJsonOutput(result.output);
    setToonError(result.error);
  };

  return (
    <ToolCard headingLevel="h1" title="JSON ↔ TOON Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">JSON to TOON</p>
              <p className="text-xs text-slate-400">Parse JSON safely and emit TOON with sorted keys for consistent diffs.</p>
            </div>
            <button
              onClick={handleJsonToToon}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white shadow-brand"
            >
              <CursorArrowRaysIcon className="h-4 w-4" />
              Convert
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300" htmlFor="json-input">
              JSON input
            </label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[220px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white focus:border-brand/50 focus:outline-none"
              spellCheck={false}
            />
            <p className="text-[11px] text-slate-400">Validation happens in-browser—no payloads leave the page.</p>
          </div>

          {jsonError && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{jsonError}</p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="font-semibold text-white">TOON output</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleJsonToToon}
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-slate-200 hover:border-white/30"
                >
                  <ArrowPathRoundedSquareIcon className="h-3.5 w-3.5" />
                  Refresh
                </button>
                <button
                  onClick={() => copyToClipboard(toonOutput)}
                  disabled={!toonOutput}
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-slate-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            </div>
            <pre className="code-output min-h-[160px]" aria-label="TOON output">
              {toonOutput || 'Converted TOON will appear here'}
            </pre>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">TOON to JSON</p>
              <p className="text-xs text-slate-400">Outline notation is parsed with the JSON-only schema to avoid surprises.</p>
            </div>
            <button
              onClick={handleToonToJson}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white shadow-brand"
            >
              <CursorArrowRaysIcon className="h-4 w-4" />
              Convert
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300" htmlFor="toon-input">
              TOON input
            </label>
            <textarea
              id="toon-input"
              value={toonInput}
              onChange={(e) => setToonInput(e.target.value)}
              className="min-h-[220px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white focus:border-brand/50 focus:outline-none"
              spellCheck={false}
            />
            <p className="text-[11px] text-slate-400">Two-space indents keep hierarchies obvious for humans and models.</p>
          </div>

          {toonError && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{toonError}</p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <p className="font-semibold text-white">JSON output</p>
              <button
                onClick={() => copyToClipboard(jsonOutput)}
                disabled={!jsonOutput}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-slate-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <pre className="code-output min-h-[160px]" aria-label="JSON output">
              {jsonOutput || 'Converted JSON will appear here'}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-brand/5 via-white/5 to-brand/10 p-4 text-sm text-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Why TOON?</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-200">
            <li>
              <span className="font-semibold">Token-lean structure:</span> Dropping braces and commas typically trims prompt token count by 10–20%, leaving more space for actual content.
            </li>
            <li>
              <span className="font-semibold">Indent-first clarity:</span> Tree depth is obvious to humans and models, which reduces hallucinated siblings when an LLM rewrites data.
            </li>
            <li>
              <span className="font-semibold">Type-disciplined parsing:</span> The converter enforces JSON-safe scalars so TOON stays compatible with APIs and config files.
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Why LLM teams like it</p>
          <p className="text-slate-200">
            TOON is trending with LLM-heavy stacks because it reads like an outline, keeps deltas tiny for review, and round-trips cleanly to JSON for execution. It also plays well with constrained decoding strategies that expect deterministic indentation.
          </p>
          <pre className="code-output text-[13px]" aria-label="TOON example snippet">{`plan:
  summary: "Keep output terse and structured"
  steps:
    - capture goals
    - normalize inputs
    - stream final JSON`}</pre>
        </div>
      </div>
    </ToolCard>
  );
}
