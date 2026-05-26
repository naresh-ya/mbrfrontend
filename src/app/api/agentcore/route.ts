/**
 * Next.js API Route: AgentCore Insights Generation
 *
 * This server-side route:
 * 1. Receives requests from frontend
 * 2. Invokes AgentCore handler via Python backend API
 * 3. Returns complete workflow results
 */

import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * POST /api/agentcore
 *
 * Invokes AgentCore workflow for insights generation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, country = 'India' } = body;

    // Validate required parameters
    if (!year || !month) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          message: 'Both year and month are required',
        },
        { status: 400 }
      );
    }

    console.log(`[AgentCore API] Invoking workflow for ${month} ${year} (${country})...`);

    // Call Python backend AgentCore endpoint
    const response = await fetch(`${PYTHON_API_URL}/api/agentcore/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        month,
        country,
      }),
      // AgentCore workflow takes 5-15 minutes
      signal: AbortSignal.timeout(900000), // 15 minutes
    });

    console.log('[AgentCore API] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[AgentCore API] Backend error:', response.status, errorData);
      return NextResponse.json(
        {
          error: 'AgentCore invocation failed',
          status: response.status,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[AgentCore API] Workflow completed successfully');
    console.log(`[AgentCore API] Results: ${data.data?.metadata?.metrics_count} metrics, ${data.data?.metadata?.risks_count} risks, ${data.data?.metadata?.actions_count} actions`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AgentCore API] Error:', error);

    // Check if it's a timeout error
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          error: 'Request timeout',
          message: 'AgentCore workflow exceeded 15 minute timeout. The workflow may still be running on the backend.',
        },
        { status: 504 }
      );
    }

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
 * GET /api/agentcore/health
 *
 * Check AgentCore handler health status
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[AgentCore API] Checking health...');

    const response = await fetch(`${PYTHON_API_URL}/api/agentcore/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 seconds
    });

    if (!response.ok) {
      console.error('[AgentCore API] Health check failed:', response.status);
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: `Backend returned ${response.status}`,
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    console.log('[AgentCore API] Health check passed');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AgentCore API] Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
