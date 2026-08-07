'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import { motion } from 'framer-motion';
import { FileText, Sparkles, TrendingUp, ArrowRight, Layers, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/resume/UploadDropzone';
import { useAllResumes } from '@/hooks/useResumeVersions';
import { FadeIn } from '@/components/ui/animations/fade-in';

type InsightsData = {
  scoreTrajectory: { date: string; score: number }[];
  totalRewritesApplied: number;
};

export default function DashboardPage() {
  const router = useRouter();
  
  const { data: insights, isLoading: isInsightsLoading } = useQuery<InsightsData>({
    queryKey: ['activityInsights'],
    queryFn: async () => {
      const res = await api.get('/activity/insights');
      return res.data;
    }
  });

  const { data: resumes, isLoading: isResumesLoading } = useAllResumes();

  function handleUploaded(data: any) {
    router.push(`/resumes/${data.resume.id}`);
  }

  // Get top 3 most recently updated resumes
  const recentResumes = resumes?.slice(0, 3) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen w-full text-foreground">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Welcome back</h1>
            <p className="text-foreground/60 mt-2">Here's an overview of your resume optimization journey.</p>
        </div>
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <Activity size={16} className="text-primary" />
            <span className="text-xs font-sans font-semibold text-foreground/80">Engine Active</span>
        </div>
      </div>

      {/* KPI Cards Row (Top) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Resumes */}
          <FadeIn delay={0.15}>
              <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between h-full">
                  <div>
                      <div className="flex items-center gap-3 text-white/60 mb-2">
                      <FileText size={16} className="text-primary" />
                      <h2 className="font-semibold text-[11px] uppercase tracking-wider">Your Resumes</h2>
                      </div>
                      <div className="text-4xl font-display font-bold text-white mt-3">{isResumesLoading ? '-' : resumes?.length || 0}</div>
                  </div>
                  <Link href="/resumes" className="mt-5 flex items-center justify-between text-xs font-semibold text-primary hover:text-white transition-colors group">
                      Manage Roster
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </FadeIn>

          {/* Total Rewrites */}
          <FadeIn delay={0.25}>
              <div className="p-6 rounded-3xl glass-panel border border-white/10 relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                  <div>
                      <div className="flex items-center gap-3 text-white/60 mb-2">
                      <Sparkles size={16} className="text-emerald-400" />
                      <h2 className="font-semibold text-[11px] uppercase tracking-wider">AI Rewrites Applied</h2>
                      </div>
                      <div className="text-4xl font-display font-bold text-white mt-3">{isInsightsLoading ? '-' : insights?.totalRewritesApplied || 0}</div>
                  </div>
                  <Link href="/history" className="mt-5 flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-white transition-colors group">
                      Activity History
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </FadeIn>

          {/* Latest Score */}
          <FadeIn delay={0.35}>
              <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between h-full">
                  <div>
                      <div className="flex items-center gap-3 text-white/60 mb-2">
                      <Activity size={16} className="text-blue-400" />
                      <h2 className="font-semibold text-[11px] uppercase tracking-wider">Latest Score</h2>
                      </div>
                      <div className="text-4xl font-display font-bold text-white mt-3">
                      {isInsightsLoading ? '-' : (insights?.scoreTrajectory?.length ? insights.scoreTrajectory[insights.scoreTrajectory.length - 1].score : 'N/A')}
                      </div>
                  </div>
                  <Link href="/insights" className="mt-5 flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-white transition-colors group">
                      View Analytics
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Quick Upload */}
        <div className="lg:col-span-7 space-y-6">
            <FadeIn delay={0.1}>
                <div className="rounded-3xl glass-panel p-6 border border-white/10 h-full">
                    <h2 className="font-display text-lg font-bold mb-4">Quick Upload</h2>
                    <UploadDropzone onUploaded={handleUploaded} />
                </div>
            </FadeIn>
        </div>

        {/* Right Column: Recent Resumes */}
        <div className="lg:col-span-5 space-y-6">
            <FadeIn delay={0.2}>
                <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4 h-full">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="font-display text-lg font-bold">Recent Resumes</h2>
                        <Link href="/resumes" className="text-xs font-semibold text-primary hover:text-white transition-colors">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {isResumesLoading ? (
                            <div className="text-sm text-foreground/50 py-4 text-center">Loading...</div>
                        ) : recentResumes.length > 0 ? (
                            recentResumes.map((r: any) => {
                                return (
                                    <div
                                        key={r.id}
                                        onClick={() => router.push(`/resumes/${r.id}`)}
                                        className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-black/20 border border-white/10 text-primary flex items-center justify-center shrink-0 group-hover:premium-glow transition-all">
                                            <FileText size={16} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-sans text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                {r.title}
                                            </div>
                                            <div className="text-[11px] font-sans text-foreground/50 mt-0.5 font-medium">
                                                Updated {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 border border-white/10 text-xs font-sans font-semibold text-foreground/50 shrink-0">
                                            <Layers size={12} className="text-primary" />
                                            <span>v{r.versions?.length || 1}</span>
                                        </div>

                                        <ChevronRight size={16} className="text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-foreground/50 py-6 text-center">
                                No resumes found.
                            </div>
                        )}
                    </div>
                </div>
            </FadeIn>
        </div>

    </div>
    </div>
  );
}
