'use client';

import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/resume/UploadDropzone';
import { useAllResumes } from '@/hooks/useResumeVersions';
import { FileText, Layers, ChevronRight, Loader2, Trash2, Sparkles, PlusCircle, Activity, Award, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import { FadeIn } from '@/components/ui/animations/fade-in';

export default function ResumesDashboard() {
    const router = useRouter();
    const { data: resumes, isLoading } = useAllResumes();
    const qc = useQueryClient();

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/resume/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['resumes'] });
        }
    });

    function handleUploaded(data: any) {
        router.push(`/resumes/${data.resume.id}`);
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this resume?")) {
            await deleteMutation.mutateAsync(id);
        }
    }

    // Calculate Stats
    const totalResumes = resumes?.length || 0;
    const totalVersions = resumes?.reduce((acc: number, r: any) => acc + (r.versions?.length || 1), 0) || 0;
    const scores = resumes?.map((r: any) => r.versions?.[0]?.analysis?.atsScore).filter((s: any) => typeof s === 'number') || [];
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;

    return (
        <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-bg">

            {/* ─── BENTO GRID LAYOUT ─── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                {/* BENTO CARD 1: Hero Banner (Col 12) */}
                <FadeIn delay={0.05} className="md:col-span-12">
                    <div className="rounded-3xl bg-surface border border-white/[0.08] p-8 md:p-10 shadow-card">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={12} />
                                    <span>AI Resume Command Center</span>
                                </div>
                                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                                    Resume Roster & <span className="text-gradient-accent">Audit Insights</span>
                                </h1>
                                <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                                    Upload your resumes, track version iterations, and inspect real-time ATS rubrics calibrated against FAANG & top startup benchmarks.
                                </p>
                            </div>

                            <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-surface-2 border border-white/[0.06]">
                                <Activity size={16} className="text-accent" />
                                <span className="text-xs font-semibold text-ink">Engine Active</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* BENTO CARD 2: Total Resumes Stat (Col 4) */}
                <FadeIn delay={0.1} className="md:col-span-4">
                    <div className="h-full rounded-3xl bg-surface border border-white/[0.08] p-6 shadow-card flex flex-col justify-between space-y-4 hover:bg-surface-2 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Total Resumes</span>
                            <div className="h-10 w-10 rounded-2xl bg-surface-2 border border-white/[0.06] text-accent flex items-center justify-center">
                                <FileText size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="font-display tabular text-4xl font-extrabold text-ink">{totalResumes}</div>
                            <div className="text-xs text-ink-muted mt-1 flex items-center gap-1.5 font-medium">
                                <Layers size={13} className="text-accent" />
                                <span>{totalVersions} total versions generated</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* BENTO CARD 3: Average ATS Score Stat (Col 4) */}
                <FadeIn delay={0.15} className="md:col-span-4">
                    <div className="h-full rounded-3xl bg-surface border border-white/[0.08] p-6 shadow-card flex flex-col justify-between space-y-4 hover:bg-surface-2 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Average ATS Score</span>
                            <div className="h-10 w-10 rounded-2xl bg-surface-2 border border-white/[0.06] text-gold flex items-center justify-center">
                                <Award size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="font-display tabular text-4xl font-extrabold text-gold">
                                {avgScore !== null ? `${avgScore}/100` : '—'}
                            </div>
                            <div className="text-xs text-ink-muted mt-1 flex items-center gap-1.5 font-medium">
                                <TrendingUp size={13} className="text-gold" />
                                <span>{scores.length > 0 ? 'Across audited resumes' : 'Upload a resume to score'}</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* BENTO CARD 4: Upload Dropzone Spotlight (Col 4) */}
                <FadeIn delay={0.2} className="md:col-span-4">
                    <UploadDropzone onUploaded={handleUploaded} />
                </FadeIn>

                {/* BENTO CARD 5: Resumes Roster List (Col 12) */}
                <FadeIn delay={0.25} className="md:col-span-12">
                    <div className="rounded-3xl bg-surface border border-white/[0.08] p-6 md:p-8 shadow-card space-y-6">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                            <div>
                                <h2 className="font-display text-xl font-bold text-ink tracking-tight">Your Resume Roster</h2>
                                <p className="text-xs text-ink-muted mt-0.5">Click any resume to view versions, scores, and AI bullet rewrites</p>
                            </div>
                            {totalResumes > 0 && (
                                <span className="px-3 py-1 rounded-full bg-surface-2 border border-white/[0.06] text-xs font-semibold text-accent">
                                    {totalResumes} Active
                                </span>
                            )}
                        </div>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 bg-surface-2 rounded-2xl border border-white/[0.06]">
                                <Loader2 size={28} className="animate-spin text-accent mb-3" />
                                <p className="text-xs font-medium text-ink-muted">Loading your resume roster...</p>
                            </div>
                        )}

                        {!isLoading && resumes?.length === 0 && (
                            <div className="flex flex-col items-center text-center py-16 px-6 bg-surface-2 border border-white/[0.06] rounded-2xl">
                                <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-4">
                                    <PlusCircle size={26} />
                                </div>
                                <h3 className="font-display text-base font-bold text-ink">No Resumes Uploaded Yet</h3>
                                <p className="text-xs text-ink-muted mt-1.5 max-w-sm leading-relaxed">
                                    Use the dropzone above to upload your first PDF resume. We will parse it and start scoring!
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!isLoading && resumes?.map((r: any) => {
                                const latestVersion = r.versions?.[0];
                                const latestScore = latestVersion?.analysis?.atsScore;

                                return (
                                    <div
                                        key={r.id}
                                        onClick={() => router.push(`/resumes/${r.id}`)}
                                        className="group relative flex items-center gap-4 bg-surface-2 hover:bg-[#1C1F2E] p-5 rounded-2xl border border-white/[0.06] hover:border-accent/40 shadow-card transition-all duration-200 cursor-pointer"
                                    >
                                        {/* Icon */}
                                        <div className="h-11 w-11 rounded-xl bg-surface border border-white/[0.08] text-accent flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-display text-sm font-semibold text-ink truncate group-hover:text-accent transition-colors">
                                                {r.title}
                                            </div>
                                            <div className="text-[11px] text-ink-muted mt-0.5 font-medium">
                                                Updated {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Score Badge */}
                                        {latestScore !== undefined && (
                                            <div className="flex flex-col items-end shrink-0 px-2.5 py-1 rounded-xl bg-surface border border-white/[0.06]">
                                                <span className="text-[9px] uppercase font-bold tracking-wider text-ink-muted">ATS Score</span>
                                                <span className="font-display text-xs font-bold text-accent">{latestScore}/100</span>
                                            </div>
                                        )}

                                        {/* Version Tag */}
                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface border border-white/[0.06] text-xs font-semibold text-ink-muted shrink-0">
                                            <Layers size={12} className="text-accent" />
                                            <span>v{r.versions?.length || 1}</span>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={(e) => handleDelete(e, r.id)}
                                            disabled={deleteMutation.isPending}
                                            className="h-8 w-8 rounded-lg hover:bg-danger/20 flex items-center justify-center text-ink-muted hover:text-danger transition-colors shrink-0"
                                            title="Delete Resume"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        <ChevronRight size={16} className="text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>

            </div>
        </main>
    );
}
