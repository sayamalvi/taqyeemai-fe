import { useState, useMemo } from "react";
import { ArrowRight, Loader2, Sparkles, Wand2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface Rewrite {
    section?: string;
    original: string;
    rewritten: string;
    rationale?: string;
}

interface BulletRewritesProps {
    rewrites: Rewrite[];
    onApply: (selectedRewrites: Rewrite[]) => void;
    isApplying?: boolean;
    error?: string | null;
}

function GradientNumber({ value, size = 32 }: { value: string | number; size?: number }) {
    return (
        <span
            className="font-display tabular font-extrabold leading-none tracking-tight text-accent"
            style={{ fontSize: size }}
        >
            {value}
        </span>
    );
}

export function BulletRewrites({ rewrites, onApply, isApplying, error }: BulletRewritesProps) {
    const ids = useMemo(() => rewrites.map((_, i) => i.toString()), [rewrites]);
    const [selected, setSelected] = useState<Set<string>>(() => new Set(ids));

    const allSelected = selected.size === ids.length && ids.length > 0;
    const someSelected = selected.size > 0;

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAll() {
        setSelected(allSelected ? new Set() : new Set(ids));
    }

    function applySelected() {
        const selectedRewrites = rewrites.filter((_, i) => selected.has(i.toString()));
        onApply?.(selectedRewrites);
    }

    if (!rewrites?.length) {
        return (
            <div className="rounded-3xl border border-white/[0.08] bg-surface p-6">
                <h3 className="font-display text-base font-bold text-ink">Suggested Bullet Rewrites</h3>
                <p className="text-xs text-ink-muted mt-1">No bullet rewrites recommended for this version.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-3xl border border-white/[0.08] bg-surface p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={12} />
                            <span>AI Bullet Optimization</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-ink tracking-tight">High-Impact Bullet Rewrites</h3>
                        <p className="text-xs text-ink-muted max-w-lg leading-relaxed">
                            Select the AI bullet rewrites you want to commit. Applying selected rewrites will automatically generate a new version of your resume.
                        </p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l border-white/[0.06] pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-ink-muted">Available</div>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <GradientNumber value={rewrites.length} size={32} />
                                    <span className="text-xs text-ink-muted font-medium">bullets</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/[0.08]" />
                            <div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-ink-muted">Selected</div>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="font-display tabular text-2xl font-extrabold text-ink">
                                        {selected.size}
                                    </span>
                                    <span className="text-xs text-ink-muted font-medium">/ {rewrites.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAll}
                                className="h-9 px-3 rounded-xl border-white/[0.08] bg-surface-2 hover:bg-surface text-ink text-xs font-semibold"
                            >
                                {allSelected ? "Deselect All" : "Select All"}
                            </Button>
                            <Button
                                size="sm"
                                onClick={applySelected}
                                disabled={!someSelected || isApplying}
                                className="h-9 px-4 rounded-xl bg-accent hover:bg-accent-strong text-bg font-semibold text-xs transition-colors duration-200"
                            >
                                {isApplying ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Sparkles size={14} className="mr-1.5" />}
                                Apply Selected ({selected.size})
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List of Rewrites */}
            <div className="space-y-4">
                {rewrites.map((r, i) => {
                    const id = i.toString();
                    const isSelected = selected.has(id);
                    return (
                        <div
                            key={id}
                            className={cn(
                                "relative rounded-3xl border p-6 transition-colors duration-200 overflow-hidden",
                                isSelected
                                    ? "border-accent/40 bg-surface"
                                    : "border-white/[0.06] bg-surface/60 hover:bg-surface"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent rounded-r-full" />
                            )}

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-lg bg-surface-2 border border-white/[0.08] flex items-center justify-center text-xs font-bold text-accent">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    {r.section && (
                                        <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                            {r.section}
                                        </span>
                                    )}
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <span className={cn(
                                        "text-xs font-semibold transition-colors",
                                        isSelected ? "text-accent" : "text-ink-muted"
                                    )}>
                                        {isSelected ? "Will Apply" : "Skip Bullet"}
                                    </span>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(id)}
                                        className="h-5 w-5 rounded-md border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                    />
                                </label>
                            </div>

                            {/* Side-by-side comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr] gap-4 items-center">
                                {/* Original Bullet */}
                                <div className="rounded-2xl bg-surface-2 p-4 border border-white/[0.06] space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Original Bullet</span>
                                    </div>
                                    <p className="text-xs text-ink-muted leading-relaxed line-through opacity-75">
                                        {r.original}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex items-center justify-center py-1 md:py-0">
                                    <div className="h-8 w-8 rounded-xl bg-surface-2 border border-white/[0.06] text-accent flex items-center justify-center shrink-0">
                                        <ArrowRight size={15} />
                                    </div>
                                </div>

                                {/* Rewritten Bullet */}
                                <div className="rounded-2xl bg-accent/10 p-4 border border-accent/30 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-accent">
                                        <Sparkles size={12} />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Optimized Bullet</span>
                                    </div>
                                    <p className="text-xs text-ink font-semibold leading-relaxed">
                                        {r.rewritten}
                                    </p>
                                </div>
                            </div>

                            {/* Rationale / Why it works */}
                            {r.rationale && (
                                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-surface-2 border border-white/[0.06] p-3.5">
                                    <div className="h-5 w-5 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0 mt-0.5">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-xs text-ink-muted leading-relaxed">
                                        <span className="font-semibold text-ink">Impact Rationale: </span>
                                        {r.rationale}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3 text-center font-medium">
                    {error}
                </div>
            )}
        </div>
    );
}
