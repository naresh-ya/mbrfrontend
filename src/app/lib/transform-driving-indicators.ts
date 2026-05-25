/**
 * Transform S3 Driving Indicators data to match the UI KpiData structure
 * Source: metadata/dynamic/India/2025/{Month}/kpi/
 * Files: sales_kpi_insights.json (7 cards) + nielsen_insights.json (4 cards)
 */

// ==================== DRIVING INDICATORS (SALES) ====================

/**
 * Helper function to get the correct category label for each KPI
 */
function getCategoryForKPI(kpiName: string, hasTarget: number | undefined): string {
  // If has target, it's percentage-based (SFA, Bias)
  if (hasTarget !== undefined) {
    return "%";
  }

  // Map specific KPIs to their categories
  const categoryMap: Record<string, string> = {
    "MI ECC": "'000",
    "MI Cities": "Number",
    "IPM DSD": "'000",
    "IPM Availability": "Number",
    "Visibility": "Number"
  };

  return categoryMap[kpiName] || "Units"; // fallback to "Units" if not mapped
}

export interface S3DrivingIndicatorCard {
  Monthly: {
    Month: string;
    Actual: number;
    Target?: number;
    Achievement?: number;
    Advanced_Indicator?: string;
    CM_vs_L3M: {
      Trend: string;
      Delta: number;
    };
    L3M_Avg: number;
    Pct_Change_vs_L3M?: number;
    YTD_Avg?: number;
    Pct_YTD_from_CM?: number;
  };
  Trend_Line: {
    [month: string]: number;
  };
  Insight: string;
}

export interface S3DrivingIndicatorsData {
  "Sales Forecasting Accuracy (SFA)": S3DrivingIndicatorCard;
  "Bias": S3DrivingIndicatorCard;
  "MI ECC": S3DrivingIndicatorCard;
  "MI Cities": S3DrivingIndicatorCard;
  "IPM DSD": S3DrivingIndicatorCard;
  "IPM Availability": S3DrivingIndicatorCard;
  "Visibility": S3DrivingIndicatorCard;
}

export function transformDrivingIndicatorsFromS3(salesData: S3DrivingIndicatorsData) {
  const cards = [];
  let order = 1;

  const kpiNames = [
    "Sales Forecasting Accuracy (SFA)",
    "Bias",
    "MI ECC",
    "MI Cities",
    "IPM DSD",
    "IPM Availability",
    "Visibility"
  ];

  for (const kpiName of kpiNames) {
    const kpiData = salesData[kpiName as keyof S3DrivingIndicatorsData];
    if (!kpiData) continue;

    // Convert trend line to chart data
    const chartData = Object.entries(kpiData.Trend_Line).map(([month, value]) => ({
      month: month,
      value: value,
    }));

    // Extract status from insight
    const insight = kpiData.Insight || "";
    let statusTag = "medium";
    let displayStatus = "";

    if (insight.includes("**ON TRACK**")) {
      statusTag = "high";
      displayStatus = "ON TRACK";
    } else if (insight.includes("**NEEDS ATTENTION**")) {
      statusTag = "low";
      displayStatus = "NEEDS ATTENTION";
    } else if (insight.includes("**AT RISK**")) {
      statusTag = "low";
      displayStatus = "AT RISK";
    } else if (insight.includes("**STABLE**")) {
      statusTag = "medium";
      displayStatus = "STABLE";
    }

    // Determine trend direction
    const trendDirection = kpiData.Monthly.CM_vs_L3M.Trend.toLowerCase();
    const achievement = kpiData.Monthly.Achievement || 0;

    // For cards with Target (SFA, Bias), use achievement to determine arrow direction
    const changeType = kpiData.Monthly.Target !== undefined
      ? (achievement > 0 ? "increase" : "decrease")
      : (trendDirection === "improving" || kpiData.Monthly.CM_vs_L3M.Delta > 0 ? "increase" : "decrease");

    // Format comparison text with context labels
    let comparison = "";
    if (kpiData.Monthly.Target !== undefined) {
      comparison = `${achievement > 0 ? '+' : ''}${achievement.toFixed(1)} vs ${kpiData.Monthly.Target.toFixed(1)} (Target)`;
    } else if (kpiData.Monthly.Pct_Change_vs_L3M !== undefined) {
      comparison = `${kpiData.Monthly.Pct_Change_vs_L3M.toFixed(2)}% vs ${kpiData.Monthly.L3M_Avg.toFixed(2)} (L3M Avg)`;
    } else {
      comparison = `${kpiData.Monthly.CM_vs_L3M.Delta > 0 ? '+' : ''}${kpiData.Monthly.CM_vs_L3M.Delta.toFixed(1)} vs ${kpiData.Monthly.L3M_Avg.toFixed(1)} (L3M Avg)`;
    }

    // Clean insight text: remove all ** markers and skip the status line
    const cleanedInsight = insight
      .replace(/\*\*/g, "") // Remove all ** markers
      .split('\n\n') // Split by paragraphs
      .filter(line => !line.match(/^(ON TRACK|NEEDS ATTENTION|AT RISK|STABLE)$/)) // Remove status line
      .join('\n\n') // Rejoin
      .trim();

    // Extract narrative: Skip first sentence (redundant status/value), show contextual insights
    let narrative = "";

    // Find first sentence end (period followed by space)
    const firstPeriodIndex = cleanedInsight.indexOf('. ');

    if (firstPeriodIndex !== -1 && firstPeriodIndex < cleanedInsight.length - 10) {
      // Take everything after first sentence (skip the ". " separator)
      narrative = cleanedInsight.substring(firstPeriodIndex + 2).trim();
    } else {
      // Fallback: if no clear sentence break, use the full cleaned insight
      narrative = cleanedInsight;
    }

    // Limit length to prevent layout breaking
    if (narrative.length > 200) {
      narrative = narrative.substring(0, 200).trim() + '...';
    }

    // Final safety check: if narrative is too short or empty, use first 150 chars of cleaned insight
    if (!narrative || narrative.length < 20) {
      narrative = cleanedInsight.substring(0, 150);
    }

    cards.push({
      id: kpiName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order: order++,
      category: getCategoryForKPI(kpiName, kpiData.Monthly.Target),
      title: kpiName,
      subtitle: kpiData.Monthly.Month,
      actual: {
        value: kpiData.Monthly.Actual.toFixed(1),
        trend: changeType,
      },
      target: {
        value: kpiData.Monthly.Target !== undefined
          ? kpiData.Monthly.Target.toFixed(1)
          : kpiData.Monthly.L3M_Avg.toFixed(1),
      },
      forecast: {
        label: "L3M Avg",
        value: kpiData.Monthly.L3M_Avg.toFixed(1),
        trend: changeType,
      },
      confidence: {
        level: statusTag,
      },
      causalLinks: {
        causalImpact: comparison,
        narrative: narrative,
      },
      causalLinksExtended: [],
      comparison: comparison,
      narrative: narrative,
      statusTag: statusTag,
      displayStatus: displayStatus, // Add display status for badge
      changeType: changeType,
      change: Math.abs(kpiData.Monthly.CM_vs_L3M.Delta),
      chartData: chartData,
      description: narrative, // Use extracted narrative (second sentence onwards)
      advanceIndicator: {
        label: "Advanced Indicator",
        value: kpiData.Monthly.Advanced_Indicator || trendDirection,
        trend: changeType,
        text: `${trendDirection} trend with ${kpiData.Monthly.CM_vs_L3M.Delta > 0 ? '+' : ''}${kpiData.Monthly.CM_vs_L3M.Delta.toFixed(2)} delta vs L3M`,
      },
      achievementVsRF: {
        label: "Achievement vs Target",
        value: kpiData.Monthly.Achievement !== undefined
          ? kpiData.Monthly.Achievement.toFixed(1)
          : kpiData.Monthly.Pct_Change_vs_L3M?.toFixed(1) || "N/A",
        status: statusTag,
        text: comparison,
      },
      segmentMix: {
        insight: narrative,
      },
      // Add CM_vs_L3M data for SFA and Bias cards
      cmVsL3M: {
        trend: kpiData.Monthly.CM_vs_L3M.Trend,
        delta: kpiData.Monthly.CM_vs_L3M.Delta,
        l3mAvg: kpiData.Monthly.L3M_Avg,
      },
      isClickable: false, // Driving indicators are non-clickable
    });
  }

  return cards;
}

// ==================== NIELSEN INDICATORS ====================

export interface S3NielsenData {
  "Numeric Dist": {
    "PHILIP MORRIS": {
      Month: string;
      PoP_Change: number;
      Trend_Line: {
        [month: string]: number;
      };
      Insight: string;
    };
  };
  "Weighted Dist": {
    "PHILIP MORRIS": {
      Month: string;
      PoP_Change: number;
      Trend_Line: {
        [month: string]: number;
      };
      Insight: string;
    };
  };
  "Value Share": {
    "PHILIP MORRIS": {
      Month: string;
      PoP_Change: number;
      Trend_Line: {
        [month: string]: number;
      };
      Insight: string;
    };
  };
  "Volume Share": {
    "PHILIP MORRIS": {
      Month: string;
      PoP_Change: number;
      Trend_Line: {
        [month: string]: number;
      };
      Insight: string;
    };
  };
}

export function transformNielsenIndicatorsFromS3(nielsenData: S3NielsenData) {
  const cards = [];
  let order = 8; // Start after the 7 sales cards

  const metrics = [
    { key: "Numeric Dist", displayName: "Numeric Dist" },
    { key: "Weighted Dist", displayName: "Weighted Dist" },
    { key: "Value Share", displayName: "Value Share" },
    { key: "Volume Share", displayName: "Volume Share" }
  ];

  for (const metric of metrics) {
    const metricKey = metric.key as keyof S3NielsenData;
    const metricData = nielsenData[metricKey];

    if (!metricData || !metricData["PHILIP MORRIS"]) continue;

    const pmData = metricData["PHILIP MORRIS"];

    // Convert trend line to chart data
    const chartData = Object.entries(pmData.Trend_Line).map(([month, value]) => ({
      month: month,
      value: value,
    }));

    // Get the latest month value (Nov'25)
    const latestMonth = pmData.Month;
    const latestValue = chartData[chartData.length - 1]?.value || 0;

    // Get the last month value (Oct'25)
    const lastMonthValue = chartData[chartData.length - 2]?.value || 0;

    // Determine status based on PoP_Change
    const popChange = pmData.PoP_Change;
    const statusTag = popChange > 0 ? "high" : "low";
    const changeType = popChange > 0 ? "increase" : "decrease";
    const displayStatus = popChange > 0 ? "ON TRACK" : "NEEDS ATTENTION";

    // Format comparison text with last month's actual value and context label
    const comparison = `${popChange > 0 ? '+' : ''}${popChange.toFixed(3)} vs ${lastMonthValue.toFixed(2)} (Last Month)`;

    // Clean insight text
    const cleanedInsight = pmData.Insight.replace(/\*\*/g, "").trim();

    // Extract narrative: Skip first sentence (redundant status/value), show contextual insights
    let nielsenNarrative = "";

    // Find first sentence end (period followed by space)
    const firstPeriodIndex = cleanedInsight.indexOf('. ');

    if (firstPeriodIndex !== -1 && firstPeriodIndex < cleanedInsight.length - 10) {
      // Take everything after first sentence (skip the ". " separator)
      nielsenNarrative = cleanedInsight.substring(firstPeriodIndex + 2).trim();
    } else {
      // Fallback: if no clear sentence break, use the full cleaned insight
      nielsenNarrative = cleanedInsight;
    }

    // Limit length to prevent layout breaking
    if (nielsenNarrative.length > 200) {
      nielsenNarrative = nielsenNarrative.substring(0, 200).trim() + '...';
    }

    // Final safety check: if narrative is too short or empty, use first 150 chars of cleaned insight
    if (!nielsenNarrative || nielsenNarrative.length < 20) {
      nielsenNarrative = cleanedInsight.substring(0, 150);
    }

    cards.push({
      id: metric.key.toLowerCase().replace(/\s+/g, '-') + "-philip-morris",
      order: order++,
      category: metric.key.includes("Share") ? "%" : "Number",
      title: metric.displayName,
      subtitle: latestMonth,
      actual: {
        value: latestValue.toFixed(2),
        trend: changeType,
      },
      target: {
        value: lastMonthValue.toFixed(2),
      },
      comparison: comparison,
      narrative: nielsenNarrative,
      statusTag: statusTag,
      displayStatus: displayStatus,
      changeType: changeType,
      chartData: chartData,
      description: nielsenNarrative,
      causalLinks: {
        causalImpact: cleanedInsight,
      },
      isClickable: false, // Not clickable
    });
  }

  return cards;
}
