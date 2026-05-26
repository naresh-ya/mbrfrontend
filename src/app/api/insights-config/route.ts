/**
 * Next.js API Route: Insights Configuration
 *
 * Provides configuration data from AgentCore backend including:
 * - Available months
 * - Current selected period
 * - Last updated timestamp
 */

import { NextRequest, NextResponse } from 'next/server';
import { invokeAgentCore } from '@/lib/agentcore-invoker';

const USE_AGENTCORE = process.env.USE_AGENTCORE === 'true';
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const LAMBDA_API_URL = process.env.LAMBDA_API_URL || 'https://v8d3212ixc.execute-api.eu-west-1.amazonaws.com/dev';
const LAMBDA_INSIGHTS_URL = process.env.LAMBDA_INSIGHTS_URL || process.env.PYTHON_API_URL || 'http://localhost:8000';

// Use Lambda for insights generation (set via environment variable)
const USE_LAMBDA_INSIGHTS = process.env.USE_LAMBDA_INSIGHTS === 'true';

// Choose the right API URL based on configuration
const INSIGHTS_API_URL = USE_LAMBDA_INSIGHTS ? LAMBDA_INSIGHTS_URL : PYTHON_API_URL;

/**
 * GET /api/insights-config
 *
 * Fetches configuration from AgentCore backend
 */
export async function GET(request: NextRequest) {
  try {
    if (USE_AGENTCORE) {
      console.log('[Insights Config] Fetching configuration from AgentCore...');

      // AgentCore doesn't have get-config, so we get it from story metadata
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

      // Extract period from story response
      const period = result.data?.period || 'December 2025';
      const [month, year] = period.split(' ');
      const config = {
        country: 'India',
        year,
        month,
        period,
        last_updated: result.data?.last_updated || new Date().toISOString(),
        generated_at: result.data?.generated_at || new Date().toISOString(),
      };

      console.log('[Insights Config] Successfully fetched config from AgentCore');
      return NextResponse.json(config);
    }

    // Fallback to HTTP backend
    console.log(`[Insights Config] Fetching configuration from ${USE_LAMBDA_INSIGHTS ? 'Lambda' : 'Python backend'}...`);

    const response = await fetch(`${INSIGHTS_API_URL}/api/isynesis/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Insights Config] Backend error:', response.status, errorText);
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
    console.log('[Insights Config] Successfully fetched config:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Insights Config] Error:', error);
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
 * GET /api/insights-config/months
 *
 * Fetches available months from Python backend
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'get-months') {
    try {
      console.log('[Insights Config] Fetching available months...');

      if (USE_AGENTCORE) {
        console.log('[Insights Config] Fetching months via AgentCore...');

        const result = await invokeAgentCore('get-months');

        if (result.status === 'error') {
          return NextResponse.json(
            {
              error: 'AgentCore request failed',
              message: result.error,
            },
            { status: 500 }
          );
        }

        console.log('[Insights Config] Months fetched successfully via AgentCore');
        return NextResponse.json(result.data);
      }

      // Fallback to HTTP backend
      const response = await fetch(`${INSIGHTS_API_URL}/api/insights/months`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const result = await response.json();

      // Lambda returns { status, data: { months, ... } }
      // We need to unwrap and return just the inner data
      const data = result.data || result;
      return NextResponse.json(data);
    } catch (error) {
      console.error('[Insights Config] Error fetching months:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch months',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }

  if (action === 'set-period') {
    try {
      const body = await request.json();
      const { year, month } = body;

      console.log('[Insights Config] Setting period:', { year, month });

      if (USE_AGENTCORE) {
        console.log('[Insights Config] Setting period via AgentCore...');

        const result = await invokeAgentCore('set-period', { year, month });

        if (result.status === 'error') {
          return NextResponse.json(
            {
              error: 'AgentCore request failed',
              message: result.error,
            },
            { status: 500 }
          );
        }

        console.log('[Insights Config] Period set successfully via AgentCore');
        return NextResponse.json(result.data);
      }

      // Fallback to HTTP backend
      const response = await fetch(`${INSIGHTS_API_URL}/api/insights/set-period`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[Insights Config] Backend error:', response.status, errorText);
        return NextResponse.json(
          {
            error: 'Failed to set period',
            status: response.status,
            details: errorText,
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('[Insights Config] Period set successfully:', data);
      return NextResponse.json(data);
    } catch (error) {
      console.error('[Insights Config] Error setting period:', error);
      return NextResponse.json(
        {
          error: 'Failed to set period',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  );
}
