'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bars3Icon } from './icons';
import { CommandPalette } from './CommandPalette';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0b1224] text-slate-200">
            <CommandPalette />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#0b1224]/80 backdrop-blur-md px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-white/10">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-slate-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-white">Dev Tools</div>
                </div>

                <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand/10 via-brand/5 to-transparent blur-3xl pointer-events-none" aria-hidden />

                <main className="flex-1 relative z-10 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
