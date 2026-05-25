"use client";

/**
 * Step Line Component
 *
 * Renders a processing step line with proper label/value styling
 */

import styles from '../dashboard/dashboard.module.css';

interface StepLineProps {
  text: string;
}

export function StepLine({ text }: StepLineProps) {
  // Check if line contains a label:value pattern
  const colonIndex = text.indexOf(':');

  if (colonIndex > 0 && colonIndex < text.length - 1) {
    // Split into label and value
    const label = text.substring(0, colonIndex + 1); // Include the colon
    const value = text.substring(colonIndex + 1);

    return (
      <div className={styles.processingStep}>
        <span style={{ fontWeight: 500, color: '#64748b' }}>{label}</span>
        <span style={{ fontWeight: 300, color: '#475569' }}>{value}</span>
      </div>
    );
  }

  // No colon, render as-is (headers, sections)
  return (
    <div className={styles.processingStep}>
      {text}
    </div>
  );
}
