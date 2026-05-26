"use client";

/**
 * Step Card Component
 *
 * Displays processing steps in beautiful card format
 */

import styles from '../dashboard/dashboard.module.css';

interface StepCardProps {
  stepNumber: number;
  stepName: string;
  content: string[];
  isActive?: boolean;
}

// Map step names to icons and friendly titles
const STEP_CONFIG: Record<string, { icon: string; title: string }> = {
  'intent': { icon: '🎯', title: 'Intent Analysis' },
  'mapping': { icon: '🗺️', title: 'Sheet Mapping' },
  'sheet_selector': { icon: '📋', title: 'Sheet Selection' },
  'structure_analyzer': { icon: '🔍', title: 'Structure Analysis' },
  'query_context_builder': { icon: '🧩', title: 'Context Building' },
  'code_generator': { icon: '⚙️', title: 'Code Generation' },
  'code_executor': { icon: '▶️', title: 'Code Execution' },
  'narrative_explainer': { icon: '📝', title: 'Narrative Creation' },
  'results_logger': { icon: '💾', title: 'Results Logging' },
};

export function StepCard({ stepNumber, stepName, content }: StepCardProps) {
  const config = STEP_CONFIG[stepName] || { icon: '📊', title: stepName };

  // Parse content into structured data
  const parsedContent = parseStepContent(content);

  // Debug
  console.log('StepCard Debug:', {
    stepNumber,
    stepName,
    contentLength: content.length,
    sectionsCount: parsedContent.sections.length,
    firstLine: content[0],
    parsedContent
  });

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <span className={styles.stepIcon}>{config.icon}</span>
        <span className={styles.stepNumber}>{stepNumber}</span>
        <span>{config.title}</span>
        {parsedContent.confidence && (
          <span className={`${styles.confidenceBadge} ${getConfidenceClass(parsedContent.confidence)}`}>
            ⚡ {parsedContent.confidence}%
          </span>
        )}
      </div>

      <div className={styles.stepContent}>
        {/* If no sections parsed, show raw content */}
        {parsedContent.sections.length === 0 && content.length > 0 && (
          <div>
            {content.map((line, idx) => (
              <div key={idx} style={{ fontSize: '13px', color: '#075985', padding: '4px 0', lineHeight: '1.7' }}>
                {line}
              </div>
            ))}
          </div>
        )}

        {parsedContent.sections.map((section, idx) => (
          <div key={idx}>
            {section.type === 'field' && (
              <div className={styles.stepDetail}>
                <span className={styles.stepLabel}>{section.label}:</span>
                <span className={styles.stepValue}>{section.value}</span>
              </div>
            )}

            {section.type === 'list' && (
              <div className={styles.stepDetail}>
                <span className={styles.stepLabel}>{section.label}:</span>
                <span className={styles.stepValue}>{section.items.join(', ')}</span>
              </div>
            )}

            {section.type === 'source' && (
              <div className={styles.sourceCard}>
                <div className={styles.sourceHeader}>
                  📄 {section.title}
                  {section.confidence && (
                    <span className={`${styles.confidenceBadge} ${getConfidenceClass(section.confidence)}`}>
                      {section.confidence}%
                    </span>
                  )}
                </div>
                {section.details.map((detail: any, detailIdx: number) => (
                  <div key={detailIdx} className={styles.stepDetail}>
                    <span className={styles.stepLabel}>{detail.label}:</span>
                    <span className={styles.stepValue}>{detail.value}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'divider' && <div className={styles.sectionDivider} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to determine confidence badge color
function getConfidenceClass(confidence: number): string {
  if (confidence >= 85) return 'high';
  if (confidence >= 70) return 'medium';
  return 'low';
}

// Parse plain text content into structured sections
function parseStepContent(lines: string[]) {
  const sections: any[] = [];
  let confidence: number | null = null;
  let currentSource: any = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and section headers in brackets
    if (!trimmed || trimmed.startsWith('[')) continue;

    // Extract overall confidence
    if (trimmed.includes('Overall Confidence:')) {
      const match = trimmed.match(/(\d+)%/);
      if (match) confidence = parseInt(match[1]);
      continue;
    }

    // Source block start
    if (trimmed.match(/^Source \d+:/)) {
      if (currentSource) sections.push(currentSource);
      currentSource = {
        type: 'source',
        title: trimmed.replace(':', ''),
        confidence: null,
        details: []
      };
      continue;
    }

    // Field within source
    if (currentSource && trimmed.includes(':')) {
      const [label, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();

      if (label.toLowerCase().includes('confidence')) {
        const match = value.match(/(\d+)%/);
        if (match) currentSource.confidence = parseInt(match[1]);
      } else {
        currentSource.details.push({
          label: label.trim(),
          value: value
        });
      }
      continue;
    }

    // Regular field
    if (trimmed.includes(':')) {
      const [label, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      sections.push({
        type: 'field',
        label: label.trim(),
        value: value
      });
    }
  }

  // Add last source if exists
  if (currentSource) sections.push(currentSource);

  return { sections, confidence };
}
