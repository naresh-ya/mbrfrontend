/**
 * Next.js API Route: iSynesis Story Data
 *
 * This server-side route:
 * 1. Receives requests from frontend
 * 2. Fetches data from AgentCore backend
 * 3. Returns formatted story data
 */

import { NextRequest, NextResponse } from 'next/server';
import { invokeAgentCore } from '@/lib/agentcore-invoker';

const USE_AGENTCORE = process.env.USE_AGENTCORE === 'true';
const LAMBDA_INSIGHTS_URL = process.env.LAMBDA_INSIGHTS_URL || 'https://xoc6chwxbi.execute-api.eu-west-1.amazonaws.com/prod';

// Always use Lambda for insights generation (no Python backend)
const INSIGHTS_API_URL = LAMBDA_INSIGHTS_URL;

/**
 * GET /api/isynesis
 *
 * Fetches story data from AgentCore backend
 */
export async function GET(request: NextRequest) {
  try {
    // Extract month and year from query parameters
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    console.log(`[iSynesis API] Request for month: ${month}, year: ${year}`);

    if (USE_AGENTCORE) {
      console.log('[iSynesis API] Fetching story data from AgentCore...');

      const result = await invokeAgentCore('get-story');

      if (result.status === 'error') {
        return NextResponse.json(
          {
            error: 'AgentCore request failed',
            message: result.error,
          },
          { status: 500 }
        );
      }

      console.log('[iSynesis API] Successfully fetched data from AgentCore');
      return NextResponse.json(result.data);
    }

    // Fallback to Lambda backend (no Python backend needed)
    // Fetch story data directly from Lambda
    console.log(`[iSynesis API] Fetching story data from Lambda...`);
    console.log(`[iSynesis API] Month: ${month}, Year: ${year}`);

    // Build URL with query parameters if month/year provided
    const storyUrl = new URL(`${INSIGHTS_API_URL}/api/isynesis/story`);
    if (month) storyUrl.searchParams.set('month', month);
    if (year) storyUrl.searchParams.set('year', year);

    console.log(`[iSynesis API] Fetching from: ${storyUrl.toString()}`);

    const response = await fetch(storyUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(180000), // 3 minutes
    });

    console.log('[iSynesis API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[iSynesis API] Backend error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'Backend request failed',
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[iSynesis API] Successfully fetched data');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[iSynesis API] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/isynesis/refresh
 *
 * Force refresh story data from AgentCore backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month } = body;

    console.log('[iSynesis API] Refreshing story data...', { year, month });

    if (USE_AGENTCORE) {
      console.log('[iSynesis API] Refreshing via AgentCore...');

      const result = await invokeAgentCore('refresh', { year, month });

      if (result.status === 'error') {
        return NextResponse.json(
          {
            error: 'AgentCore refresh failed',
            message: result.error,
          },
          { status: 500 }
        );
      }

      console.log('[iSynesis API] Successfully refreshed data via AgentCore');
      return NextResponse.json(result.data);
    }

    // Fallback to Lambda backend
    const url = new URL(`${LAMBDA_INSIGHTS_URL}/api/isynesis/refresh`);
    if (year) url.searchParams.append('year', year);
    if (month) url.searchParams.append('month', month);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(60000), // 60 seconds for refresh
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[iSynesis API] Refresh error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'Refresh failed',
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[iSynesis API] Successfully refreshed data');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[iSynesis API] Refresh error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
