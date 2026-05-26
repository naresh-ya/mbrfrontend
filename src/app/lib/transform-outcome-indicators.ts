/**
 * Transform S3 Outcome Indicators JSON data to match the UI KpiData structure
 */

// ==================== NET REVENUE TRANSFORMATIONS ====================

// YTD Card (nor-kpi-card-001)
export interface S3NetRevenueYTDCard {
  id: string;
  title: string;
  subtitle: string;
  actual: {
    label: string;
    value: string;
    unit: string;
    trend: string;
  };
  performance: {
    growthPct: {
      label: string;
      value: string;
    };
    achievementVsOB: {
      label: string;
      value: string;
      status: string;
    };
    varianceVsRF: {
      label: string;
      value: string;
      status: string;
    };
  };
  advanceIndicator: {
    label: string;
    value: string;
    trend: string;
    insight: string;
  };
  drivers: {
    price: {
      label: string;
      value: string;
      impact: string;
    };
    mix: {
      label: string;
      value: string;
      impact: string;
    };
    volume: {
      label: string;
      value: string;
      impact: string;
    };
    fx?: {
      label: string;
      value: string;
      impact: string;
    };
  };
  keyInsights: string[];
}

// Monthly Card (nor-kpi-card-002)
export interface S3NetRevenueMonthlyCard {
  id: string;
  title: string;
  subtitle: string;
  actual: {
    label: string;
    value: string;
    unit: string;
    month: string;
  };
  performance?: {
    norPreviousYear: {
      label: string;
      value: string;
      unit: string;
    };
    growthPct: {
      label: string;
      value: string;
      trend: string;
    };
  };
  unitEconomics: {
    per000sBeforeSA: {
      label: string;
      value: string;
    };
    per000sAfterSA: {
      label: string;
      value: string;
    };
  };
  trendLine: {
    label: string;
    data: {
      [month: string]: string;
    };
  };
  drivers: {
    price: {
      label: string;
      value: string;
      impact: string;
    };
    mix: {
      label: string;
      value: string;
      impact: string;
    };
    volume: {
      label: string;
      value: string;
      impact: string;
    };
    fx?: {
      label: string;
      value: string;
      impact: string;
    };
  };
  componentPercentages?: {
    fx?: {
      label: string;
      value: string;
    };
    volume?: {
      label: string;
      value: string;
    };
    mix?: {
      label: string;
      value: string;
    };
    price?: {
      label: string;
      value: string;
    };
  };
  keyInsights: string[];
}

export interface S3NetRevenueInsights {
  executiveSummary: {
    bullets: string[];
  };
  ogsmInsightCards: Array<{
    title: string;
    status: string;
    metricSnapshot: string;
    insightNarrative: string;
    riskOrOpportunity: string;
    forwardSignal: string;
  }>;
}

export function transformNetRevenueFromS3(
  ytdCard: S3NetRevenueYTDCard,
  monthlyCard: S3NetRevenueMonthlyCard,
  insightsData: S3NetRevenueInsights
) {
  // Convert trendLine data object to chartData array
  const chartData = Object.entries(monthlyCard.trendLine.data).map(([month, value]) => {
    // Convert "January" to "Jan'25" format
    const monthMap: { [key: string]: string } = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    };
    const shortMonth = monthMap[month] || month.substring(0, 3);
    return {
      month: `${shortMonth}'25`,
      value: parseFloat(value),
    };
  });

  // Determine arrow direction based on monthly growthPct value (for comparison arrow)
  const monthlyGrowthValue = monthlyCard.performance?.growthPct?.value
    ? parseFloat(monthlyCard.performance.growthPct.value.replace('%', ''))
    : 0;
  const changeType = monthlyGrowthValue >= 0 ? "increase" : "decrease";

  // Map advanceIndicator trend to status tag (affects chart color: low=red, medium=amber, high=green)
  const statusTag = ytdCard.advanceIndicator.trend === "increase" ? "high" :
                    ytdCard.advanceIndicator.trend === "decrease" ? "low" : "medium";

  // Format comparison with previous year NOR value
  const previousYearNOR = monthlyCard.performance?.norPreviousYear?.value || "N/A";
  const growthPctValue = monthlyCard.performance?.growthPct?.value || "N/A";
  const formattedComparison = `${growthPctValue} vs PY (${previousYearNOR})`;

  return {
    id: "net-revenue",
    order: 4,
    category: "Th USD", // Changed to "Th USD"
    title: "Net Revenue",
    subtitle: monthlyCard.subtitle,
    actual: {
      value: parseFloat(monthlyCard.actual.value).toLocaleString("en-US", {
        maximumFractionDigits: 1,
      }),
      trend: monthlyCard.performance?.growthPct?.trend === "increase" ? "increase" : "decrease",
    },
    target: {
      value: ytdCard.performance.achievementVsOB.value,
    },
    // NEW: Show monthly growth with previous year value
    comparison: formattedComparison,
    narrative: monthlyCard.keyInsights[0] || "",
    statusTag: statusTag,
    trend: monthlyCard.performance?.growthPct?.trend === "increase" ? "increase" : "decrease",
    changeType: changeType,

    // Required for modal - Last 3 Month Avg % (Sub-Card 1)
    last3MonthAvg: {
      label: ytdCard.advanceIndicator.label || "Last 3 Month Avg %",
      value: ytdCard.advanceIndicator.value || "N/A",
      trend: ytdCard.advanceIndicator.trend === "increase" ? "increase" : "decrease",
      insight: ytdCard.advanceIndicator.insight,
    },

    // Required for modal - Achievement vs OB (Sub-Card 2)
    achievementVsOB: {
      label: ytdCard.performance.achievementVsOB.label || "Achievement vs OB %",
      value: ytdCard.performance.achievementVsOB.value || "N/A",
      status: ytdCard.performance.achievementVsOB.status === "on_track" ? "On Track" :
              ytdCard.performance.achievementVsOB.status === "at_risk" ? "At Risk" : "Off Track",
    },

    // Keep old advanceIndicator for backward compatibility
    advanceIndicator: {
      label: ytdCard.advanceIndicator.label || "Last 3 Month Avg %",
      value: ytdCard.advanceIndicator.value || "N/A",
      trend: ytdCard.advanceIndicator.trend === "increase" ? "increase" : "decrease",
      text: ytdCard.advanceIndicator.insight,
    },

    // Required for modal - Drivers (Monthly) with Component Percentages (Sub-Card 3)
    drivers: {
      items: [
        {
          name: "Price",
          value: parseFloat(monthlyCard.drivers.price.value).toFixed(1),
          percentage: monthlyCard.componentPercentages?.price?.value || "N/A",
          impact: monthlyCard.drivers.price.impact,
        },
        {
          name: "Volume",
          value: parseFloat(monthlyCard.drivers.volume.value).toFixed(1),
          percentage: monthlyCard.componentPercentages?.volume?.value || "N/A",
          impact: monthlyCard.drivers.volume.impact,
        },
        {
          name: "Mix",
          value: parseFloat(monthlyCard.drivers.mix.value).toFixed(1),
          percentage: monthlyCard.componentPercentages?.mix?.value || "N/A",
          impact: monthlyCard.drivers.mix.impact,
        },
        ...(monthlyCard.drivers.fx ? [{
          name: "FX",
          value: parseFloat(monthlyCard.drivers.fx.value).toFixed(1),
          percentage: monthlyCard.componentPercentages?.fx?.value || "N/A",
          impact: monthlyCard.drivers.fx.impact,
        }] : []),
      ],
    },

    // Required for modal - Unit Economics (Sub-Card 4)
    unitEconomics: {
      per000sBeforeSA: {
        label: monthlyCard.unitEconomics.per000sBeforeSA.label || "NOR per 000s (Before SA)",
        value: monthlyCard.unitEconomics.per000sBeforeSA.value,
      },
      per000sAfterSA: {
        label: monthlyCard.unitEconomics.per000sAfterSA.label || "NOR per 000s (After SA)",
        value: monthlyCard.unitEconomics.per000sAfterSA.value,
      },
    },

    // Keep achievementVsRF for backward compatibility
    achievementVsRF: {
      label: ytdCard.performance.varianceVsRF.label || "Achievement vs. RF",
      value: ytdCard.performance.varianceVsRF.value || "N/A",
      status: ytdCard.performance.varianceVsRF.status === "on_track" ? "On Track" :
              ytdCard.performance.varianceVsRF.status === "at_risk" ? "At Risk" : "Off Track",
      text: `NOR vs Rolling Forecast tracking at ${ytdCard.performance.varianceVsRF.value}`,
    },

    // Keep segmentMix for backward compatibility
    segmentMix: {
      Price: {
        value: parseFloat(monthlyCard.drivers.price.value).toFixed(1),
        status: monthlyCard.drivers.price.impact === "positive" ? "On Track" : "At Risk",
      },
      Mix: {
        value: parseFloat(monthlyCard.drivers.mix.value).toFixed(1),
        status: monthlyCard.drivers.mix.impact === "positive" ? "On Track" : "At Risk",
      },
      Volume: {
        value: parseFloat(monthlyCard.drivers.volume.value).toFixed(1),
        status: monthlyCard.drivers.volume.impact === "positive" ? "On Track" : "At Risk",
      },
      ...(monthlyCard.drivers.fx ? {
        FX: {
          value: parseFloat(monthlyCard.drivers.fx.value).toFixed(1),
          status: monthlyCard.drivers.fx.impact === "positive" ? "On Track" : "At Risk",
        }
      } : {}),
      insight: insightsData.executiveSummary.bullets[0] || "",
    },

    // Required for modal - causalLinks
    causalLinks: {
      causalImpact: monthlyCard.keyInsights[0] || ytdCard.advanceIndicator.insight,
    },

    // Optional - causalLinksExtended (use monthly key insights)
    causalLinksExtended: monthlyCard.keyInsights.slice(0, 3),

    // Chart data from trendLine
    chartData: chartData,

    // Store full data for modal
    s3Data: {
      ytdCard: ytdCard,
      monthlyCard: monthlyCard,
      insights: insightsData,
    },
  };
}

// ==================== SECONDARY VOLUME TRANSFORMATIONS ====================

export interface S3SecondaryVolumeCard {
  id: string;
  title: string;
  subtitle: string;
  actual: {
    label: string;
    value: string;
    trend: string;
  };
  target: {
    label: string;
    value: string;
    status: string;
  };
  advanceIndicator: {
    label: string;
    value: string;
    previousYearValue?: string;
    trend: string;
    insight: string;
  };
  trendVsLast3Months?: {
    label: string;
    value: string;
    trend: string;
  };
  segmentMix: {
    items: Array<{
      segment: string;
      value: number;
      status: string;
    }>;
    insight: string;
  };
  chartData?: Array<{
    period: string;
    value: number;
  }>;
}

export interface S3SecondaryVolumeInsights {
  executiveSummary: {
    bullets: string[];
  };
  imsPerformance: {
    summary: string;
    trendDirection: string;
    rfStatus: string;
  };
}

export function transformSecondaryVolumeFromS3(
  cardData: S3SecondaryVolumeCard,
  insightsData: S3SecondaryVolumeInsights
) {
  // Convert S3 month format "Jan-25" to "Jan'25" format that the UI expects
  const convertMonthFormat = (period: string): string => {
    // Handle formats like "Jan-25" -> "Jan'25"
    const match = period.match(/^([A-Za-z]+)-(\d{2})$/);
    if (match) {
      return `${match[1]}'${match[2]}`;
    }
    return period; // Return as-is if format doesn't match
  };

  // Use chartData from S3 if available, otherwise create placeholder
  const chartData = cardData.chartData && cardData.chartData.length > 0
    ? cardData.chartData.slice(-12).map((item) => ({
        month: convertMonthFormat(item.period),
        value: item.value,
      }))
    : [
        { month: "Oct'25", value: 900 },
        { month: "Nov'25", value: 1013 },
        { month: "Dec'25", value: parseFloat(cardData.actual.value) },
      ];

  // Transform segmentMix items to the format expected by modal
  const segmentMixForModal: any = {
    insight: cardData.segmentMix.insight || "",
  };

  cardData.segmentMix.items.forEach((item) => {
    const segmentKey = item.segment.replace(/\s+/g, "_");
    segmentMixForModal[segmentKey] = {
      value: item.value.toFixed(1),
      status: item.status === "on_track" ? "On Track" :
              item.status === "at_risk" ? "At Risk" : "Off Track",
    };
  });

  // Helper function to format percentage to one decimal place
  const formatPercentage = (value: string): string => {
    const match = value.match(/([+-]?\d+\.?\d*)/);
    if (match) {
      const num = parseFloat(match[1]);
      return value.replace(match[1], num.toFixed(1));
    }
    return value;
  };

  // Determine status based on growth trend, not RF achievement
  const growthStatus = cardData.advanceIndicator.trend === "increase" ? "high" :
                       cardData.advanceIndicator.trend === "decrease" ? "low" : "medium";

  // Format comparison with previous year value for face card
  const growthPct = cardData.advanceIndicator.value;
  const previousYearValue = cardData.advanceIndicator.previousYearValue || "N/A";
  const formattedComparisonWithPY = `${formatPercentage(growthPct)} vs PY (${previousYearValue})`;

  return {
    id: "secondary-volume-sales",
    order: 1,
    category: "Million sticks",
    title: "Secondary Volume Sales",
    subtitle: cardData.subtitle,
    actual: {
      value: parseFloat(cardData.actual.value).toLocaleString("en-US", {
        maximumFractionDigits: 1,
      }),
      trend: cardData.actual.trend === "increase" ? "increase" : "decrease",
    },
    target: {
      value: cardData.target.value,
    },
    // NEW: Show growth with PY value on face card
    comparison: formattedComparisonWithPY,
    // NEW: Use segment mix insight as narrative on face card
    narrative: cardData.segmentMix.insight,
    statusTag: growthStatus,
    trend: cardData.actual.trend === "increase" ? "increase" : "decrease",
    changeType: cardData.advanceIndicator.trend === "increase" ? "increase" : "decrease",

    // Required for modal - trendVsLast3Months (NEW)
    trendVsLast3Months: {
      label: cardData.trendVsLast3Months?.label || "Trend vs Last 3 Months",
      value: cardData.trendVsLast3Months?.value || "N/A",
      trend: cardData.trendVsLast3Months?.trend === "increase" ? "increase" : "decrease",
    },

    // Required for modal - achievementVsRF
    achievementVsRF: {
      label: cardData.target.label || "Achievement vs. RF",
      value: cardData.target.value || "N/A",
      status: cardData.target.status === "on_track" ? "On Track" :
              cardData.target.status === "at_risk" ? "At Risk" : "Off Track",
    },

    // Required for modal - segmentMix with proper format (including status)
    segmentMix: {
      items: cardData.segmentMix.items.map(item => ({
        segment: item.segment,
        value: item.value.toFixed(1),
        status: item.status === "on_track" ? "On Track" :
                item.status === "at_risk" ? "At Risk" : "Off Track",
      })),
      insight: cardData.segmentMix.insight,
    },

    // Required for modal - causalLinks
    causalLinks: {
      causalImpact: cardData.segmentMix.insight || cardData.advanceIndicator.insight,
    },

    // Optional - insights for modal bottom section
    insights: {
      executiveSummary: insightsData.executiveSummary.bullets || [],
      advanceIndicatorInsight: cardData.advanceIndicator.insight || "",
      segmentMixInsight: cardData.segmentMix.insight || "",
    },

    chartData: chartData,

    // Store full data for modal
    s3Data: {
      card: cardData,
      insights: insightsData,
    },
  };
}

// ==================== OPERATING INCOME TRANSFORMATIONS ====================

export interface S3OperatingIncomeCard {
  id: string;
  title: string;
  subtitle: string;
  Monthly: {
    Month: string;
    OI_Actual: {
      value: string;
      unit: string;
      trend: string;
    };
    "OI_as_%_of_NOR_vs_Last_3_Months_Avg": {
      value: string;
      trend: string;
      insight: string;
    };
    "OI%-PY%": {
      value: string;
      previousYearOI?: string;
      status: string;
    };
    Drivers: {
      OI_by_Price: {
        value: string;
        impact: string;
      };
      OI_by_Volume: {
        value: string;
        impact: string;
      };
      OI_by_Mix: {
        value: string;
        impact: string;
      };
      OI_by_FX?: {
        value: string;
        impact: string;
      };
    };
    ComponentPercentages?: {
      "FX_%": { value: string };
      "Volume_%": { value: string };
      "Mix_%": { value: string };
      "Price_%": { value: string };
    };
  };
  YTD: {
    "Variance_vs_RF_%": {
      value: string;
      status: string;
    };
  };
  Trend_Line?: {
    monthly_values: {
      [month: string]: string;
    };
  };
  chartData?: Array<{
    period: string;
    value: number;
  }>;
  keyInsights: string[];
}

export interface S3OperatingIncomeInsights {
  executiveSummary: {
    bullets: string[];
  };
  [key: string]: any;
}

export function transformOperatingIncomeFromS3(
  cardData: S3OperatingIncomeCard,
  insightsData: S3OperatingIncomeInsights
) {
  // Convert trend line to chart data (use chartData if available, otherwise Trend_Line)
  const chartData = cardData.chartData
    ? cardData.chartData.map((item) => ({
        month: item.period.replace('-', "'"),
        value: item.value,
      }))
    : cardData.Trend_Line
    ? Object.entries(cardData.Trend_Line.monthly_values).map(([month, value]) => {
        const monthMap: { [key: string]: string } = {
          January: "Jan",
          February: "Feb",
          March: "Mar",
          April: "Apr",
          May: "May",
          June: "Jun",
          July: "Jul",
          August: "Aug",
          September: "Sep",
          October: "Oct",
          November: "Nov",
          December: "Dec",
        };
        const shortMonth = monthMap[month] || month.substring(0, 3);
        return {
          month: `${shortMonth}'25`,
          value: parseFloat(value.replace(/,/g, '')),
        };
      })
    : [];

  // Determine arrow direction based on OI%-PY%
  const pyGrowth = parseFloat(cardData.Monthly["OI%-PY%"].value.replace('%', ''));
  const changeType = pyGrowth >= 0 ? "increase" : "decrease";

  // Status tag based on trend
  const statusTag = cardData.Monthly.OI_Actual.trend === "increase" ? "high" :
                    cardData.Monthly.OI_Actual.trend === "decrease" ? "low" : "medium";

  // Format comparison with previous year value
  const previousYearOI = cardData.Monthly["OI%-PY%"].previousYearOI || "N/A";
  const formattedComparison = `${cardData.Monthly["OI%-PY%"].value} vs PY (${previousYearOI})`;

  return {
    id: "operating-income",
    order: 3,
    category: "Th USD", // Changed from unit to fixed "Th USD"
    title: "Operating Income",
    subtitle: cardData.subtitle,
    actual: {
      value: cardData.Monthly.OI_Actual.value,
      trend: cardData.Monthly.OI_Actual.trend === "increase" ? "increase" : "decrease",
    },
    target: {
      value: cardData.YTD["Variance_vs_RF_%"].value,
    },
    // NEW: Show comparison with previous year OI value
    comparison: formattedComparison,
    narrative: cardData.keyInsights[1] || cardData.keyInsights[0] || "",
    statusTag: statusTag,
    trend: cardData.Monthly.OI_Actual.trend === "increase" ? "increase" : "decrease",
    changeType: changeType,

    // Required for modal - OI % of NOR vs 3M Avg (Sub-Card 1)
    oiPercentOfNOR: {
      label: "OI % of NOR vs 3M Avg",
      value: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].value,
      trend: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].trend === "increase" ? "increase" : "decrease",
      insight: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].insight,
    },

    // Required for modal - Variance vs RF (Sub-Card 2)
    achievementVsRF: {
      label: "Variance vs RF %",
      value: cardData.YTD["Variance_vs_RF_%"].value,
      status: cardData.YTD["Variance_vs_RF_%"].status === "on_track" ? "On Track" :
              cardData.YTD["Variance_vs_RF_%"].status === "at_risk" ? "At Risk" : "Off Track",
    },

    // Required for modal - Drivers (Monthly) with Component Percentages (Sub-Card 3)
    drivers: {
      items: [
        {
          name: "Price",
          value: parseFloat(cardData.Monthly.Drivers.OI_by_Price.value).toFixed(1),
          percentage: cardData.Monthly.ComponentPercentages?.["Price_%"]?.value || "N/A",
          impact: cardData.Monthly.Drivers.OI_by_Price.impact,
        },
        {
          name: "Volume",
          value: parseFloat(cardData.Monthly.Drivers.OI_by_Volume.value.replace(/,/g, '')).toFixed(1),
          percentage: cardData.Monthly.ComponentPercentages?.["Volume_%"]?.value || "N/A",
          impact: cardData.Monthly.Drivers.OI_by_Volume.impact,
        },
        {
          name: "Mix",
          value: parseFloat(cardData.Monthly.Drivers.OI_by_Mix.value).toFixed(1),
          percentage: cardData.Monthly.ComponentPercentages?.["Mix_%"]?.value || "N/A",
          impact: cardData.Monthly.Drivers.OI_by_Mix.impact,
        },
        ...(cardData.Monthly.Drivers.OI_by_FX ? [{
          name: "FX",
          value: parseFloat(cardData.Monthly.Drivers.OI_by_FX.value).toFixed(1),
          percentage: cardData.Monthly.ComponentPercentages?.["FX_%"]?.value || "N/A",
          impact: cardData.Monthly.Drivers.OI_by_FX.impact,
        }] : []),
      ],
    },

    // Keep old structure for backward compatibility
    advanceIndicator: {
      label: "OI % of NOR vs 3M Avg",
      value: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].value,
      trend: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].trend === "increase" ? "increase" : "decrease",
      text: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].insight,
    },

    // Keep segmentMix for backward compatibility
    segmentMix: {
      "OI by Price": {
        value: parseFloat(cardData.Monthly.Drivers.OI_by_Price.value).toFixed(1),
        status: cardData.Monthly.Drivers.OI_by_Price.impact === "positive" ? "On Track" : "At Risk",
      },
      "OI by Volume": {
        value: parseFloat(cardData.Monthly.Drivers.OI_by_Volume.value.replace(/,/g, '')).toFixed(1),
        status: cardData.Monthly.Drivers.OI_by_Volume.impact === "positive" ? "On Track" : "At Risk",
      },
      "OI by Mix": {
        value: parseFloat(cardData.Monthly.Drivers.OI_by_Mix.value).toFixed(1),
        status: cardData.Monthly.Drivers.OI_by_Mix.impact === "positive" ? "On Track" : "At Risk",
      },
      insight: insightsData.executiveSummary.bullets[0] || "",
    },

    // Required for modal - causalLinks
    causalLinks: {
      causalImpact: cardData.keyInsights[0] || "",
    },

    // Optional - causalLinksExtended
    causalLinksExtended: cardData.keyInsights.slice(0, 3),

    // Chart data from trend line
    chartData: chartData,

    // Store full data for modal
    s3Data: {
      card: cardData,
      insights: insightsData,
    },
  };
}

// ==================== MARKET SHARE TRANSFORMATIONS ====================

export interface S3MarketShareCard {
  metadata: {
    generatedAt: string;
    currentMonth: string;
    unit: string;
  };
  cards: {
    industry: {
      type: string;
      month: string;
      unit: string;
      kpis: {
        currentMonthVolume: number;
        sameMonthLastYear: number;
        growthVsPY_pct: number;
        pctChangeVsLast3Months_pct: number;
        segmentBreakdown: Array<{
          segment: string;
          volume: number;
          ytd_volume: number;
          ytd_growth_vs_py_percent: number;
        }>;
        monthlyTrend: Array<{
          month: string;
          volume: number;
        }>;
      };
      insights: string[];
      segmentInsight?: string;
      trendInsight?: string;
    };
    players: {
      [playerName: string]: {
        type: string;
        player: string;
        kpis: {
          currentMonthVolume: number;
          sameMonthLastYear: number;
          growthVsPY_pct: number;
          pctChangeVsLast3Months_pct: number;
          ytd_volume: number;
          ytd_growth_vs_py_percent: number;
          ytd_share_of_market_percent: number;
          monthlyTrend: Array<{
            month: string;
            volume: number;
          }>;
        };
        insights: string[];
      };
    };
  };
}

export interface S3MarketShareInsights {
  executiveSummary: {
    bullets: string[];
  };
  [key: string]: any;
}

export function transformMarketShareFromS3(
  cardData: S3MarketShareCard,
  insightsData: S3MarketShareInsights
) {
  const industry = cardData.cards.industry;
  const players = cardData.cards.players;

  // Convert industry monthly trend to chart data
  const chartData = industry.kpis.monthlyTrend.map((item) => {
    const date = new Date(item.month);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      month: `${monthNames[date.getMonth()]}'${String(date.getFullYear()).slice(-2)}`,
      value: item.volume,
    };
  });

  // Determine arrow direction and status
  const growthPct = industry.kpis.growthVsPY_pct;
  const changeType = growthPct >= 0 ? "increase" : "decrease";
  const statusTag = growthPct > 10 ? "high" : growthPct > 0 ? "medium" : "low";

  // Get top 4 segments by volume
  const top4Segments = industry.kpis.segmentBreakdown
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 4);

  // Format segment mix for modal
  const segmentMix: any = {
    insight: insightsData?.executiveSummary?.bullets?.[0] || industry.segmentInsight || industry.insights[0] || "",
  };

  top4Segments.forEach((seg) => {
    const segmentKey = seg.segment.replace(/\s+/g, "_");
    segmentMix[segmentKey] = {
      value: seg.volume.toFixed(1),
      status: seg.ytd_growth_vs_py_percent > 0 ? "On Track" : "At Risk",
    };
  });

  // Format players data for modal - showing all players with their market share
  const playersData = Object.entries(players).map(([name, data]) => ({
    player: name,
    share: data.kpis.ytd_share_of_market_percent,
    volume: data.kpis.ytd_volume,
  }));

  return {
    id: "market-share",
    order: 2,
    category: industry.unit,
    title: "Market Share",
    subtitle: `Industry Performance - ${new Date(industry.month).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    actual: {
      value: industry.kpis.currentMonthVolume.toLocaleString("en-US", {
        maximumFractionDigits: 1,
      }),
      trend: changeType,
    },
    target: {
      value: industry.kpis.sameMonthLastYear.toLocaleString("en-US", {
        maximumFractionDigits: 1,
      }),
    },
    comparison: `${growthPct.toFixed(2)}% vs PY(${industry.kpis.sameMonthLastYear.toLocaleString("en-US", { maximumFractionDigits: 1 })})`,
    narrative: industry.insights[1] || industry.insights[0] || "",
    statusTag: statusTag,
    trend: changeType,
    changeType: changeType,

    // Required for modal - advanceIndicator (pctChangeVsLast3Months_pct)
    advanceIndicator: {
      label: "% Change vs Last 3 Months",
      value: `${industry.kpis.pctChangeVsLast3Months_pct.toFixed(2)}%`,
      trend: industry.kpis.pctChangeVsLast3Months_pct >= 0 ? "increase" : "decrease",
      text: `Market volume changed by ${industry.kpis.pctChangeVsLast3Months_pct.toFixed(2)}% compared to the last 3-month average.`,
    },

    // Required for modal - achievementVsRF (showing players market share)
    achievementVsRF: {
      label: "Players Market Share (YTD %)",
      value: "", // Will show players list instead
      status: "On Track",
      text: "", // Players data will be shown in custom format
      players: playersData, // Pass players data for custom rendering
    },

    // Required for modal - segmentMix (top 4 segments)
    segmentMix: segmentMix,

    // Required for modal - causalLinks
    causalLinks: {
      causalImpact: industry.insights[0] || "",
    },

    // Optional - causalLinksExtended
    causalLinksExtended: industry.insights.slice(0, 3),

    // Chart data from ITC monthly trend
    chartData: chartData,

    // Store full data for modal including players
    s3Data: {
      card: cardData,
      insights: insightsData,
      players: playersData,
    },
  };
}

// ==================== OPERATIONS & INNOVATION TRANSFORMATIONS ====================

export interface S3OperationsInnovationData {
  Customer_Fill_Rate: {
    Month: string;
    "Actual_%": number;
    "Target_%": number;
    "Achievement_%": number;
    Advanced_Indicator: string;
    "Trend_Line_%": {
      [month: string]: number;
    };
    Insight: string;
  };
  LOGD: {
    YTD_Value: number;
    Year_Target: number;
    Achievement: number;
    Advanced_Indicator: string;
    Trend_Line: {
      [month: string]: number;
    };
    Insight: string;
  };
  Innovation_Index: {
    Month: string;
    "Actual_%": number;
    "Achievement_vs_Previous_Month_%": number;
    "Trend_Line_%": {
      [month: string]: number;
    };
    Insight: string;
  };
}

export function transformOperationsInnovationFromS3(data: S3OperationsInnovationData) {
  const cards = [];
  let order = 5; // After the 4 outcome indicator cards

  // 1. Customer Fill Rate
  if (data.Customer_Fill_Rate) {
    const cfr = data.Customer_Fill_Rate;
    const chartData = Object.entries(cfr["Trend_Line_%"]).map(([month, value]) => ({
      month: month,
      value: value,
    }));

    const insight = cfr.Insight || "";
    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = cfr["Achievement_%"];
    const changeType = achievement >= 0 ? "increase" : "decrease";

    // Set status tag based on trend: increasing = ON TRACK, decreasing = NEEDS ATTENTION
    const trendStatusTag = changeType === "increase" ? "high" : "low";
    const trendDisplayStatus = changeType === "increase" ? "ON TRACK" : "NEEDS ATTENTION";

    cards.push({
      id: "customer-fill-rate",
      order: order++,
      category: "%",
      title: "Customer Fill Rate",
      subtitle: cfr.Month,
      actual: {
        value: cfr["Actual_%"].toFixed(1),
        trend: changeType,
      },
      target: {
        value: cfr["Target_%"].toFixed(1),
      },
      // Format: "99.9 ↑ +0.4 vs 99.5 (Target)"
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(1)} vs ${cfr["Target_%"].toFixed(1)} (Target)`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: trendStatusTag,
      displayStatus: trendDisplayStatus,
      changeType: changeType,
      chartData: chartData,
      description: cleanedInsight,
      causalLinks: {
        causalImpact: cleanedInsight,
      },
      isClickable: false, // Not clickable
    });
  }

  // 2. LOGD
  if (data.LOGD) {
    const logd = data.LOGD;
    const chartData = Object.entries(logd.Trend_Line).map(([month, value]) => ({
      month: month,
      value: value,
    }));

    const insight = logd.Insight || "";
    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = logd.Achievement;
    const changeType = achievement >= 0 ? "increase" : "decrease";

    // Set status tag based on trend: increasing = ON TRACK, decreasing = NEEDS ATTENTION
    const trendStatusTag = changeType === "increase" ? "high" : "low";
    const trendDisplayStatus = changeType === "increase" ? "ON TRACK" : "NEEDS ATTENTION";

    cards.push({
      id: "logd",
      order: order++,
      category: "YTD",
      title: "LOGD",
      subtitle: "Year to Date",
      actual: {
        value: logd.YTD_Value.toFixed(0),
        trend: changeType,
      },
      target: {
        value: logd.Year_Target.toFixed(0),
      },
      // Format: "+10 vs 150 (Target)"
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(0)} vs ${logd.Year_Target.toFixed(0)} (Target)`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: trendStatusTag,
      displayStatus: trendDisplayStatus,
      changeType: changeType,
      chartData: chartData,
      description: cleanedInsight,
      causalLinks: {
        causalImpact: cleanedInsight,
      },
      isClickable: false, // Not clickable
    });
  }

  // 3. Innovation Index
  if (data.Innovation_Index) {
    const ii = data.Innovation_Index;
    const chartData = Object.entries(ii["Trend_Line_%"]).map(([month, value]) => ({
      month: month,
      value: value,
    }));

    const insight = ii.Insight || "";
    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = ii["Achievement_vs_Previous_Month_%"];
    const changeType = achievement >= 0 ? "increase" : "decrease";

    // Set status tag based on trend: increasing = ON TRACK, decreasing = NEEDS ATTENTION
    const trendStatusTag = changeType === "increase" ? "high" : "low";
    const trendDisplayStatus = changeType === "increase" ? "ON TRACK" : "NEEDS ATTENTION";

    // Get previous month value from trend line (last entry before current month)
    const trendLineEntries = Object.entries(ii["Trend_Line_%"]);
    const previousMonthValue = trendLineEntries.length > 1
      ? trendLineEntries[trendLineEntries.length - 2][1]
      : (ii["Actual_%"] - achievement);

    cards.push({
      id: "innovation-index",
      order: order++,
      category: "%",
      title: "Innovation Index",
      subtitle: ii.Month,
      actual: {
        value: ii["Actual_%"].toFixed(1),
        trend: changeType,
      },
      target: {
        value: previousMonthValue.toFixed(1), // Store previous month value for display
      },
      // Format: "-0.1 vs Previous Month (0.1)"
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(1)} vs Previous Month (${previousMonthValue.toFixed(1)})`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: trendStatusTag,
      displayStatus: trendDisplayStatus,
      changeType: changeType,
      chartData: chartData,
      description: cleanedInsight,
      causalLinks: {
        causalImpact: cleanedInsight,
      },
      isClickable: false, // Not clickable
    });
  }

  return cards;
}
