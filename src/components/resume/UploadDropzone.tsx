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
            });
            setFile(null);
            setTitle('');

            onUploaded?.(result);
        } catch (e: any) {
            setErr(e.response?.data?.message || 'Upload and evaluation failed.');
        }
    }

    return (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="font-display text-xl font-bold text-foreground tracking-tight">AI Evaluation Engine</h2>
                </div>
                <p className="text-xs font-sans text-foreground/60 leading-relaxed">
                    Upload your PDF to initiate an enterprise-grade ATS audit.
                </p>
            </div>

            {!file && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'rounded-2xl border border-dashed border-white/10 bg-black/20 cursor-pointer p-8 transition-all duration-300 outline-none flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 group',
                        isDragActive && 'border-primary bg-primary/10',
                        isDragReject && 'border-[#EF4444] bg-[#EF4444]/10'
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-primary flex items-center justify-center mb-4 group-hover:premium-glow group-hover:bg-primary/10 transition-all">
                        <UploadCloud size={24} />
                    </div>

                    <div className="font-display font-semibold tracking-tight text-sm text-foreground">
                        {isDragActive ? 'Drop file to analyze' : 'Drag & drop your resume PDF'}
                    </div>
                    <div className="text-[11px] font-sans text-foreground/50 mt-1.5 font-medium">
                        or <span className="text-primary font-semibold underline underline-offset-2">browse</span> (max 5 MB)
                    </div>
                </div>
            )}

            {file && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4"
                >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-sans font-semibold text-foreground truncate">{file.name}</div>
                        <div className="text-[11px] font-sans text-primary flex items-center gap-1.5 mt-1 font-medium">
                            <CheckCircle2 size={12} />
                            Ready · {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                    </div>
                    <button
                        onClick={() => setFile(null)}
                        className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
                        disabled={upload.isPending}
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}

            <AnimatePresence>
                {file && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden pt-2"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-sans font-semibold text-foreground/80 pl-1">Resume Title</label>
                            <Input
                                placeholder="e.g. Senior Frontend Engineer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 rounded-xl bg-black/40 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-foreground/30 text-sm transition-all"
                            />
                        </div>

                        <Button
                            onClick={submit}
                            disabled={upload.isPending}
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-sans font-semibold text-sm transition-all premium-glow mt-4"
                        >
                            {upload.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Processing Audit...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles size={16} />
                                    <span>Upload Resume</span>
                                </span>
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {err && (
                <div className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-4 py-3 rounded-xl font-medium">
                    {err}
                </div>
            )}
        </div>
    );
}
