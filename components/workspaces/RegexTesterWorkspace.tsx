'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

type RegexMatch = {
    match: string;
    index: number;
    groups: Record<string, string>;
};

export function RegexTesterWorkspace({ tool }: { tool: ToolInfo }) {
    const [regexPattern, setRegexPattern] = useState('');
    const [regexFlags, setRegexFlags] = useState('g');
    const [regexText, setRegexText] = useState('');
    const [regexMatches, setRegexMatches] = useState<RegexMatch[]>([]);
    const [regexError, setRegexError] = useState('');

    const handleRegexTest = () => {
        if (!regexPattern) {
            setRegexError('Enter a regex pattern to start testing.');
            setRegexMatches([]);
            return;
        }

        try {
            const regex = new RegExp(regexPattern, regexFlags);
            const results: RegexMatch[] = [];

            if (regexFlags.includes('g')) {
                for (const match of regexText.matchAll(regex)) {
                    results.push({
                        match: match[0],
                        index: match.index ?? 0,
                        groups: { ...(match.groups || {}) },
                    });
                }
            } else {
                const match = regex.exec(regexText);
                if (match) {
                    results.push({
                        match: match[0],
                        index: match.index ?? 0,
                        groups: { ...(match.groups || {}) },
                    });
                }
            }

            setRegexMatches(results);
            setRegexError(results.length ? '' : 'No matches found for this pattern.');
        } catch (error) {
            setRegexError('Invalid regex pattern or flags.');
            setRegexMatches([]);
        }
    };

    return (
        <ToolCard headingLevel="h1" title="Regex Tester" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-3 items-start">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Regex pattern</label>
                            <input
                                type="text"
                                value={regexPattern}
                                onChange={(e) => setRegexPattern(e.target.value)}
                                placeholder="e.g. (\n+) or (?<word>\\w+)"
                                className="w-full px-3 py-2"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Flags</label>
                            <input
                                type="text"
                                value={regexFlags}
                                onChange={(e) => setRegexFlags(e.target.value)}
                                placeholder="gmi"
                                className="w-full px-3 py-2"
                            />
                            <p className="text-xs text-slate-400">Common: g (global), i (ignore case), m (multiline)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-300">Sample text</label>
                        <textarea
                            value={regexText}
                            onChange={(e) => setRegexText(e.target.value)}
                            placeholder={`Paste text to match, e.g.\nUser: alice@example.com\nUser: bob@example.com`}
                            className="w-full"
                            rows={6}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleRegexTest} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                            <CursorArrowRaysIcon className="h-4 w-4" /> Test pattern
                        </button>
                        {regexError && <p className="text-sm text-rose-400">{regexError}</p>}
                    </div>
                </div>

                <div className="space-y-2 lg:h-full">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="badge">Matches</span>
                        <span className="text-xs text-slate-400">Shows matched text, index, and named groups</span>
                    </div>
                    <div className="code-output space-y-3 lg:min-h-[220px]">
                        {regexMatches.length === 0 ? (
                            <p className="text-sm text-slate-400">Run the tester to see matches for your pattern.</p>
                        ) : (
                            regexMatches.map((entry, index) => (
                                <div key={`${entry.index}-${entry.match}-${index}`} className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-slate-200">
                                        <span className="badge">#{index + 1}</span>
                                        <span className="font-semibold">Match at index {entry.index}</span>
                                    </div>
                                    <pre className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 overflow-auto">{entry.match || '—'}</pre>
                                    {Object.keys(entry.groups).length > 0 && (
                                        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                                            <p className="mb-1 text-xs text-slate-400">Captured Groups</p>
                                            <ul className="space-y-1">
                                                {Object.entries(entry.groups).map(([name, val]) => (
                                                    <li key={name} className="flex gap-2 text-xs">
                                                        <span className="font-semibold text-slate-300">{name}:</span>
                                                        <span className="text-slate-100 break-all">{val}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
