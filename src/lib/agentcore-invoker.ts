/**
 * AgentCore Invoker - Utility to invoke AgentCore runtime from Next.js API routes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const AGENTCORE_CLI_PATH = process.env.AGENTCORE_CLI_PATH || path.join(process.cwd(), '../invoke_agentcore_cli.py');
const USE_AGENTCORE = process.env.USE_AGENTCORE === 'true';

export interface AgentCoreResponse {
  status: string;
  data?: any;
  error?: string;
}

/**
 * Invoke AgentCore runtime with specified action and parameters
 */
export async function invokeAgentCore(
  action: string,
  params: Record<string, string> = {}
): Promise<AgentCoreResponse> {
  if (!USE_AGENTCORE) {
    throw new Error('AgentCore is not enabled. Set USE_AGENTCORE=true in environment.');
  }

  try {
    // Build command with parameters
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    const command = `python "${AGENTCORE_CLI_PATH}" ${action} ${paramString}`;

    console.log(`[AgentCore] Invoking: ${action}`, params);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 600000, // 10 minutes
    });

    if (stderr) {
      console.error('[AgentCore] Error:', stderr);
      const errorData = JSON.parse(stderr);
      return {
        status: 'error',
        error: errorData.error || 'Unknown error',
      };
    }

    const result = JSON.parse(stdout);
    console.log('[AgentCore] Success:', action);

    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('[AgentCore] Invocation failed:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
