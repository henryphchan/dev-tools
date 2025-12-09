'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolInfo } from '../../lib/tools';

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
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        Keycode Visualizer
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Press any key on your keyboard to see the JavaScript event code, key value, and modifiers.
                    </p>
                </div>

                {/* Main Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Active Key Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] shadow-2xl">
                            <AnimatePresence mode="wait">
                                {currentEvent ? (
                                    <motion.div
                                        key={currentEvent.timestamp}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="text-center space-y-6"
                                    >
                                        <div className="text-9xl font-black text-white tracking-tighter">
                                            {currentEvent.which}
                                        </div>
                                        <div className="text-3xl font-medium text-cyan-400">
                                            {currentEvent.code}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-500 text-2xl font-light"
                                    >
                                        Press any key...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Details & Modifiers */}
                    <div className="space-y-6">

                        {/* Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard label="event.key" value={currentEvent?.key || '-'} delay={0.1} />
                            <InfoCard label="event.code" value={currentEvent?.code || '-'} delay={0.2} />
                            <InfoCard label="event.which" value={currentEvent?.which?.toString() || '-'} delay={0.3} />
                        </div>

                        {/* Modifier Keys */}
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Modifiers</h3>
                            <div className="flex gap-4">
                                <ModifierKey label="Shift" active={currentEvent?.modifiers.shift} />
                                <ModifierKey label="Ctrl" active={currentEvent?.modifiers.ctrl} />
                                <ModifierKey label="Alt" active={currentEvent?.modifiers.alt} />
                                <ModifierKey label="Meta" active={currentEvent?.modifiers.meta} />
                            </div>
                        </div>

                        {/* History Table */}
                        {history.length > 0 && (
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 overflow-hidden">
                                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Recent Keys</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="text-slate-500 border-b border-slate-700">
                                            <tr>
                                                <th className="pb-2 font-medium">Key</th>
                                                <th className="pb-2 font-medium">Code</th>
                                                <th className="pb-2 font-medium">Which</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {history.map((evt, i) => (
                                                <tr key={evt.timestamp} className={i === 0 ? "bg-slate-700/30" : ""}>
                                                    <td className="py-2 font-mono text-cyan-300">{evt.key}</td>
                                                    <td className="py-2 text-slate-400">{evt.code}</td>
                                                    <td className="py-2 text-slate-400">{evt.which}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value, delay }: { label: string; value: string; delay: number }) {
    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between"
        >
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
            <span className="text-2xl font-bold text-white mt-1 truncate" title={value}>{value === ' ' ? '(Space)' : value}</span>
        </motion.div>
    );
}

function ModifierKey({ label, active }: { label: string; active?: boolean }) {
    return (
        <div
            className={`
        px-4 py-2 rounded-lg text-sm font-bold border transition-all duration-200
        ${active
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900 border-slate-700 text-slate-600'}
      `}
        >
            {label}
        </div>
    );
}
