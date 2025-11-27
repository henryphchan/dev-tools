'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

export function UuidWorkspace({ tool }: { tool: ToolInfo }) {
  const [uuidValue, setUuidValue] = useState('');

  const generateUuid = () => {
    const next = crypto.randomUUID();
    setUuidValue(next);
  };

  return (
    <ToolCard title="UUID Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generateUuid}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
        >
          <CursorArrowRaysIcon className="h-4 w-4" />
          Generate UUID
        </button>
        {uuidValue && (
          <button
            onClick={() => copyToClipboard(uuidValue)}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
          </button>
        )}
      </div>
      {uuidValue && <pre className="code-output" aria-label="UUID output">{uuidValue}</pre>}
      <p className="text-xs text-slate-400">Uses the browser&apos;s crypto API to generate RFC 4122 v4 identifiers.</p>
    </ToolCard>
  );
}
