'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    label: string;
    sublabel?: string;
    color?: 'accent' | 'gold';
    className?: string;
}

export function ScoreRing({
    value,
    max = 100,
    size = 120,
    strokeWidth = 6,
    label,
    sublabel,
    color = 'accent',
    className,
}: ScoreRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / max, 1);
    const dashOffset = circumference * (1 - progress);

    const gradId = `score-ring-grad-${color}-${Math.random().toString(36).substr(2, 4)}`;

    return (
        <div className={cn("flex flex-col items-center gap-2.5", className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <defs>
                        {color === 'accent' ? (
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00F59B" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        ) : (
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                        )}
                    </defs>

                    {/* Crisp Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Vector Gradient Progress Stroke (NO DROP-SHADOW BUG) */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                </svg>

                {/* Center Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        className={cn(
                            "font-display tabular text-2xl font-extrabold tracking-tight",
                            color === 'accent' ? "text-[#00F59B]" : "text-[#FBBF24]"
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        {value}
                    </motion.span>
                    {sublabel && (
                        <span className="text-[10px] text-ink-muted/80 font-medium">
                            {sublabel}
                        </span>
                    )}
                </div>
            </div>

            <div className="text-center">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</div>
            </div>
        </div>
    );
}
