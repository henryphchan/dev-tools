'use client';

import { useState, useRef } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

const colorPalettes: Record<string, string[]> = {
    aurora: ['#22d3ee', '#a855f7', '#f472b6', '#f97316', '#facc15'],
    grayscale: ['#f8fafc', '#cbd5e1', '#94a3b8', '#475569', '#1f2937'],
    ocean: ['#67e8f9', '#22d3ee', '#0284c7', '#0ea5e9', '#312e81'],
    sunset: ['#f472b6', '#fb923c', '#facc15', '#f97316', '#ef4444'],
};

export function WordCloudWorkspace({ tool }: { tool: ToolInfo }) {
    const [wordCloudText, setWordCloudText] = useState('');
    const [wordCloudBg, setWordCloudBg] = useState('#0b1224');
    const [wordCloudMaxWords, setWordCloudMaxWords] = useState(60);
    const [wordCloudStopwords, setWordCloudStopwords] = useState('the,and,a,to,of,in,for,on,with,at,by');
    const [wordCloudPalette, setWordCloudPalette] = useState('aurora');
    const [wordCloudWidth, setWordCloudWidth] = useState(640);
    const [wordCloudHeight, setWordCloudHeight] = useState(360);
    const [wordCloudError, setWordCloudError] = useState('');
    const [isGeneratingWordCloud, setIsGeneratingWordCloud] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const buildWordList = () => {
        const stopwords = new Set(
            wordCloudStopwords
                .split(',')
                .map((word) => word.trim().toLowerCase())
                .filter(Boolean)
        );

        const tokens = wordCloudText.match(/[\p{L}\p{N}']+/gu) || [];
        const counts = new Map<string, number>();

        tokens.forEach((token) => {
            const lower = token.toLowerCase();
            if (stopwords.has(lower) || lower.length < 2) return;
            counts.set(lower, (counts.get(lower) || 0) + 1);
        });

        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, Math.max(1, wordCloudMaxWords));
    };

    const generateWordCloud = async () => {
        if (!canvasRef.current) return;

        const list = buildWordList();
        if (list.length === 0) {
            setWordCloudError('Enter some text to visualize.');
            return;
        }

        setIsGeneratingWordCloud(true);

        try {
            const WordCloud = (await import('wordcloud')).default as any;
            const palette = colorPalettes[wordCloudPalette] || colorPalettes.aurora;

            canvasRef.current.width = wordCloudWidth;
            canvasRef.current.height = wordCloudHeight;

            WordCloud(canvasRef.current, {
                list,
                backgroundColor: wordCloudBg,
                color: () => palette[Math.floor(Math.random() * palette.length)],
                weightFactor: (size: number) => Math.max(Math.min(size * 12, 140), 12),
                rotateRatio: 0,
                shuffle: true,
                drawOutOfBound: false,
            });

            setWordCloudError('');
        } catch (error) {
            console.error('Word cloud generation failed', error);
            setWordCloudError('Unable to render the word cloud. Please try again.');
        } finally {
            setIsGeneratingWordCloud(false);
        }
    };

    return (
        <ToolCard title="Word Cloud Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-300">Text to visualize</label>
                        <textarea
                            value={wordCloudText}
                            onChange={(e) => setWordCloudText(e.target.value)}
                            placeholder="Paste or type your text here..."
                            className="w-full"
                            rows={6}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Max words</label>
                            <input
                                type="number"
                                min={10}
                                max={400}
                                value={wordCloudMaxWords}
                                onChange={(e) => setWordCloudMaxWords(Number(e.target.value))}
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Color palette</label>
                            <select
                                value={wordCloudPalette}
                                onChange={(e) => setWordCloudPalette(e.target.value)}
                                className="w-full px-3 py-2"
                            >
                                <option value="aurora">Aurora (brand)</option>
                                <option value="grayscale">Grayscale</option>
                                <option value="ocean">Ocean</option>
                                <option value="sunset">Sunset</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Canvas width (px)</label>
                            <input
                                type="number"
                                min={320}
                                max={1200}
                                value={wordCloudWidth}
                                onChange={(e) => setWordCloudWidth(Number(e.target.value))}
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Canvas height (px)</label>
                            <input
                                type="number"
                                min={240}
                                max={900}
                                value={wordCloudHeight}
                                onChange={(e) => setWordCloudHeight(Number(e.target.value))}
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-sm text-slate-300">Stopwords (comma-separated)</label>
                            <input
                                type="text"
                                value={wordCloudStopwords}
                                onChange={(e) => setWordCloudStopwords(e.target.value)}
                                className="w-full px-3 py-2"
                            />
                            <p className="text-xs text-slate-400">Excluded words will not appear in the cloud.</p>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-sm text-slate-300">Background color</label>
                            <input
                                type="text"
                                value={wordCloudBg}
                                onChange={(e) => setWordCloudBg(e.target.value)}
                                className="w-full px-3 py-2"
                                placeholder="#0b1224"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={generateWordCloud}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                            disabled={isGeneratingWordCloud}
                        >
                            <CursorArrowRaysIcon className="h-4 w-4" />
                            {isGeneratingWordCloud ? 'Generating...' : 'Generate word cloud'}
                        </button>
                        {wordCloudError && <p className="text-sm text-rose-400">{wordCloudError}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-slate-300">Live preview</p>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-center min-h-[260px]">
                        <canvas ref={canvasRef} className="max-w-full" aria-label="Word cloud preview" />
                    </div>
                    <p className="text-xs text-slate-400">Adjust dimensions for higher-resolution exports, then right-click the canvas to save.</p>
                </div>
            </div>
        </ToolCard>
    );
}
