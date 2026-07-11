'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/resume/UploadDropzone';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Home() {
  const [result, setResult] = useState<any>(null);

  function handleUploaded(data: any) {
    setResult(data);
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl sm:text-5xl font-black text-accent-strong tracking-tight">
            AI Resume Roster
          </h1>
          <p className="text-base sm:text-lg text-ink-muted">
            Upload your resume PDF to parse the details and get an instant ATS score check.
          </p>
        </div>

        {/* Upload Box */}
        <UploadDropzone onUploaded={handleUploaded} />

        {/* Results Screen */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6"
          >
            {/* ATS Score Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-6 gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-accent-strong">Analysis Results</h3>
                <p className="text-sm text-ink-muted mt-1">Evaluated for: {result.analysis?.targetRole || 'General'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-ink-muted uppercase font-semibold">ATS Score</div>
                  <div className="font-display text-4xl font-black text-accent-strong">{result.analysis?.atsScore}/100</div>
                </div>
                <div className="h-12 w-1.5 rounded-full bg-accent" />
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(result.analysis?.scoreBreakdown || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-surface-2 rounded-2xl p-4 border border-border/50 text-center">
                  <div className="text-xs text-ink-muted capitalize font-medium">{key}</div>
                  <div className="font-display text-2xl font-bold text-accent-strong mt-1">{value}%</div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className="bg-accent-soft border border-accent/20 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-accent-strong uppercase tracking-wide">AI Verdict</h4>
              <p className="text-sm text-ink leading-relaxed">{result.analysis?.aiVerdict}</p>
            </div>

            {/* Issues and Suggestions */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-accent-strong">Identified Issues & Fixes</h4>
              <div className="space-y-3">
                {result.analysis?.issues?.map((issue: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-border bg-surface-2 flex flex-col sm:flex-row gap-4 justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-md font-bold uppercase",
                          issue.severity === 'Critical' ? 'bg-danger/10 text-danger' :
                            issue.severity === 'Moderate' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        )}>
                          {issue.severity}
                        </span>
                        <span className="text-xs text-ink-muted font-medium">{issue.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-ink mt-2">{issue.issue}</p>
                    </div>
                    <div className="sm:max-w-md bg-surface p-4 rounded-xl border border-border/40">
                      <span className="text-xs font-bold text-accent uppercase">Action Item</span>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">{issue.fixSuggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </main>
  );
}
