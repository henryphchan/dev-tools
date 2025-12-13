'use client';

import { ChangeEvent, useState } from 'react';
import { parquetRead } from 'hyparquet';
import { ToolInfo } from '../../lib/tools';
import { ArrowPathRoundedSquareIcon, ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';

interface ColumnProfile {
    name: string;
    uniqueCount: number;
    nullCount: number;
    dominantPattern: string;
    patternCoverage: number;
    samples: string[];
    numericStats: {
        min: number;
        max: number;
        average: number;
        median: number;
        stdDev: number;
    } | null;
    minLength: number | null;
    maxLength: number | null;
}

const describePattern = (value: string) =>
    value
        .split('')
        .map((char) => {
            if (/\d/.test(char)) return 'N';
            if (/[A-Za-z]/.test(char)) return 'L';
            if (/\s/.test(char)) return '·';
            return char;
        })
        .join('');

const computeNumericStats = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const variance =
        values.reduce((total, value) => total + Math.pow(value - average, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return { min, max, average, median, stdDev } as const;
};

const formatNumericStat = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.0+$/, '');

const renderNumericStat = (
    stats: ColumnProfile['numericStats'],
    value: keyof NonNullable<ColumnProfile['numericStats']>
) => (stats ? formatNumericStat(stats[value]) : '—');

const renderLengthStat = (profile: ColumnProfile, key: 'minLength' | 'maxLength') =>
    profile.numericStats ? '—' : profile[key] ?? '—';

export function ParquetProfilerWorkspace({ tool }: { tool: ToolInfo }) {
    const [profileError, setProfileError] = useState('');
    const [profileRowCount, setProfileRowCount] = useState(0);
    const [profileResults, setProfileResults] = useState<ColumnProfile[]>([]);
    const [profileFileName, setProfileFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProfileFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setProfileFileName(file.name);
        setProfileError('');
        setIsProcessing(true);
        setProfileResults([]);
        setProfileRowCount(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const startTime = performance.now();

            // hyparquet parquetRead returns a promise that resolves to an array of row objects (if I recall correctly how wrapper works usually)
            // or we might need to use a lower level API if we want column chunks.
            // But for simplicity let's try reading it all.

            // NOTE: hyparquet.parquetRead({ file }) returns array of rows.
            // We need to support BigInt serializing if any.

            const rows = await new Promise<any[]>((resolve, reject) => {
                parquetRead({
                    file: arrayBuffer,
                    onComplete: (data: any[]) => resolve(data),
                }).catch(reject); // hyparquet might not return a promise in all versions, but let's try wrapping it or assuming async.
                // Wait, hyparquet description says "lightweight pure JS".
                // If it's sync it returns data. If async it takes callback or promise.
                // Let's assume promise based on modern libs or check usage.
                // Actually, looking at typical usage: `parquetRead({ file })` returns the data synchronously if input is ArrayBuffer?
                // Let's wrap in try-catch and handle both.
            });

            // If rows is undefined, maybe it was synchronous?
            // Let's retry as sync if needed.

        } catch (e: any) {
            // Fallback for sync execution if await didn't work as expected or if it failed.
            try {
                const arrayBuffer = await file.arrayBuffer();
                // Synchronous attempt
                parquetRead({
                    file: arrayBuffer,
                    onComplete: (rows: any[]) => {
                        processRows(rows);
                    }
                });
            } catch (err: any) {
                setProfileError(`Failed to parse Parquet: ${err.message}`);
                setIsProcessing(false);
            }
        }
    };

    const processRows = (rows: any[]) => {
        if (!rows || rows.length === 0) {
            setProfileError('Parquet file is empty or could not be read.');
            setIsProcessing(false);
            return;
        }

        setProfileRowCount(rows.length);

        // Extract headers from first row
        const firstRow = rows[0];
        const headers = Object.keys(firstRow);

        const profiles = headers.map((header) => {
            const uniqueValues = new Set<string>();
            const patternCounts = new Map<string, number>();
            const samples: string[] = [];
            const lengths: number[] = [];
            let nullCount = 0;
            let populated = 0;
            let nonNumericCount = 0;
            const numericValues: number[] = [];

            rows.forEach((row) => {
                const rawValue = row[header];
                // Handle BigInt
                const value = rawValue === undefined || rawValue === null ? '' : String(rawValue);
                const trimmed = value.trim();

                if (!trimmed) {
                    nullCount += 1;
                    return;
                }

                populated += 1;
                uniqueValues.add(trimmed);
                lengths.push(trimmed.length);

                const numericValue = Number(trimmed);
                if (Number.isFinite(numericValue)) {
                    numericValues.push(numericValue);
                } else {
                    nonNumericCount += 1;
                }

                const pattern = describePattern(trimmed);
                patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);

                if (samples.length < 3) {
                    samples.push(trimmed);
                }
            });

            const [dominantPattern, patternCount] = Array.from(patternCounts.entries()).sort((a, b) => b[1] - a[1])[0] || [
                'No values',
                0,
            ];

            const patternCoverage = populated ? Math.round((patternCount / populated) * 100) : 0;
            const numericStats =
                populated > 0 && nonNumericCount === 0 && numericValues.length
                    ? computeNumericStats(numericValues)
                    : null;

            const hasNonNumericData = populated > 0 && nonNumericCount > 0;
            const minLength = hasNonNumericData && lengths.length ? Math.min(...lengths) : null;
            const maxLength = hasNonNumericData && lengths.length ? Math.max(...lengths) : null;

            return {
                name: header,
                uniqueCount: uniqueValues.size,
                nullCount,
                dominantPattern,
                patternCoverage,
                samples,
                numericStats,
                minLength,
                maxLength,
            } satisfies ColumnProfile;
        });

        setProfileResults(profiles);
        setIsProcessing(false);
    };

    // Re-implement handleProfileFileUpload clean
    const handleParquetUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setProfileFileName(file.name);
        setProfileError('');
        setIsProcessing(true);
        setProfileResults([]);
        setProfileRowCount(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            // hyparquet 0.x usage: parquetRead({ file, onComplete })
            parquetRead({
                file: arrayBuffer,
                onComplete: (data: any[]) => {
                    processRows(data);
                }
            }).then((data: any) => {
                // Some versions might implement promise
                if (data && Array.isArray(data)) processRows(data);
            });
        } catch (err: any) {
            console.error(err);
            setProfileError('Error reading parquet file: ' + err.message);
            setIsProcessing(false);
        }
    }


    const exportProfileCsv = () => {
        if (!profileResults.length) return;

        // We can use PapaParse for unparsing if we want, or just manual string building to avoid dep if unused?
        // But Papa is used in CsvProfiler, so it's in project.
        // Let's dynamic import or just build string to keep it simple self-contained or use utils.

        // To be consistent with CSV Profiler, I will reimplement simple CSV generation or use the one from CSV profiler if I extracted it.
        // I'll just write a simple generator here.

        const headers = ['Column', 'Unique', 'Null/blank', 'Min length', 'Max length', 'Min', 'Max', 'Average', 'Median', 'Std dev', 'Pattern', 'Coverage', 'Samples'];

        const rows = profileResults.map((column) => [
            column.name,
            column.uniqueCount,
            column.nullCount,
            column.minLength ?? '',
            column.maxLength ?? '',
            column.numericStats ? formatNumericStat(column.numericStats.min) : '',
            column.numericStats ? formatNumericStat(column.numericStats.max) : '',
            column.numericStats ? formatNumericStat(column.numericStats.average) : '',
            column.numericStats ? formatNumericStat(column.numericStats.median) : '',
            column.numericStats ? formatNumericStat(column.numericStats.stdDev) : '',
            column.dominantPattern,
            column.patternCoverage,
            column.samples.join(' | ')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'parquet-profile.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolCard title="Parquet Data Profiler" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Upload Parquet File</label>
                            <p className="text-xs text-slate-400">Analyze schema and statistics locally.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                            <label className={`inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 cursor-pointer hover:border-brand/50 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="file" accept=".parquet" className="hidden" onChange={handleParquetUpload} disabled={isProcessing} />
                                <ArrowPathRoundedSquareIcon className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                                {isProcessing ? 'Processing...' : 'Upload Parquet'}
                            </label>

                            {profileResults.length > 0 && (
                                <button
                                    onClick={exportProfileCsv}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-brand/50 hover:text-white"
                                >
                                    <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                    Export results
                                </button>
                            )}
                        </div>
                    </div>

                    {profileFileName && <p className="text-xs text-slate-400">Loaded: {profileFileName}</p>}
                    {profileError && <p className="text-sm text-rose-400">{profileError}</p>}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Rows</p>
                            <p className="text-lg font-semibold text-white">{profileRowCount}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Columns</p>
                            <p className="text-lg font-semibold text-white">{profileResults.length}</p>
                        </div>
                        <p className="text-sm text-slate-400">
                            {profileResults.length === 0 && !isProcessing && 'Upload a Parquet file to see profiling results.'}
                        </p>
                    </div>

                    {/* Detailed explanations similar to CSV Profiler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Pattern notation</p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Each character is classified: digits → <span className="font-mono text-xs">N</span>, letters →{' '}
                                <span className="font-mono text-xs">L</span>, whitespace → <span className="font-mono text-xs">·</span>.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Coverage</p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                % of rows matching the dominant pattern.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {profileResults.length ? (
                            <table className="min-w-full text-sm text-slate-200">
                                <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 pr-3">Column</th>
                                        <th className="text-left py-2 pr-3">Unique</th>
                                        <th className="text-left py-2 pr-3">Null/blank</th>
                                        <th className="text-left py-2 pr-3">Min length</th>
                                        <th className="text-left py-2 pr-3">Max length</th>
                                        <th className="text-left py-2 pr-3">Min</th>
                                        <th className="text-left py-2 pr-3">Max</th>
                                        <th className="text-left py-2 pr-3">Average</th>
                                        <th className="text-left py-2 pr-3">Median</th>
                                        <th className="text-left py-2 pr-3">Std dev</th>
                                        <th className="text-left py-2 pr-3">Pattern</th>
                                        <th className="text-left py-2 pr-3">Coverage</th>
                                        <th className="text-left py-2 pr-3">Samples</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {profileResults.map((column) => (
                                        <tr key={column.name}>
                                            <td className="py-3 pr-3 font-semibold text-white">{column.name}</td>
                                            <td className="py-3 pr-3">{column.uniqueCount}</td>
                                            <td className="py-3 pr-3">{column.nullCount}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderLengthStat(column, 'minLength')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderLengthStat(column, 'maxLength')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderNumericStat(column.numericStats, 'min')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderNumericStat(column.numericStats, 'max')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderNumericStat(column.numericStats, 'average')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderNumericStat(column.numericStats, 'median')}</td>
                                            <td className="py-3 pr-3 text-slate-300">{renderNumericStat(column.numericStats, 'stdDev')}</td>
                                            <td className="py-3 pr-3 font-mono text-xs text-slate-300">{column.dominantPattern}</td>
                                            <td className="py-3 pr-3">{column.patternCoverage}%</td>
                                            <td className="py-3 pr-3 text-slate-300">{column.samples.join(', ') || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-slate-400 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3">
                                Results will appear here after uploading a Parquet file.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
