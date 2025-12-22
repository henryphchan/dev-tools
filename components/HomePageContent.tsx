'use client';

import { tools } from '../lib/tools';
import { GitHubIcon } from './icons';
import { LandingToolCard } from './LandingToolCard';
import { useFavorites } from '../hooks/useFavorites';

export function HomePageContent() {
    const { favorites, isLoaded } = useFavorites();
    const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

    return (
        <div className="relative isolate">
            {/* Background gradients for hero */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 pt-10 sm:pb-32 lg:flex lg:py-40 lg:items-center lg:gap-x-10 lg:justify-between">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                    <div className="flex">
                        <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition-all duration-300">
                            <span className="font-semibold text-brand">Privacy First</span>
                            <span className="h-4 w-px bg-white/10" aria-hidden="true" />
                            <div className="flex items-center gap-x-1">
                                100% Client-side. No tracking.
                            </div>
                        </div>
                    </div>
                    <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
                        The developer toolkit <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            you can trust.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        A privacy-first collection of essential tools. running entirely in your browser.
                        <br />
                        No servers, no tracking, just utility.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                        <a
                            href="#tools"
                            className="rounded-xl bg-brand/90 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all duration-300 hover:scale-105"
                        >
                            Explore Tools
                        </a>
                        <a href="https://github.com/henryphchan/dev-tools" target="_blank" className="text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-brand transition-colors">
                            <GitHubIcon className="w-5 h-5" />
                            Star on GitHub <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>

            <div id="tools" className="mx-auto max-w-7xl px-6 lg:px-8 space-y-20 pb-24">
                {isLoaded && favoriteTools.length > 0 && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Your Favorites</h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {favoriteTools.map((tool) => (
                                <LandingToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </section>
                )}

                {Object.entries(
                    tools.reduce((acc, tool) => {
                        const category = tool.badge;
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push(tool);
                        return acc;
                    }, {} as Record<string, typeof tools>)
                ).sort((a, b) => a[0].localeCompare(b[0])).map(([category, categoryTools]) => (
                    <section key={category} className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">{category}</h2>
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                                {categoryTools.length}
                            </span>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {categoryTools.map((tool) => (
                                <LandingToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </section>
                ))}

                <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 sm:p-14">
                    <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.500),theme(colors.slate.900))] opacity-20" />
                    <div className="relative max-w-2xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                            Open source and community driven
                        </h2>
                        <p className="text-lg leading-8 text-slate-300 text-balance">
                            Dev Tools is free and open source. We welcome contributions, bug reports, and feature requests.
                            Help us make developer life a little bit easier.
                        </p>
                        <div className="flex items-center justify-center gap-x-6">
                            <a
                                href="https://github.com/henryphchan/dev-tools/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                            >
                                View on GitHub
                            </a>
                            <a
                                href="https://github.com/henryphchan/dev-tools/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold leading-6 text-white hover:text-brand transition-colors"
                            >
                                Report an Issue <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
}
