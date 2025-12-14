'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

export function TimestampConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [timestampInput, setTimestampInput] = useState('');
    const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');
    const [timestampResult, setTimestampResult] = useState('');
    const [timestampError, setTimestampError] = useState('');

    const handleTimestampConvert = () => {
        const value = Number(timestampInput);

        if (!Number.isFinite(value)) {
            setTimestampError('Enter a numeric timestamp in seconds or milliseconds.');
            setTimestampResult('');
            return;
        }

        const millis = timestampUnit === 'seconds' ? value * 1000 : value;
        const dt = DateTime.fromMillis(millis);

        if (!dt.isValid) {
            setTimestampError('Invalid timestamp. Please verify the units match the value.');
            setTimestampResult('');
            return;
        }

        const local = dt.toFormat('DDD • HH:mm:ss ZZZZ');
        const iso = dt.toISO();

        setTimestampResult(`${local}\nISO: ${iso}`);
        setTimestampError('');
    };

    return (
        <ToolCard title="Timestamp to Date Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
                <div className="space-y-1">
                    <label className="text-sm text-slate-300">Timestamp</label>
                    <input
                        type="text"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                        placeholder="1700000000"
                        className="w-full px-3 py-2"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-slate-300">Units</label>
                    <select
                        value={timestampUnit}
                        onChange={(e) => setTimestampUnit(e.target.value as 'seconds' | 'milliseconds')}
                        className="w-full px-3 py-2"
                    >
                        <option value="seconds">Seconds</option>
                        <option value="milliseconds">Milliseconds</option>
                    </select>
                </div>
                <button
                    onClick={handleTimestampConvert}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                    <CursorArrowRaysIcon className="h-4 w-4" /> Convert
                </button>
            </div>
            {timestampError && <p className="text-sm text-rose-400">{timestampError}</p>}
            {timestampResult && <pre className="code-output" aria-label="Timestamp output">{timestampResult}</pre>}
            <p className="text-xs text-slate-400">Outputs include your local timezone and ISO-8601 format.</p>
        </ToolCard>
    );
}
