// export type TrendType = "increase" | "decrease";

// export type ChartDataPoint = {

//   month: string;

//   value: number;

// };

// export type ActualData = {

//   value: string;

//   trend: TrendType;

// };

// export type TargetData = {

//   value: string;

// };

// export type ForecastData = {

//   label: string;

//   value: string;

//   trend: TrendType;

// };

// export type ConfidenceData = {

//   level: string;

// };

// export type CausalLinksData = {

//   causalImpact: string;

//   narrative: string;

// };

// export type KpiData = {

//   id: string;

//   category: string;

//   sub_category: string;

//   title: string;

//   subtitle: string;

//   actual: ActualData;

//   target: TargetData;

//   forecast: ForecastData;

//   confidence: ConfidenceData;

//   causalLinks: CausalLinksData;

//   description: string;

//   change: number;

//   changeType: TrendType;

//   chartData: ChartDataPoint[];
  
//  comparison: string;   // e.g., "+32.5% vs LY"
//   statusTag: string;    // e.g., "off high", "off medium"
//   narrative: string; 
//   causalImpact: string;

// };

// export type DashboardResponse = {

//   userName: string;

//   kpis: KpiData[];

// };

export type TrendType = "increase" | "decrease";

export type ChartDataPoint = {
  month: string;
  value: number;
};

export type ActualData = {
  value: string;
  trend: TrendType;
};

export type TargetData = {
  value: string;
};

export type ForecastData = {
  label: string;
  value: string;
  trend: TrendType;
};

export type ConfidenceData = {
  level: string;
};

export type CausalLinksData = {
  causalImpact: string;
  narrative: string;
};

/* ✅ NEW – Advance Indicator */
export type AdvanceIndicatorData = {
  label: string;
  value: string;
  trend: TrendType;
  text: string;   
};

/* ✅ NEW – Achievement vs RF */
export type AchievementVsRFData = {
  label: string;
  value: string;
  status: string; // "on track" | "at-risk" | "off track"
  text: string;   // additional context about the achievement vs RF
};

/* ✅ NEW – Segment Mix */
export type SegmentMixData = {
  RF: { value: number; status: string };
  KS_Premium: { value: number; status: string };
  KS_High: { value: number; status: string };
  PF: { value: number; status: string };
  insight: string;
};

export type KpiData = {
   comparison: string;   // e.g., "+32.5% vs LY"
  statusTag: string;    // e.g., "off high", "off medium"
  narrative: string; 
  id: string;
  category: string;
  sub_category: string;
  title: string;
  subtitle: string;

  actual: ActualData;
  target: TargetData;
  forecast: ForecastData;
  confidence: ConfidenceData;

  causalLinks: CausalLinksData;

  /* ✅ NEW – array of extended causal insight lines */
  causalLinksExtended: string[];

  description: string;

  change: number;
  changeType: TrendType;

  chartData: ChartDataPoint[];

  /* ✅ NEW FIELDS ADDED BASED ON YOUR JSON */
  advanceIndicator: AdvanceIndicatorData;
  achievementVsRF: AchievementVsRFData;
  segmentMix: SegmentMixData;
};

export type DashboardResponse = {
  userName: string;
  kpis: KpiData[];
};