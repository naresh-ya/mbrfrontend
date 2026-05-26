"use client";

/**
 * Excel Agent Page
 *
 * Full-page chat interface for the Excel Analysis Agent
 */

import { ExcelAgentChat } from '@/components/excel-agent/excel-agent-chat';

export default function AgentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ExcelAgentChat />
      </div>
    </div>
  );
}
