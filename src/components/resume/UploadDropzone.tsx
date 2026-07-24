'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUploadResume } from '@/hooks/useUploadResume';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB limit

export function UploadDropzone({ onUploaded }: { onUploaded?: (data: any) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [targetJobDescription, setTargetJobDescription] = useState('');
    const [err, setErr] = useState('');
    const upload = useUploadResume();

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: MAX_BYTES,
        multiple: false,
        onDropAccepted: (files) => {
            setErr('');
            setFile(files[0]);
            setTitle(files[0].name.replace(/\.pdf$/i, ''));
        },
        onDropRejected: (rejections) => {
            const reason = rejections?.[0]?.errors?.[0]?.message || 'File rejected';
            setErr(reason);
        },
    });

    async function submit() {
        if (!file) return;
        setErr('');
        try {
            const result = await upload.mutateAsync({
                file,
                title,
                targetRole,
                targetJobDescription,
            });
            setFile(null);
            setTitle('');
            setTargetRole('');
            setTargetJobDescription('');

            onUploaded?.(result);
        } catch (e: any) {
            setErr(e.response?.data?.message || 'Upload and evaluation failed.');
        }
    }

    return (
        <div className="bg-surface rounded-3xl border border-white/[0.08] p-6 shadow-card space-y-5">
            <div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <h2 className="font-display text-base font-bold text-ink tracking-tight">Upload Resume</h2>
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">PDF format only. Extracts text, parses sections, and executes ATS scoring.</p>
            </div>

            {!file && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'rounded-2xl border border-dashed border-white/10 bg-surface-2 cursor-pointer p-8 transition-all duration-200 outline-none flex flex-col items-center justify-center text-center hover:border-accent/40',
                        isDragActive && 'border-accent bg-accent/10',
                        isDragReject && 'border-danger bg-danger/10'
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="h-12 w-12 rounded-2xl bg-surface border border-white/[0.08] text-accent flex items-center justify-center mb-3">
                        <UploadCloud size={22} />
                    </div>

                    <div className="font-display font-semibold tracking-tight text-xs text-ink">
                        {isDragActive ? 'Drop file to analyze' : 'Drag & drop your resume PDF'}
                    </div>
                    <div className="text-[11px] text-ink-muted mt-1 font-medium">
                        or <span className="text-accent font-semibold underline underline-offset-2">browse files</span> (max 5 MB)
                    </div>
                </div>
            )}

            {file && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex items-center gap-3"
                >
                    <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                        <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-ink truncate">{file.name}</div>
                        <div className="text-[10px] text-accent flex items-center gap-1 mt-0.5 font-medium">
                            <CheckCircle2 size={12} />
                            Ready · {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                    </div>
                    <button
                        onClick={() => setFile(null)}
                        className="h-7 w-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                        disabled={upload.isPending}
                    >
                        <X size={14} />
                    </button>
                </motion.div>
            )}

            <AnimatePresence>
                {file && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden pt-1"
                    >
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider pl-0.5">Resume Title</label>
                            <Input
                                placeholder="Resume Title (e.g. Senior Frontend Engineer)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-surface-2 border-white/[0.08] focus:border-accent text-ink h-10 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider pl-0.5">Target Role <span className="text-ink-muted/50 font-normal">(Optional)</span></label>
                            <Input
                                placeholder="e.g. Lead Fullstack Engineer"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="bg-surface-2 border-white/[0.08] focus:border-accent text-ink h-10 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider pl-0.5">Job Description <span className="text-ink-muted/50 font-normal">(Optional for ATS match)</span></label>
                            <textarea
                                className="w-full min-h-[85px] text-xs p-3 bg-surface-2 border border-white/[0.08] rounded-xl focus:outline-none focus:border-accent text-ink resize-none placeholder:text-ink-muted/40 font-sans"
                                placeholder="Paste job description text here to get custom keyword gap analysis..."
                                value={targetJobDescription}
                                onChange={(e) => setTargetJobDescription(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={submit}
                            disabled={upload.isPending}
                            className="w-full h-11 bg-accent hover:bg-accent-strong text-bg font-semibold rounded-xl transition-colors duration-200 mt-2 text-xs"
                        >
                            {upload.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Analyzing PDF...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles size={14} />
                                    <span>Upload & Evaluate</span>
                                </span>
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {err && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2 text-center font-medium">
                    {err}
                </div>
            )}
        </div>
    );
}
