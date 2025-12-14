'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { ArrowPathRoundedSquareIcon, CursorArrowRaysIcon } from '../icons';

type WebpConversion = {
    name: string;
    originalSize: number;
    convertedSize: number;
    url: string;
    blob: Blob;
};

const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes)) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const decimals = value >= 10 || unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(decimals)} ${units[unitIndex]}`;
};

export function WebpConverterWorkspace({ tool }: { tool: ToolInfo }) {
    const [webpFiles, setWebpFiles] = useState<File[]>([]);
    const [webpConversions, setWebpConversions] = useState<WebpConversion[]>([]);
    const [webpQuality, setWebpQuality] = useState(80);
    const [webpProcessing, setWebpProcessing] = useState(false);
    const [webpError, setWebpError] = useState('');

    const selectedOriginalBytes = useMemo(() => webpFiles.reduce((sum, file) => sum + file.size, 0), [webpFiles]);
    const convertedOriginalBytes = useMemo(
        () => webpConversions.reduce((sum, conversion) => sum + conversion.originalSize, 0),
        [webpConversions]
    );
    const convertedTotalBytes = useMemo(
        () => webpConversions.reduce((sum, conversion) => sum + conversion.convertedSize, 0),
        [webpConversions]
    );

    const activeOriginalBytes = webpConversions.length > 0 ? convertedOriginalBytes : selectedOriginalBytes;
    const activeConvertedBytes = webpConversions.length > 0 ? convertedTotalBytes : 0;
    const savingsBytes = activeConvertedBytes > 0 ? Math.max(activeOriginalBytes - activeConvertedBytes, 0) : 0;
    const savingsPercent =
        activeConvertedBytes > 0 && activeOriginalBytes > 0 ? (savingsBytes / activeOriginalBytes) * 100 : 0;

    const releaseWebpUrls = (conversions: WebpConversion[]) => {
        conversions.forEach((conversion) => URL.revokeObjectURL(conversion.url));
    };

    const convertImageToWebp = (file: File, quality: number, index: number): Promise<WebpConversion> => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const image = new window.Image();

            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;

                const context = canvas.getContext('2d');
                if (!context) {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Canvas not supported in this browser'));
                    return;
                }

                context.drawImage(image, 0, 0);

                const clampedQuality = Math.min(Math.max(quality, 0), 100) / 100;

                canvas.toBlob(
                    (blob) => {
                        URL.revokeObjectURL(objectUrl);

                        if (!blob) {
                            reject(new Error('WebP conversion returned an empty file'));
                            return;
                        }

                        const baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
                        const suffix = index > 0 ? `-${index + 1}` : '';
                        const name = `${baseName}${suffix}.webp`;
                        const url = URL.createObjectURL(blob);

                        resolve({ name, originalSize: file.size, convertedSize: blob.size, url, blob });
                    },
                    'image/webp',
                    clampedQuality
                );
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Unable to load image for conversion'));
            };

            image.decoding = 'async';
            image.src = objectUrl;
        });
    };

    const handleWebpFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setWebpFiles(files);
        setWebpConversions((current) => {
            releaseWebpUrls(current);
            return [];
        });
        setWebpError('');
    };

    const handleConvertToWebp = async () => {
        if (webpFiles.length === 0) {
            setWebpError('Upload one or more images to convert.');
            return;
        }

        setWebpProcessing(true);
        setWebpError('');

        try {
            const conversions = await Promise.all(
                webpFiles.map((file, index) => convertImageToWebp(file, webpQuality, index))
            );

            setWebpConversions((current) => {
                releaseWebpUrls(current);
                return conversions;
            });
        } catch (error) {
            console.error('Failed to convert to WebP', error);
            setWebpError('Conversion failed for one or more files. Try different inputs or quality.');
        } finally {
            setWebpProcessing(false);
        }
    };

    const handleDownloadWebp = (conversion: WebpConversion) => {
        const link = document.createElement('a');
        link.href = conversion.url;
        link.download = conversion.name;
        link.click();
    };

    const handleDownloadAllWebp = async () => {
        if (webpConversions.length === 0) return;

        setWebpProcessing(true);

        try {
            const zip = new JSZip();
            webpConversions.forEach((conversion) => {
                zip.file(conversion.name, conversion.blob);
            });

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted-webp-files.zip';
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to package WebP files', error);
            setWebpError('Unable to package the converted files for download.');
        } finally {
            setWebpProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            releaseWebpUrls(webpConversions);
        };
    }, [webpConversions]);

    return (
        <ToolCard title="WebP Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4 items-start">
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-white">What is WebP?</p>
                            <p className="text-sm text-slate-300">
                                WebP is a modern image format from Google that delivers lossy and lossless compression while supporting
                                transparency and animation. Smaller file sizes mean faster page loads and leaner downloads without giving up
                                visual quality.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-white">Benefits of WebP format</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                                <li>Typical size reductions of 20–70% compared to JPEG or PNG at similar quality.</li>
                                <li>Better Core Web Vitals from faster image delivery and fewer bytes over the network.</li>
                                <li>Supports transparency and animation in a single format, simplifying asset pipelines.</li>
                                <li>Browser-side conversion keeps your images local—no uploads or external services.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-300">Upload images</label>
                            <input type="file" accept="image/*" multiple onChange={handleWebpFileChange} className="w-full" />
                            <p className="text-xs text-slate-400">
                                Drop in one or many images. Conversion runs entirely in your browser and never leaves this page.
                            </p>
                            <p className="text-xs text-slate-400">
                                Selected files: <span className="font-semibold text-slate-200">{webpFiles.length}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-slate-300">
                                <label htmlFor="webp-quality">Quality</label>
                                <span className="badge">{webpQuality}%</span>
                            </div>
                            <input
                                id="webp-quality"
                                type="range"
                                min={50}
                                max={100}
                                step={1}
                                value={webpQuality}
                                onChange={(e) => setWebpQuality(Number(e.target.value))}
                                className="w-full accent-brand"
                            />
                            <p className="text-xs text-slate-400">Default quality is 80%. Lower values favor smaller sizes.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleConvertToWebp}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={webpProcessing}
                            >
                                <CursorArrowRaysIcon className="h-4 w-4" />
                                Convert to WebP
                            </button>
                            <button
                                onClick={handleDownloadAllWebp}
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={webpConversions.length === 0 || webpProcessing}
                            >
                                <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                Download all WebP files
                            </button>
                            {webpProcessing && <p className="text-sm text-slate-300">Working on your images…</p>}
                            {webpError && <p className="text-sm text-rose-400">{webpError}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-1">
                                <p className="text-xs text-slate-400">Total before conversion</p>
                                <p className="text-lg font-semibold text-white">{formatBytes(activeOriginalBytes)}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-1">
                                <p className="text-xs text-slate-400">After conversion (WebP)</p>
                                <p className="text-lg font-semibold text-white">
                                    {formatBytes(activeConvertedBytes)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-1">
                                <p className="text-xs text-slate-400">Bandwidth saved</p>
                                <p className="text-lg font-semibold text-emerald-400">
                                    {formatBytes(savingsBytes)} ({savingsPercent.toFixed(1)}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300">Converted Files</h3>
                        {webpConversions.length > 0 ? (
                            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {webpConversions.map((conversion) => (
                                    <div
                                        key={conversion.name}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-900/50 p-2 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-200">{conversion.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {formatBytes(conversion.convertedSize)} ({(conversion.convertedSize / 1024).toFixed(1)} KB)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadWebp(conversion)}
                                            className="shrink-0 text-brand hover:text-brand-light"
                                            title="Download"
                                        >
                                            <ArrowPathRoundedSquareIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No files converted yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
