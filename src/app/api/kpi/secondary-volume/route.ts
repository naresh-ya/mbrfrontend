import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.LAMBDA_KPI_API_URL || 'https://g3hjzqs2wf.execute-api.eu-west-1.amazonaws.com/dev';

// Increase timeout for this route
export const maxDuration = 60;

/**
 * Expand abbreviated month name to full name
 * "Dec" → "December", "Nov" → "November", etc.
 */
function expandMonthName(abbr: string): string {
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

export async function GET(request: NextRequest) {
  try {
    // Get month parameter from query string (defaults to "December 2025")
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || 'December 2025';

    // Parse month string "Dec 2025" or "December 2025" into parts
    const parts = month.trim().split(' ');
    let monthName = parts[0];
    const year = parts[1] || '2025';

    // Expand abbreviated month name if needed
    monthName = expandMonthName(monthName);

    console.log(`[Secondary Volume API] Fetching data for ${monthName} ${year}`);

    // Forward to Python backend
    const backendUrl = `${BACKEND_URL}/api/kpi/secondary-volume?month=${encodeURIComponent(monthName)}&year=${encodeURIComponent(year)}`;

    const response = await fetch(backendUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Secondary Volume API] Successfully fetched data`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Secondary Volume API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch secondary volume data' },
      { status: 500 }
    );
  }
}
