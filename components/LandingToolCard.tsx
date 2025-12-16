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
        <div className="group relative block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand/40 hover:bg-brand/5 transition h-full">
            <Link
                href={`/tools/${tool.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`Open ${tool.title}`}
            />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4 pointer-events-none">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold">{tool.accent}</span>
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className="badge group-hover:bg-brand/20 group-hover:text-brand transition-colors">{tool.badge}</span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(tool.id, e);
                                }}
                                className="text-slate-400 hover:text-brand transition-colors p-1 -mr-1"
                                type="button"
                            >
                                {favorite ? <HeartSolidIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand transition-colors">{tool.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{tool.description}</p>
                </div>

            </div>
        </div>
    );
}
