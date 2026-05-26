/**
 * UI Month Management Utility
 *
 * Provides centralized functions to fetch and manage the current UI month
 * from S3 bucket via Lambda API.
 */

// Use Lambda backend via Next.js API routes (avoids CORS issues)
// This calls Next.js /api/insights-config which proxies to Lambda
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/insights-config';

export interface UIMonthConfig {
  country: string;
  year: string;
  month: string;
  period: string;
  lastRefresh: string;
  lastUpdated: string;
  generatedAt?: string;
}

export interface AvailableMonth {
  label: string;
  value: string;
  year: string;
  month: string;
  sortOrder: number;
}

export interface AvailableMonthsResponse {
  status: string;
  months: AvailableMonth[];
  current: string;
  latest: string;
  lastUpdated: string;
}

/**
 * Fetches the current UI month configuration from Lambda via Next.js API route
 * This reads from: s3://mbr-data-lake/raw_data/India/{year}/{month}/
 */
export async function getCurrentUIMonth(): Promise<UIMonthConfig> {
  try {
    // Call Next.js API route which proxies to Lambda
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch UI month config: ${response.status}`);
    }

    const data = await response.json();

    return {
      country: data.country || 'India',
      year: data.year || '2025',
      month: data.month || 'December',
      period: data.period || `${data.month} ${data.year}`,
      lastRefresh: data.last_refresh || data.lastUpdated || new Date().toISOString(),
      lastUpdated: data.last_updated || data.lastUpdated || new Date().toISOString(),
      generatedAt: data.generated_at || data.generatedAt,
    };
  } catch (error) {
    console.error('Error fetching current UI month:', error);
    throw error;
  }
}

/**
 * Fetches available months from Lambda via Next.js API route
 * Returns the last 3 months sorted by date (newest first)
 */
export async function getAvailableUIMonths(): Promise<AvailableMonthsResponse> {
  try {
    // Call Next.js API route with query parameter
    const response = await fetch(`${API_URL}?action=get-months`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch available months: ${response.status}`);
    }

    const result = await response.json();

    // Transform Lambda response to match expected format
    return {
      status: result.status || 'success',
      months: (result.months || []).map((m: any) => ({
        label: m.label || `${m.month} ${m.year}`,
        value: m.value || `${m.month} ${m.year}`,
        year: m.year,
        month: m.month,
        sortOrder: m.sortOrder || m.sort_order || 0
      })),
      current: result.current || result.months?.[0]?.label || '',
      latest: result.latest || result.months?.[0]?.label || '',
      lastUpdated: result.last_updated || result.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching available UI months:', error);
    throw error;
  }
}

/**
 * Sets the current UI month/period via Lambda API (through Next.js proxy)
 * This updates the configuration and may trigger insights generation
 */
export async function setUIMonth(year: string, month: string): Promise<UIMonthConfig> {
  try {
    // Call Next.js API route with action parameter
    const response = await fetch(`${API_URL}?action=set-period`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, month }),
      signal: AbortSignal.timeout(180000), // 3 minutes - may trigger insights generation
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.message || errorData.error || `Failed to set UI month: ${response.status}`);
    }

    const result = await response.json();

    // Return the updated config
    return {
      country: result.country || 'India',
      year: result.year || year,
      month: result.month || month,
      period: result.period || `${month} ${year}`,
      lastRefresh: result.last_updated || result.lastUpdated || new Date().toISOString(),
      lastUpdated: result.last_updated || result.lastUpdated || new Date().toISOString(),
      generatedAt: result.generated_at || result.generatedAt,
    };
  } catch (error) {
    console.error('Error setting UI month:', error);
    throw error;
  }
}

/**
 * Helper to expand month abbreviation to full name
 */
export function expandMonthName(abbr: string): string {
  const monthMap: { [key: string]: string } = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December',
  };
  return monthMap[abbr] || abbr;
}

/**
 * Helper to abbreviate full month name
 */
export function abbreviateMonthName(fullName: string): string {
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
  return monthMap[fullName] || fullName;
}

/**
 * Parse month string like "Dec 2025" or "December 2025" into components
 */
export function parseMonthString(monthStr: string): { month: string; year: string } {
  const parts = monthStr.trim().split(' ');
  if (parts.length >= 2) {
    const monthPart = parts[0];
    const year = parts[1];
    const month = expandMonthName(monthPart);
    return { month, year };
  }
  throw new Error(`Invalid month string format: ${monthStr}`);
}
