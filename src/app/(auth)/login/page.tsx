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
            const response = await api.post('/auth/login', { 
                email: email.trim(), 
                password 
            });
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn delay={0.1}>
            <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-8">

                <div className="space-y-2">
                    <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">Welcome back</h2>
                    <p className="text-sm font-sans text-foreground/60">Enter your credentials to access your roster.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-4 py-3 rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-sans font-semibold text-foreground/80 pl-1">Email Address</label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-12 rounded-xl bg-black/40 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-foreground/30 text-sm transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-sans font-semibold text-foreground/80 pl-1">Password</label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-12 rounded-xl bg-black/40 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-foreground/30 text-sm transition-all"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-sans font-semibold text-base transition-all premium-glow mt-4"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="pt-6 font-sans text-sm text-foreground/50 border-t border-white/10 flex justify-center gap-2 items-center">
                    <span>Don't have an account?</span>
                    <Link href="/register" className="text-primary font-medium hover:text-white transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </FadeIn>
    );
}
