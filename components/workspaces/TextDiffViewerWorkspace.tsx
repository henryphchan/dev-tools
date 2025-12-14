'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { diffLines } from 'diff';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';

type DiffLine = {
    type: 'added' | 'removed' | 'unchanged';
    leftNumber?: number;
    rightNumber?: number;
    text: string;
};

export function TextDiffViewerWorkspace({ tool }: { tool: ToolInfo }) {
    const [diffLeftText, setDiffLeftText] = useState('');
    const [diffRightText, setDiffRightText] = useState('');
    const [diffLeftLabel, setDiffLeftLabel] = useState('Original text');
    const [diffRightLabel, setDiffRightLabel] = useState('Changed text');
    const [clipboardError, setClipboardError] = useState('');

    const diffSegments = useMemo(() => diffLines(diffLeftText, diffRightText), [diffLeftText, diffRightText]);

    const numberedDiff = useMemo<DiffLine[]>(() => {
        let leftLine = 1;
        let rightLine = 1;
        const rows: DiffLine[] = [];

        diffSegments.forEach((segment) => {
            const lines = segment.value.split('\n');
            if (lines[lines.length - 1] === '') {
                lines.pop();
            }

            lines.forEach((line) => {
                if (segment.added) {
                    rows.push({ type: 'added', rightNumber: rightLine, text: line });
                    rightLine += 1;
                } else if (segment.removed) {
                    rows.push({ type: 'removed', leftNumber: leftLine, text: line });
                    leftLine += 1;
                } else {
                    rows.push({ type: 'unchanged', leftNumber: leftLine, rightNumber: rightLine, text: line });
                    leftLine += 1;
                    rightLine += 1;
                }
            });
        });

        return rows;
    }, [diffSegments]);

    const diffStats = useMemo(
        () =>
            numberedDiff.reduce(
                (acc, line) => {
                    if (line.type === 'added') acc.added += 1;
                    if (line.type === 'removed') acc.removed += 1;
                    acc.total += 1;
                    return acc;
                },
                { added: 0, removed: 0, total: 0 }
            ),
        [numberedDiff]
    );

    const handleFileUpload = (
        event: ChangeEvent<HTMLInputElement>,
        setText: (value: string) => void,
        setLabel: (value: string) => void
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLabel(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setText(typeof reader.result === 'string' ? reader.result : '');
        };
        reader.readAsText(file);
    };

    const pasteFromClipboard = async (setText: (value: string) => void) => {
        try {
            const text = await navigator.clipboard.readText();
            setText(text);
            setClipboardError('');
        } catch (error) {
            setClipboardError('Unable to read from clipboard. Please paste manually.');
        }
    };

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (error) {
            console.error('Clipboard copy failed', error);
        }
    };

    return (
        <ToolCard title="Compare 2 text files" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">{diffLeftLabel}</label>
                    <textarea
                        value={diffLeftText}
                        onChange={(e) => setDiffLeftText(e.target.value)}
                        placeholder="Paste or upload the first file..."
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-brand/50 hover:text-white">
                            <input
                                type="file"
                                accept=".txt,.log,.md,.json,.xml,.sql,.csv,.yml,.yaml"
                                className="sr-only"
                                onChange={(event) => handleFileUpload(event, setDiffLeftText, setDiffLeftLabel)}
                            />
                            Upload file
                        </label>
                        <button
                            onClick={() => pasteFromClipboard(setDiffLeftText)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/20"
                        >
                            Paste clipboard
                        </button>
                        {diffLeftText && (
                            <button
                                onClick={() => copyToClipboard(diffLeftText)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-slate-200 transition hover:border-brand/60 hover:text-white"
                            >
                                Copy text
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-300">{diffRightLabel}</label>
                    <textarea
                        value={diffRightText}
                        onChange={(e) => setDiffRightText(e.target.value)}
                        placeholder="Paste or upload the second file..."
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-brand/50 hover:text-white">
                            <input
                                type="file"
                                accept=".txt,.log,.md,.json,.xml,.sql,.csv,.yml,.yaml"
                                className="sr-only"
                                onChange={(event) => handleFileUpload(event, setDiffRightText, setDiffRightLabel)}
                            />
                            Upload file
                        </label>
                        <button
                            onClick={() => pasteFromClipboard(setDiffRightText)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/20"
                        >
                            Paste clipboard
                        </button>
                        {diffRightText && (
                            <button
                                onClick={() => copyToClipboard(diffRightText)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-slate-200 transition hover:border-brand/60 hover:text-white"
                            >
                                Copy text
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="badge">Line numbers</span>
                        <span className="badge bg-emerald-500/20 text-emerald-200 border-emerald-500/30">+ {diffStats.added}</span>
                        <span className="badge bg-rose-500/20 text-rose-200 border-rose-500/30">- {diffStats.removed}</span>
                    </div>
                    <span className="text-xs text-slate-400">{diffStats.total || '0'} total lines compared</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden">
                    <div className="grid grid-cols-[70px_70px_1fr] border-b border-white/10 bg-slate-900/70 text-xs uppercase tracking-wide text-slate-300">
                        <div className="px-3 py-2 text-right">Left</div>
                        <div className="px-3 py-2 text-right">Right</div>
                        <div className="px-3 py-2">Diff</div>
                    </div>
                    {numberedDiff.length === 0 && (
                        <p className="px-4 py-6 text-sm text-slate-300">Paste or upload two files to see highlighted changes.</p>
                    )}

                    <div className="divide-y divide-white/5 font-mono text-xs">
                        {numberedDiff.map((line, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-[70px_70px_1fr] hover:bg-white/5 ${line.type === 'added'
                                    ? 'bg-emerald-500/10 text-emerald-200'
                                    : line.type === 'removed'
                                        ? 'bg-rose-500/10 text-rose-200 opacity-80'
                                        : 'text-slate-300'
                                    }`}
                            >
                                <div className="px-3 py-1 text-right text-slate-500 select-none border-r border-white/5">
                                    {line.leftNumber || ''}
                                </div>
                                <div className="px-3 py-1 text-right text-slate-500 select-none border-r border-white/5">
                                    {line.rightNumber || ''}
                                </div>
                                <div className="px-3 py-1 whitespace-pre-wrap break-all">{line.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
