/**
 * Excel Agent Service
 *
 * Frontend service to interact with Excel Agent via AgentCore
 */

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AgentEvent {
  type: string;
  stepName?: string;
  delta?: string;
  snapshot?: any;
  outcome?: any;
  message?: string;
  code?: string;
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * Call Excel Agent and get streaming response
 */
export async function askExcelAgent(
  query: string,
  onEvent?: (event: AgentEvent) => void
): Promise<string> {
  const response = await fetch('/api/excel-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to call Excel Agent');
  }

  if (!response.body) {
    throw new Error('No response stream');
  }

  // Parse SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalAnswer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim() || !line.startsWith('data: ')) continue;

      const data = line.substring(6); // Remove 'data: ' prefix
      if (data === '[DONE]') continue;

      try {
        const event: AgentEvent = JSON.parse(data);

        // Call event handler if provided
        if (onEvent) {
          onEvent(event);
        }

        // Accumulate text content
        if (event.type === 'TEXT_MESSAGE_CONTENT' && event.delta) {
          finalAnswer += event.delta;
        }

        // Capture final answer from STATE_SNAPSHOT
        if (event.type === 'STATE_SNAPSHOT' && event.snapshot?.final_answer) {
          const answer = event.snapshot.final_answer;
          // Skip progress messages
          if (answer && !['🔍 Analyzing your query...', '💻 Generating analysis code...', '📊 Preparing results...'].includes(answer)) {
            finalAnswer = answer;
          }
        }

        // Capture answer from MESSAGES_SNAPSHOT
        if (event.type === 'MESSAGES_SNAPSHOT') {
          const messages = event.messages || [];
          for (const msg of messages) {
            if (msg.role === 'assistant' && msg.content) {
              finalAnswer = finalAnswer || msg.content;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse SSE event:', e, data);
      }
    }
  }

  return finalAnswer || 'No answer received from agent';
}

/**
 * Get event type label for display
 */
export function getEventLabel(eventType: string): string {
  const labels: Record<string, string> = {
    RUN_STARTED: '🚀 Starting analysis...',
    STEP_STARTED: '⚙️ Processing...',
    TEXT_MESSAGE_CONTENT: '💬 Generating response...',
    STATE_SNAPSHOT: '📊 Updating...',
    RUN_FINISHED: '✅ Complete',
    RUN_ERROR: '❌ Error',
  };
  return labels[eventType] || eventType;
}

/**
 * Format agent event for display
 */
export function formatAgentEvent(event: AgentEvent): string {
  if (event.type === 'STEP_STARTED') {
    return `Processing: ${event.stepName || 'unknown'}`;
  }
  if (event.type === 'RUN_ERROR') {
    return `Error: ${event.message || 'Unknown error'}`;
  }
  return getEventLabel(event.type);
}
