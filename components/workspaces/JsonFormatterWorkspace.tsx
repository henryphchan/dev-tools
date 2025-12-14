'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function JsonFormatterWorkspace({ tool }: { tool: ToolInfo }) {
    const [jsonInput, setJsonInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const [jsonError, setJsonError] = useState('');

    const handleJsonFormat = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setJsonOutput(JSON.stringify(parsed, null, 2));
            setJsonError('');
        } catch (error) {
            setJsonError('Invalid JSON. Please check your syntax.');
            setJsonOutput('');
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
        <ToolCard title="JSON Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste JSON here...'
                className="w-full"
            />
            <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleJsonFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                    <CursorArrowRaysIcon className="h-4 w-4" />
                    Format JSON
                </button>
                {jsonOutput && (
                    <button onClick={() => copyToClipboard(jsonOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                        <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
                    </button>
                )}
                {jsonError && <p className="text-sm text-rose-400">{jsonError}</p>}
            </div>
            {jsonOutput && <pre className="code-output" aria-label="JSON output">{jsonOutput}</pre>}
        </ToolCard>
    );
}
