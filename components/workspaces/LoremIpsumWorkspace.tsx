'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'in',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
];

type Mode = 'sentences' | 'paragraphs';

interface Settings {
  mode: Mode;
  count: number;
  sentencesPerParagraph: number;
  wordsPerSentence: number;
  startWithClassic: boolean;
}

const defaultSettings: Settings = {
  mode: 'paragraphs',
  count: 3,
  sentencesPerParagraph: 4,
  wordsPerSentence: 12,
  startWithClassic: true,
};

function capitalize(sentence: string) {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function pickWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function buildSentence(wordsPerSentence: number, useClassicOpening: boolean) {
  const words = Array.from({ length: wordsPerSentence }, (_, index) => {
    if (useClassicOpening && index === 0) return 'lorem';
    if (useClassicOpening && index === 1 && wordsPerSentence > 1) return 'ipsum';
    return pickWord();
  });

  const sentence = words.join(' ');
  return `${capitalize(sentence)}.`;
}

function generateLorem(settings: Settings) {
  let usedClassic = false;

  const generateSentence = () => {
    const sentence = buildSentence(settings.wordsPerSentence, settings.startWithClassic && !usedClassic);
    if (!usedClassic && settings.startWithClassic) {
      usedClassic = true;
    }
    return sentence;
  };

  if (settings.mode === 'sentences') {
    return Array.from({ length: settings.count }, generateSentence).join(' ');
  }

  const paragraphs = Array.from({ length: settings.count }, () =>
    Array.from({ length: settings.sentencesPerParagraph }, generateSentence).join(' '),
  );

  return paragraphs.join('\n\n');
}

function downloadAsText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function LoremIpsumWorkspace({ tool }: { tool: ToolInfo }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [output, setOutput] = useState('');

  const itemLabel = settings.mode === 'sentences' ? 'sentences' : 'paragraphs';

  const estimatedWordCount = useMemo(() => {
    const sentenceCount =
      settings.mode === 'sentences' ? settings.count : settings.count * settings.sentencesPerParagraph;
    return sentenceCount * settings.wordsPerSentence;
  }, [settings]);

  useEffect(() => {
    setOutput(generateLorem(settings));
  }, [settings]);

  const handleRegenerate = () => {
    setOutput(generateLorem(settings));
  };

  const handleDownload = () => {
    downloadAsText(output, 'lorem-ipsum.txt');
  };

  return (
    <ToolCard title="Lorem Ipsum Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['sentences', 'paragraphs'] as Mode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSettings((prev) => ({ ...prev, mode }))}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  settings.mode === mode
                    ? 'border-brand/60 bg-brand/20 text-white shadow-brand'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {mode === 'sentences' ? 'Sentences' : 'Paragraphs'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <label htmlFor="lorem-count" className="font-semibold text-white">
                Quantity
              </label>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                {settings.count} {itemLabel}
              </span>
            </div>
            <input
              id="lorem-count"
              type="range"
              min={1}
              max={10}
              value={settings.count}
              onChange={(event) => setSettings((prev) => ({ ...prev, count: Number(event.target.value) }))}
              className="w-full accent-brand"
            />
            <p className="text-xs text-slate-400">
              Set how many {itemLabel} you need. Lower counts are ideal for tight UI mocks; higher counts fill long-form layouts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <label htmlFor="words-per-sentence" className="font-semibold text-white">
                Words per sentence
              </label>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">{settings.wordsPerSentence} words</span>
            </div>
            <input
              id="words-per-sentence"
              type="range"
              min={4}
              max={28}
              value={settings.wordsPerSentence}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, wordsPerSentence: Number(event.target.value) }))
              }
              className="w-full accent-brand"
            />
            <p className="text-xs text-slate-400">
              Longer sentences mimic body copy, while shorter ones are perfect for compact lists or tooltips.
            </p>
          </div>

          {settings.mode === 'paragraphs' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <label htmlFor="sentences-per-paragraph" className="font-semibold text-white">
                  Sentences per paragraph
                </label>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                  {settings.sentencesPerParagraph} sentences
                </span>
              </div>
              <input
                id="sentences-per-paragraph"
                type="range"
                min={2}
                max={10}
                value={settings.sentencesPerParagraph}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, sentencesPerParagraph: Number(event.target.value) }))
                }
                className="w-full accent-brand"
              />
              <p className="text-xs text-slate-400">
                Control how dense each paragraph feels. Fewer sentences keep things punchy; more sentences suit articles.
              </p>
            </div>
          )}

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={settings.startWithClassic}
              onChange={(event) => setSettings((prev) => ({ ...prev, startWithClassic: event.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <div>
              <p className="font-semibold text-white">Start with &ldquo;Lorem ipsum&rdquo;</p>
              <p className="text-xs text-slate-400">Use the traditional opening for the first sentence before randomizing the rest.</p>
            </div>
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Generated text</p>
              <p className="text-xs text-slate-400">
                Approximately {estimatedWordCount} words across {settings.mode === 'paragraphs' ? 'paragraphs' : 'sentences'}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
              <button
                onClick={handleRegenerate}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 hover:border-white/30"
              >
                <CursorArrowRaysIcon className="h-4 w-4" />
                Shuffle
              </button>
              <button
                onClick={() => copyToClipboard(output)}
                disabled={!output}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" />
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Download .txt
              </button>
            </div>
          </div>

          <textarea
            value={output}
            readOnly
            rows={12}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm leading-relaxed text-white"
          />
        </div>
      </div>
    </ToolCard>
  );
}
