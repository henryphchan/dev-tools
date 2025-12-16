'use client';

import NextImage from 'next/image';
import { useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import {
    ArrowPathRoundedSquareIcon,
    ClipboardDocumentCheckIcon,
    CursorArrowRaysIcon,
} from '../icons';

export function QrCodeGeneratorWorkspace({ tool }: { tool: ToolInfo }) {
    const [qrContent, setQrContent] = useState('');
    const [qrType, setQrType] = useState<'text' | 'wifi'>('text');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrError, setQrError] = useState('');
    const [qrSize, setQrSize] = useState(320);
    const [qrDarkColor, setQrDarkColor] = useState('#0ea5e9');
    const [qrLightColor, setQrLightColor] = useState('#0b1224');
    const [qrDarkColorText, setQrDarkColorText] = useState('#0ea5e9');
    const [qrLightColorText, setQrLightColorText] = useState('#0b1224');
    const [qrErrorCorrection, setQrErrorCorrection] = useState<'L' | 'M' | 'H'>('M');
    const [wifiSsid, setWifiSsid] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
    const [wifiHidden, setWifiHidden] = useState(false);

    const clampedQrSize = useMemo(() => Math.min(1024, Math.max(120, qrSize)), [qrSize]);

    const normalizeHexColor = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
        const hex = withHash.slice(1).replace(/[^0-9a-fA-F]/g, '');

        if (hex.length === 3) {
            return `#${hex
                .split('')
                .map((char) => char.repeat(2))
                .join('')}`.toLowerCase();
        }

        if (hex.length === 6) {
            return `#${hex.toLowerCase()}`;
        }

        return null;
    };

    const commitColorInput = (
        value: string,
        setColor: (color: string) => void,
        setText: (colorText: string) => void,
        fallback: string
    ) => {
        const normalized = normalizeHexColor(value);

        if (normalized) {
            setColor(normalized);
            setText(normalized);
        } else {
            setText(fallback);
        }
    };

    const buildWifiPayload = () => {
        if (!wifiSsid.trim()) {
            throw new Error('SSID is required for WiFi QR codes.');
        }

        const hiddenFlag = wifiHidden ? 'H:true;' : '';
        const passwordPart = wifiSecurity === 'nopass' ? '' : `P:${wifiPassword};`;
        return `WIFI:T:${wifiSecurity};S:${wifiSsid};${passwordPart}${hiddenFlag};`;
    };

    const handleGenerateQr = async () => {
        try {
            const payload = qrType === 'wifi' ? buildWifiPayload() : qrContent.trim();

            if (!payload) {
                throw new Error('Enter text, a URL, or WiFi details to generate a QR code.');
            }

            const canvas = document.createElement('canvas');

            await QRCode.toCanvas(canvas, payload, {
                width: clampedQrSize,
                margin: 2,
                color: { dark: qrDarkColor, light: qrLightColor },
                errorCorrectionLevel: qrErrorCorrection,
            });

            const dataUrl = canvas.toDataURL('image/png');

            setQrDataUrl(dataUrl);
            setQrError('');
        } catch (error) {
            console.error('QR generation failed', error);
            setQrError('Unable to generate QR code. Please verify the input data.');
            setQrDataUrl('');
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
        <ToolCard headingLevel="h1" title="QR Code Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-6 items-start">
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="radio"
                                    name="qr-type"
                                    value="text"
                                    checked={qrType === 'text'}
                                    onChange={() => setQrType('text')}
                                />
                                Text or URL
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="radio"
                                    name="qr-type"
                                    value="wifi"
                                    checked={qrType === 'wifi'}
                                    onChange={() => setQrType('wifi')}
                                />
                                WiFi credentials
                            </label>
                        </div>

                        {qrType === 'text' && (
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Text or URL</label>
                                <textarea
                                    value={qrContent}
                                    onChange={(e) => setQrContent(e.target.value)}
                                    placeholder="https://example.com or any text..."
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 min-h-[120px]"
                                />
                            </div>
                        )}

                        {qrType === 'wifi' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Network name (SSID)</label>
                                    <input
                                        type="text"
                                        value={wifiSsid}
                                        onChange={(e) => setWifiSsid(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                        placeholder="MyWiFi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Security</label>
                                    <select
                                        value={wifiSecurity}
                                        onChange={(e) => setWifiSecurity(e.target.value as typeof wifiSecurity)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-slate-100"
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">Open network</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Password (optional for open networks)</label>
                                    <input
                                        type="text"
                                        value={wifiPassword}
                                        onChange={(e) => setWifiPassword(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                        placeholder="••••••••"
                                        disabled={wifiSecurity === 'nopass'}
                                    />
                                </div>
                                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={wifiHidden}
                                        onChange={(e) => setWifiHidden(e.target.checked)}
                                    />
                                    Hidden network
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-sm font-semibold text-slate-200">Customization</p>
                            <p className="text-xs text-slate-400">Choose error correction, sizing, and colors.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm text-slate-300">Error correction</label>
                                <select
                                    value={qrErrorCorrection}
                                    onChange={(e) => setQrErrorCorrection(e.target.value as typeof qrErrorCorrection)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-slate-100"
                                >
                                    <option value="H">High (30%)</option>
                                    <option value="M">Medium (15%)</option>
                                    <option value="L">Low (7%)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-slate-300">Size (px)</label>
                                <input
                                    type="number"
                                    min={120}
                                    max={1024}
                                    value={qrSize}
                                    onChange={(e) => setQrSize(Number(e.target.value))}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                    placeholder="320"
                                />
                                <p className="text-xs text-slate-400">Clamped between 120px and 1024px.</p>
                            </div>
                            <div className="space-y-1 min-w-0">
                                <label className="text-sm text-slate-300">Foreground</label>
                                <div className="flex items-center gap-2 min-w-0">
                                    <input
                                        type="color"
                                        value={qrDarkColor}
                                        onChange={(e) => {
                                            setQrDarkColor(e.target.value);
                                            setQrDarkColorText(e.target.value);
                                        }}
                                        className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-white/5 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={qrDarkColorText}
                                        onChange={(e) => setQrDarkColorText(e.target.value)}
                                        onBlur={() => commitColorInput(qrDarkColorText, setQrDarkColor, setQrDarkColorText, qrDarkColor)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                commitColorInput(qrDarkColorText, setQrDarkColor, setQrDarkColorText, qrDarkColor);
                                            }
                                        }}
                                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                        placeholder="#0ea5e9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 min-w-0">
                                <label className="text-sm text-slate-300">Background</label>
                                <div className="flex items-center gap-2 min-w-0">
                                    <input
                                        type="color"
                                        value={qrLightColor}
                                        onChange={(e) => {
                                            setQrLightColor(e.target.value);
                                            setQrLightColorText(e.target.value);
                                        }}
                                        className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-white/5 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={qrLightColorText}
                                        onChange={(e) => setQrLightColorText(e.target.value)}
                                        onBlur={() => commitColorInput(qrLightColorText, setQrLightColor, setQrLightColorText, qrLightColor)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                commitColorInput(qrLightColorText, setQrLightColor, setQrLightColorText, qrLightColor);
                                            }
                                        }}
                                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                        placeholder="#0b1224"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleGenerateQr}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                        >
                            <CursorArrowRaysIcon className="h-4 w-4" />
                            Generate QR code
                        </button>
                        {qrDataUrl && (
                            <button
                                onClick={() => copyToClipboard(qrType === 'wifi' ? buildWifiPayload() : qrContent)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                            >
                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy encoded data
                            </button>
                        )}
                        {qrError && <p className="text-sm text-rose-400">{qrError}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-300 mb-2">Preview</p>
                        <div className="flex items-center justify-center rounded-xl border border-white/5 bg-slate-950/40 p-6 min-h-[280px]">
                            {qrDataUrl ? (
                                <NextImage
                                    src={qrDataUrl}
                                    alt="Generated QR code"
                                    width={clampedQrSize}
                                    height={clampedQrSize}
                                    className="object-contain"
                                    style={{ width: clampedQrSize, height: clampedQrSize, maxWidth: '100%', maxHeight: '100%' }}
                                />
                            ) : (
                                <p className="text-sm text-slate-400 text-center">Enter details and generate to see the QR code.</p>
                            )}
                        </div>
                    </div>
                    {qrDataUrl && (
                        <a
                            download="qr-code.png"
                            href={qrDataUrl}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand/50 hover:text-white"
                        >
                            <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                            Download PNG
                        </a>
                    )}
                </div>
            </div>
        </ToolCard>
    );
}
