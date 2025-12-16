'use client';

import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon } from '../icons';

type StringCaseVariant = { label: string; value: string };
type StringCaseRow = { index: number; source: string; variants: StringCaseVariant[] };
type StringCaseResult = { error: string; rows: StringCaseRow[] | null };

export function StringCaseConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [stringCaseInput, setStringCaseInput] = useState('user_profile id');

    const splitIntoWords = (value: string) => {
        return value
            .replace(/[_-]+/g, ' ')
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .split(/[^A-Za-z0-9]+/)
            .filter(Boolean)
            .map((word) => word.toLowerCase());
    };

    const stringCaseResults = useMemo<StringCaseResult>(() => {
        const lines = stringCaseInput
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        if (!lines.length) {
            return { error: 'Enter text to convert into different casing styles.', rows: null };
        }

        const capitalize = (word: string) => (word ? word[0].toUpperCase() + word.slice(1) : '');

        const rows: StringCaseRow[] = [];

        for (const [index, line] of lines.entries()) {
            const words = splitIntoWords(line);

            if (!words.length) {
                return { error: `Line ${index + 1} has no letters or digits to convert.`, rows: null };
            }

            const camelCase = words.map((word, idx) => (idx === 0 ? word : capitalize(word))).join('');
            const pascalCase = words.map(capitalize).join('');
            const snakeCase = words.join('_');
            const kebabCase = words.join('-');
            const titleCase = words.map(capitalize).join(' ');
            const screamingSnake = words.join('_').toUpperCase();
            const sentenceCase = `${capitalize(words[0])}${words
                .slice(1)
                .map((word) => (word ? ` ${word}` : ''))
                .join('')}`;

            rows.push({
                index,
                source: line,
                variants: [
                    { label: 'camelCase', value: camelCase },
                    { label: 'PascalCase', value: pascalCase },
                    { label: 'snake_case', value: snakeCase },
                    { label: 'kebab-case', value: kebabCase },
                    { label: 'Title Case', value: titleCase },
                    { label: 'SCREAMING_SNAKE_CASE', value: screamingSnake },
                    { label: 'Sentence case', value: sentenceCase },
                ],
            });
        }

        return { error: '', rows };
    }, [stringCaseInput]);

    const handleExportStringCaseCsv = () => {
        if (!stringCaseResults.rows || stringCaseResults.rows.length === 0) return;

        const headers = [
            'Line',
            'Source',
            ...stringCaseResults.rows[0].variants.map((variant) => variant.label),
        ];

        const data = stringCaseResults.rows.map((row) => [
            row.index + 1,
            row.source,
            ...row.variants.map((variant) => variant.value),
        ]);

        const csv = Papa.unparse({ fields: headers, data });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'string-case-conversions.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (error) {
            console.error('Clipboard copy failed', error);
        }
    };

    return (
        <ToolCard headingLevel="h1" title="String Case Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">Input text</label>
                    <textarea
                        value={stringCaseInput}
                        onChange={(e) => setStringCaseInput(e.target.value)}
                        placeholder="userProfile id"
                        className="w-full"
                        rows={3}
                    />
                </div>

                {stringCaseResults.error && <p className="text-sm text-rose-400">{stringCaseResults.error}</p>}

                {stringCaseResults.rows && (
                    <div className="space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={handleExportStringCaseCsv}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-white/30"
                            >
                                Export CSV
                            </button>
                        </div>
                        {stringCaseResults.rows.map((row) => (
                            <div key={row.index} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">Line {row.index + 1}</p>
                                        {row.source && <p className="text-sm font-semibold text-white">{row.source}</p>}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(row.source)}
                                        className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-white/30"
                                    >
                                        <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy line
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {row.variants?.map((result) => (
                                        <div key={result.label} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-semibold text-white">{result.label}</p>
                                                <button
                                                    onClick={() => copyToClipboard(result.value)}
                                                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
                                                >
                                                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                                                </button>
                                            </div>
                                            <p className="font-mono text-sm text-slate-200 break-words">{result.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ToolCard>
    );
}
