'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { getTimeZones } from '@vvo/tzdb';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { CursorArrowRaysIcon } from '../icons';

type TimezoneOption = {
    value: string;
    label: string;
};

// Timezone suggestions logic
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

function formatDateTimeValue(value: string) {
    const dt = DateTime.fromISO(value, { setZone: true });
    if (!dt.isValid) return '';
    return dt.toFormat('fff ZZZZ');
}

export function TimezoneConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [sourceTime, setSourceTime] = useState('');
    const [sourceZone, setSourceZone] = useState('UTC');
    const [targetZone, setTargetZone] = useState('America/New_York');
    const [convertedTime, setConvertedTime] = useState('');
    const [timeError, setTimeError] = useState('');

    const handleTimeConversion = () => {
        const parsed = DateTime.fromISO(sourceTime, { zone: sourceZone });
        if (!parsed.isValid) {
            setTimeError('Invalid date/time. Please use the picker to choose a valid value.');
            setConvertedTime('');
            return;
        }

        const converted = parsed.setZone(targetZone);
        setConvertedTime(converted.toISO() ?? '');
        setTimeError('');
    };

    return (
        <ToolCard title="Timezone Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">Source time</label>
                    <input
                        type="datetime-local"
                        value={sourceTime}
                        onChange={(e) => setSourceTime(e.target.value)}
                        className="w-full px-3 py-2"
                    />
                    <select value={sourceZone} onChange={(e) => setSourceZone(e.target.value)} className="w-full px-3 py-2">
                        {timezoneSuggestions.map((zone) => (
                            <option key={zone.value} value={zone.value}>
                                {zone.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">Target timezone</label>
                    <select value={targetZone} onChange={(e) => setTargetZone(e.target.value)} className="w-full px-3 py-2">
                        {timezoneSuggestions.map((zone) => (
                            <option key={zone.value} value={zone.value}>
                                {zone.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleTimeConversion} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                        <CursorArrowRaysIcon className="h-4 w-4" /> Convert time
                    </button>
                    {timeError && <p className="text-sm text-rose-400">{timeError}</p>}
                </div>
            </div>

            {convertedTime && (
                <div className="code-output">
                    <p className="text-sm text-slate-400">{formatDateTimeValue(sourceTime)} ({sourceZone})</p>
                    <p className="text-lg font-semibold text-white">{formatDateTimeValue(convertedTime)} ({targetZone})</p>
                </div>
            )}
        </ToolCard>
    );
}
