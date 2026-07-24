'use client';

import { Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mesh relative flex flex-col justify-center overflow-hidden font-sans text-foreground">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-10 flex min-h-screen items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          
          {/* Left Column: Premium Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-10">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                Taqyeem<span className="text-primary">.ai</span>
              </span>
            </Link>

            <div className="space-y-6 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-primary text-xs font-semibold tracking-wide">
                <Sparkles size={14} />
                <span>AI-Powered Career Intelligence</span>
              </div>
              
              <h1 className="font-display text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
                Join the <span className="text-primary font-medium italic">elite</span> tier of candidates.
              </h1>
              
              <p className="text-foreground/60 text-base leading-relaxed font-light">
                Secure your dream role by leveraging the same algorithms recruiters use. We identify gaps and rewrite your experience to guarantee interviews.
              </p>
            </div>

            {/* Social Proof / Metrics */}
            <div className="flex items-center gap-8 pt-6 border-t border-white/[0.08]">
              <div className="space-y-1">
                <div className="text-2xl font-display font-bold text-foreground">94%</div>
                <div className="text-xs text-foreground/50 font-medium uppercase tracking-wide">Interview Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-display font-bold text-foreground">2.5x</div>
                <div className="text-xs text-foreground/50 font-medium uppercase tracking-wide">Salary Increase</div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="w-full max-w-md mx-auto relative">
            <div className="lg:hidden mb-12 text-center">
              <Link href="/">
                <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                  Taqyeem<span className="text-primary">.ai</span>
                </span>
              </Link>
            </div>
            
            {/* The child form goes here */}
            {children}
            
          </div>
        </div>
      </div>
    </div>
  );
}
