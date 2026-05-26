"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from "../../src/components/dashboard/dashboard.module.css";
import { askExcelAgent, AgentMessage, AgentEvent } from '@/services/excel-agent-service';
import { RotatingText } from '@/components/excel-agent/rotating-text';
import { StepLine } from '@/components/excel-agent/step-line';

export default function DashboardPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setProcessingSteps([]);

    try {
      let stepCount = 0;
      const shownFields = new Set<string>();

      const answer = await askExcelAgent(input.trim(), (event: AgentEvent) => {
        if (event.type === 'STEP_STARTED') {
          stepCount++;
          const stepName = event.stepName || 'Processing...';

          // Custom messages for specific steps
          const customMessages: Record<string, string> = {
            'structure_analyzer': 'Reviewing PMI files...',
            'code_generator': 'Generating code securely...',
            'narrative_explainer': 'Understanding the code, please wait...',
            'results_logger': 'Saving results for learning agents...'
          };

          const message = customMessages[stepName] || stepName;
          setCurrentStep(`[${stepCount}] ${message}`);
          setProcessingSteps((prev) => [...prev, `[${stepCount}] STEP: ${stepName}${customMessages[stepName] ? ' - ' + customMessages[stepName] : ''}`]);
        }
        else if (event.type === 'TEXT_MESSAGE_CONTENT' && event.delta) {
          setStreamingText((prev) => prev + event.delta);
        }
        else if (event.type === 'STATE_SNAPSHOT' && event.snapshot) {
          const snapshot = event.snapshot;
          const newSteps: string[] = [];

          // Domain Validation (detailed)
          if (snapshot.domain_validation && !shownFields.has('domain_validation')) {
            const dv = snapshot.domain_validation;
            newSteps.push('[Domain Validation]');
            newSteps.push(`  Question Type: ${dv.question_type || '?'}`);
            const conf = dv.confidence_score || dv.confidence;
            if (conf) newSteps.push(`  Confidence: ${conf}%`);
            if (dv.reason) newSteps.push(`  Reason: ${dv.reason}`);
            shownFields.add('domain_validation');
          }

          // Intent Analysis (detailed)
          if (snapshot.analysis_spec && !shownFields.has('analysis_spec') &&
              typeof snapshot.analysis_spec === 'object' && Object.keys(snapshot.analysis_spec).length > 0) {
            const spec = snapshot.analysis_spec;
            newSteps.push('');
            newSteps.push('[Intent Analysis]');
            newSteps.push(`  Analysis Type: ${spec.analysis_type || spec.intent || '?'}`);
            if (spec.primary_metrics?.length)
              newSteps.push(`  Primary Metrics: ${spec.primary_metrics.join(', ')}`);
            if (spec.time_context)
              newSteps.push(`  Time Context: ${spec.time_context}`);
            if (spec.aggregations?.length)
              newSteps.push(`  Aggregations: ${spec.aggregations.join(', ')}`);
            shownFields.add('analysis_spec');
          }

          // Sheet Mapping (detailed)
          if (snapshot.mapping_result && !shownFields.has('mapping_result')) {
            const mapping = snapshot.mapping_result;
            newSteps.push('');
            newSteps.push('[Sheet Mapping]');
            if (mapping.confidence)
              newSteps.push(`  Overall Confidence: ${mapping.confidence}%`);

            const files = mapping.file_and_sheet_mapping || [];
            if (files.length > 0) {
              newSteps.push(`  Number of Sources: ${files.length}`);
              files.forEach((file: any, idx: number) => {
                newSteps.push('');
                if (files.length > 1) newSteps.push(`  Source ${idx + 1}:`);
                newSteps.push(`    File: ${file.file_name || '?'}`);
                newSteps.push(`    Sheet: ${file.tab_name || '?'}`);
                newSteps.push(`    Confidence: ${file.confidence || mapping.confidence}%`);
                if (file.why) newSteps.push(`    Why: ${file.why}`);
              });
            }
            shownFields.add('mapping_result');
          }

          if (newSteps.length > 0) {
            setProcessingSteps((prev) => [...prev, ...newSteps]);
          }
        }
        else if (event.type === 'RUN_FINISHED') {
          setCurrentStep('Complete!');
        }
        else if (event.type === 'RUN_ERROR') {
          setCurrentStep('Error: ' + (event.message || 'Unknown error'));
        }
      });

      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');
      setCurrentStep('');
      setProcessingSteps([]);
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
      setProcessingSteps([]);
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

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className={styles.container}>
      {/* Greeting - Always at top */}
      <div className={styles.greeting}>
        <h1>
          Good afternoon <span className={styles.name}>Shivam Sharma!</span>
        </h1>
        <p>What should we navigate today?</p>
      </div>

      {/* Chat Messages Area */}
      {messages.length > 0 && (
        <div className={styles.chatArea}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              <div className={styles.messageContent}>
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
                <span className={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {/* Processing steps display */}
          {loading && processingSteps.length > 0 && (
            <div className={styles.processingSteps}>
              {processingSteps.map((step, idx) => (
                <StepLine key={idx} text={step} />
              ))}
              {currentStep && (
                <div className={styles.processingStepActive}>
                  <span>{currentStep} - </span>
                  <RotatingText interval={2000} />
                </div>
              )}
            </div>
          )}

          {/* Streaming message */}
          {streamingText && (
            <div className={styles.assistantMessage}>
              <div className={styles.messageContent}>
                <div className={styles.markdownContent}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {streamingText}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* Input Box - Below chat */}
      <div className={styles.inputArea}>
        {loading && currentStep && messages.length === 0 && (
          <div className={styles.loadingBar}>
            <div className={styles.spinner}></div>
            <span>{currentStep} - </span>
            <RotatingText interval={2000} />
          </div>
        )}

        <div className={styles.searchBox}>
          <input
            placeholder="How may we help you today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <div className={styles.icons}>
            <button className={styles.iconBtn}>🎤</button>
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts - Show when no messages */}
      {messages.length === 0 && (
        <div className={styles.prompts}>
          {[
            "What does Dec look like?",
            "What should we be doing differently in Jan?",
            "Where are the top sales in India?",
          ].map((p, i) => (
            <div
              key={i}
              className={styles.promptCard}
              onClick={() => handlePromptClick(p)}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.promptIcon}>📈</span> {p}
            </div>
          ))}
        </div>
      )}

      {/* KPI Chips - COMMENTED OUT */}
      {/* <div className={styles.sectionHeader} style={{ marginTop: messages.length > 0 ? "3rem" : "5rem" }}>
        <span>Pinned Outcome Indicators</span>
        <a href="#">VIEW ALL OUTCOME INDICATORS →</a>
      </div>

      <div className={styles.kpiRow}>
        <KPI label="Total Revenue" value="15.5%" trend="up" />
        <div style={{ marginLeft: "2rem" }}>
          <KPI label="Profit margin" value="15.5%" trend="down" />
        </div>
        <div style={{ marginLeft: "2rem" }}>
          <KPI label="% Kit Sales via..." value="25.5%" trend="up" />
        </div>
        <div style={{ marginLeft: "2rem" }}>
          <KPI label="Customer churn" value="15.5%" trend="down" />
        </div>
      </div> */}

      {/* Pinned Indicators - COMMENTED OUT */}
      {/* <div className={styles.sectionHeader}>
        <span>Pinned Driving Indicators</span>
        <a href="#">VIEW ALL DRIVING INDICATORS →</a>
      </div>

      <div className={styles.indicatorRow}>
        {[1, 2, 3].map((n) => (
          <IndicatorCard key={n} />
        ))}
        <div className={styles.addCard}>+</div>
      </div> */}
    </div>
  );
}

/* Components */

type KPIProps = {
  label: string;
  value: string;
  trend: "up" | "down";
};

function KPI({ label, value, trend }: KPIProps) {
  return (
    <div className={styles.kpiChip}>
      <span>{label}</span>

      <span
        className={
          trend === "up" ? styles.kpiValueUp : styles.kpiValueDown
        }
      >
        {trend === "up" ? "↑ " : "↓ "}
        {value}
      </span>
    </div>
  );
}

function NarrativeCard() {
  return (
    <div className="card">
      <img src="https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Gateway-Of-India_600.jpg" />
      <div className="content">
        <h3>Maharashtra leads national sales, Northern states show growth potential</h3>
        <p>Jan 2026</p>
        <a href="#">READ →</a>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          gap: 16px;
        }
        img {
          width: 180px;
          height: 120px;
          border-radius: 6px;
          object-fit: cover;
        }
        h3 {
          font-size: 16px;
          margin: 0 0 8px;
        }
        p {
          opacity: 0.6;
          margin: 0 0 8px;
        }
      `}</style>
    </div>
  );
}

function IndicatorCard({ trend = "up" }) {
  // ✅ Smaller, smoother graph shape exactly like screenshot
  const graphPoints = `
    0,28 
    18,34 
    32,40 
    48,36 
    62,32 
    78,38 
    100,18
  `;

  return (
    <div className="indicator">
      <div className="topRow">
        <div className="title">Total Revenue</div>
        <div className={trend === "up" ? "badgeUp" : "badgeDown"}>
          {trend === "up" ? "↑" : "↓"} 15.5%
        </div>
      </div>

      <div className="value">$1.2 M</div>

      <svg
        width="100%"
        height="80"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="graph"
      >
        <defs>
          <linearGradient id="fillFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfe5ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#eef5ff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Fill */}
        <polygon
          fill="url(#fillFade)"
          points={`${graphPoints} 100,50 0,50`}
        />

        {/* Thin line (fixed!) */}
        <polyline
          fill="none"
          stroke="#1b78e2"
          strokeWidth="1.4"
          strokeLinejoin="round"
          points={graphPoints}
        />
      </svg>

      <style jsx>{`
        .indicator {
          width: 260px;
          background: #ffffff;
          border-radius: 12px;
          border: 2px solid #b7d9ff;
          padding: 14px 16px;
        }

        .topRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .title {
          font-size: 13px;
          opacity: 0.8;
        }

        .value {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .badgeUp {
          background: #d0f0da;
          color: #0f6b27;
          padding: 3px 10px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
        }

        .badgeDown {
          background: #ffd6d6;
          color: #b00020;
          padding: 3px 10px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
        }

        .graph {
          margin-top: 8px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
