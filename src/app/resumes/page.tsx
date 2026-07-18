'use client';

import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/resume/UploadDropzone';
import { useAllResumes } from '@/hooks/useResumeVersions';
import { FileText, Layers, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';

export default function ResumesDashboard() {
    const router = useRouter();
    const { data: resumes, isLoading } = useAllResumes();
    const qc = useQueryClient();

    // 1. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/resume/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['resumes'] });
        }
    });

    function handleUploaded(data: any) {
        // FIXED routing to match your /resumes/[id] folder structure!
        router.push(`/resumes/${data.resume.id}`);
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation(); // prevent card click when clicking trash
        if (confirm("Are you sure you want to delete this resume?")) {
            await deleteMutation.mutateAsync(id);
        }
    }

    return (
        <main className="p-8 max-w-6xl mx-auto space-y-6">

            {/* Top Greeting */}
            <div className="mb-10">
                <h1 className="font-display text-4xl font-black text-accent-strong tracking-tight">Hello, Sayam.</h1>
                <p className="text-sm text-ink-muted mt-2">Sharpen your resume with calm, focused AI insights.</p>
            </div>

            {/* Header */}
            <div>
                <h2 className="font-display text-2xl font-bold text-accent-strong">Your Resumes</h2>
                <p className="text-sm text-ink-muted mt-1">Upload a new one or pick up where you left off.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: Upload Column (Col-5) */}
                <div className="lg:col-span-5">
                    <div className="bg-surface rounded-[24px] border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-ink text-base mb-1">Upload a resume</h3>
                        <p className="text-xs text-ink-muted mb-6">PDF only. We extract the text and create version V1.</p>
                        <UploadDropzone onUploaded={handleUploaded} />
                    </div>
                </div>

                {/* Right Side: Resumes List Column (Col-7) */}
                <div className="lg:col-span-7 space-y-3">
                    {isLoading && (
                        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
                    )}

                    {!isLoading && resumes?.length === 0 && (
                        <div className="flex flex-col items-center text-center py-16 bg-surface border border-border rounded-[24px] shadow-sm">
                            <div className="h-14 w-14 rounded-2xl bg-[#E8F3EB] text-[#2E6B4E] flex items-center justify-center mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-display text-xl font-bold tracking-tight text-ink">No resumes yet</h3>
                            <p className="text-sm text-ink-muted mt-1.5 max-w-sm leading-relaxed">
                                Drop your first PDF on the left to get started — we'll parse it, score it, and suggest stronger bullets.
                            </p>
                        </div>
                    )}


                    {!isLoading && resumes?.map((r: any) => (
                        <div
                            key={r.id}
                            onClick={() => router.push(`/resumes/${r.id}`)}
                            className="cursor-pointer flex items-center gap-4 bg-surface p-4 rounded-[24px] border border-border hover:border-accent/40 shadow-sm transition-all group"
                        >
                            {/* Icon block matching screenshot */}
                            <div className="h-12 w-12 rounded-xl bg-[#E8F3EB] text-[#2E6B4E] flex items-center justify-center shrink-0">
                                <FileText size={18} />
                            </div>

                            {/* Text Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-display text-sm font-semibold text-ink truncate group-hover:text-accent transition-colors">
                                    {r.title}
                                </div>
                                <div className="text-[11px] text-ink-muted mt-0.5">
                                    Updated {new Date(r.updatedAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Version Badge matching screenshot */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg border border-border/50 text-[11px] font-medium text-ink-muted shrink-0">
                                <Layers size={11} />
                                {r.versions?.length || 1} version{(r.versions?.length || 1) !== 1 ? 's' : ''}
                            </div>

                            {/* Trash Icon */}
                            <button
                                onClick={(e) => handleDelete(e, r.id)}
                                disabled={deleteMutation.isPending}
                                className="h-8 w-8 rounded-full hover:bg-danger/10 flex items-center justify-center text-ink-muted hover:text-danger transition-colors ml-2 shrink-0"
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* Chevron */}
                            <ChevronRight size={16} className="text-ink-muted group-hover:text-accent transition-all shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
