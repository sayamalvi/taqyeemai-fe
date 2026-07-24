'use client';

import Link from "next/link";
import { Variants, motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-10 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo className="w-40 h-auto" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link 
            href="/login" 
            className="hidden md:flex items-center gap-2 font-sans text-sm font-semibold hover:text-primary transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 text-center -mt-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={item} className="mb-8">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide text-primary premium-glow">
              <Sparkles className="w-4 h-4" /> 
              <span>Taqyeem.ai — Enterprise-Grade Evaluation Engine</span>
            </div>
          </motion.div>

          <motion.h1 
            variants={item}
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.05] text-white"
          >
            Elevate Your Career <br className="hidden md:block" />
            <span className="text-primary italic font-light">Trajectory.</span>
          </motion.h1>

          <motion.p 
            variants={item}
            className="mt-8 text-lg md:text-xl text-white/60 font-sans max-w-2xl mx-auto font-light leading-relaxed"
          >
            Stop guessing. Our AI engine mathematically audits your resume against elite recruiter benchmarks, ensuring you beat the ATS and secure top-tier interviews.
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/register"
              className="group relative flex items-center justify-center gap-3 bg-primary text-black font-semibold text-base px-8 py-4 rounded-2xl w-full sm:w-auto hover:bg-white transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
            >
              Analyze Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/login"
              className="group flex items-center justify-center gap-3 glass-panel text-white font-semibold text-base px-8 py-4 rounded-2xl w-full sm:w-auto hover:bg-white/10 transition-colors"
            >
              Enter Dashboard
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-16 flex items-center justify-center gap-8 text-sm font-medium text-white/40 flex-wrap">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> Bank-grade Encryption
             </div>
             <div className="flex items-center gap-2">
               <Sparkles className="w-4 h-4" /> 100k+ Data Points
             </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
