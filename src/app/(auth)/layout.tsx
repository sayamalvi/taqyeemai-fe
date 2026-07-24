'use client';

import { ScoreRing } from '@/components/ui/score-ring';
import { Sparkles, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-bg bg-dot-grid relative flex flex-col justify-center overflow-hidden">
            {/* Split Screen Container */}
            <div className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 min-h-[90vh] flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

                    {/* Left Column (7 Cols): Product Showcase & Intro */}
                    <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-10 pr-8">
                        {/* Wordmark */}
                        <div>
                            <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                                taqyeem<span className="text-accent">.ai</span>
                            </span>
                        </div>

                        {/* Hero Text */}
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={12} />
                                <span>AI Resume Intelligence</span>
                            </div>
                            <h1 className="font-display text-4xl xl:text-5xl font-extrabold text-ink tracking-tight leading-[1.1]">
                                Beat the ATS. Land <span className="text-gradient-accent">FAANG Interviews.</span>
                            </h1>
                            <p className="text-sm text-ink-muted leading-relaxed">
                                Taqyeem.ai audits your resume against recruiter algorithms, reveals keyword gaps, and generates high-impact bullet rewrites powered by AI.
                            </p>
                        </div>

                        {/* High-Precision Product Mock Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="rounded-3xl border border-white/[0.08] bg-surface p-6 shadow-card space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-accent" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-ink">Audit Engine Engine Output</span>
                                </div>
                                <span className="text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full">
                                    Live Scoring Model
                                </span>
                            </div>

                            {/* Crisp Score Ring + Diff Card */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                {/* Score Ring Mini (No drop-shadow bug) */}
                                <div className="md:col-span-4 flex flex-col items-center justify-center bg-surface-2 border border-white/[0.06] rounded-2xl p-4">
                                    <ScoreRing
                                        value={92}
                                        label="ATS Match"
                                        sublabel="/ 100"
                                        color="accent"
                                        size={96}
                                        strokeWidth={5}
                                    />
                                    <span className="text-[10px] text-accent font-bold mt-2">↑ +18 pts vs draft</span>
                                </div>

                                {/* Live Bullet Diff Preview */}
                                <div className="md:col-span-8 space-y-2.5">
                                    <div className="rounded-xl bg-surface-2 border border-white/[0.06] p-3 text-[11px] space-y-1">
                                        <div className="text-danger font-bold uppercase tracking-wider text-[9px]">
                                            Original Bullet
                                        </div>
                                        <p className="text-ink-muted line-through opacity-70">
                                            Responsible for building frontend features using React and TypeScript.
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-accent/10 border border-accent/30 p-3 text-[11px] space-y-1">
                                        <div className="flex items-center gap-1.5 text-accent font-bold uppercase tracking-wider text-[9px]">
                                            <Sparkles size={10} />
                                            <span>AI Optimized Rewrite</span>
                                        </div>
                                        <p className="text-ink font-semibold">
                                            Architected high-throughput React/TypeScript dashboard, reducing latency by 42% for 250k MAU.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature Badges */}
                        <div className="flex items-center gap-6 text-xs font-semibold text-ink-muted flex-wrap">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-accent" />
                                <span>Multi-Tenant Data Isolation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-gold" />
                                <span>Sub-3s Realtime Audits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-accent" />
                                <span>FAANG Hiring Rubric</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (5 Cols): Centered Auth Form */}
                    <div className="lg:col-span-5 w-full flex flex-col justify-center">
                        <div className="lg:hidden mb-6 text-center">
                            <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                                taqyeem<span className="text-accent">.ai</span>
                            </span>
                        </div>
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}
