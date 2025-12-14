'use client';

import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { CronExpressionParser } from 'cron-parser';
import { getTimeZones } from '@vvo/tzdb';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

type TimezoneOption = {
    value: string;
    label: string;
};

// Timezone suggestions logic (duplicated to keep component self-contained)
const tzDatabaseZones = getTimeZones({ includeUtc: true });

const formatOffsetMinutes = (offsetMinutes: number) => {
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absoluteMinutes / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (absoluteMinutes % 60).toString().padStart(2, '0');

    return `${sign}${hours}:${minutes}`;
};

const timezoneOptions: TimezoneOption[] = tzDatabaseZones
    .map((zone) => {
        const formattedOffset = formatOffsetMinutes(zone.currentTimeOffsetInMinutes);

        return {
            value: zone.name,
            label: `${zone.name} (UTC${formattedOffset})`,
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

const uniqueOffsets = Array.from(
    new Set(tzDatabaseZones.map((zone) => formatOffsetMinutes(zone.currentTimeOffsetInMinutes)))
).sort();

const isoOffsetOptions: TimezoneOption[] = uniqueOffsets.map((offset) => ({
    value: `UTC${offset}`,
    label: `UTC${offset}`,
}));

const timezoneSuggestions: TimezoneOption[] = [...isoOffsetOptions, ...timezoneOptions];

const computeCronWarnings = (expression: string, runs: DateTime[]) => {
    const warnings = new Set<string>();

    const fields = expression
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const minuteIndex = fields.length === 5 ? 0 : 1;
    const minuteField = fields[minuteIndex] ?? '';

    if (minuteField === '*' || minuteField === '*/1') {
        warnings.add('Runs every minute. Be careful with high-frequency jobs.');
    }

    if (runs.length >= 2) {
        const firstDiff = runs[1].diff(runs[0]).as('minutes');
        const isFrequent = runs.every((run, i) => {
            if (i === 0) return true;
            return run.diff(runs[i - 1]).as('minutes') <= 5;
        });

        if (firstDiff < 5 || isFrequent) {
            warnings.add('Runs very frequently (under 5 minutes). Consider widening the interval for heavy tasks.');
        }
    }

    return Array.from(warnings);
};

const normalizeCronExpression = (expression: string): string => {
    const fields = expression
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (fields.length < 5 || fields.length > 7) {
        throw new Error('Unsupported field count');
    }

    if (fields.length === 7) {
        fields.pop();
    }

    const dayOfMonthIndex = fields.length === 6 ? 3 : 2;
    const dayOfWeekIndex = fields.length === 6 ? 5 : 4;

    fields[dayOfMonthIndex] = fields[dayOfMonthIndex].replace('?', '*');
    fields[dayOfWeekIndex] = fields[dayOfWeekIndex].replace('?', '*');

    return fields.join(' ');
};

export function CronValidatorWorkspace({ tool }: { tool: ToolInfo }) {
    const [cronExpression, setCronExpression] = useState('*/5 * * * *');
    const [cronZone, setCronZone] = useState('UTC');
    const [cronRuns, setCronRuns] = useState<DateTime[]>([]);
    const [cronWarnings, setCronWarnings] = useState<string[]>([]);
    const [cronError, setCronError] = useState('');

    const handleCronPreview = () => {
        try {
            const normalizedExpression = normalizeCronExpression(cronExpression);
            const interval = CronExpressionParser.parse(normalizedExpression, {
                currentDate: DateTime.now().setZone(cronZone).toJSDate(),
                tz: cronZone,
            });

            const nextRuns: DateTime[] = [];
            for (let i = 0; i < 10; i += 1) {
                const next = interval.next().toDate();
                nextRuns.push(DateTime.fromJSDate(next).setZone(cronZone));
            }

            setCronRuns(nextRuns);
            setCronError('');
            setCronWarnings(computeCronWarnings(normalizedExpression, nextRuns));
        } catch (error) {
            setCronError('Invalid cron expression. Supports 5-field or Quartz-style 6/7-field syntax like “0 0/15 * * * ? *”.');
            setCronRuns([]);
            setCronWarnings([]);
        }
    };

    useEffect(() => {
        handleCronPreview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToolCard title="Cron Expression Validator" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-sm text-slate-300">Cron expression</label>
                        <input
                            type="text"
                            value={cronExpression}
                            onChange={(e) => setCronExpression(e.target.value)}
                            placeholder="*/5 * * * *"
                            className="w-full px-3 py-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-slate-300">Timezone</label>
                        <select value={cronZone} onChange={(e) => setCronZone(e.target.value)} className="w-full px-3 py-2">
                            {timezoneSuggestions.map((zone) => (
                                <option key={zone.value} value={zone.value}>
                                    {zone.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleCronPreview}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                    >
                        <CursorArrowRaysIcon className="h-4 w-4" />
                        Validate & preview
                    </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-slate-200">
                    <p className="font-semibold text-white">Supported syntax</p>
                    <p>
                        Supports classic 5-field cron (<code>minute hour day-of-month month day-of-week</code>) and Quartz-style 6/7-field
                        cron with seconds and optional year (<code>second minute hour day-of-month month day-of-week [year]</code>).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="font-semibold text-white">Field meanings</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Second: 0-59 (Quartz only)</li>
                                <li>Minute: 0-59</li>
                                <li>Hour: 0-23</li>
                                <li>Day of month: 1-31</li>
                                <li>Month: 1-12 or JAN-DEC</li>
                                <li>Day of week: 0-6 or SUN-SAT</li>
                                <li>Year: four digits (optional for Quartz)</li>
                            </ul>
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-white">Special characters</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><code>,</code> list multiple values (e.g., <code>1,15</code>)</li>
                                <li><code>-</code> specify ranges (e.g., <code>1-5</code>)</li>
                                <li><code>/</code> step values (e.g., <code>0/15</code> for every 15)</li>
                                <li><code>*</code> wildcard for all valid values</li>
                                <li><code>?</code> placeholder in Quartz for day-of-month or day-of-week</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {cronError && <p className="text-sm text-rose-400">{cronError}</p>}

                {!cronError && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="badge">Next 10 runs</span>
                                <span className="text-xs text-slate-400">Based on {cronZone}</span>
                            </div>
                            <div className="code-output space-y-2">
                                {cronRuns.length === 0 && <p className="text-sm text-slate-400">Enter a cron expression to see the schedule.</p>}
                                {cronRuns.map((run, index) => (
                                    <div key={run.toMillis()} className="flex items-center gap-3 text-sm text-slate-50">
                                        <span className="badge">#{index + 1}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold">{run.toFormat('ccc, MMM d yyyy • HH:mm:ss ZZZZ')}</p>
                                            <p className="text-xs text-slate-400">{run.toRelative({ base: DateTime.now().setZone(cronZone) })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="badge">Visual timeline</span>
                                <span className="text-xs text-slate-400">Spacing reflects time between runs</span>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                                <div className="relative h-32 w-full select-none">
                                    {cronRuns.length > 0 ? (
                                        <>
                                            {/* Axis Line */}
                                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20 -translate-y-1/2 rounded-full" />

                                            {(() => {
                                                const start = cronRuns[0];
                                                const end = cronRuns[cronRuns.length - 1];
                                                // Add some padding to the time range so points aren't on the absolute edge
                                                const duration = end.diff(start).as('milliseconds');
                                                // If duration is 0 (single run logic error or super fast), default to 1 min span?
                                                const span = Math.max(duration, 60000);

                                                // Use 5% padding on each side
                                                const getLeftPercent = (dt: DateTime) => {
                                                    const offset = dt.diff(start).as('milliseconds');
                                                    return (offset / span) * 90 + 5;
                                                };

                                                return cronRuns.map((run, i) => {
                                                    const left = getLeftPercent(run);
                                                    const isTop = i % 2 === 0;

                                                    return (
                                                        <div
                                                            key={run.toMillis()}
                                                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-help"
                                                            style={{ left: `${left}%` }}
                                                        >
                                                            {/* Label (Top) */}
                                                            {isTop && (
                                                                <div className="absolute bottom-4 flex flex-col items-center transition-transform hover:scale-110">
                                                                    <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                                                                        {run.toFormat('HH:mm')}
                                                                    </span>
                                                                    <div className="h-2 w-px bg-white/20 mt-1" />
                                                                </div>
                                                            )}

                                                            {/* Point */}
                                                            <div className="relative z-10 h-3 w-3 rounded-full bg-brand ring-2 ring-slate-900 group-hover:bg-white transition-colors" />

                                                            {/* Label (Bottom) */}
                                                            {!isTop && (
                                                                <div className="absolute top-4 flex flex-col items-center transition-transform hover:scale-110">
                                                                    <div className="h-2 w-px bg-white/20 mb-1" />
                                                                    <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                                                                        {run.toFormat('HH:mm')}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Tooltip (Invisible, for screen readers mostly as visual is clear) */}
                                                            <span className="sr-only">
                                                                Run {i + 1} at {run.toFormat('yyyy-MM-dd HH:mm:ss')}
                                                            </span>

                                                            {/* Hover Tooltip via title temporarily, could be custom but native is robust */}
                                                            <div className="absolute inset-0 w-full h-full" title={run.toFormat('ccc, MMM d • HH:mm:ss ZZZZ')} />
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                            Enter a valid cron expression to see the timeline
                                        </div>
                                    )}
                                </div>
                                {cronWarnings.length > 0 && (
                                    <div className="mt-2 text-xs text-amber-300 space-y-1">
                                        <p className="font-semibold">Warnings:</p>
                                        <ul className="list-disc list-inside">
                                            {cronWarnings.map((warn) => (
                                                <li key={warn}>{warn}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolCard>
    );
}
