'use client';

import { useUser } from '@/hooks/useUser';
import { Settings, Paintbrush, Rocket } from 'lucide-react';

export default function SettingsPage() {
    const { data: user } = useUser();

    return (
        <div className="flex-1 w-full p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-foreground/50 text-sm">Manage your highly classified preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:border-white/5 relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 text-primary font-sans font-semibold flex items-center justify-center text-2xl ring-2 ring-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">{user?.name ?? 'Loading...'}</h2>
                            <p className="text-sm text-foreground/50">{user?.email}</p>

                            <div className="mt-6 w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Current Tier</span>
                                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{user?.tier ?? 'FREE'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Toggles (Dummy) */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold font-display mb-2 px-2">Account Features</h3>

                    <div className="glass-panel p-8 rounded-3xl border border-white/10 dark:border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[300px] relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-48 h-48 bg-primary/20 blur-3xl rounded-full" />

                        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                            <Paintbrush size={28} />
                        </div>

                        <h4 className="text-xl font-bold text-foreground mb-2 flex gap-1">More settings are on the way <Rocket size={28} /></h4>
                        <p className="text-sm text-foreground/50 max-w-sm relative z-10">
                            Yet to be released!
                        </p>

                        <button className="mt-8 px-6 py-2.5 rounded-full bg-white/5 text-foreground/50 text-sm font-medium hover:bg-white/10 transition-colors cursor-not-allowed relative z-10">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


