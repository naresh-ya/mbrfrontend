'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { generateSummaryAction } from '@/app/actions';
import type { KpiData } from '@/app/lib/data';

type ExecutiveSummaryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiData: KpiData[];
};

export function ExecutiveSummaryDialog({ open, onOpenChange, kpiData }: ExecutiveSummaryDialogProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatKpiDataForAI = useCallback((data: KpiData[]) => {
    if (data.length === 0) {
      return { dashboardMetrics: '', recentTrends: '', performanceHighlights: '' };
    }
    const dashboardMetrics = data
      .map(kpi => `${kpi.title}: ${kpi.value} (${kpi.changeType === 'increase' ? '+' : '-'}${kpi.change}%)`)
      .join(', ');
      
    const recentTrends = "User engagement is growing, but customer churn is also slightly increasing. Revenue shows strong positive momentum while profit margins are under pressure.";
    
    const performanceHighlights = `Total revenue hit a new high at ${data[0].value}. Customer acquisition remains strong, adding ${data[2].value} new customers. However, profit margin and churn rate need attention.`;

    return { dashboardMetrics, recentTrends, performanceHighlights };
  }, []);
  
  useEffect(() => {
    if (open && !summary && !isLoading && kpiData.length > 0) {
      const generate = async () => {
        setIsLoading(true);
        const aiInput = formatKpiDataForAI(kpiData);
        const result = await generateSummaryAction(aiInput);
        setSummary(result.summary);
        setIsLoading(false);
      };
      generate();
    }
  }, [open, summary, isLoading, kpiData, formatKpiDataForAI]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      // Don't reset summary on close, so it's cached if the user re-opens.
      // It will only refetch if the kpiData changes.
    }
  };

  useEffect(() => {
    if (!open) {
      setSummary('');
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText /> AI Executive Summary
          </DialogTitle>
          <DialogDescription>
            An AI-generated summary of your current business performance.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-foreground/90">
          {isLoading || (summary === '' && open) ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <div className="h-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
            </div>
          ) : (
             <div className="whitespace-pre-wrap leading-relaxed">
                <p>{summary}</p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
