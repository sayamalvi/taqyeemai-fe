'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations/fade-in';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            router.push('/resumes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn delay={0.05}>
            <div className="bg-surface rounded-3xl border border-white/[0.08] p-8 sm:p-10 shadow-card space-y-6">
                <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Authentication</span>
                    <h2 className="font-display text-2xl font-bold text-ink tracking-tight">Sign In</h2>
                    <p className="text-xs text-ink-muted leading-relaxed">Enter your credentials to access your resume roster.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-3.5 py-2.5 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted pl-0.5">Email Address</label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-11 rounded-xl bg-surface-2 border-white/[0.08] focus:border-accent text-ink placeholder:text-ink-muted/40 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted pl-0.5">Password</label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-11 rounded-xl bg-surface-2 border-white/[0.08] focus:border-accent text-ink placeholder:text-ink-muted/40 text-xs"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-accent hover:bg-accent-strong text-bg font-semibold text-xs transition-colors duration-200 mt-2"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>Sign In to Dashboard</span>
                                <ArrowRight size={14} />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="pt-3 text-center text-xs text-ink-muted border-t border-white/[0.06]">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-accent hover:underline font-bold">
                        Create Account
                    </Link>
                </div>
            </div>
        </FadeIn>
    );
}
