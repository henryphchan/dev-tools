'use client';

import { useState, ChangeEvent } from 'react';
import CryptoJS from 'crypto-js';
import * as blake from 'blakejs';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';

const digestAlgorithms = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha3-256', label: 'SHA3-256' },
    { value: 'blake2b', label: 'BLAKE2b (512-bit)' },
];

export function HashGeneratorWorkspace({ tool }: { tool: ToolInfo }) {
    const [digestAlgorithm, setDigestAlgorithm] = useState('sha256');
    const [digestText, setDigestText] = useState('');
    const [digestFileName, setDigestFileName] = useState('');
    const [digestFileBytes, setDigestFileBytes] = useState<ArrayBuffer | null>(null);
    const [digestResult, setDigestResult] = useState('');
    const [digestError, setDigestError] = useState('');

    const toHexFromBytes = (bytes: Uint8Array) =>
        Array.from(bytes)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

    const handleDigestFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setDigestFileName('');
            setDigestFileBytes(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setDigestFileBytes(reader.result as ArrayBuffer);
            setDigestFileName(file.name);
        };
        reader.readAsArrayBuffer(file);
    };

    const computeDigest = async () => {
        if (!digestText && !digestFileBytes) {
            setDigestError('Provide text or upload a file to hash.');
            setDigestResult('');
            return;
        }

        try {
            const byteSource = digestFileBytes ? new Uint8Array(digestFileBytes) : new TextEncoder().encode(digestText);
            const wordArray = digestFileBytes
                ? CryptoJS.lib.WordArray.create(byteSource as any)
                : CryptoJS.enc.Utf8.parse(digestText);

            let hexResult = '';

            switch (digestAlgorithm) {
                case 'md5':
                    hexResult = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                    break;
                case 'sha1':
                    hexResult = CryptoJS.SHA1(wordArray).toString(CryptoJS.enc.Hex);
                    break;
                case 'sha256':
                    hexResult = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                    break;
                case 'sha3-256':
                    hexResult = CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
                    break;
                case 'blake2b':
                    hexResult = toHexFromBytes(blake.blake2b(byteSource, undefined, 64));
                    break;
                default:
                    hexResult = '';
            }

            setDigestResult(hexResult);
            setDigestError('');
        } catch (error) {
            console.error('Digest computation failed', error);
            setDigestError('Unable to compute the hash. Please try again.');
            setDigestResult('');
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
        <ToolCard title="Message Digester" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Algorithm</label>
                            <select
                                value={digestAlgorithm}
                                onChange={(e) => setDigestAlgorithm(e.target.value)}
                                className="w-full px-3 py-2"
                            >
                                {digestAlgorithms.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-300">Upload file (optional)</label>
                            <input type="file" onChange={handleDigestFile} className="w-full" />
                            {digestFileName && <p className="text-xs text-slate-400">{digestFileName}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-300">Text input (used if no file is provided)</label>
                        <textarea
                            value={digestText}
                            onChange={(e) => setDigestText(e.target.value)}
                            placeholder="Paste text to hash..."
                            className="w-full"
                            rows={4}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={computeDigest}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                        >
                            <CursorArrowRaysIcon className="h-4 w-4" />
                            Generate hash
                        </button>
                        {digestResult && (
                            <button
                                onClick={() => copyToClipboard(digestResult)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy hash
                            </button>
                        )}
                        {digestError && <p className="text-sm text-rose-400">{digestError}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-slate-300">Hash output</p>
                    {digestResult ? (
                        <pre className="code-output break-all" aria-label="Digest output">{digestResult}</pre>
                    ) : (
                        <p className="text-sm text-slate-400">Select an algorithm and provide input to see the hash.</p>
                    )}
                    <p className="text-xs text-slate-400">Uses client-side hashing only; inputs stay in your browser.</p>
                </div>
            </div>
        </ToolCard>
    );
}
