'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolInfo } from '../../lib/tools';
import ToolCard from '../ToolCard';

interface KeyEventData {
    key: string;
    code: string;
    which: number;
    modifiers: {
        ctrl: boolean;
        alt: boolean;
        shift: boolean;
        meta: boolean;
    };
    timestamp: number;
}

export function KeycodeVisualizerWorkspace({ tool }: { tool: ToolInfo }) {
    const [currentEvent, setCurrentEvent] = useState<KeyEventData | null>(null);
    const [history, setHistory] = useState<KeyEventData[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            const newEvent: KeyEventData = {
                key: e.key,
                code: e.code,
                which: e.which || e.keyCode,
                modifiers: {
                    ctrl: e.ctrlKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
                    meta: e.metaKey,
                },
                timestamp: Date.now(),
            };

            setCurrentEvent(newEvent);
            setHistory((prev) => [newEvent, ...prev].slice(0, 10));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <ToolCard title={tool.title} description={tool.description} badge={tool.badge} accent={tool.accent}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Key Display */}
                <div className="relative group min-h-[400px]">
                    <div className="absolute inset-0 bg-brand/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500" />
                    <div className="relative h-full bg-slate-900/50 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
                        <AnimatePresence mode="wait">
                            {currentEvent ? (
                                <motion.div
                                    key={currentEvent.timestamp}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="text-9xl font-black text-white tracking-tighter drop-shadow-lg">
                                        {currentEvent.which}
                                    </div>
                                    <div className="text-3xl font-medium text-brand">
                                        {currentEvent.code}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-500 text-xl font-light text-center"
                                >
                                    Press any key...
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Details & Info */}
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                        <InfoCard label="event.key" value={currentEvent?.key || '-'} />
                        <InfoCard label="event.code" value={currentEvent?.code || '-'} />
                        <InfoCard label="event.which" value={currentEvent?.which?.toString() || '-'} />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Modifiers</h3>
                        <div className="flex gap-3">
                            <ModifierKey label="Shift" active={currentEvent?.modifiers.shift} />
                            <ModifierKey label="Ctrl" active={currentEvent?.modifiers.ctrl} />
                            <ModifierKey label="Alt" active={currentEvent?.modifiers.alt} />
                            <ModifierKey label="Meta" active={currentEvent?.modifiers.meta} />
                        </div>
                    </div>

                    {history.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">History</h3>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-white/5 text-slate-400 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Key</th>
                                            <th className="px-4 py-2 font-medium">Code</th>
                                            <th className="px-4 py-2 font-medium">Which</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {history.map((evt, i) => (
                                            <tr key={evt.timestamp} className={i === 0 ? "bg-brand/10" : "hover:bg-white/5"}>
                                                <td className="px-4 py-2 font-mono text-brand-light">{evt.key === ' ' ? 'Space' : evt.key}</td>
                                                <td className="px-4 py-2 text-slate-400">{evt.code}</td>
                                                <td className="px-4 py-2 text-slate-500">{evt.which}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolCard>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between h-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
            <span className="text-xl font-bold text-white truncate" title={value}>
                {value === ' ' ? '(Space)' : value}
            </span>
        </div>
    );
}

function ModifierKey({ label, active }: { label: string; active?: boolean }) {
    return (
        <div
            className={`
        flex-1 px-3 py-2 rounded-lg text-sm font-bold border text-center transition-all duration-200
        ${active
                    ? 'bg-brand/20 border-brand text-brand shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]'
                    : 'bg-transparent border-white/10 text-slate-600'}
      `}
        >
            {label}
        </div>
    );
}
