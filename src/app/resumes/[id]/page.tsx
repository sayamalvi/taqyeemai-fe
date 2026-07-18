'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useResume, useAnalysisForVersion, useAnalyzeResume, useApplyRewrites } from '@/hooks/useResumeVersions';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BulletRewrites, Rewrite } from '@/components/analysis/bullet-rewrites';

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

            // Automatically switch to the newly created version!
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
            <main className="min-h-screen py-12 px-4 flex justify-center bg-bg">
                <Loader2 size={32} className="animate-spin text-accent" />
            </main>
        );
    }

    if (!resume) {
        return (
            <main className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
                <FileText size={48} className="text-ink-muted mb-4" />
                <h2 className="font-display text-xl font-bold">Resume not found</h2>
                <Link href="/" className="text-sm text-accent mt-2 hover:underline">← Back home</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-6">

                {/* Back + Title */}
                <div>
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-3">
                        <ArrowLeft size={14} /> Back to uploads
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-accent-strong">{resume.title}</h1>
                    <p className="text-sm text-ink-muted mt-1">{versions.length} version{versions.length > 1 ? 's' : ''}</p>
                </div>

                {/* Analysis Trigger Card */}
                <div className="bg-surface rounded-2xl border border-border p-6 shadow-card flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                    <div className="space-y-3 w-full sm:w-auto">
                        <div>
                            <h3 className="font-display text-lg font-bold text-accent-strong">Run Analysis</h3>
                            <p className="text-sm text-ink-muted">Score this version with AI to get actionable feedback.</p>
                        </div>
                        {/* Version Switcher */}
                        <div className="flex items-center gap-1 bg-surface-2 border border-border p-1 rounded-full w-fit">
                            {versions.map((v: any) => (
                                <button
                                    key={v.id}
                                    onClick={() => setActiveVersionId(v.id)}
                                    className={cn(
                                        'h-7 px-4 text-xs font-semibold rounded-full transition-all',
                                        activeVersionId === v.id
                                            ? 'bg-ink text-bg shadow-sm'
                                            : 'text-ink-muted hover:text-ink'
                                    )}
                                >
                                    V{v.versionNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-[400px]">
                        <Input
                            placeholder="Target Role (e.g. Frontend Engineer)"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="bg-surface-2 border-border/50"
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzeMutation.isPending || !activeVersionId}
                            className="bg-accent hover:bg-accent-strong text-white shrink-0"
                        >
                            {analyzeMutation.isPending ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Sparkles size={16} className="mr-2" />
                            )}
                            Analyze
                        </Button>
                    </div>
                </div>

                {analyzeMutation.isError && (
                    <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3">
                        Failed to analyze resume. Please try again.
                    </div>
                )}

                {/* Analysis Results Panel */}
                {isFetchingAnalysis && !analysis ? (
                    <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
                ) : analysis ? (
                    <motion.div
                        key={activeVersionId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6"
                    >
                        {/* Interview Probability & ATS Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-6 gap-4">
                            <div>
                                <h3 className="font-display text-2xl font-bold text-accent-strong">Analysis Results</h3>
                                <p className="text-sm text-ink-muted mt-1">
                                    Target: <span className="font-semibold text-ink">{analysis.targetRole || 'General'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right border-r border-border pr-6">
                                    <div className="text-xs text-ink-muted uppercase font-semibold tracking-wide">ATS Engine Match</div>
                                    <div className="font-display text-2xl font-bold text-ink flex items-center justify-end gap-2">
                                        {analysis.atsScore}/100
                                        {atsDelta !== null && atsDelta !== 0 && (
                                            <span className={cn("text-sm font-bold flex items-center", atsDelta > 0 ? "text-success" : "text-danger")}>
                                                {atsDelta > 0 ? '↑' : '↓'} {Math.abs(atsDelta)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-accent uppercase font-bold tracking-wide">Interview Probability</div>
                                    <div className="font-display text-4xl font-black text-accent-strong flex items-baseline justify-end gap-1">
                                        {analysis.interviewProbability}<span className="text-2xl">%</span>
                                        {probDelta !== null && probDelta !== 0 && (
                                            <span className={cn("text-lg font-bold ml-1 flex items-center", probDelta > 0 ? "text-success" : "text-danger")}>
                                                {probDelta > 0 ? '↑' : '↓'} {Math.abs(probDelta)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recruiter Feedback */}
                        <div className="bg-surface-2 border border-border rounded-2xl p-6 space-y-5 shadow-sm">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-accent-strong uppercase tracking-wide flex items-center gap-2">
                                    <Sparkles size={16} className="text-accent" /> Hiring Manager Verdict
                                </h4>
                                <p className="text-sm text-ink leading-relaxed">{analysis.aiVerdict}</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-5 border-t border-border/50">
                                {/* Concerns */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-danger uppercase tracking-wider">Top Concerns</h5>
                                    <ul className="space-y-2.5">
                                        {(analysis.recruiterConcerns as string[])?.map((concern, i) => (
                                            <li key={i} className="text-sm text-ink-muted flex items-start gap-2 leading-snug">
                                                <span className="text-danger font-bold mt-0.5">•</span> {concern}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Missing Skills */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-warning uppercase tracking-wider">Skills Gap</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {(analysis.missingSkills as string[])?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-semibold border border-warning/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issues (Top Fixes) */}
                        <div className="space-y-4 pt-4">
                            <h4 className="font-display text-lg font-bold text-accent-strong">
                                Top Fixes & Recommendations ({(analysis.issues as any[])?.length || 0})
                            </h4>
                            <div className="space-y-3">
                                {(analysis.issues as any[])?.map((issue: any, index: number) => (
                                    <div
                                        key={index}
                                        className="p-5 rounded-2xl border border-border bg-surface-2 flex flex-col sm:flex-row gap-4 justify-between"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    'text-xs px-2 py-0.5 rounded-md font-bold uppercase',
                                                    issue.severity === 'Critical' ? 'bg-danger/10 text-danger' :
                                                        issue.severity === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                                                )}>
                                                    {issue.severity}
                                                </span>
                                                <span className="text-xs text-ink-muted font-medium">{issue.category}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-ink mt-2">{issue.issue}</p>
                                        </div>
                                        <div className="sm:max-w-md bg-surface p-4 rounded-xl border border-border/40">
                                            <span className="text-xs font-bold text-accent uppercase">Action Item</span>
                                            <p className="text-xs text-ink-muted mt-1 leading-relaxed">{issue.fixSuggestion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rewrites */}
                        {analysis.rewrites && (analysis.rewrites as any[]).length > 0 && (
                            <div className="pt-6 border-t border-border">
                                <BulletRewrites
                                    rewrites={analysis.rewrites}
                                    isApplying={applyRewritesMutation.isPending}
                                    onApply={handleApplyRewrites}
                                />
                            </div>
                        )}

                        {/* Raw JSON for Debugging */}
                        <details className="group mt-8">
                            <summary className="text-xs text-ink-muted cursor-pointer hover:text-ink font-medium">
                                🔍 View Parsed JSON (for debugging LLM output)
                            </summary>
                            <pre className="mt-3 p-4 bg-surface-2 border border-border rounded-xl text-xs overflow-auto max-h-[400px] text-ink-muted">
                                {JSON.stringify(analysis.parsedData, null, 2)}
                            </pre>
                        </details>
                    </motion.div>
                ) : (
                    <div className="bg-surface-2 rounded-3xl border border-border p-12 flex flex-col items-center justify-center text-center space-y-3">
                        <Sparkles size={32} className="text-ink-muted" />
                        <div>
                            <p className="font-semibold text-ink">Ready to analyze</p>
                            <p className="text-sm text-ink-muted max-w-sm mt-1">Enter a target role above and click Analyze to let Gemini score your resume.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
