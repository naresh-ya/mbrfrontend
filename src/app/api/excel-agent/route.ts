/**
 * Next.js API Route: Excel Agent via AgentCore
 *
 * This server-side route:
 * 1. Receives query from frontend
 * 2. Signs request with AWS credentials
 * 3. Calls AgentCore runtime
 * 4. Streams response back to frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as aws4 from 'aws4';
import { EXCEL_AGENT_CONFIG } from '@/lib/agentcore-config';

// Types
interface AgentRequest {
  threadId: string;
  runId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }>;
  state?: any;
  tools?: any[];
  context?: any[];
  forwardedProps?: any;
}

/**
 * Generate unique IDs
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate session ID for AgentCore runtime
 */
function generateSessionId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}${month}${day}${hour}${minute}${second}`;
  const random = Math.random().toString(36).substring(2, 15);
  return `session-${timestamp}-${random}`;
}

/**
 * Sign AWS request with SigV4
 */
async function signAgentCoreRequest(payload: string, sessionId: string) {
  // Get AWS credentials using default provider chain
  const provider = defaultProvider();
  const credentials = await provider();

  const url = new URL(EXCEL_AGENT_CONFIG.endpoint);

  const requestToSign = {
    host: url.host,
    path: url.pathname + url.search,
    method: 'POST',
    service: 'bedrock-agentcore',
    region: EXCEL_AGENT_CONFIG.region,
    headers: {
      'Content-Type': 'application/json',
      'X-Amzn-Bedrock-AgentCore-Runtime-Session-Id': sessionId,
    },
    body: payload,
  };

  // Sign the request
  const signed = aws4.sign(requestToSign, {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  });

  return signed;
}

/**
 * POST /api/excel-agent
 *
 * Body: { query: string }
 * Returns: SSE stream
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Build AgentCore request payload
    const threadId = body.threadId || generateId('thread');
    const runId = generateId('run');
    const messageId = generateId('msg');

    const payload: AgentRequest = {
      threadId,
      runId,
      messages: [
        {
          id: messageId,
          role: 'user',
          content: query,
        },
      ],
      state: {},
      tools: [],
      context: [],
      forwardedProps: {},
    };

    const payloadString = JSON.stringify(payload);

    // Generate session ID for AgentCore runtime
    const sessionId = generateSessionId();

    console.log('[Excel Agent] Request:', {
      threadId,
      runId,
      sessionId,
      query: query.substring(0, 100),
      endpoint: EXCEL_AGENT_CONFIG.endpoint,
    });

    // Sign the request
    const signedRequest = await signAgentCoreRequest(payloadString, sessionId);

    const headers = signedRequest.headers as Record<string, string>;

    console.log('[Excel Agent] Signed headers:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers['Authorization'] ? 'present' : 'missing',
      'X-Amzn-Bedrock-AgentCore-Runtime-Session-Id': headers['X-Amzn-Bedrock-AgentCore-Runtime-Session-Id'],
    });

    // Make request to AgentCore
    const response = await fetch(EXCEL_AGENT_CONFIG.endpoint, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: payloadString,
    });

    console.log('[Excel Agent] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Excel Agent] AgentCore error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'AgentCore request failed',
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // Stream the response back to client
    const stream = response.body;
    if (!stream) {
      return NextResponse.json(
        { error: 'No response stream from AgentCore' },
        { status: 500 }
      );
    }

    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Excel Agent] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
