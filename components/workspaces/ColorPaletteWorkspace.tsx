'use client';

import { useState, useMemo } from 'react';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';
import { ClipboardDocumentCheckIcon } from '../icons';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
    // Ensure components are within 0-255
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    const rHex = clamp(r).toString(16).padStart(2, '0');
    const gHex = clamp(g).toString(16).padStart(2, '0');
    const bHex = clamp(b).toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
}

function mix(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number },
    weight: number
) {
    // weight is 0..1, amount of color2
    const r = color1.r * (1 - weight) + color2.r * weight;
    const g = color1.g * (1 - weight) + color2.g * weight;
    const b = color1.b * (1 - weight) + color2.b * weight;
    return { r, g, b };
}

type Palette = Record<number, string>;

function generatePalette(baseHex: string): Palette | null {
    const base = hexToRgb(baseHex);
    if (!base) return null;

    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    // This scale approximates Tailwind's typical distribution
    // 500 is the base color
    return {
        50: rgbToHex(mix(base, white, 0.95)),
        100: rgbToHex(mix(base, white, 0.9)),
        200: rgbToHex(mix(base, white, 0.75)),
        300: rgbToHex(mix(base, white, 0.6)),
        400: rgbToHex(mix(base, white, 0.3)),
        500: baseHex, // user input
        600: rgbToHex(mix(base, black, 0.1)),
        700: rgbToHex(mix(base, black, 0.3)),
        800: rgbToHex(mix(base, black, 0.45)),
        900: rgbToHex(mix(base, black, 0.6)),
        950: rgbToHex(mix(base, black, 0.75)),
    };
}

export function ColorPaletteWorkspace({ tool }: { tool: ToolInfo }) {
    const [baseColor, setBaseColor] = useState('#3b82f6'); // Default to Tailwind Blue 500
    const [copiedKey, setCopiedKey] = useState<number | 'config' | null>(null);

    const palette = useMemo(() => generatePalette(baseColor), [baseColor]);

    const handleCopy = (text: string, key: number | 'config') => {
        copyToClipboard(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleCopyConfig = () => {
        if (!palette) return;
        const config = `colors: {\n  brand: {\n${Object.entries(palette)
            .map(([stop, hex]) => `    ${stop}: '${hex}',`)
            .join('\n')}\n  },\n},`;
        handleCopy(config, 'config');
    };

    const isValidColor = palette !== null;

    return (
        <ToolCard
            title={tool.title}
            description={tool.longDescription}
            badge={tool.badge}
            accent={tool.accent}
        >
            <div className="space-y-8">
                {/* Input Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <label htmlFor="base-color" className="block text-sm font-medium text-slate-300">
                            Base Color (Hex)
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="base-color"
                                type="text"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className={`flex-1 rounded-xl border bg-black/40 px-4 py-3 font-mono text-lg text-white transition-colors focus:outline-none focus:ring-2 ${isValidColor
                                    ? 'border-white/10 focus:border-brand focus:ring-brand/20'
                                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                                    }`}
                                placeholder="#3b82f6"
                            />
                            <div
                                className="relative h-[54px] w-[54px] flex-none overflow-hidden rounded-xl border border-white/10 shadow-lg"
                                style={{ backgroundColor: isValidColor ? baseColor : 'transparent' }}
                            >
                                <input
                                    type="color"
                                    value={isValidColor ? (baseColor.startsWith('#') ? baseColor : `#${baseColor}`) : '#000000'}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                />
                            </div>
                        </div>
                        {!isValidColor && (
                            <p className="text-xs text-red-400">Please enter a valid hex color code (e.g. #3b82f6)</p>
                        )}
                    </div>
                    <button
                        onClick={handleCopyConfig}
                        disabled={!isValidColor}
                        className="inline-flex h-[54px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {copiedKey === 'config' ? (
                            <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" />
                        ) : (
                            <ClipboardDocumentCheckIcon className="h-5 w-5 text-slate-400" />
                        )}
                        <span>Copy Config</span>
                    </button>
                </div>

                {/* Palette Grid */}
                {isValidColor && palette && (
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                        {Object.entries(palette).map(([stop, hex]) => {
                            const stopNum = parseInt(stop);
                            // Determine text color based on brightness
                            // Simple heuristic: if stop < 500 use dark text, else light text
                            // But 500 varies. Let's calculate luminance.
                            const rgb = hexToRgb(hex)!;
                            const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
                            const textColor = luminance > 0.5 ? 'text-black/80' : 'text-white';

                            return (
                                <button
                                    key={stop}
                                    onClick={() => handleCopy(hex, stopNum)}
                                    className="group relative flex h-24 flex-col justify-between rounded-xl p-3 text-left transition-transform active:scale-95"
                                    style={{ backgroundColor: hex }}
                                >
                                    <div className={`text-sm font-bold ${textColor}`}>{stop}</div>
                                    <div className="flex items-center justify-between">
                                        <span className={`font-mono text-xs uppercase opacity-80 ${textColor}`}>
                                            {hex}
                                        </span>
                                        {copiedKey === stopNum && (
                                            <ClipboardDocumentCheckIcon
                                                className={`h-4 w-4 ${textColor} opacity-100`}
                                            />
                                        )}
                                        {copiedKey !== stopNum && (
                                            <div
                                                className={`rounded-md bg-black/10 p-1 opacity-0 transition-opacity group-hover:opacity-100 ${luminance > 0.5 ? 'bg-black/10' : 'bg-white/20'
                                                    }`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-3 w-3 ${textColor}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </ToolCard>
    );
}
