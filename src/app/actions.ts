'use server';

// AI functionality removed — frontend-only build.
// These stubs return a neutral response so UI calls won't break.
export async function askAIAction(_input: any): Promise<{ answer: string }> {
  return { answer: 'AI features are disabled in this frontend-only build.' };
}

export async function generateSummaryAction(_input: any): Promise<{ summary: string }> {
  return { summary: 'AI features are disabled in this frontend-only build.' };
}
