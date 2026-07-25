'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Sparkles, Loader2, Target, AlertTriangle, ChevronDown, Download } from 'lucide-react';
import { useResume, useAnalysisForVersion, useAnalyzeResume, useApplyRewrites, useGenerateLatex, useDownloadPdf } from '@/hooks/useResumeVersions';
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

    useEffect(() => {
        if (!activeVersionId && versions.length) {
            setActiveVersionId(versions[versions.length - 1].id);
        }
    }, [versions, activeVersionId]);

    const { data: analysisData, isFetching: isFetchingAnalysis } = useAnalysisForVersion(id, activeVersionId || '');
    const analysis = analysisData?.analysis;

    const currentVersionIndex = versions.findIndex((v: any) => v.id === activeVersionId);
    const previousVersionId = currentVersionIndex > 0 ? versions[currentVersionIndex - 1].id : '';
    const { data: prevAnalysisData } = useAnalysisForVersion(id, previousVersionId);
    const prevAnalysis = prevAnalysisData?.analysis;

    const atsDelta = prevAnalysis && analysis ? Math.round((analysis.atsScore - prevAnalysis.atsScore) * 10) / 10 : null;
    const probDelta = prevAnalysis && analysis ? analysis.interviewProbability - prevAnalysis.interviewProbability : null;

    const generateLatexMutation = useGenerateLatex(id);
    const [copied, setCopied] = useState(false);

    const downloadPdfMutation = useDownloadPdf(id);

    async function handleDownloadPdf() {
        if (!activeVersionId) return;
        await downloadPdfMutation.mutateAsync(activeVersionId);
    }

    async function handleGenerateLatex() {
        if (!activeVersionId) return;
        await generateLatexMutation.mutateAsync(activeVersionId);
    }

    function handleCopyLatex(code: string) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleAnalyze() {
        if (!activeVersionId) return;
        analyzeMutation.mutate({
            versionId: activeVersionId,
            targetRole: targetRole.trim() || undefined,
        });
    }

    if (isLoading) {
        return (
            <main className="min-h-screen py-24 px-4 flex flex-col items-center justify-center text-foreground">
                <Loader2 size={32} className="animate-spin text-primary mb-3" />
                <p className="text-xs text-foreground/50 font-sans font-medium">Loading document...</p>
            </main>
        );
    }

    if (!resume) {
        return (
            <main className="min-h-screen py-24 px-4 flex flex-col items-center justify-center text-center text-foreground">
                <div className="h-14 w-14 rounded-2xl glass-panel flex items-center justify-center text-foreground/50 mb-4">
                    <FileText size={28} />
                </div>
                <h2 className="font-display text-xl font-bold">Document Not Found</h2>
                <p className="text-xs font-sans text-foreground/50 mt-1 max-w-xs">The requested file does not exist or you do not have permission to view it.</p>
                <Link href="/resumes" className="mt-5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">
                    ← Return to Roster
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-foreground">

            <FadeIn delay={0.05}>
                <div className="space-y-4">
                    <Link href="/resumes" className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-foreground/50 hover:text-primary transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Resumes</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-display text-3xl font-bold tracking-tight">{resume.title}</h1>
                            <div className="flex items-center gap-3 mt-1.5 text-xs font-sans text-foreground/60 font-medium">
                                <span className="flex items-center gap-1 text-primary font-semibold">
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

            <FadeIn delay={0.1}>
                <div className="glass-panel rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <h3 className="font-display text-base font-bold tracking-tight">Version Control</h3>
                        </div>

                        <div className="flex items-center gap-1.5 bg-black/20 border border-white/10 p-1.5 rounded-2xl w-fit">
                            {versions.map((v: any) => (
                                <button
                                    key={v.id}
                                    onClick={() => setActiveVersionId(v.id)}
                                    className={cn(
                                        'h-8 px-4 text-xs font-sans font-semibold rounded-xl transition-all duration-200',
                                        activeVersionId === v.id
                                            ? 'bg-primary text-white premium-glow'
                                            : 'text-foreground/50 hover:text-foreground'
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

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-[450px]">
                        <div className="relative w-full">
                            <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                            <Input
                                placeholder="Target Role (e.g. Lead Frontend Engineer)"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="pl-9 h-11 bg-black/40 border-white/10 text-sm font-sans rounded-xl focus:border-primary text-foreground placeholder:text-foreground/30 transition-all"
                            />
                        </div>
                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzeMutation.isPending || !activeVersionId}
                            className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-primary/90 text-white font-sans font-semibold rounded-xl transition-all duration-200 shrink-0 text-xs premium-glow"
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
                <div className="text-xs font-sans text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-2xl px-4 py-3 text-center font-medium">
                    Failed to analyze resume. Please try again.
                </div>
            )}

            {isFetchingAnalysis && !analysis ? (
                <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-3xl">
                    <Loader2 size={28} className="animate-spin text-primary mb-3" />
                    <p className="text-xs font-sans font-medium text-foreground/50">Evaluating resume against ATS algorithms...</p>
                </div>
            ) : analysis ? (
                <motion.div
                    key={activeVersionId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    <div className="glass-panel rounded-3xl p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={12} />
                                    <span>Audit Report · v{versions.find((v: any) => v.id === activeVersionId)?.versionNumber || 1}</span>
                                </div>
                                <h2 className="font-display text-2xl font-bold tracking-tight">
                                    Evaluation Metrics
                                </h2>
                                <p className="text-xs font-sans text-foreground/60 max-w-sm leading-relaxed">
                                    Scored against target role <span className="font-semibold text-primary">{analysis.targetRole || 'General'}</span>.
                                </p>
                            </div>

                            <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
                                <div className="relative">
                                    <ScoreRing
                                        value={analysis.atsScore}
                                        label="ATS Match"
                                        sublabel="/ 100"
                                        color="accent"
                                        size={110}
                                        strokeWidth={6}
                                    />
                                    {atsDelta !== null && atsDelta !== 0 && (
                                        <div className={cn(
                                            "mt-1 text-center font-sans text-xs font-bold flex items-center justify-center gap-0.5",
                                            atsDelta > 0 ? "text-[#10B981]" : "text-[#EF4444]"
                                        )}>
                                            <span>{atsDelta > 0 ? '↑' : '↓'}</span>
                                            <span>{Math.abs(atsDelta)} pts vs prev</span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-16 w-px bg-white/10 hidden sm:block" />

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
                                            "mt-1 text-center font-sans text-xs font-bold flex items-center justify-center gap-0.5",
                                            probDelta > 0 ? "text-[#10B981]" : "text-[#EF4444]"
                                        )}>
                                            <span>{probDelta > 0 ? '↑' : '↓'}</span>
                                            <span>{Math.abs(probDelta)}% vs prev</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-sans font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={14} />
                                <span>Executive Summary</span>
                            </h3>
                            <p className="text-sm font-sans text-foreground leading-relaxed font-light">
                                {analysis.aiVerdict}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#EF4444] uppercase tracking-wider">
                                    <AlertTriangle size={14} />
                                    <span>Critical Concerns</span>
                                </div>
                                <ul className="space-y-2">
                                    {(analysis.recruiterConcerns as string[])?.map((concern, i) => (
                                        <li key={i} className="text-xs font-sans text-foreground/80 flex items-start gap-2.5 leading-relaxed bg-[#EF4444]/5 border border-[#EF4444]/10 p-3 rounded-xl">
                                            <span className="text-[#EF4444] font-bold mt-0.5">•</span>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#D4AF37] uppercase tracking-wider">
                                    <Target size={14} />
                                    <span>Skills & Keyword Gap</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(analysis.missingSkills as string[])?.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-sans font-semibold border border-[#D4AF37]/20 flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                                            <span>{skill}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-display text-lg font-bold">
                                Actionable Recommendations ({(analysis.issues as any[])?.length || 0})
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {(analysis.issues as any[])?.map((issue: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:bg-white/5 transition-colors duration-200"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                'text-[10px] font-sans px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
                                                issue.severity === 'Critical' ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30' :
                                                    issue.severity === 'Medium' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-primary/15 text-primary border border-primary/30'
                                            )}>
                                                {issue.severity}
                                            </span>
                                            <span className="text-xs font-sans text-foreground/50 font-medium">{issue.category}</span>
                                        </div>
                                        <p className="text-sm font-sans font-medium text-foreground leading-relaxed">{issue.issue}</p>
                                    </div>

                                    <div className="w-full md:max-w-md bg-black/20 p-4 rounded-2xl border border-white/10 space-y-1">
                                        <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-wider">Suggested Fix</span>
                                        <p className="text-xs font-sans text-foreground/70 leading-relaxed font-light">{issue.fixSuggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {analysis.rewrites && (analysis.rewrites as any[]).length > 0 && (
                        <div className="pt-4">
                            <BulletRewrites
                                rewrites={analysis.rewrites}
                                isApplying={applyRewritesMutation.isPending}
                                onApply={handleApplyRewrites}
                            />
                        </div>
                    )}
                    {/* LaTeX Generator Section */}
                    {/* <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                                    <FileText size={18} className="text-primary" />
                                    ATS-Optimized LaTeX Export
                                </h3>
                                <p className="text-xs font-sans text-foreground/50 mt-1">
                                    Generate a clean, single-column LaTeX resume guaranteed to parse perfectly in modern ATS systems.
                                </p>
                            </div>

                            {!analysis.latexCode ? (
                                <Button
                                    onClick={handleGenerateLatex}
                                    disabled={generateLatexMutation.isPending}
                                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl premium-glow"
                                >
                                    {generateLatexMutation.isPending ? (
                                        <><Loader2 size={14} className="animate-spin mr-2" /> Generating...</>
                                    ) : (
                                        <><Sparkles size={14} className="mr-2" /> Generate LaTeX</>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleCopyLatex(analysis.latexCode)}
                                    variant="outline"
                                    className="border-primary/20 text-primary hover:bg-primary/10 text-xs font-semibold rounded-xl"
                                >
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </Button>
                            )}
                        </div>

                        {analysis.latexCode && (
                            <div className="relative mt-4">
                                <pre className="p-4 bg-black/40 border border-white/10 rounded-2xl text-[10px] sm:text-[11px] overflow-auto max-h-[400px] text-foreground/80 font-mono custom-scrollbar">
                                    {analysis.latexCode}
                                </pre>
                            </div>
                        )}
                    </div> */}
                    {/* PDF Download Section */}
                    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                                    <FileText size={18} className="text-primary" />
                                    ATS-Optimized PDF Export
                                </h3>
                                <p className="text-xs font-sans text-foreground/50 mt-1">
                                    Download a clean, single-column PDF resume guaranteed to parse perfectly in modern ATS systems.
                                </p>
                            </div>

                            <Button
                                onClick={handleDownloadPdf}
                                disabled={downloadPdfMutation.isPending}
                                className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl premium-glow"
                            >
                                {downloadPdfMutation.isPending ? (
                                    <><Loader2 size={14} className="animate-spin mr-2" /> Compiling...</>
                                ) : (
                                    <><Download size={14} className="mr-2" /> Download PDF</>
                                )}
                            </Button>
                        </div>
                    </div>

                    <details className="group mt-8">
                        <summary className="text-xs font-sans text-foreground/40 cursor-pointer hover:text-foreground/80 font-medium inline-flex items-center gap-1.5 transition-colors">
                            <span>Inspect Raw Evaluation Data</span>
                            <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                        </summary>
                        <pre className="mt-3 p-5 bg-black/40 border border-white/10 rounded-2xl text-[11px] overflow-auto max-h-[400px] text-foreground/50 font-mono">
                            {JSON.stringify(analysis.parsedData, null, 2)}
                        </pre>
                    </details>
                </motion.div>
            ) : (
                <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary premium-glow">
                        <Sparkles size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-display text-base font-bold">Ready for Evaluation</h3>
                        <p className="text-xs font-sans text-foreground/60 max-w-sm">Enter a target role in the top bar and click Run AI Audit to calculate your metrics.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
