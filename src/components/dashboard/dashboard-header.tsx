'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AskAiDialog } from './ask-ai-dialog';
import { MonthFilter } from '@/components/shared/month-filter';
import type { KpiData } from '@/app/lib/data';

type DashboardHeaderProps = {
  kpiData: KpiData[];
  userName: string;
  selectedMonth: string;
  monthOptions: string[];
  onMonthChange: (month: string) => void;
  lastUpdated?: string;
  title?: string; // Optional title prop
};

export function DashboardHeader({
  kpiData,
  userName,
  selectedMonth,
  monthOptions,
  onMonthChange,
  lastUpdated,
  title = "Outcome Indicators", // Default value
}: DashboardHeaderProps) {
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Format last updated time (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    if (!lastUpdated) {
      setFormattedTime('Tue, Mar 31  15:15 IST');
      return;
    }

    try {
      const date = new Date(lastUpdated);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      };
      setFormattedTime(date.toLocaleString('en-US', options));
    } catch {
      setFormattedTime('Tue, Mar 31  15:15 IST');
    }
  }, [lastUpdated]);

  return (
  <>
    <header className="w-full flex flex-col gap-6">

      {/* Top Row: Month Dropdown + Last Updated + Refresh */}
      <div className="flex items-center justify-between w-full">

        {/* LEFT: Month Dropdown */}
        <MonthFilter
          selectedMonth={selectedMonth}
          monthOptions={monthOptions}
          onMonthChange={onMonthChange}
        />

        {/* RIGHT: Last updated + Refresh */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="text-right">
            <div className="font-medium">Last updated</div>
            <div className="text-gray-500">
              {isMounted ? formattedTime : ''}
            </div>
          </div>

          <button
            className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
            onClick={() => window.location.reload()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0112.92-5.303M19.5 12a7.5 7.5 0 01-12.92 5.303"
              />
            </svg>
            REFRESH
          </button>
        </div>
      </div>

      {/* Middle Row: Ask AI Text Input */}
      {/* <div className="w-full flex items-center gap-2">
        <input
          type="text"
          placeholder="How may we help you today?"
          className="w-full border-[2px] border-blue-400 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />

        <button
          className="h-full bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700"
          onClick={() => setIsAskAiOpen(true)}
        >
          ➤
        </button>
      </div> */}

      {/* Section Title */}
      <h2 className="text-[22px] font-semibold text-black">{title}</h2>
    </header>

    <AskAiDialog open={isAskAiOpen} onOpenChange={setIsAskAiOpen} />
  </>
);
  // return (
  //   <>
  //     <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
  //       <div>
  //         <h1 className="text-3xl font-bold tracking-tight">
  //           Welcome back, {userName || 'User'}!
  //         </h1>
  //         <p className="mt-1 text-muted-foreground">
  //           Viewing data for {selectedMonth || 'selected month'}.
  //         </p>
  //       </div>
  //       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  //         <MonthFilter
  //           selectedMonth={selectedMonth}
  //           monthOptions={monthOptions}
  //           onMonthChange={onMonthChange}
  //         />
  //         <Button onClick={() => setIsAskAiOpen(true)}>
  //           <Bot />
  //           Ask AI
  //         </Button>
  //       </div>
  //     </header>
  //     <AskAiDialog open={isAskAiOpen} onOpenChange={setIsAskAiOpen} />
  //   </>
  // );
}
