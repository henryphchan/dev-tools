'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function JwtDecoderWorkspace({ tool }: { tool: ToolInfo }) {
    const [jwtInput, setJwtInput] = useState('');
    const [jwtHeader, setJwtHeader] = useState('');
    const [jwtPayload, setJwtPayload] = useState('');
    const [jwtError, setJwtError] = useState('');

    const decodeBase64Url = (value: string) => {
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        return atob(padded);
    };

    const handleJwtDecode = () => {
        try {
            const parts = jwtInput.split('.');

            if (parts.length < 2) {
                throw new Error('JWT must have at least header and payload parts.');
            }

            const [headerPart, payloadPart] = parts;

            const decodedHeader = JSON.parse(decodeBase64Url(headerPart));
            const decodedPayload = JSON.parse(decodeBase64Url(payloadPart));

            setJwtHeader(JSON.stringify(decodedHeader, null, 2));
            setJwtPayload(JSON.stringify(decodedPayload, null, 2));
            setJwtError('');
        } catch (error) {
            setJwtError('Unable to decode JWT. Ensure it is a valid Base64URL token.');
            setJwtHeader('');
            setJwtPayload('');
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
        <ToolCard title="JWT Decoder" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="space-y-2">
                <label className="text-sm text-slate-300">JWT</label>
                <textarea
                    value={jwtInput}
                    onChange={(e) => setJwtInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGV2In0.signature"
                    className="w-full"
                />
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleJwtDecode}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                    >
                        <CursorArrowRaysIcon className="h-4 w-4" />
                        Decode JWT
                    </button>
                    {(jwtHeader || jwtPayload) && (
                        <button
                            onClick={() => copyToClipboard(`${jwtHeader}\n${jwtPayload}`)}
                            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy decoded parts
                        </button>
                    )}
                </div>
                {jwtError && <p className="text-sm text-rose-400">{jwtError}</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Header</p>
                    {jwtHeader ? <pre className="code-output" aria-label="JWT header">{jwtHeader}</pre> : <p className="text-sm text-slate-400">Decoded header will appear here.</p>}
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Payload</p>
                    {jwtPayload ? <pre className="code-output" aria-label="JWT payload">{jwtPayload}</pre> : <p className="text-sm text-slate-400">Decoded payload will appear here.</p>}
                </div>
            </div>
        </ToolCard>
    );
}
