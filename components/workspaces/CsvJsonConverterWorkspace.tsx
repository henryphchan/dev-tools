'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ArrowPathRoundedSquareIcon, ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function CsvJsonConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [csvInput, setCsvInput] = useState('');
    const [jsonFromCsv, setJsonFromCsv] = useState('');
    const [csvError, setCsvError] = useState('');
    const [jsonForCsv, setJsonForCsv] = useState('');
    const [csvFromJson, setCsvFromJson] = useState('');
    const [jsonToCsvError, setJsonToCsvError] = useState('');

    const handleCsvToJson = () => {
        try {
            const parsed = Papa.parse(csvInput, { header: true, skipEmptyLines: true });

            if (parsed.errors.length) {
                throw new Error(parsed.errors[0].message);
            }

            setJsonFromCsv(JSON.stringify(parsed.data, null, 2));
            setCsvError('');
        } catch (error) {
            setCsvError('Unable to parse CSV. Check your delimiters and headers.');
            setJsonFromCsv('');
        }
    };

    const handleJsonToCsv = () => {
        try {
            const parsed = JSON.parse(jsonForCsv || '');
            const csv = Papa.unparse(parsed);
            setCsvFromJson(csv);
            setJsonToCsvError('');
        } catch (error) {
            setJsonToCsvError('Invalid JSON. Provide an array or object to convert.');
            setCsvFromJson('');
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
        <ToolCard headingLevel="h1" title="CSV ↔ JSON Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-sm text-slate-300">CSV input (expects headers)</label>
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                        placeholder={`name,role\nAda,Engineer`}
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleCsvToJson}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                        >
                            <CursorArrowRaysIcon className="h-4 w-4" />
                            Convert to JSON
                        </button>
                        {jsonFromCsv && (
                            <button
                                onClick={() => copyToClipboard(jsonFromCsv)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy JSON
                            </button>
                        )}
                    </div>
                    {csvError && <p className="text-sm text-rose-400">{csvError}</p>}
                    {jsonFromCsv && <pre className="code-output" aria-label="JSON from CSV">{jsonFromCsv}</pre>}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
                    <label className="text-sm text-slate-300">JSON input</label>
                    <textarea
                        value={jsonForCsv}
                        onChange={(e) => setJsonForCsv(e.target.value)}
                        placeholder='[{"name":"Ada","role":"Engineer"}]'
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleJsonToCsv}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10"
                        >
                            <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                            Convert to CSV
                        </button>
                        {csvFromJson && (
                            <button
                                onClick={() => copyToClipboard(csvFromJson)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy CSV
                            </button>
                        )}
                    </div>
                    {jsonToCsvError && <p className="text-sm text-rose-400">{jsonToCsvError}</p>}
                    {csvFromJson && <pre className="code-output" aria-label="CSV from JSON">{csvFromJson}</pre>}
                </div>
            </div>
        </ToolCard>
    );
}
