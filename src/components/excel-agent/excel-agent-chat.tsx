"use client";

/**
 * Excel Agent Chat Component
 *
 * Interactive chat interface to ask questions to the Excel Agent
 */

import { useState, useRef, useEffect } from 'react';
import { askExcelAgent, AgentMessage, AgentEvent, formatAgentEvent } from '@/services/excel-agent-service';
import { RotatingText } from './rotating-text';

export function ExcelAgentChat() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AgentMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingText('');
    setCurrentStep('Starting...');

    try {
      // Call Excel Agent with event streaming
      const answer = await askExcelAgent(input.trim(), (event: AgentEvent) => {
        // Handle different event types
        if (event.type === 'STEP_STARTED') {
          setCurrentStep(event.stepName || 'Processing...');
        } else if (event.type === 'TEXT_MESSAGE_CONTENT' && event.delta) {
          setStreamingText((prev) => prev + event.delta);
        } else if (event.type === 'STATE_SNAPSHOT') {
          // Could show intermediate state here
          console.log('State snapshot:', event.snapshot);
        } else if (event.type === 'RUN_FINISHED') {
          setCurrentStep('Complete!');
        } else if (event.type === 'RUN_ERROR') {
          setCurrentStep('Error: ' + (event.message || 'Unknown error'));
        }
      });

      // Add assistant message
      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');
      setCurrentStep('');
    } catch (error) {
      console.error('Excel Agent error:', error);

      const errorMessage: AgentMessage = {
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
      setCurrentStep('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] border rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">📊 Excel Analysis Agent</h2>
        <p className="text-sm text-blue-100">Ask questions about your Excel data</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">👋 Hi! I'm your Excel Analysis Agent</p>
            <p className="text-sm">Ask me anything about your data!</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'What is the total sales?',
                  'Show me brand analysis',
                  'What are the top regions?',
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(example)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
              <p className="whitespace-pre-wrap">{streamingText}</p>
              <div className="flex items-center mt-2">
                <p className="text-xs text-gray-500">
                  {currentStep && <span className="font-medium">{currentStep} - </span>}
                  <RotatingText className="text-blue-600 font-semibold" interval={2000} />
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50 rounded-b-lg">
        {currentStep && loading && (
          <div className="mb-2 text-sm flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-gray-700">{currentStep}</span>
            <span className="mx-2 text-gray-400">-</span>
            <RotatingText className="text-blue-600 font-semibold" interval={2000} />
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your Excel data..."
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
