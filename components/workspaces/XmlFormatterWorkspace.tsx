'use client';

import { useState } from 'react';
import xmlFormatter from 'xml-formatter';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function XmlFormatterWorkspace({ tool }: { tool: ToolInfo }) {
    const [xmlInput, setXmlInput] = useState('');
    const [xmlOutput, setXmlOutput] = useState('');
    const [xmlError, setXmlError] = useState('');

    const handleXmlFormat = () => {
        try {
            setXmlOutput(xmlFormatter(xmlInput, { collapseContent: true }));
            setXmlError('');
        } catch (error) {
            setXmlError('Invalid XML. Please verify your markup.');
            setXmlOutput('');
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
        <ToolCard title="XML Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <textarea
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder='<note><to>Devs</to><body>Stay awesome</body></note>'
                className="w-full"
            />
            <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleXmlFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                    <CursorArrowRaysIcon className="h-4 w-4" />
                    Format XML
                </button>
                {xmlOutput && (
                    <button onClick={() => copyToClipboard(xmlOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                        <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
                    </button>
                )}
                {xmlError && <p className="text-sm text-rose-400">{xmlError}</p>}
            </div>
            {xmlOutput && <pre className="code-output" aria-label="XML output">{xmlOutput}</pre>}
        </ToolCard>
    );
}
