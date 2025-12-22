'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0b1224] text-slate-200 p-6 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6 pt-10"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Built for Developers
                        </span>
                        <br />
                        <span className="text-slate-100">by Developers</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Fast, privacy-focused, and offline-capable utilities.
                        No tracking, no server side processing — just client side.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-3 gap-6"
                >
                    <FeatureCard
                        variants={item}
                        title="Privacy First"
                        description="100% client-side execution. Your data never leaves your browser."
                        icon={
                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        }
                    />
                    <FeatureCard
                        variants={item}
                        title="Offline Capable"
                        description="Works without internet. Load once, use anywhere."
                        icon={
                            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                            </svg>
                        }
                    />
                    <FeatureCard
                        variants={item}
                        title="Lightning Fast"
                        description="Zero latency. Built with modern web technologies for peak performance."
                        icon={
                            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        }
                    />
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                >
                    <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                        Under the Hood
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div> Next.js
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-sky-400"></div> Tailwind CSS
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> TypeScript
                        </div>
                    </div>
                </motion.div>

                {/* Footer Credits */}
                <div className="text-center text-slate-500 text-sm">
                    <p>
                        Created by <a href="https://henrychan.tech" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Henry Chan</a>
                    </p>
                    <p className="mt-2">
                        <a href="https://github.com/henryphchan/dev-tools" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
                            Open Source on GitHub
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}

function FeatureCard({ title, description, icon, variants }: { title: string, description: string, icon: React.ReactNode, variants: any }) {
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -5, borderColor: 'rgba(14, 165, 233, 0.5)' }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm transition-colors duration-300"
        >
            <div className="mb-4 bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
}
