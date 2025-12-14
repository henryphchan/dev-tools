'use client';

import { useState } from 'react';
import { format as formatSql } from 'sql-formatter';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function SqlFormatterWorkspace({ tool }: { tool: ToolInfo }) {
    const [sqlInput, setSqlInput] = useState('');
    const [sqlOutput, setSqlOutput] = useState('');
    const [sqlError, setSqlError] = useState('');

    const handleSqlFormat = () => {
        try {
            setSqlOutput(formatSql(sqlInput, { language: 'sql' }));
            setSqlError('');
        } catch (error) {
            setSqlError('Unable to format SQL. Check for incomplete statements.');
            setSqlOutput('');
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
        <ToolCard title="SQL Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <textarea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="select id, email from users where active=1 order by created_at desc"
                className="w-full"
            />
            <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleSqlFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                    <CursorArrowRaysIcon className="h-4 w-4" />
                    Format SQL
                </button>
                {sqlOutput && (
                    <button onClick={() => copyToClipboard(sqlOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                        <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
                    </button>
                )}
                {sqlError && <p className="text-sm text-rose-400">{sqlError}</p>}
            </div>
            {sqlOutput && <pre className="code-output" aria-label="SQL output">{sqlOutput}</pre>}
        </ToolCard>
    );
}
