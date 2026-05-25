'use client';

import { useState, useEffect } from 'react';

export interface KPIMonth {
  label: string;
  value: string;
  year: string;
  month: string;
}

export interface KPIMonthsResponse {
  status: string;
  months: KPIMonth[];
  availableMonths: string[];
  current: string;
  latest: string;
  lastUpdated: string;
}

/**
 * Abbreviate month name
 * "December" → "Dec", "November" → "Nov", etc.
 */
function abbreviateMonth(monthName: string): string {
  const monthMap: { [key: string]: string } = {
    'January': 'Jan',
    'February': 'Feb',
    'March': 'Mar',
    'April': 'Apr',
    'May': 'May',
    'June': 'Jun',
    'July': 'Jul',
    'August': 'Aug',
    'September': 'Sep',
    'October': 'Oct',
    'November': 'Nov',
    'December': 'Dec',
  };
  return monthMap[monthName] || monthName;
}

/**
 * Convert "December 2025" to "Dec 2025"
 */
function abbreviateMonthString(fullMonth: string): string {
  const parts = fullMonth.trim().split(' ');
  if (parts.length === 2) {
    const abbr = abbreviateMonth(parts[0]);
    return `${abbr} ${parts[1]}`;
  }
  return fullMonth;
}

/**
 * Custom hook to fetch available months for KPI pages
 * Uses the getmonth_all backend logic from agent_wrapper.py
 *
 * Flow:
 * Frontend → /api/kpi/available-months → Backend /api/kpi/available-months
 *          → get_available_months() → S3 scan
 *
 * @returns Available months data and loading state
 */
export function useKPIMonths() {
  const [months, setMonths] = useState<KPIMonth[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonths() {
      try {
        setLoading(true);
        setError(null);

        console.log('🎯 [useKPIMonths] Fetching available months via getmonth_all...');

        const response = await fetch('/api/kpi/available-months', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch KPI months: ${response.status}`);
        }

        const data: KPIMonthsResponse = await response.json();

        console.log('✅ [useKPIMonths] Received months (full):', data.availableMonths);

        // Convert full month names to abbreviated format
        const abbreviatedMonths = data.availableMonths.map(m => abbreviateMonthString(m));
        const abbreviatedCurrent = abbreviateMonthString(data.current || data.latest);

        console.log('✅ [useKPIMonths] Abbreviated months:', abbreviatedMonths);

        setMonths(data.months);
        setAvailableMonths(abbreviatedMonths);  // Use abbreviated format
        setCurrentMonth(abbreviatedCurrent);    // Use abbreviated format

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch months';
        setError(errorMsg);
        console.error('❌ [useKPIMonths] Error:', err);

        // Set fallback data (abbreviated format)
        const fallbackMonths = ['Dec 2025', 'Nov 2025', 'Oct 2025'];
        setAvailableMonths(fallbackMonths);
        setCurrentMonth(fallbackMonths[0]);

      } finally {
        setLoading(false);
      }
    }

    fetchMonths();
  }, []);

  return {
    months,              // Full month objects
    availableMonths,     // Simple string array: ["December 2025", "November 2025", ...]
    currentMonth,        // Default/latest month
    loading,
    error,
  };
}
