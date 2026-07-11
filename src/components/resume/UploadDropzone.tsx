'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
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
            // Reset form
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
        <div className="space-y-4 max-w-xl mx-auto p-6 bg-surface rounded-3xl border border-border shadow-card hover:shadow-hover transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-accent-strong">Upload Resume</h2>
            <p className="text-sm text-ink-muted">PDF format only. We extract details and run an ATS analysis.</p>

            {!file && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'rounded-2xl border border-dashed cursor-pointer p-8 transition-all duration-200 outline-none flex flex-col items-center justify-center text-center',
                        isDragActive
                            ? 'border-accent bg-accent-soft'
                            : 'border-border bg-surface-2 hover:border-accent/40 hover:bg-accent-soft/40',
                        isDragReject && 'border-danger bg-danger/10'
                    )}
                >
                    <input {...getInputProps()} />
                    <motion.div
                        animate={isDragActive ? { y: -4 } : { y: 0 }}
                        className={cn(
                            'h-12 w-12 rounded-xl flex items-center justify-center mb-3',
                            isDragActive ? 'bg-accent text-white' : 'bg-accent-soft text-accent-strong'
                        )}
                    >
                        <UploadCloud size={20} />
                    </motion.div>
                    <div className="font-display font-semibold tracking-tight text-sm">
                        {isDragActive ? 'Drop it here' : 'Drop your resume PDF'}
                    </div>
                    <div className="text-xs text-ink-muted mt-1">or click to browse · PDF only (max 5 MB)</div>
                </div>
            )}

            {file && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3"
                >
                    <div className="h-10 w-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent-strong">
                        <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="text-xs text-ink-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button
                        onClick={() => setFile(null)}
                        className="h-8 w-8 rounded-full hover:bg-surface-2 flex items-center justify-center text-ink-muted"
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
                        className="space-y-3 overflow-hidden"
                    >
                        <Input
                            placeholder="Resume Title (e.g. Software Engineer Resume)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Input
                            placeholder="Target Role (optional, e.g. Frontend Engineer)"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                        />
                        <textarea
                            className="w-full min-h-[100px] text-sm p-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder-ink-muted/50"
                            placeholder="Target Job Description (optional, copy/paste JD here for precise keyword scoring)"
                            value={targetJobDescription}
                            onChange={(e) => setTargetJobDescription(e.target.value)}
                        />
                        <Button
                            onClick={submit}
                            disabled={upload.isPending}
                            className="w-full bg-accent hover:bg-accent-strong text-white"
                        >
                            {upload.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin mr-2" />
                                    Analyzing with AI...
                                </>
                            ) : (
                                'Upload & Evaluate'
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {err && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
                    {err}
                </div>
            )}
        </div>
    );
}
