'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

type InsightsData = {
  scoreTrajectory: { date: string; score: number }[];
  topMissingSkills: { skill: string; count: number }[];
  totalRewritesApplied: number;
};

export default function InsightsPage() {
  const { data, isLoading } = useQuery<InsightsData>({
    queryKey: ['activityInsights'],
    queryFn: async () => {
      const res = await api.get('/activity/insights');
      return res.data;
    }
  });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen w-full text-foreground">
      <div>
        <h1 className="text-3xl font-display font-bold">Analytics & Insights</h1>
        <p className="text-foreground/60 mt-2">Track your progress and identify recurring skill gaps.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-primary" /></div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Rewrites KPI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="flex items-center gap-3 text-white/60 mb-2">
              <Sparkles size={18} className="text-emerald-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">AI Rewrites Applied</h2>
            </div>
            <div className="text-5xl font-display font-bold text-white mt-4">{data.totalRewritesApplied}</div>
            <p className="text-sm text-white/40 mt-4">Total automated optimizations performed across all resumes.</p>
          </motion.div>

          {/* Score Trajectory Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 p-6 rounded-2xl glass-panel border border-white/10"
          >
            <div className="flex items-center gap-3 text-white/60 mb-6">
              <TrendingUp size={18} className="text-blue-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Health Score Evolution</h2>
            </div>
            {data.scoreTrajectory.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.scoreTrajectory.map(d => ({ ...d, dateFormatted: formatDate(d.date) }))}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="dateFormatted" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/40">Not enough data to display trends.</div>
            )}
          </motion.div>

          {/* Top Missing Skills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 p-6 rounded-2xl glass-panel border border-white/10"
          >
             <div className="flex items-center gap-3 text-white/60 mb-6">
              <AlertCircle size={18} className="text-orange-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Most Frequently Missing Skills</h2>
            </div>
            
            {data.topMissingSkills.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topMissingSkills} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="skill" type="category" stroke="#ffffff90" fontSize={12} tickLine={false} axisLine={false} width={120} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#fb923c" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/40">No missing skills detected yet.</div>
            )}
          </motion.div>

        </div>
      ) : null}
    </div>
  );
}
