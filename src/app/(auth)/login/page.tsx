// frontend/src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
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
            // Store the token that Passport/NestJS generated!
            localStorage.setItem('accessToken', response.data.accessToken);
            // Redirect to the dashboard
            router.push('/resumes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn delay={0.1}>
            <div className="relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[28px] border border-white/5 p-8 shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 flex items-center justify-center bg-accent/10 rounded-xl mb-4 border border-accent/20">
                        <Sparkles className="text-accent" size={24} />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
                    <p className="text-sm text-ink-muted mt-2">Enter your credentials to access your resumes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider pl-1">Email</label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-accent text-ink h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider pl-1">Password</label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-accent text-ink h-11 rounded-xl"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-strong text-black font-semibold h-11 rounded-xl mt-4 shadow-[0_0_16px_rgba(0,229,153,0.25)] transition-all duration-300"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Log In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-ink-muted">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-accent hover:underline font-semibold">
                        Sign up
                    </Link>
                </div>
            </div>
        </FadeIn>
    );
}
