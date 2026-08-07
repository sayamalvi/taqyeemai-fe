'use client';

import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/resume/UploadDropzone';
import { useAllResumes } from '@/hooks/useResumeVersions';
import { FileText, Layers, ChevronRight, Loader2, Trash2, Sparkles, PlusCircle, Activity, Award, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api';
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
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen w-full text-foreground">

            {/* ─── BENTO GRID LAYOUT ─── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                {/* BENTO CARD 1: Hero Banner (Col 12) */}
                <FadeIn delay={0.05} className="md:col-span-12">
                    <div className="rounded-3xl glass-panel p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={12} />
                                    <span>Premium Audit Workspace</span>
                                </div>
                                <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                                    Resume Roster & <span className="text-primary italic font-light">Insights</span>
                                </h1>
                                <p className="text-sm font-sans text-foreground/60 leading-relaxed font-light">
                                    Upload your resumes, track version iterations, and inspect real-time ATS rubrics calibrated against top-tier FAANG benchmarks.
                                </p>
                            </div>

                            <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                                <Activity size={16} className="text-primary" />
                                <span className="text-xs font-sans font-semibold text-foreground/80">Engine Active</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* BENTO CARD 2: Total Resumes Stat (Col 4) */}
                <FadeIn delay={0.1} className="md:col-span-4">
                    <div className="h-full rounded-3xl glass-panel p-6 flex flex-col justify-between space-y-4 hover:bg-white/5 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-foreground/50">Total Resumes</span>
                            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-primary flex items-center justify-center">
                                <FileText size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="font-display tabular text-4xl font-bold text-foreground">{totalResumes}</div>
                            <div className="text-xs text-foreground/50 font-sans mt-1 flex items-center gap-1.5 font-medium">
                                <Layers size={13} className="text-primary" />
                                <span>{totalVersions} total versions generated</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* BENTO CARD 3: Average ATS Score Stat (Col 4) */}
                <FadeIn delay={0.15} className="md:col-span-4">
                    <div className="h-full rounded-3xl glass-panel p-6 flex flex-col justify-between space-y-4 hover:bg-white/5 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-foreground/50">Avg Match Rate</span>
                            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center">
                                <Award size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="font-display tabular text-4xl font-bold text-[#D4AF37]">
                                {avgScore !== null ? `${avgScore}%` : '—'}
                            </div>
                            <div className="text-xs text-foreground/50 font-sans mt-1 flex items-center gap-1.5 font-medium">
                                <TrendingUp size={13} className="text-[#D4AF37]" />
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
                    <div className="rounded-3xl glass-panel p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Your Active Roster</h2>
                                <p className="text-xs font-sans text-foreground/50 mt-0.5">Click any resume to view detailed metrics and AI rewrite suggestions.</p>
                            </div>
                            {totalResumes > 0 && (
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-semibold text-primary">
                                    {totalResumes} Active
                                </span>
                            )}
                        </div>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/5 border border-white/10">
                                <Loader2 size={28} className="animate-spin text-primary mb-3" />
                                <p className="text-xs font-sans font-medium text-foreground/50">Fetching your documents...</p>
                            </div>
                        )}

                        {!isLoading && resumes?.length === 0 && (
                            <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 premium-glow">
                                    <PlusCircle size={26} />
                                </div>
                                <h3 className="font-display text-base font-bold text-foreground">No Resumes Uploaded Yet</h3>
                                <p className="text-xs font-sans text-foreground/50 mt-1.5 max-w-sm leading-relaxed">
                                    Use the evaluation engine above to securely upload your PDF. We will parse it and initiate scoring.
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
                                        className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                                    >
                                        {/* Icon */}
                                        <div className="h-11 w-11 rounded-xl bg-black/20 border border-white/10 text-primary flex items-center justify-center shrink-0 group-hover:premium-glow transition-all">
                                            <FileText size={18} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-sans text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                {r.title}
                                            </div>
                                            <div className="text-[11px] font-sans text-foreground/50 mt-0.5 font-medium">
                                                Updated {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Score Badge */}
                                        {latestScore !== undefined && (
                                            <div className="flex flex-col items-end shrink-0 px-3 py-1.5 rounded-xl bg-black/20 border border-white/10">
                                                <span className="text-[9px] font-sans uppercase font-semibold tracking-widest text-foreground/40">Match</span>
                                                <span className="font-display text-xs font-bold text-[#D4AF37]">{latestScore}%</span>
                                            </div>
                                        )}

                                        {/* Version Tag */}
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 border border-white/10 text-xs font-sans font-semibold text-foreground/50 shrink-0">
                                            <Layers size={12} className="text-primary" />
                                            <span>v{r.versions?.length || 1}</span>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={(e) => handleDelete(e, r.id)}
                                            disabled={deleteMutation.isPending}
                                            className="h-8 w-8 rounded-lg hover:bg-[#EF4444]/20 flex items-center justify-center text-foreground/40 hover:text-[#EF4444] transition-colors shrink-0"
                                            title="Delete Resume"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        <ChevronRight size={16} className="text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
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
