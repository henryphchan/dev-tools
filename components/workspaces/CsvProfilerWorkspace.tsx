'use client';

import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
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

export function CsvProfilerWorkspace({ tool }: { tool: ToolInfo }) {
  const [profileInput, setProfileInput] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileRowCount, setProfileRowCount] = useState(0);
  const [profileResults, setProfileResults] = useState<ColumnProfile[]>([]);
  const [profileFileName, setProfileFileName] = useState('');

  const handleProfileFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileInput(reader.result as string);
      setProfileFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleProfileCsv = () => {
    if (!profileInput.trim()) {
      setProfileError('Paste CSV data or upload a file to profile.');
      setProfileResults([]);
      setProfileRowCount(0);
      return;
    }

    try {
      const parsed = Papa.parse<Record<string, string>>(profileInput, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });

      if (parsed.errors.length) {
        throw new Error(parsed.errors[0].message);
      }

      const headers = parsed.meta.fields?.filter(Boolean) ?? [];

      if (headers.length === 0) {
        throw new Error('CSV must include a header row to profile columns.');
      }

      const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
      if (duplicates.length) {
        throw new Error(`Column headers must be unique. Duplicates: ${Array.from(new Set(duplicates)).join(', ')}`);
      }

      const rows = parsed.data;
      setProfileRowCount(rows.length);

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
      setProfileError('');
    } catch (error) {
      setProfileError('Unable to profile the CSV. Validate the format and try again.');
      setProfileResults([]);
      setProfileRowCount(0);
    }
  };

  const exportProfileCsv = () => {
    if (!profileResults.length) return;

    const csv = Papa.unparse(
      profileResults.map((column) => ({
        Column: column.name,
        Unique: column.uniqueCount,
        'Null/blank': column.nullCount,
        'Min length': column.minLength ?? '',
        'Max length': column.maxLength ?? '',
        Min: column.numericStats ? formatNumericStat(column.numericStats.min) : '',
        Max: column.numericStats ? formatNumericStat(column.numericStats.max) : '',
        Average: column.numericStats ? formatNumericStat(column.numericStats.average) : '',
        Median: column.numericStats ? formatNumericStat(column.numericStats.median) : '',
        'Std dev': column.numericStats ? formatNumericStat(column.numericStats.stdDev) : '',
        Pattern: column.dominantPattern,
        Coverage: column.patternCoverage,
        Samples: column.samples.join(' | '),
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'csv-profile.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard title="CSV Data Profiler" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Paste CSV data</label>
              <p className="text-xs text-slate-400">Headers are required. Empty lines are skipped automatically.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 cursor-pointer hover:border-brand/50">
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleProfileFileUpload} />
                <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                Upload CSV
              </label>
              <button
                onClick={handleProfileCsv}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
              >
                <CursorArrowRaysIcon className="h-4 w-4" />
                Profile data
              </button>
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

          <textarea
            value={profileInput}
            onChange={(e) => setProfileInput(e.target.value)}
            placeholder={`id,name,score\n1,Ada,98\n2,Lin,87`}
            className="w-full"
            rows={6}
          />
          {profileFileName && <p className="text-xs text-slate-400">Loaded from: {profileFileName}</p>}
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
            <p className="text-sm text-slate-400">Run the profiler to validate the CSV structure and inspect each column.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Pattern notation</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Each character is classified: digits → <span className="font-mono text-xs">N</span>, letters →{' '}
                <span className="font-mono text-xs">L</span>, whitespace → <span className="font-mono text-xs">·</span>, and
                punctuation/symbols stay as-is. Example: <span className="font-mono text-xs">123-AB</span> becomes{' '}
                <span className="font-mono text-xs">NNN-LL</span>.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Coverage</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Coverage shows what percentage of populated rows match the dominant pattern for a column. It is calculated as
                <span className="font-mono text-xs"> (rows matching pattern ÷ populated rows) × 100</span>.
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
                Profile results will appear here after validating the CSV format and running the analysis.
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
