/**
 * AWS Bedrock AgentCore Client
 * Server-side utility for invoking AgentCore runtime via Python CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

// Path to Python CLI script (in parent isynesis directory)
const SCRIPT_PATH = path.join(process.cwd(), '..', 'invoke_agentcore_cli.py');

/**
 * Invoke AgentCore via Python CLI script
 */
async function invokeAgentCore(action: string, params?: Record<string, any>): Promise<any> {
  try {
    // Build command with parameters
    let command = `python "${SCRIPT_PATH}" ${action}`;

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        command += ` ${key}="${value}"`;
      }
    }

    console.log('[AgentCore Client] Executing:', command);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minutes timeout
    });

    if (stderr) {
      console.error('[AgentCore Client] Python stderr:', stderr);

      // Try to parse error as JSON
      try {
        const errorData = JSON.parse(stderr);
        throw new Error(errorData.error || 'AgentCore invocation failed');
      } catch {
        throw new Error(stderr);
      }
    }

    if (!stdout || stdout.trim() === '') {
      throw new Error('No output from AgentCore');
    }

    const result = JSON.parse(stdout);
    console.log('[AgentCore Client] Success:', action);

    return result;
  } catch (error) {
    console.error('[AgentCore Client] Error:', error);
    throw new Error(`AgentCore invocation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get story data from AgentCore
 */
export async function getStoryData(): Promise<any> {
  return invokeAgentCore('get-story');
}

/**
 * Get available months from AgentCore
 */
export async function getAvailableMonths(): Promise<any> {
  return invokeAgentCore('get-months');
}

/**
 * Set active period in AgentCore
 */
export async function setPeriod(year: string, month: string): Promise<any> {
  return invokeAgentCore('set-period', { year, month });
}

/**
 * Refresh data in AgentCore
 */
export async function refreshData(year?: string, month?: string): Promise<any> {
  const params: Record<string, any> = {};
  if (year) params.year = year;
  if (month) params.month = month;
  return invokeAgentCore('refresh', params);
}
