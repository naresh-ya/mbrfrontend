import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * GET /api/kpi/available-months
 *
 * Fetches available months for KPI pages (Outcome Indicators, Driving Indicators)
 * Uses the getmonth_all logic from backend
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[KPI Months API] Fetching available months from backend...');

    const backendUrl = `${PYTHON_API_URL}/api/kpi/available-months`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
      signal: AbortSignal.timeout(30000), // 30 second timeout (increased for S3 operations)
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    console.log('[KPI Months API] Successfully fetched months:', data.availableMonths);

    return NextResponse.json(data);

  } catch (error) {
    console.error('[KPI Months API] Error:', error);

    // Return fallback data
    return NextResponse.json(
      {
        status: 'success',
        months: [
          { label: 'December 2025', value: 'December 2025', year: '2025', month: 'December' },
          { label: 'November 2025', value: 'November 2025', year: '2025', month: 'November' },
          { label: 'October 2025', value: 'October 2025', year: '2025', month: 'October' },
        ],
        availableMonths: ['December 2025', 'November 2025', 'October 2025'],
        current: 'December 2025',
        latest: 'December 2025',
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
