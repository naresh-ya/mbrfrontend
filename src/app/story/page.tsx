"use client";

import { useEffect, useState } from "react";
import StoryOfMonthPMI from "@/components/exenarrative/execstory";
import { useUIMonth } from "@/contexts/UIMonthContext";

export default function StoryPage() {
  const [storyData, setStoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Checking insights...');

  // Use global UI month context
  const { currentMonth, currentMonthName, currentYear, config: uiMonthConfig } = useUIMonth();
  const generatedAt = uiMonthConfig?.generatedAt || uiMonthConfig?.lastUpdated || "";

  // Fetch story data when period changes
  const fetchStoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingMessage(`Loading story for ${currentMonth}...`);

      console.log(`\n${'='.repeat(70)}`);
      console.log(`📖 STORY PAGE: Fetching story data for: ${currentMonth}`);
      console.log(`${'='.repeat(70)}`);

      // Parse current period to get month and year
      const [month, year] = currentMonth.split(' ');

      console.log(`   📍 Parsed: month="${month}", year="${year}"`);

      // Fetch story data directly - AgentCore automatically handles period
      const timestamp = Date.now();
      const response = await fetch(`/api/isynesis?t=${timestamp}&month=${month}&year=${year}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch story data: ${response.statusText}`);
      }

      const result = await response.json();

      console.log(`   ✅ Got story response:`, {
        status: result.status,
        period: result.period,
        generated_at: result.generated_at,
        source: result.source
      });

      if (result.status === 'success' && result.data) {
        setStoryData(result.data);
        console.log(`   ✅ Story data loaded for: ${result.period || currentMonth}, generated: ${result.generated_at || 'N/A'}`);
        console.log(`   📊 Story data month title:`, result.data?.monthTitle);
        console.log(`${'='.repeat(70)}\n`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching story data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when currentMonth changes
  useEffect(() => {
    if (currentMonth) {
      console.log(`🔄 Current month changed to: ${currentMonth}, fetching story data...`);
      fetchStoryData();
    }
  }, [currentMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #1a56db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loadingMessage}</p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          {loadingMessage.includes('Checking')
            ? 'This may take 1-2 minutes if insights need to be generated...'
            : 'Almost there...'}
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <p style={{ color: '#d32f2f', fontSize: '1.2rem' }}>❌ Error loading story data</p>
        <p style={{ color: '#666' }}>{error}</p>
        <button
          onClick={fetchStoryData}
          style={{
            padding: '0.5rem 1rem',
            background: '#1a56db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Format timestamp for display
  const formatGeneratedTime = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  return (
    <div>
      <StoryOfMonthPMI data={storyData} />
    </div>
  );
}

