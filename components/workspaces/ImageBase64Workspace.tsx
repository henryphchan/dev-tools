'use client';

import { useState, ChangeEvent, useMemo } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ArrowUpTrayIcon, ClipboardDocumentCheckIcon, PhotoIcon } from '../icons';

export function ImageBase64Workspace({ tool }: { tool: ToolInfo }) {
    const [file, setFile] = useState<File | null>(null);
    const [base64, setBase64] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG, GIF, etc.)');
            return;
        }

        setFile(selectedFile);
        setError('');
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setBase64(result);
            setPreviewUrl(result);
            setLoading(false);
        };
        reader.onerror = () => {
            setError('Failed to read file.');
            setLoading(false);
        };
        reader.readAsDataURL(selectedFile);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const base64Size = useMemo(() => {
        // Base64 is ~1.33x larger than original
        return base64.length;
    }, [base64]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const snippets = useMemo(() => {
        if (!base64) return [];
        return [
            {
                label: 'Raw Base64',
                value: base64,
                action: () => copyToClipboard(base64)
            },
            {
                label: 'HTML <img /> source',
                value: `<img src="${base64}" alt="${file?.name}" />`,
                action: () => copyToClipboard(`<img src="${base64}" alt="${file?.name}" />`)
            },
            {
                label: 'CSS Background Image',
                value: `background-image: url('${base64}');`,
                action: () => copyToClipboard(`background-image: url('${base64}');`)
            }
        ];
    }, [base64, file]);

    return (
        <ToolCard
            headingLevel="h1"
            title="Image to Base64 Converter"
            description={tool.description}
            badge={tool.badge}
            accent={tool.accent}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-brand/50 hover:bg-white/5 transition-colors group text-center cursor-pointer">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <ArrowUpTrayIcon className="w-8 h-8 text-brand" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-200">Click to upload or drag image</p>
                                <p className="text-sm text-slate-400 mt-1">Supports PNG, JPG, GIF, WebP, SVG</p>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-rose-400">{error}</p>}

                    {file && (
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Original Size</span>
                                <span className="text-sm font-mono text-slate-200">{formatBytes(file.size)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Base64 Size (approx)</span>
                                <span className="text-sm font-mono text-slate-200">{formatBytes(base64Size)}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand w-full animate-pulse" style={{ display: loading ? 'block' : 'none' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {previewUrl ? (
                        <div className="space-y-6">
                            <div className="border border-white/10 rounded-xl p-4 bg-[url('/transparent-grid.svg')] bg-repeat bg-slate-950/50 flex items-center justify-center min-h-[200px]">
                                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded shadow-lg" />
                            </div>

                            <div className="space-y-4">
                                {snippets.map((snippet, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold ml-1">{snippet.label}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={snippet.value}
                                                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-400 focus:outline-none"
                                            />
                                            <button
                                                onClick={snippet.action}
                                                className="bg-brand hover:bg-brand-light text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                            >
                                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 border border-white/5 rounded-2xl bg-white/5 border-dashed">
                            <PhotoIcon className="w-12 h-12 opacity-20 mb-4" />
                            <p>Image preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolCard>
    );
}
