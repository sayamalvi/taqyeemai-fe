'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
    variant?: 'monogram' | 'full';
    size?: number;
    className?: string;
}

/** Geometric "T" monogram inspired by Arabic calligraphy angles */
function Monogram({ size = 32 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Taqyeem logo"
        >
            <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--gold)" />
                </linearGradient>
            </defs>
            {/* Outer diamond frame */}
            <rect
                x="4" y="4" width="32" height="32" rx="8"
                fill="url(#logo-grad)"
                opacity="0.15"
            />
            {/* "T" letterform — horizontal bar */}
            <rect x="10" y="12" width="20" height="3.5" rx="1.75" fill="url(#logo-grad)" />
            {/* "T" letterform — vertical stem */}
            <rect x="18.25" y="12" width="3.5" height="18" rx="1.75" fill="url(#logo-grad)" />
            {/* Decorative dot — Arabic diacritic inspired */}
            <circle cx="30" cy="26" r="2.2" fill="var(--gold)" />
        </svg>
    );
}

/** Full wordmark: monogram + "taqyeem.ai" */
function Wordmark({ className }: { className?: string }) {
    return (
        <span className={cn("font-display text-lg font-extrabold tracking-tight text-ink", className)}>
            taqyeem<span className="text-accent">.ai</span>
        </span>
    );
}

export function Logo({ variant = 'full', size = 32, className }: LogoProps) {
    if (variant === 'monogram') {
        return <Monogram size={size} />;
    }

    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <Monogram size={size} />
            <Wordmark />
        </div>
    );
}
