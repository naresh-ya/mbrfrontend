'use client';

/**
 * UI Month Context
 *
 * Provides global state management for the current UI month across all pages.
 * Fetches data from S3 bucket via Python backend API.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getCurrentUIMonth,
  getAvailableUIMonths,
  setUIMonth,
  parseMonthString,
  abbreviateMonthName,
  type UIMonthConfig,
  type AvailableMonth,
} from '@/lib/ui-month';

interface UIMonthContextType {
  // Current month configuration
  currentMonth: string; // e.g., "December 2025"
  currentMonthAbbr: string; // e.g., "Dec 2025"
  currentYear: string;
  currentMonthName: string; // e.g., "December"
  config: UIMonthConfig | null;

  // Available months
  availableMonths: AvailableMonth[];
  availableMonthsAbbr: string[]; // For dropdowns: ["Dec 2025", "Nov 2025", ...]

  // State flags
  loading: boolean;
  error: string | null;

  // Actions
  changeMonth: (monthStr: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const UIMonthContext = createContext<UIMonthContextType | undefined>(undefined);

interface UIMonthProviderProps {
  children: ReactNode;
}

export function UIMonthProvider({ children }: UIMonthProviderProps) {
  const [config, setConfig] = useState<UIMonthConfig | null>(null);
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PERSISTENCE: Load saved selection from localStorage
  const loadSavedSelection = useCallback(() => {
    if (typeof window === 'undefined') return null;

    try {
      const savedMonth = localStorage.getItem('isynesis_selected_month');
      const savedYear = localStorage.getItem('isynesis_selected_year');

      if (savedMonth && savedYear) {
        console.log(`📂 Restored selection from localStorage: ${savedMonth} ${savedYear}`);
        return { month: savedMonth, year: savedYear };
      }
    } catch (err) {
      console.warn('Failed to load from localStorage:', err);
    }

    return null;
  }, []);

  // PERSISTENCE: Save selection to localStorage
  const saveSelection = useCallback((month: string, year: string) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('isynesis_selected_month', month);
      localStorage.setItem('isynesis_selected_year', year);
      console.log(`💾 Saved selection to localStorage: ${month} ${year}`);
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }, []);

  // Fetch current month and available months
  const fetchData = useCallback(async (forceMonth?: { month: string; year: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch available months first
      const monthsData = await getAvailableUIMonths();
      setAvailableMonths(monthsData.months);

      let monthConfig: UIMonthConfig;

      if (forceMonth) {
        // Use the forced month (from localStorage)
        console.log(`🔧 Using saved selection: ${forceMonth.month} ${forceMonth.year}`);

        // Set the period in backend
        try {
          monthConfig = await setUIMonth(forceMonth.year, forceMonth.month);
        } catch (err) {
          console.warn('Failed to set saved period, using defaults:', err);
          monthConfig = {
            country: 'India',
            year: forceMonth.year,
            month: forceMonth.month,
            period: `${forceMonth.month} ${forceMonth.year}`,
            lastRefresh: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          };
        }
      } else {
        // Fetch current month from API (only on first load if no saved selection)
        monthConfig = await getCurrentUIMonth();

        // Save this as the default
        saveSelection(monthConfig.month, monthConfig.year);
      }

      setConfig(monthConfig);
      console.log('✓ UI Month loaded:', monthConfig.period);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load UI month';
      setError(errorMsg);
      console.error('Error loading UI month:', err);

      // Set default fallback
      setConfig({
        country: 'India',
        year: '2025',
        month: 'December',
        period: 'December 2025',
        lastRefresh: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
      setAvailableMonths([
        { label: 'December 2025', value: 'December 2025', year: '2025', month: 'December', sortOrder: 202512 },
        { label: 'November 2025', value: 'November 2025', year: '2025', month: 'November', sortOrder: 202511 },
        { label: 'October 2025', value: 'October 2025', year: '2025', month: 'October', sortOrder: 202510 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [saveSelection]);

  // Initial load: restore from localStorage if available
  useEffect(() => {
    const savedSelection = loadSavedSelection();

    if (savedSelection) {
      // Use saved selection
      fetchData(savedSelection);
    } else {
      // No saved selection, fetch default
      fetchData();
    }
  }, [fetchData, loadSavedSelection]);

  // REMOVED: Automatic polling that was causing rollback
  // The polling was fetching from API Gateway every 30 seconds and overwriting user selection
  // Now the selection persists until user explicitly changes it

  // Change month handler
  const changeMonth = useCallback(async (monthStr: string) => {
    try {
      setLoading(true);
      setError(null);

      // Parse month string (e.g., "Dec 2025" or "December 2025")
      const { month, year } = parseMonthString(monthStr);

      console.log(`📅 Changing UI month to: ${month} ${year}`);

      // Save to localStorage FIRST (so it persists immediately)
      saveSelection(month, year);

      // Update via API (this may trigger insights generation)
      const newConfig = await setUIMonth(year, month);

      setConfig(newConfig);

      console.log('✓ UI Month changed successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change month';
      setError(errorMsg);
      console.error('Error changing month:', err);
      throw err; // Re-throw so caller can handle
    } finally {
      setLoading(false);
    }
  }, [saveSelection]);

  // Refresh data
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Derived values
  const currentMonth = config?.period || 'December 2025';
  const currentMonthName = config?.month || 'December';
  const currentYear = config?.year || '2025';
  const currentMonthAbbr = `${abbreviateMonthName(currentMonthName)} ${currentYear}`;

  // Generate abbreviated month options for dropdowns
  const availableMonthsAbbr = availableMonths.map((m) => {
    const abbr = abbreviateMonthName(m.month);
    return `${abbr} ${m.year}`;
  });

  const value: UIMonthContextType = {
    currentMonth,
    currentMonthAbbr,
    currentYear,
    currentMonthName,
    config,
    availableMonths,
    availableMonthsAbbr,
    loading,
    error,
    changeMonth,
    refresh,
  };

  return <UIMonthContext.Provider value={value}>{children}</UIMonthContext.Provider>;
}

/**
 * Hook to access UI Month context
 *
 * Usage:
 * ```tsx
 * const { currentMonth, availableMonths, changeMonth } = useUIMonth();
 * ```
 */
export function useUIMonth() {
  const context = useContext(UIMonthContext);
  if (context === undefined) {
    throw new Error('useUIMonth must be used within a UIMonthProvider');
  }
  return context;
}
