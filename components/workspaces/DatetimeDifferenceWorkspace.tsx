'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

export function DatetimeDifferenceWorkspace({ tool }: { tool: ToolInfo }) {
    const [diffStart, setDiffStart] = useState('');
    const [diffEnd, setDiffEnd] = useState('');
    const [diffResults, setDiffResults] = useState<{
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
        months: number;
        years: number;
    } | null>(null);
    const [diffFormattedDetails, setDiffFormattedDetails] = useState('');
    const [diffSummary, setDiffSummary] = useState('');
    const [diffError, setDiffError] = useState('');

    const formatDiffValue = (value: number) =>
        new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
        }).format(value);

    const handleDateDifference = () => {
        const start = DateTime.fromISO(diffStart);
        const end = DateTime.fromISO(diffEnd);

        if (!start.isValid || !end.isValid) {
            setDiffError('Please provide two valid dates/times.');
            setDiffResults(null);
            setDiffSummary('');
            setDiffFormattedDetails('');
            return;
        }

        const diff = end.diff(start);

        const detailedDiff = end.diff(start, [
            'years',
            'months',
            'days',
            'hours',
            'minutes',
            'seconds',
        ]);
        const diffParts = detailedDiff.toObject();

        setDiffResults({
            seconds: diff.as('seconds'),
            minutes: diff.as('minutes'),
            hours: diff.as('hours'),
            days: diff.as('days'),
            months: diff.as('months'),
            years: diff.as('years'),
        });

        const millisDelta = end.toMillis() - start.toMillis();
        const relative = end.toRelative({ base: start, style: 'long' });

        const differenceLine = `${Math.trunc(diffParts.years ?? 0)} Year ${Math.trunc(diffParts.months ?? 0)} Month ${Math.trunc(
            diffParts.days ?? 0
        )} Day ${Math.trunc(diffParts.hours ?? 0)} Hour ${Math.trunc(diffParts.minutes ?? 0)} Minute ${Math.trunc(
            diffParts.seconds ?? 0
        )} Second`;

        if (millisDelta === 0) {
            setDiffSummary('Both datetimes are identical.');
            setDiffFormattedDetails('');
        } else if (millisDelta > 0) {
            setDiffSummary('End date is in the future relative to Start date.');
            setDiffFormattedDetails(`Precise duration:\n${differenceLine}\n\nRelative:\n${relative}`);
        } else {
            setDiffSummary('End date is in the past relative to Start date.');
            setDiffFormattedDetails(`Precise duration:\n${differenceLine}\n\nRelative:\n${relative}`);
        }

        setDiffError('');
    };

    return (
        <ToolCard headingLevel="h1" title="Datetime Difference Calculator" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">Start datetime</label>
                    <input
                        type="datetime-local"
                        value={diffStart}
                        onChange={(e) => setDiffStart(e.target.value)}
                        className="w-full px-3 py-2"
                    />
                    <p className="text-xs text-slate-400">Defaults to your current date and time.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-300">End datetime</label>
                    <input
                        type="datetime-local"
                        value={diffEnd}
                        onChange={(e) => setDiffEnd(e.target.value)}
                        className="w-full px-3 py-2"
                    />
                    <p className="text-xs text-slate-400">Update either value to measure a new gap.</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
                <button
                    onClick={handleDateDifference}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                    <CursorArrowRaysIcon className="h-4 w-4" />
                    Calculate difference
                </button>
                {diffError && <p className="text-sm text-rose-400">{diffError}</p>}
            </div>

            {(diffFormattedDetails || diffSummary) && (
                <div className="mt-3 space-y-2">
                    {diffFormattedDetails && (
                        <pre className="code-output whitespace-pre-wrap" aria-label="Datetime difference formatted">
                            {diffFormattedDetails}
                        </pre>
                    )}
                    {diffSummary && <p className="text-sm text-slate-200">{diffSummary}</p>}
                </div>
            )}

            {diffResults && (
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { label: 'Seconds', value: diffResults.seconds },
                            { label: 'Minutes', value: diffResults.minutes },
                            { label: 'Hours', value: diffResults.hours },
                            { label: 'Days', value: diffResults.days },
                            { label: 'Months', value: diffResults.months },
                            { label: 'Years', value: diffResults.years },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm text-slate-400">{item.label}</p>
                                <p className="text-lg font-semibold text-white">{formatDiffValue(item.value)}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400">
                        Positive values mean the end datetime is after the start; negative values mean the start is later.
                    </p>
                </div>
            )}
        </ToolCard>
    );
}
