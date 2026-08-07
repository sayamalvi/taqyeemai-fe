'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, Activity as ActivityIcon, Download } from 'lucide-react';

type Activity = {
  id: string;
  actionType: 'UPLOAD' | 'ANALYZE' | 'REWRITE' | 'EXPORT';
  createdAt: string;
  details?: any;
  resume?: { title: string };
  resumeVersion?: { versionNumber: number };
};

export default function HistoryPage() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['activityHistory'],
    queryFn: async () => {
      const res = await api.get('/activity/history');
      return res.data;
    }
  });

  const getIcon = (type: Activity['actionType']) => {
    switch (type) {
      case 'UPLOAD': return <FileText className="text-blue-400" size={20} />;
      case 'ANALYZE': return <ActivityIcon className="text-purple-400" size={20} />;
      case 'REWRITE': return <RefreshCw className="text-emerald-400" size={20} />;
      case 'EXPORT': return <Download className="text-orange-400" size={20} />;
    }
  };

  const getTitle = (activity: Activity) => {
    const resumeName = activity.resume?.title || 'a resume';
    const vNum = activity.resumeVersion?.versionNumber ? `(v${activity.resumeVersion.versionNumber})` : '';
    switch (activity.actionType) {
      case 'UPLOAD': return `Uploaded ${resumeName}`;
      case 'ANALYZE': return `Analyzed ${resumeName} ${vNum}`;
      case 'REWRITE': return `Applied AI Rewrites to ${resumeName} ${vNum}`;
      case 'EXPORT': return `Exported ${resumeName} as PDF`;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(d);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen w-full text-foreground">
      <div>
        <h1 className="text-3xl font-display font-bold">Activity History</h1>
        <p className="text-foreground/60 mt-2">Track all your resume iterations and analyses over time.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {activities?.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background/50 backdrop-blur shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getIcon(activity.actionType)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white/90">{getTitle(activity)}</h3>
                  <time className="text-xs text-white/50">{formatDate(activity.createdAt)}</time>
                </div>
                {activity.details && (
                  <div className="text-sm text-white/70 mt-2 bg-black/20 p-3 rounded-lg font-mono overflow-x-auto whitespace-nowrap">
                    {Object.entries(activity.details).map(([k, v]) => (
                      <div key={k}><span className="text-white/40">{k}:</span> {String(v)}</div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {activities?.length === 0 && (
             <div className="text-center text-white/50 py-12">No activity found.</div>
          )}
        </div>
      )}
    </div>
  );
}
