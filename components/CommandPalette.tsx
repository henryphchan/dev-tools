'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { tools } from '../lib/tools';
import { MagnifyingGlassIcon } from './icons';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            // Toggle on Cmd+K or Ctrl+K
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    // Group tools by badge
    const groupedTools = tools.reduce((acc, tool) => {
        if (!acc[tool.badge]) acc[tool.badge] = [];
        acc[tool.badge].push(tool);
        return acc;
    }, {} as Record<string, typeof tools>);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 font-sans">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <Command
                className="w-full max-w-2xl bg-[#0b1224] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col"
                loop
            >
                <div className="flex items-center border-b border-white/10 px-4 shrink-0">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 mr-3" />
                    <Command.Input
                        placeholder="Search tools..."
                        className="flex-1 h-14 bg-transparent text-slate-200 placeholder:text-slate-500 text-base focus:outline-none"
                        autoFocus
                    />
                </div>

                <Command.List className="max-h-[50vh] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500">
                        No results found.
                    </Command.Empty>

                    {Object.entries(groupedTools).map(([category, categoryTools]) => (
                        <Command.Group key={category} heading={category} className="mb-2">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-[#0b1224]/95 backdrop-blur-sm z-10">
                                {category}
                            </div>
                            {categoryTools.map((tool) => (
                                <Command.Item
                                    key={tool.id}
                                    value={`${tool.title} ${tool.keywords.join(' ')}`}
                                    onSelect={() => runCommand(() => router.push(`/tools/${tool.slug}`))}
                                    className="group flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-slate-300 hover:bg-brand/10 hover:text-white aria-selected:bg-brand/10 aria-selected:text-white cursor-pointer transition-colors"
                                >
                                    <span className={`w-2 h-2 rounded-full bg-slate-700 group-aria-selected:bg-brand group-hover:bg-brand transition-colors`} />
                                    <span className="flex-1">{tool.title}</span>
                                    <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors border border-white/5 rounded px-1.5 py-0.5 max-w-[120px] truncate hidden sm:inline-block">
                                        {tool.description}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    ))}
                </Command.List>

                <div className="border-t border-white/10 px-4 py-2.5 flex items-center justify-end gap-5 bg-white/5 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Navigate</span>
                        <div className="flex gap-1">
                            <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded">↑</kbd>
                            <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded">↓</kbd>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Open</span>
                        <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded">↵</kbd>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Close</span>
                        <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded">esc</kbd>
                    </div>
                </div>
            </Command>
        </div>
    );
}
