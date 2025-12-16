'use client';

import Link from 'next/link';
import { ToolInfo } from '../lib/tools';
import { HeartIcon, HeartSolidIcon } from './icons';
import { useFavorites } from '../hooks/useFavorites';

interface LandingToolCardProps {
    tool: ToolInfo;
}

export function LandingToolCard({ tool }: LandingToolCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(tool.id);

    return (
        <div className="group relative block h-full">
            {/* Hover gradient background effect */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/50 to-indigo-500/50 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md" aria-hidden="true" />

            <div className="relative h-full flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-colors group-hover:bg-slate-900/80">
                <Link
                    href={`/tools/${tool.slug}`}
                    className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label={`Open ${tool.title}`}
                />

                <div className="relative z-10 flex flex-col gap-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Small accent pill */}
                            <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-white/10 group-hover:text-indigo-200 transition-colors">
                                {tool.accent}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(tool.id, e);
                            }}
                            className="pointer-events-auto p-2 -mr-2 text-slate-500 hover:text-red-500 transition-colors bg-transparent rounded-full hover:bg-white/5"
                            type="button"
                            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {favorite ? <HeartSolidIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors tracking-tight">
                            {tool.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                            {tool.description}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-brand text-sm font-semibold flex items-center">
                        Open Tool <span className="ml-1">→</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
