/**
 * React Hook: useAgentCore
 *
 * Easy-to-use hook for invoking AgentCore insights generation
 */

import { useState, useCallback } from 'react';

export interface AgentCoreRequest {
  year: string;
  month: string;
  country?: string;
}

export interface AgentCoreMetadata {
  timestamp: string;
  metrics_count: number;
  risks_count: number;
  actions_count: number;
  narrative_length: number;
}

export interface AgentCoreWorkflowResults {
  data_loaded: boolean;
  metrics_computed: Record<string, any>;
  knowledge_base: Record<string, any>;
  risks_identified: any[];
  actions_generated: any[];
  narrative_generated: string;
  final_output: Record<string, any>;
}

export interface AgentCoreResponse {
  status: 'success' | 'error';
  period?: {
    year: string;
    month: string;
    country: string;
  };
  workflow_results?: AgentCoreWorkflowResults;
  metadata?: AgentCoreMetadata;
  error?: string;
  error_type?: string;
}

export interface UseAgentCoreReturn {
  /** Invoke the AgentCore workflow */
  invoke: (request: AgentCoreRequest) => Promise<AgentCoreResponse>;
  /** Check AgentCore health status */
  checkHealth: () => Promise<{ status: string; agentcore_handler?: string }>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Latest results */
  results: AgentCoreResponse | null;
  /** Progress indicator (if available) */
  progress: string | null;
}

/**
 * Hook for interacting with AgentCore insights generation
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { invoke, loading, error, results } = useAgentCore();
 *
 *   const handleGenerate = async () => {
 *     const result = await invoke({
 *       year: "2025",
 *       month: "December",
 *       country: "India"
 *     });
 *
 *     if (result.status === 'success') {
 *       console.log('Metrics:', result.metadata?.metrics_count);
 *       console.log('Risks:', result.metadata?.risks_count);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleGenerate} disabled={loading}>
 *       {loading ? 'Generating...' : 'Generate Insights'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAgentCore(): UseAgentCoreReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AgentCoreResponse | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  /**
   * Invoke AgentCore workflow
   */
  const invoke = useCallback(async (request: AgentCoreRequest): Promise<AgentCoreResponse> => {
    setLoading(true);
    setError(null);
    setProgress('Initializing workflow...');

    try {
      console.log('[useAgentCore] Invoking workflow:', request);

      const response = await fetch('/api/agentcore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      setProgress('Processing response...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      console.log('[useAgentCore] Workflow completed successfully');

      const agentCoreResponse: AgentCoreResponse = data.data || data;
      setResults(agentCoreResponse);
      setProgress(null);

      return agentCoreResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useAgentCore] Error:', errorMessage);
      setError(errorMessage);
      setProgress(null);

      return {
        status: 'error',
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check AgentCore health
   */
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/agentcore', {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('[useAgentCore] Health check error:', err);
      return {
        status: 'unhealthy',
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }, []);

  return {
    invoke,
    checkHealth,
    loading,
    error,
    results,
    progress,
  };
}
