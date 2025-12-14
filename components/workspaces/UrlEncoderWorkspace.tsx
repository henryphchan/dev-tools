'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

export function UrlEncoderWorkspace({ tool }: { tool: ToolInfo }) {
    const [encodeInput, setEncodeInput] = useState('');
    const [decodeInput, setDecodeInput] = useState('');
    const [urlEncoded, setUrlEncoded] = useState('');
    const [base64Encoded, setBase64Encoded] = useState('');
    const [decodeOutput, setDecodeOutput] = useState('');
    const [encodeError, setEncodeError] = useState('');
    const [decodeError, setDecodeError] = useState('');

    const handleEncode = () => {
        setUrlEncoded(encodeURIComponent(encodeInput));
        try {
            setBase64Encoded(btoa(encodeInput));
            setEncodeError('');
        } catch (error) {
            setBase64Encoded('');
            setEncodeError('Encoding failed. Ensure the input contains valid characters.');
        }
    };

    const handleDecode = () => {
        try {
            const decodedUrl = decodeURIComponent(decodeInput);
            const decodedBase64 = atob(decodeInput);
            setDecodeOutput(`URL decoded: ${decodedUrl}\nBase64 decoded: ${decodedBase64}`);
            setDecodeError('');
        } catch (error) {
            setDecodeError('Decoding failed. Ensure the string is valid URL or Base64.');
            setDecodeOutput('');
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
        <ToolCard title="URL & Base64 Encoder/Decoder" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-sm text-slate-300">Text to encode</label>
                    <textarea
                        value={encodeInput}
                        onChange={(e) => setEncodeInput(e.target.value)}
                        placeholder="Type text here..."
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleEncode} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                            <CursorArrowRaysIcon className="h-4 w-4" /> Encode
                        </button>
                        {encodeError && <p className="text-sm text-rose-400">{encodeError}</p>}
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-300">URL Encoded</p>
                            <div className="flex gap-2">
                                <pre className="code-output flex-1 overflow-x-auto">{urlEncoded || '...'}</pre>
                                {urlEncoded && (
                                    <button onClick={() => copyToClipboard(urlEncoded)} className="self-start p-2 hover:text-white text-slate-300">
                                        <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-300">Base64 Encoded</p>
                            <div className="flex gap-2">
                                <pre className="code-output flex-1 overflow-x-auto">{base64Encoded || '...'}</pre>
                                {base64Encoded && (
                                    <button onClick={() => copyToClipboard(base64Encoded)} className="self-start p-2 hover:text-white text-slate-300">
                                        <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
                    <label className="text-sm text-slate-300">String to decode (URL or Base64)</label>
                    <textarea
                        value={decodeInput}
                        onChange={(e) => setDecodeInput(e.target.value)}
                        placeholder="Paste encoded string..."
                        className="w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleDecode} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10">
                            <CursorArrowRaysIcon className="h-4 w-4" /> Decode
                        </button>
                        {decodeOutput && (
                            <button onClick={() => copyToClipboard(decodeOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy result
                            </button>
                        )}
                        {decodeError && <p className="text-sm text-rose-400">{decodeError}</p>}
                    </div>
                    {decodeOutput && <pre className="code-output" aria-label="Decode output">{decodeOutput}</pre>}
                </div>
            </div>
        </ToolCard>
    );
}
