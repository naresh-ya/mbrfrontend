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
    salesAllowance: {
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
    salesAllowance: {
      label: string;
      value: string;
      impact: string;
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

  // Determine arrow direction based on growthPct value (for comparison arrow)
  const growthValue = parseFloat(ytdCard.performance.growthPct.value.replace('%', ''));
  const changeType = growthValue >= 0 ? "increase" : "decrease";

  // Map advanceIndicator trend to status tag (affects chart color: low=red, medium=amber, high=green)
  const statusTag = ytdCard.advanceIndicator.trend === "increase" ? "high" :
                    ytdCard.advanceIndicator.trend === "decrease" ? "low" : "medium";

  return {
    id: "net-revenue",
    order: 4,
    category: monthlyCard.actual.unit || "000s",
    title: "Net Revenue",
    subtitle: monthlyCard.subtitle,
    actual: {
      value: parseFloat(monthlyCard.actual.value).toLocaleString("en-US", {
        maximumFractionDigits: 1,
      }),
      trend: ytdCard.actual.trend === "increase" ? "increase" : "decrease",
    },
    target: {
      value: ytdCard.performance.achievementVsOB.value,
    },
    comparison: `${ytdCard.performance.growthPct.value} vs PY`,
    narrative: monthlyCard.keyInsights[0] || "",
    statusTag: statusTag,
    trend: ytdCard.actual.trend === "increase" ? "increase" : "decrease",
    changeType: changeType,

    // Required for modal - advanceIndicator (using monthly card insight)
    advanceIndicator: {
      label: "Advance Indicator",
      value: ytdCard.advanceIndicator.value || "N/A",
      trend: ytdCard.advanceIndicator.trend === "increase" ? "increase" : "decrease",
      text: monthlyCard.keyInsights[1] || "",
    },

    // Required for modal - achievementVsOB (from YTD card)
    achievementVsOB: {
      label: ytdCard.performance.achievementVsOB.label || "Achievement vs. OB",
      value: ytdCard.performance.achievementVsOB.value || "N/A",
      status: ytdCard.performance.achievementVsOB.status === "on_track" ? "On Track" :
              ytdCard.performance.achievementVsOB.status === "at_risk" ? "At Risk" : "Off Track",
      text: `NOR vs Original Budget tracking at ${ytdCard.performance.achievementVsOB.value}`,
    },

    // Required for modal - achievementVsRF (from YTD card)
    achievementVsRF: {
      label: ytdCard.performance.varianceVsRF.label || "Achievement vs. RF",
      value: ytdCard.performance.varianceVsRF.value || "N/A",
      status: ytdCard.performance.varianceVsRF.status === "on_track" ? "On Track" :
              ytdCard.performance.varianceVsRF.status === "at_risk" ? "At Risk" : "Off Track",
      text: `NOR vs Rolling Forecast tracking at ${ytdCard.performance.varianceVsRF.value}`,
    },

    // Required for modal - segmentMix (using monthly drivers)
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
      "Sales Allowance": {
        value: parseFloat(monthlyCard.drivers.salesAllowance.value).toFixed(1),
        status: monthlyCard.drivers.salesAllowance.impact === "positive" ? "On Track" : "At Risk",
      },
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
    trend: string;
    insight: string;
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

  // Format comparison with "vs LY" if not already present
  const formattedComparison = cardData.advanceIndicator.value.includes('vs')
    ? formatPercentage(cardData.advanceIndicator.value)
    : `${formatPercentage(cardData.advanceIndicator.value)} vs LY`;

  // Determine status based on growth trend, not RF achievement
  const growthStatus = cardData.advanceIndicator.trend === "increase" ? "high" :
                       cardData.advanceIndicator.trend === "decrease" ? "low" : "medium";

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
    comparison: formattedComparison,
    narrative: cardData.advanceIndicator.insight,
    statusTag: growthStatus,
    trend: cardData.actual.trend === "increase" ? "increase" : "decrease",
    changeType: cardData.advanceIndicator.trend === "increase" ? "increase" : "decrease",

    // Required for modal - advanceIndicator
    advanceIndicator: {
      label: cardData.advanceIndicator.label || "Growth vs Prior Year",
      value: cardData.advanceIndicator.value || "N/A",
      trend: cardData.advanceIndicator.trend === "increase" ? "increase" : "decrease",
      text: cardData.advanceIndicator.insight || "",
    },

    // Required for modal - achievementVsRF
    achievementVsRF: {
      label: cardData.target.label || "Achievement vs. RF",
      value: cardData.target.value || "N/A",
      status: cardData.target.status === "on_track" ? "On Track" :
              cardData.target.status === "at_risk" ? "At Risk" : "Off Track",
      text: cardData.segmentMix.insight || insightsData.imsPerformance.summary || "",
    },

    // Required for modal - segmentMix with proper format
    segmentMix: segmentMixForModal,

    // Required for modal - causalLinks
    causalLinks: {
      causalImpact: cardData.segmentMix.insight || cardData.advanceIndicator.insight,
    },

    // Optional - causalLinksExtended (use executive summary bullets)
    causalLinksExtended: insightsData.executiveSummary.bullets.slice(0, 3),

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
    };
  };
  YTD: {
    "Variance_vs_RF_%": {
      value: string;
      status: string;
    };
  };
  Trend_Line: {
    monthly_values: {
      [month: string]: string;
    };
  };
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
  // Convert trend line to chart data
  const chartData = Object.entries(cardData.Trend_Line.monthly_values).map(([month, value]) => {
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
  });

  // Determine arrow direction based on OI%-PY%
  const pyGrowth = parseFloat(cardData.Monthly["OI%-PY%"].value.replace('%', ''));
  const changeType = pyGrowth >= 0 ? "increase" : "decrease";

  // Status tag based on trend
  const statusTag = cardData.Monthly.OI_Actual.trend === "increase" ? "high" :
                    cardData.Monthly.OI_Actual.trend === "decrease" ? "low" : "medium";

  return {
    id: "operating-income",
    order: 3,
    category: cardData.Monthly.OI_Actual.unit || "USD (K)",
    title: "Operating Income",
    subtitle: cardData.subtitle,
    actual: {
      value: cardData.Monthly.OI_Actual.value,
      trend: cardData.Monthly.OI_Actual.trend === "increase" ? "increase" : "decrease",
    },
    target: {
      value: cardData.YTD["Variance_vs_RF_%"].value,
    },
    comparison: `${cardData.Monthly["OI%-PY%"].value} vs PY`,
    narrative: cardData.keyInsights[1] || "",
    statusTag: statusTag,
    trend: cardData.Monthly.OI_Actual.trend === "increase" ? "increase" : "decrease",
    changeType: changeType,

    // Required for modal - advanceIndicator (OI % of NOR vs 3M Avg)
    advanceIndicator: {
      label: "OI % of NOR vs 3M Avg",
      value: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].value,
      trend: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].trend === "increase" ? "increase" : "decrease",
      text: cardData.Monthly["OI_as_%_of_NOR_vs_Last_3_Months_Avg"].insight,
    },

    // Required for modal - achievementVsRF (Variance vs RF)
    achievementVsRF: {
      label: "Variance vs RF %",
      value: cardData.YTD["Variance_vs_RF_%"].value,
      status: cardData.YTD["Variance_vs_RF_%"].status === "on_track" ? "On Track" :
              cardData.YTD["Variance_vs_RF_%"].status === "at_risk" ? "At Risk" : "Off Track",
      text: `OI vs Rolling Forecast tracking at ${cardData.YTD["Variance_vs_RF_%"].value}`,
    },

    // Required for modal - segmentMix (using monthly drivers)
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

    // Extract status from insight
    let statusTag = "medium";
    let displayStatus = "";
    const insight = cfr.Insight || "";

    if (insight.includes("**ON TRACK**")) {
      statusTag = "high";
      displayStatus = "ON TRACK";
    } else if (insight.includes("**NEEDS ATTENTION**")) {
      statusTag = "low";
      displayStatus = "NEEDS ATTENTION";
    } else if (insight.includes("**AT RISK**")) {
      statusTag = "low";
      displayStatus = "AT RISK";
    }

    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = cfr["Achievement_%"];
    const changeType = achievement >= 0 ? "increase" : "decrease";

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
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(1)} vs ${cfr["Target_%"].toFixed(1)}`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: statusTag,
      displayStatus: displayStatus,
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

    let statusTag = "medium";
    let displayStatus = "";
    const insight = logd.Insight || "";

    if (insight.includes("**EXCEEDS TARGET**")) {
      statusTag = "high";
      displayStatus = "EXCEEDS TARGET";
    } else if (insight.includes("**ON TRACK**")) {
      statusTag = "high";
      displayStatus = "ON TRACK";
    } else if (insight.includes("**NEEDS ATTENTION**")) {
      statusTag = "low";
      displayStatus = "NEEDS ATTENTION";
    }

    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = logd.Achievement;
    const changeType = achievement >= 0 ? "increase" : "decrease";

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
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(0)} vs ${logd.Year_Target.toFixed(0)}`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: statusTag,
      displayStatus: displayStatus,
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

    let statusTag = "medium";
    let displayStatus = "";
    const insight = ii.Insight || "";

    if (insight.includes("**ON TRACK**")) {
      statusTag = "high";
      displayStatus = "ON TRACK";
    } else if (insight.includes("**NEEDS ATTENTION**")) {
      statusTag = "low";
      displayStatus = "NEEDS ATTENTION";
    } else if (insight.includes("**AT RISK**")) {
      statusTag = "low";
      displayStatus = "AT RISK";
    }

    const cleanedInsight = insight.replace(/\*\*/g, "").trim();
    const achievement = ii["Achievement_vs_Previous_Month_%"];
    const changeType = achievement >= 0 ? "increase" : "decrease";

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
        value: "0.0", // No explicit target in data
      },
      comparison: `${achievement >= 0 ? '+' : ''}${achievement.toFixed(1)} vs Previous Month`,
      narrative: cleanedInsight.substring(0, 150),
      statusTag: statusTag,
      displayStatus: displayStatus,
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
