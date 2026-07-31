import { useState, useMemo } from "react";
import { ArrowRight, Loader2, Sparkles, Wand2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface Rewrite {
    section?: string;
    original: string;
    existing_skills_found?: string;
    flaw_analysis?: string;
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
            className="font-display tabular font-extrabold leading-none tracking-tight text-primary"
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
            <div className="rounded-3xl border border-white/10 glass-panel p-6">
                <h3 className="font-display text-base font-bold text-foreground">Suggested Bullet Rewrites</h3>
                <p className="text-xs font-sans text-foreground/50 mt-1">No bullet rewrites recommended for this version.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-3xl border border-white/10 glass-panel p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={12} />
                            <span>AI Optimization</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground tracking-tight">High-Impact Experience Rewrites</h3>
                        <p className="text-sm font-sans text-foreground/60 max-w-lg leading-relaxed font-light">
                            Select the AI bullet rewrites you want to commit. Applying selected rewrites will automatically generate a new version of your resume.
                        </p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-[10px] font-sans uppercase tracking-widest font-semibold text-foreground/40">Available</div>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <GradientNumber value={rewrites.length} size={32} />
                                    <span className="text-xs font-sans text-foreground/50 font-medium">bullets</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <div className="text-[10px] font-sans uppercase tracking-widest font-semibold text-foreground/40">Selected</div>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="font-display tabular text-2xl font-bold text-foreground">
                                        {selected.size}
                                    </span>
                                    <span className="text-xs font-sans text-foreground/50 font-medium">/ {rewrites.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAll}
                                className="h-9 px-3 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-foreground text-xs font-sans font-semibold transition-colors"
                            >
                                {allSelected ? "Deselect All" : "Select All"}
                            </Button>
                            <Button
                                size="sm"
                                onClick={applySelected}
                                disabled={!someSelected || isApplying}
                                className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-sans font-semibold text-xs transition-colors duration-200 premium-glow"
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
                                    ? "border-primary/40 glass-panel"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-lg bg-black/20 border border-white/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    {r.section && (
                                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                            {r.section}
                                        </span>
                                    )}
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <span className={cn(
                                        "text-xs font-sans font-semibold transition-colors",
                                        isSelected ? "text-primary" : "text-foreground/50"
                                    )}>
                                        {isSelected ? "Will Apply" : "Skip Bullet"}
                                    </span>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(id)}
                                        className="h-5 w-5 rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                </label>
                            </div>

                            {/* Side-by-side comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr] gap-4 items-center">
                                {/* Original Bullet */}
                                <div className="rounded-2xl bg-black/20 p-4 border border-white/10 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                                        <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-foreground/40">Original Bullet</span>
                                    </div>
                                    <p className="text-xs font-sans text-foreground/50 leading-relaxed line-through">
                                        {r.original}
                                    </p>
                                    {(r.existing_skills_found || r.flaw_analysis) && (
                                        <details className="mt-3 group/cot cursor-pointer">
                                            <summary className="text-[10px] font-sans font-bold text-foreground/40 uppercase tracking-wider select-none flex items-center gap-1 hover:text-primary transition-colors">
                                                <span>Inspect AI Reasoning</span>
                                                <div className="transition-transform group-open/cot:rotate-180">▼</div>
                                            </summary>
                                            <div className="mt-2 space-y-2 p-3 bg-black/40 rounded-xl border border-white/5">
                                                {r.existing_skills_found && (
                                                    <p className="text-[11px] font-sans text-foreground/70">
                                                        <span className="font-bold text-foreground/90">Detected Skills:</span> {r.existing_skills_found}
                                                    </p>
                                                )}
                                                {r.flaw_analysis && (
                                                    <p className="text-[11px] font-sans text-foreground/70 leading-relaxed">
                                                        <span className="font-bold text-foreground/90">Analysis:</span> {r.flaw_analysis}
                                                    </p>
                                                )}
                                            </div>
                                        </details>
                                    )}
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex items-center justify-center py-1 md:py-0">
                                    <div className="h-8 w-8 rounded-xl bg-black/20 border border-white/10 text-primary flex items-center justify-center shrink-0">
                                        <ArrowRight size={15} />
                                    </div>
                                </div>

                                {/* Rewritten Bullet */}
                                <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <Sparkles size={12} />
                                        <span className="text-[10px] font-sans uppercase font-bold tracking-wider">Optimized Bullet</span>
                                    </div>
                                    <p className="text-[13px] font-sans text-foreground font-medium leading-relaxed">
                                        {r.rewritten}
                                    </p>
                                </div>
                            </div>

                            {/* Rationale / Why it works */}
                            {r.rationale && (
                                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-black/20 border border-white/10 p-3.5">
                                    <div className="h-5 w-5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-xs font-sans text-foreground/60 leading-relaxed">
                                        <span className="font-semibold text-foreground">Impact Rationale: </span>
                                        {r.rationale}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="text-xs font-sans text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-2xl px-4 py-3 text-center font-medium">
                    {error}
                </div>
            )}
        </div>
    );
}
