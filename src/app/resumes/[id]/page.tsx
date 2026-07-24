'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Sparkles, Loader2, Target, AlertTriangle, ChevronDown } from 'lucide-react';
import { useResume, useAnalysisForVersion, useAnalyzeResume, useApplyRewrites } from '@/hooks/useResumeVersions';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BulletRewrites, Rewrite } from '@/components/analysis/bullet-rewrites';
import { ScoreRing } from '@/components/ui/score-ring';
import { FadeIn } from '@/components/ui/animations/fade-in';

export default function ResumeDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: resume, isLoading } = useResume(id);
    const versions = resume?.versions || [];

    const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
    const [targetRole, setTargetRole] = useState('');

    const analyzeMutation = useAnalyzeResume(id);
    const applyRewritesMutation = useApplyRewrites(id);

    async function handleApplyRewrites(selectedRewrites: Rewrite[]) {
        if (!activeVersionId) return;

        try {
            const data = await applyRewritesMutation.mutateAsync({
                baseVersionId: activeVersionId,
                rewrites: selectedRewrites.map(r => ({ original: r.original, rewritten: r.rewritten }))
            });

            setActiveVersionId(data.version.id);
        } catch (error) {
            console.error("Failed to apply rewrites", error);
        }
    }

    // Auto-select latest version when data loads
    useEffect(() => {
        if (!activeVersionId && versions.length) {
            setActiveVersionId(versions[versions.length - 1].id);
        }
    }, [versions, activeVersionId]);

    const { data: analysisData, isFetching: isFetchingAnalysis } = useAnalysisForVersion(id, activeVersionId || '');
    const analysis = analysisData?.analysis;

    // Calculate Deltas
    const currentVersionIndex = versions.findIndex((v: any) => v.id === activeVersionId);
    const previousVersionId = currentVersionIndex > 0 ? versions[currentVersionIndex - 1].id : '';
    const { data: prevAnalysisData } = useAnalysisForVersion(id, previousVersionId);
    const prevAnalysis = prevAnalysisData?.analysis;

    const atsDelta = prevAnalysis && analysis ? Math.round((analysis.atsScore - prevAnalysis.atsScore) * 10) / 10 : null;
    const probDelta = prevAnalysis && analysis ? analysis.interviewProbability - prevAnalysis.interviewProbability : null;

    function handleAnalyze() {
        if (!activeVersionId) return;
        analyzeMutation.mutate({
            versionId: activeVersionId,
            targetRole: targetRole.trim() || undefined,
        });
    }

    if (isLoading) {
        return (
            <main className="min-h-screen py-24 px-4 flex flex-col items-center justify-center bg-bg">
                <Loader2 size={32} className="animate-spin text-accent mb-3" />
                <p className="text-xs text-ink-muted font-medium">Loading resume workstation...</p>
            </main>
        );
    }

    if (!resume) {
        return (
            <main className="min-h-screen py-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-surface border border-white/[0.08] flex items-center justify-center text-ink-muted mb-4">
                    <FileText size={28} />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Resume Not Found</h2>
                <p className="text-xs text-ink-muted mt-1 max-w-xs">The requested resume does not exist or you do not have permission to view it.</p>
                <Link href="/resumes" className="mt-5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold hover:bg-accent/20 transition-all">
                    ← Return to Roster
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 bg-bg">
            
            {/* Top Navigation & Title Header */}
            <FadeIn delay={0.05}>
                <div className="space-y-4">
                    <Link href="/resumes" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-accent transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Resumes</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">{resume.title}</h1>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted font-medium">
                                <span className="flex items-center gap-1 text-accent font-semibold">
                                    <FileText size={14} />
                                    <span>{versions.length} Version{versions.length > 1 ? 's' : ''} Created</span>
                                </span>
                                <span>·</span>
                                <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Version Selector & Run Analysis Bar */}
            <FadeIn delay={0.1}>
                <div className="bg-surface rounded-3xl border border-white/[0.08] p-6 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            <h3 className="font-display text-base font-bold text-ink tracking-tight">Version Control Workstation</h3>
                        </div>
                        
                        {/* Pill Version Switcher */}
                        <div className="flex items-center gap-1.5 bg-surface-2 border border-white/[0.06] p-1.5 rounded-2xl w-fit">
                            {versions.map((v: any) => (
                                <button
                                    key={v.id}
                                    onClick={() => setActiveVersionId(v.id)}
                                    className={cn(
                                        'h-8 px-4 text-xs font-semibold rounded-xl transition-all duration-200',
                                        activeVersionId === v.id
                                            ? 'bg-accent text-bg font-bold'
                                            : 'text-ink-muted hover:text-ink'
                                    )}
                                >
                                    v{v.versionNumber}
                                    {v.source === 'ai_rewrite' && (
                                        <span className="ml-1 text-[9px] opacity-80">(AI)</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target Role & Run Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-[450px]">
                        <div className="relative w-full">
                            <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <Input
                                placeholder="Target Role (e.g. Lead Frontend Engineer)"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="pl-9 h-11 bg-surface-2 border-white/[0.08] text-xs rounded-xl focus:border-accent text-ink placeholder:text-ink-muted/50"
                            />
                        </div>
                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzeMutation.isPending || !activeVersionId}
                            className="w-full sm:w-auto h-11 px-6 bg-accent hover:bg-accent-strong text-bg font-semibold rounded-xl transition-colors duration-200 shrink-0 text-xs"
                        >
                            {analyzeMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Auditing...</span>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Sparkles size={15} />
                                    <span>Run AI Audit</span>
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {analyzeMutation.isError && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3 text-center font-medium">
                    Failed to analyze resume. Please try again.
                </div>
            )}

            {/* Analysis Results Panel */}
            {isFetchingAnalysis && !analysis ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-white/[0.08]">
                    <Loader2 size={28} className="animate-spin text-accent mb-3" />
                    <p className="text-xs font-medium text-ink-muted">Evaluating resume against ATS algorithms...</p>
                </div>
            ) : analysis ? (
                <motion.div
                    key={activeVersionId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    {/* Score Ring Hero Section (Cleaned, no bounding-box drop-shadow bug) */}
                    <div className="bg-surface rounded-3xl border border-white/[0.08] p-8 shadow-card">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={12} />
                                    <span>Audit Report · v{versions.find((v: any) => v.id === activeVersionId)?.versionNumber || 1}</span>
                                </div>
                                <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">
                                    Evaluation Metrics
                                </h2>
                                <p className="text-xs text-ink-muted max-w-sm leading-relaxed">
                                    Scored against target role <span className="font-semibold text-accent">{analysis.targetRole || 'General'}</span>.
                                </p>
                            </div>

                            {/* Dual Score Rings (Crisp vector gradients, no drop shadow bug) */}
                            <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
                                {/* ATS Score Ring */}
                                <div className="relative">
                                    <ScoreRing
                                        value={analysis.atsScore}
                                        label="ATS Engine Match"
                                        sublabel="/ 100"
                                        color="accent"
                                        size={110}
                                        strokeWidth={6}
                                    />
                                    {atsDelta !== null && atsDelta !== 0 && (
                                        <div className={cn(
                                            "mt-1 text-center text-xs font-bold flex items-center justify-center gap-0.5",
                                            atsDelta > 0 ? "text-success" : "text-danger"
                                        )}>
                                            <span>{atsDelta > 0 ? '↑' : '↓'}</span>
                                            <span>{Math.abs(atsDelta)} pts vs prev</span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-16 w-px bg-white/[0.08] hidden sm:block" />

                                {/* Interview Probability Ring */}
                                <div className="relative">
                                    <ScoreRing
                                        value={analysis.interviewProbability}
                                        label="Interview Probability"
                                        sublabel="%"
                                        color="gold"
                                        size={110}
                                        strokeWidth={6}
                                    />
                                    {probDelta !== null && probDelta !== 0 && (
                                        <div className={cn(
                                            "mt-1 text-center text-xs font-bold flex items-center justify-center gap-0.5",
                                            probDelta > 0 ? "text-success" : "text-danger"
                                        )}>
                                            <span>{probDelta > 0 ? '↑' : '↓'}</span>
                                            <span>{Math.abs(probDelta)}% vs prev</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hiring Manager Verdict Banner */}
                    <div className="bg-surface rounded-3xl border border-white/[0.08] p-6 md:p-8 shadow-card space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={14} />
                                <span>Hiring Manager Verdict</span>
                            </h3>
                            <p className="text-xs md:text-sm text-ink leading-relaxed font-medium">
                                {analysis.aiVerdict}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.06]">
                            {/* Concerns */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-danger uppercase tracking-wider">
                                    <AlertTriangle size={14} />
                                    <span>Top Recruiter Concerns</span>
                                </div>
                                <ul className="space-y-2">
                                    {(analysis.recruiterConcerns as string[])?.map((concern, i) => (
                                        <li key={i} className="text-xs text-ink-muted flex items-start gap-2.5 leading-relaxed bg-danger/5 border border-danger/10 p-3 rounded-xl">
                                            <span className="text-danger font-bold mt-0.5">•</span>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Missing Skills Gap */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
                                    <Target size={14} />
                                    <span>Skills & Keyword Gap</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(analysis.missingSkills as string[])?.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-xl bg-gold/10 text-gold text-xs font-semibold border border-gold/20 flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                                            <span>{skill}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Action Items & Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-display text-lg font-bold text-ink">
                                Top Actionable Fixes ({(analysis.issues as any[])?.length || 0})
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {(analysis.issues as any[])?.map((issue: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-3xl border border-white/[0.08] bg-surface flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:bg-surface-2 transition-colors duration-200"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                'text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                                                issue.severity === 'Critical' ? 'bg-danger/15 text-danger border border-danger/30' :
                                                    issue.severity === 'Medium' ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-success/15 text-success border border-success/30'
                                            )}>
                                                {issue.severity}
                                            </span>
                                            <span className="text-xs text-ink-muted font-medium">{issue.category}</span>
                                        </div>
                                        <p className="text-xs md:text-sm font-semibold text-ink leading-relaxed">{issue.issue}</p>
                                    </div>

                                    <div className="w-full md:max-w-md bg-surface-2 p-4 rounded-2xl border border-white/[0.06] space-y-1">
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Fix Suggestion</span>
                                        <p className="text-xs text-ink-muted leading-relaxed">{issue.fixSuggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Bullet Rewrites Component */}
                    {analysis.rewrites && (analysis.rewrites as any[]).length > 0 && (
                        <div className="pt-4">
                            <BulletRewrites
                                rewrites={analysis.rewrites}
                                isApplying={applyRewritesMutation.isPending}
                                onApply={handleApplyRewrites}
                            />
                        </div>
                    )}

                    {/* Raw JSON Inspect */}
                    <details className="group mt-8">
                        <summary className="text-xs text-ink-muted cursor-pointer hover:text-ink font-semibold inline-flex items-center gap-1.5">
                            <span>Inspect Parsed Structured JSON</span>
                            <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                        </summary>
                        <pre className="mt-3 p-5 bg-surface-2 border border-white/[0.08] rounded-2xl text-[11px] overflow-auto max-h-[400px] text-ink-muted font-mono">
                            {JSON.stringify(analysis.parsedData, null, 2)}
                        </pre>
                    </details>
                </motion.div>
            ) : (
                <div className="bg-surface rounded-3xl border border-white/[0.08] p-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Sparkles size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-display text-base font-bold text-ink">Ready for AI Audit</h3>
                        <p className="text-xs text-ink-muted max-w-sm">Enter a target role in the top bar and click Run AI Audit to calculate your ATS Score and Interview Probability.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
