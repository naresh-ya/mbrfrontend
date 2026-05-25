"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StoryOfMonthPMI.module.css";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── Static chart data ─────────────────────────────────────────────────────
const DIVERGENCE_DATA = [
  { week: "W1", secondary: 8.0, retail: 2.2 },
  { week: "W2", secondary: 9.1, retail: 2.2 },
  { week: "W3", secondary: 9.7, retail: 2.3 },
  { week: "W4", secondary: 10.0, retail: 2.3 },
];

const REVENUE_DATA = [
  { m: "Feb", v: 22 }, { m: "Mar", v: 24 }, { m: "Apr", v: 25 },
  { m: "May", v: 28 }, { m: "Jun", v: 31 }, { m: "Jul", v: 33 },
  { m: "Aug", v: 35 }, { m: "Sep", v: 37 }, { m: "Oct", v: 41 },
  { m: "Nov", v: 44 }, { m: "Dec", v: 47 }, { m: "Jan", v: 50 },
];

const MARKET_SHARE_DATA = [
  { brand: "PMI",    share: 28, delta: "+0.6", fill: "#1a56db" },
  { brand: "ITC",    share: 41, delta: "\u22120.8", fill: "#64748b" },
  { brand: "Others", share: 31, delta: "+0.2", fill: "#cbd5e1" },
];

const STATE_DATA = [
  { state: "Delhi",         share: "22%", seq: "\u22122.1%", status: "warn" },
  { state: "Maharashtra",   share: "16%", seq: "\u22121.9%", status: "warn" },
  { state: "Karnataka",     share: "8%",  seq: "+0.5%",   status: "ok"   },
  { state: "Rest of India", share: "54%", seq: "+1.2%",   status: "good" },
];

const LAUNCH_METRICS = [
  { label: "Weighted Distribution",  actual: 20, target: 40,  color: "#d32f2f" },
  { label: "Volume vs Forecast",      actual: 54, target: 100, color: "#ff9800" },
  { label: "Modern Trade Velocity",   actual: 88, target: 100, color: "#0a8f08" },
  { label: "General Trade Velocity",  actual: 25, target: 100, color: "#d32f2f" },
];

/** ✅ Extend Watchout type to support drawer content */
type Watchout = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium";
  chipLabel?: string;
  soWhat?: string;
  signals?: string[];
  nowWhat?: string[];
};

type KPI = {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  tone?: "good" | "warn" | "risk" | "neutral";
  icon?: React.ReactNode;
};

type ActData = {
  actNumber: number;
  title: string;
  subtitle: string;
  aiInsight: string;
  insights: string[];
  chartData?: {
    type: "area" | "bars";
    title: string;
    labels?: string[];
    values?: number[];
    data?: Array<{brand: string; share: number; delta: string; fill?: string}>;
  };
  tableData?: {
    type: "states" | "brands" | "launch" | "variants";
    title: string;
    data?: Array<{state?: string; brand?: string; variant?: string; share?: string; volume?: string; seq?: string; status?: string; coverage?: string}>;
    columns?: string[];
    rows?: Array<Record<string, any>>;
    metricsDetails?: Record<string, any>;
    count?: number;
  };
};

type StoryData = {
  monthTitle: string;
  subtitle: string;
  themeTag: string;

  heroTitle: string;
  heroLead: string;

  kpis: KPI[];

  sections: {
    wins: string[];
    twist: string[];
    faultLines: string[];
    innovation: string[];
  };

  acts?: ActData[];

  watchouts: Watchout[];

  actions: { title: string; bullets: string[]; icon?: React.ReactNode }[];

  footnotes?: string[];
};

/* Icons (unchanged) */
const IconRevenue = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19h16v2H4v-2Zm2-3h3v2H6v-2Zm5-6h3v8h-3V10Zm5-4h3v12h-3V6Z" fill="currentColor" opacity="0.9" />
  </svg>
);

const IconShare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 18l6-6 4 4 6-10 2 1-7 12-5-5-5 5z" fill="currentColor" />
  </svg>
);

const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 5l-6 2-6-2v14l6 2 6-2 6 2V7l-6-2Zm0 2.2l4 1.3V18l-4-1.3V7.2Zm-6 0v9.5l-4 1.3V8.5l4-1.3Zm2 0l4-1.3v9.5l-4 1.3V7.2Z" fill="currentColor" />
  </svg>
);

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 8l-9-5-9 5 9 5 9-5Zm-18 2v10l8 4V14l-8-4Zm10 4v10l8-4V10l-8 4Z" fill="currentColor" />
  </svg>
);

const IconRocket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M14 4c3.5 1 6 4.5 6 8 0 2.8-1.6 5.9-4.3 8.6l-1.4-1.4c2.3-2.3 3.7-4.8 3.7-7.2 0-2.8-2-5.3-4.8-6-1.5 1.3-3 2.9-4.3 4.4l-2 2c-1 1-1.7 2.2-1.9 3.6L4 20l1.8-.3c1.4-.2 2.6-.9 3.6-1.9l2-2c1.5-1.4 3.1-2.8 4.6-4.3Zm-2.5 7.5a2 2 0 1 1 2.8-2.8 2 2 0 0 1-2.8 2.8Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Chart + visual sub-components ───────────────────────────────────────

function AIInsight({ text }: { text: string }) {
  return (
    <div className={styles.aiInsight}>
      <span className={styles.aiInsightBadge}>✦ AI Insight</span>
      <p className={styles.aiInsightText}>{text}</p>
    </div>
  );
}

function SectionSep({ label }: { label: string }) {
  return (
    <div className={styles.sectionSep}>
      <div className={styles.sectionSepLine} />
      <span className={styles.sectionSepLabel}>{label}</span>
      <div className={styles.sectionSepLine} />
    </div>
  );
}

function DivergenceChart() {
  return (
    <div>
      <div className={styles.chartLegend}>
        <span className={styles.legendDot} style={{ background: "#1a56db" }} />
        <span>Secondary MoM %</span>
        <span className={styles.legendDot} style={{ background: "#10b981", marginLeft: 10 }} />
        <span>Retail offtake MoM %</span>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={DIVERGENCE_DATA} margin={{ top: 2, right: 8, left: -26, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 12]} />
          <Tooltip formatter={(v: number, name: string) => [`${v}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
          <Line type="monotone" dataKey="secondary" stroke="#1a56db" strokeWidth={2.5} dot={false} name="Secondary" />
          <Line type="monotone" dataKey="retail" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 3" name="Retail" />
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.divergenceGap}>
        <span className={styles.gapBadge}>⚠ 3–4 wks excess stock detected</span>
      </div>
    </div>
  );
}

function RevenueTrendChart({ chartData }: { chartData?: { labels: string[]; values: number[]; title: string } }) {
  // Transform chartData to the format expected by the chart
  const data = useMemo(() => {
    console.log('[RevenueTrendChart] chartData:', chartData);
    if (chartData && chartData.labels && chartData.values) {
      const transformed = chartData.labels.map((label, idx) => ({
        m: label,
        v: chartData.values[idx]
      }));
      console.log('[RevenueTrendChart] Using API data, first 3 points:', transformed.slice(0, 3));
      return transformed;
    }
    // Fallback to static data if no chartData provided
    console.log('[RevenueTrendChart] Using FALLBACK static data');
    return REVENUE_DATA;
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={72}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1a56db" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#1a56db" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="m"
          tick={{ fontSize: 10 }}
          interval={0}
          angle={0}
          height={20}
        />
        <Tooltip formatter={(v: number) => [`${v}`, "Rev Index"]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
        <Area type="monotone" dataKey="v" stroke="#1a56db" fill="url(#revGrad)" strokeWidth={2} dot={false} name="Net Rev Index" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MarketShareBars() {
  return (
    <div className={styles.shareBarGroup}>
      {MARKET_SHARE_DATA.map((d) => (
        <div key={d.brand} className={styles.shareBarRow}>
          <div className={styles.shareBarLabel}>{d.brand}</div>
          <div className={styles.shareBarTrack}>
            <div className={styles.shareBarFill} style={{ width: `${d.share}%`, background: d.fill }} />
          </div>
          <div className={styles.shareBarValue}>{d.share}%</div>
          <div className={styles.shareBarDelta} style={{ color: d.delta.startsWith("+") ? "#0a8f08" : "#d32f2f" }}>{d.delta}</div>
        </div>
      ))}
    </div>
  );
}

function StateTable() {
  return (
    <table className={styles.stateTable}>
      <thead>
        <tr>
          <th>State</th><th>Vol. Share</th><th>Seq. Δ</th><th>Signal</th>
        </tr>
      </thead>
      <tbody>
        {STATE_DATA.map((r, i) => (
          <tr key={i} className={r.status === "warn" ? styles.rowWarn : ""}>
            <td className={styles.cellBold}>{r.state}</td>
            <td>{r.share}</td>
            <td className={r.seq.startsWith("-") ? styles.cellRed : styles.cellGreen}>{r.seq}</td>
            <td>
              <span className={r.status === "good" ? styles.tagGood : styles.tagWarn}>
                {r.status === "good" ? "➚ Accelerate" : r.status === "ok" ? "→ Monitor" : "⚠ Review"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LaunchTracker({ metricsDetails }: { metricsDetails?: Record<string, any> }) {
  // Transform metricsDetails object to array format
  const metrics = useMemo(() => {
    if (metricsDetails && typeof metricsDetails === 'object') {
      // Backend passes metricsDetails as object with metric names as keys
      // Transform to array format: [{ label, actual, target, color }, ...]
      return Object.entries(metricsDetails).map(([label, details]: [string, any]) => {
        const actual = parseFloat(details.value) || 0;
        const target = parseFloat(details.target) || 100;
        const severity = details.severity || 'low';

        // Color based on severity
        const color = severity === 'high' ? '#d32f2f' :
                     severity === 'medium' ? '#ff9800' :
                     '#0a8f08';

        return { label, actual, target, color };
      });
    }
    // Fallback to static data
    return LAUNCH_METRICS;
  }, [metricsDetails]);

  const title = "Compact Edge — Day 60 Scorecard";
  const status = "⚠ Below Target";

  return (
    <div className={styles.launchTracker}>
      <div className={styles.launchHeader}>
        <span className={styles.launchTitle}>{title}</span>
        <span className={styles.launchStatus}>{status}</span>
      </div>
      {metrics.map((m: any) => {
        const pct = Math.min((m.actual / m.target) * 100, 100);
        return (
          <div key={m.label} className={styles.launchRow}>
            <div className={styles.launchRowLabel}>{m.label}</div>
            <div className={styles.launchBarWrap}>
              <div className={styles.launchBar} style={{ width: `${pct}%`, background: m.color }} />
            </div>
            <div className={styles.launchRowNums}>
              <span style={{ color: m.color, fontWeight: 700 }}>{m.actual}%</span>
              <span className={styles.launchTarget}>/ {m.target}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WatchoutCard({ w, onOpen }: { w: Watchout; onOpen: (id: string) => void }) {
  return (
    <div className={`${styles.watchCard} ${w.severity === "high" ? styles.watchHigh : styles.watchMedium}`}>
      <div className={styles.watchHead}>
        <div className={styles.watchTitle}>{w.title}</div>
        <div className={`${styles.drawerPill} ${w.severity === "high" ? styles.pillHigh : styles.pillMedium}`}>
          {w.severity.toUpperCase()}
        </div>
      </div>
      <p className={styles.watchDesc}>{w.description.slice(0, 130)}…</p>
      {w.signals?.slice(0, 2).map((s, i) => (
        <div key={i} className={styles.watchSignal}>
          <span className={styles.watchDot} />{s}
        </div>
      ))}
      <button className={styles.watchCta} onClick={() => onOpen(w.id)}>View full detail →</button>
    </div>
  );
}

function ActionCard({ a }: { a: { title: string; bullets: string[]; icon?: React.ReactNode } }) {
  return (
    <div className={styles.actionCard}>
      {a.icon && <div className={styles.actionIcon}>{a.icon}</div>}
      <div className={styles.actionTitle}>{a.title}</div>
      <ul className={styles.actionBullets}>{a.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
    </div>
  );
}

const MiniBarChart: React.FC<{ values: number[] }> = ({ values }) => {
  const max = Math.max(...values, 1);
  return (
    <div className={styles.miniChart} aria-hidden="true">
      {values.map((v, i) => (
        <span key={i} className={styles.miniBar} style={{ height: `${Math.round((v / max) * 100)}%` }} />
      ))}
    </div>
  );
};

const InventoryBlocks: React.FC<{ blocks?: number }> = ({ blocks = 12 }) => (
  <div className={styles.blocks} aria-hidden="true">
    {Array.from({ length: blocks }).map((_, i) => (
      <span key={i} className={styles.block} />
    ))}
  </div>
);

export default function StoryOfMonthPMI({ data }: { data?: Partial<StoryData> }) {
  console.log('[StoryOfMonthPMI] VERSION: 2.0 - DYNAMIC ACTS ENABLED');

  /** ✅ ADDED: Drawer state */
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const lastFocusedElRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const story = useMemo<StoryData>(() => {
    console.log('[StoryOfMonthPMI] Received data:', {
      hasData: !!data,
      hasActs: !!data?.acts,
      actsCount: data?.acts?.length || 0,
      firstActTitle: data?.acts?.[0]?.title,
      firstActChart: data?.acts?.[0]?.chartData ? {
        type: data.acts[0].chartData.type,
        labelsCount: data.acts[0].chartData.labels?.length,
        valuesCount: data.acts[0].chartData.values?.length,
        firstThreeValues: data.acts[0].chartData.values?.slice(0, 3)
      } : 'missing'
    });

    const base: StoryData = {
      monthTitle: "Story of the Month",
      subtitle: "December Performance Snapshot & Key Risks",
      themeTag: "GST-led Stock‑Up: Strong Optics, Hidden Gravity",

      heroTitle: "The GST Mirage: Growth Today, Gravity Tomorrow",
      heroLead:
        "Revenue and premium share gains are real — but the trade is building inventory ahead of a potential GST increase. Act now to prevent a near-term volume correction and protect economy-segment share.",

      kpis: [
        { label: "Net Revenue", value: "+8.2% YoY", delta: "+3.3% MoM", tone: "good", hint: "Primarily price/mix-led growth", icon: <IconRevenue /> },
        { label: "Secondary Volumes", value: "+10.1% YoY", delta: "~+10% MoM", tone: "good", hint: "Stock‑up visible in channel", icon: <IconBox /> },
        { label: "Market Share Gain", value: "~+60 bps", tone: "good", hint: "Premium-led (Marlboro); economy erosion persists", icon: <IconShare /> },
        { label: "Delhi + Maharashtra", value: "~‑2% seq.", tone: "warn", hint: "Pipeline correction vs demand? Deep dive needed", icon: <IconMap /> },
      ],

      sections: {
        wins: [
          "Healthy business growth: Net revenue +8.2% YoY, +3.3% MoM; driven by price/mix, not volume.",
          "Offtake strengthened: Secondary volumes +10.1% YoY as distributor-to-retailer shipments improved across key metros.",
          "Channel uptick partly driven by anticipation of a GST increase by trade partners.",
        ],
        twist: [
          "Industry contracted: Combustible volumes -4.8% YoY, yet PMI secondary volumes grew → implied ~60 bps share gain.",
          "Share pickup disproportionately premium-led (Marlboro) as competitive intensity eased post SKU rationalization.",
          "Challenge remains in economy segment, where share continues to erode to regional and local players.",
        ],
        faultLines: [
          "Delhi & Maharashtra together contribute ~38% of national secondary volumes but only ~25% of UBO distribution → structurally concentrated exposure.",
          "Both states saw ~2% sequential dip this month, likely post-strong-month pipeline correction.",
          "Recommendation: SKU-level review in Delhi & Maharashtra to ensure no underlying demand erosion masked by normalization.",
        ],
        innovation: [
          "Compact Edge launch at 60 days: 20% weighted distribution vs 40% target; volumes at 54% of forecast.",
          "Modern trade sell-through healthy; general trade velocity weak due to insufficient retailer push and visibility.",
          "Nielsen RMS divergence: retail +2.3% MoM vs secondary ~+10% → ~3–4 weeks excess inventory building in the channel (GST anticipation).",
        ],
      },

      /** ✅ ENRICHED: Watchouts include chip labels + drawer content */
      watchouts: [
        {
          id: "inventory",
          chipLabel: "Inventory Divergence",
          title: "Q4 volume correction risk",
          severity: "high",
          description:
            "3–4 weeks excess stock could trigger trade liquidation, causing a sharp sequential drop in secondary volumes that misrepresents true consumer demand and distorts P&L signals.",
          soWhat: "Headline secondary volumes may reverse in 1–2 months even if consumers remain stable.",
          signals: [
            "Secondary vs retail gap > 2 weeks sustained",
            "Distributor fill-rate falling while retail stays flat",
            "Rising returns / lower reorder frequency in top metros",
          ],
          nowWhat: [
            "Set weekly divergence thresholds; trigger shipment moderation",
            "Targeted liquidation in high-stock pockets (visibility + schemes)",
            "Align distributor KPIs to retail offtake to avoid over-push",
          ],
        },
        {
          id: "downtrading",
          chipLabel: "Economy Down‑Trading",
          title: "Down‑trading accelerates economy share loss",
          severity: "high",
          description:
            "GST increase may push price-sensitive consumers to cheaper local brands — historically sticky once entrenched. Without a credible value-tier response, permanent share loss risk rises.",
          soWhat: "Once consumers shift to local economy brands, regaining share becomes costlier and slower.",
          signals: [
            "Economy mix decline accelerating in price-sensitive states",
            "Local brand share rising in distributor panels",
            "Increased demand for lower price-pack tiers at retail",
          ],
          nowWhat: [
            "Pre-GST: tactical price-pack architecture in hotspots",
            "Deploy targeted trade offers; protect shelf presence",
            "Weekly monitoring of economy segment share vs local brands",
          ],
        },
        {
          id: "concentration",
          chipLabel: "State Concentration",
          title: "State concentration → earnings vulnerability",
          severity: "medium",
          description:
            "With ~38% of volumes concentrated in a few states, any regulatory disruption, distributor conflict, or demand shock can disproportionately impact national performance — compounded by the current sequential dip.",
          soWhat: "Performance volatility increases because a small number of states can swing national results.",
          signals: [
            "Sequential dips continuing in Delhi/Maharashtra",
            "Regulatory/compliance events or distributor friction",
            "Distribution gaps widening vs volume concentration",
          ],
          nowWhat: [
            "SKU-level deep dive in Delhi/Maharashtra to separate demand vs pipeline",
            "Accelerate growth in underleveraged states to diversify base",
            "Strengthen distributor governance in high-concentration states",
          ],
        },
        {
          id: "launch",
          chipLabel: "Launch at Risk",
          title: "Launch credibility at stake",
          severity: "medium",
          description:
            "Compact Edge is at a critical juncture. If general trade gaps aren’t closed quickly, the SKU risks continuation review and weakens confidence in the innovation go-to-market model.",
          soWhat: "The risk extends beyond one SKU — it affects the credibility of the launch engine and trade confidence.",
          signals: [
            "WD remains < 30% by next sprint",
            "General trade velocity stays below modern trade baseline",
            "Low visibility compliance in top GT clusters",
          ],
          nowWhat: [
            "2-week GT sprint: visibility kits + retailer incentives",
            "Tight distributor/promoter cadence in top districts",
            "Monitor WD%, numeric distribution, outlet velocity weekly",
          ],
        },
      ],

      actions: [
        { title: "Inventory Shock Absorber (Next 30 Days)", icon: <IconBox />, bullets: ["Track divergence weekly; define alert thresholds.", "Moderate shipments in high-stock pockets.", "Run targeted liquidation to avoid a cliff-drop."] },
        { title: "General Trade Rescue for Compact Edge", icon: <IconRocket />, bullets: ["2-week GT sprint: visibility + incentives.", "Tight execution cadence with distributors.", "Monitor WD%, numeric distribution, velocity."] },
        { title: "Economy Segment Defense Play", icon: <IconShare />, bullets: ["Pre-GST price-pack actions in hotspots.", "Early warning on economy mix + local share.", "Protect shelf presence in down-trading zones."] },
      ],

      footnotes: [
        "Based on provided secondary shipment trends, state mix, new launch performance indicators, and Nielsen RMS retail signal divergence.",
        "Watchouts are forward-looking and should be validated through weekly trade + retail pulse checks.",
      ],
    };

    const merged = deepMerge(base, data || {});
    console.log('[StoryOfMonthPMI] Final merged story:', {
      hasActs: !!merged.acts,
      actsCount: merged.acts?.length || 0,
      firstActTitle: merged.acts?.[0]?.title,
      firstActChart: merged.acts?.[0]?.chartData ? {
        type: merged.acts[0].chartData.type,
        labelsCount: merged.acts[0].chartData.labels?.length,
        valuesCount: merged.acts[0].chartData.values?.length,
        firstThreeValues: merged.acts[0].chartData.values?.slice(0, 3)
      } : 'missing'
    });
    return merged;
  }, [data]);

  /** ✅ ADDED: Derived data */
  const activeRisk = useMemo(
    () => story.watchouts.find((w) => w.id === activeRiskId) || null,
    [activeRiskId, story.watchouts]
  );

  /** ✅ ADDED: Drawer open/close helpers */
  const openRisk = (id: string) => {
    lastFocusedElRef.current = document.activeElement as HTMLElement;
    setActiveRiskId(id);
  };

  const closeRisk = () => {
    setActiveRiskId(null);
  };

  /** ✅ ADDED: ESC closes drawer + focus management */
  useEffect(() => {
    if (!activeRiskId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRisk();
    };

    document.addEventListener("keydown", onKeyDown);

    // Focus drawer for accessibility
    setTimeout(() => {
      drawerRef.current?.focus();
    }, 0);

    // Prevent body scroll while drawer open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;

      // Restore focus to the chip that opened it
      lastFocusedElRef.current?.focus?.();
    };
  }, [activeRiskId]);

  return (
    <section className={styles.story} aria-label="PMI Story of the Month">
      <div className={styles.shell}>
        {/* ── Topbar ─────────────────────────────────────────────── */}
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.mark} aria-hidden="true">PMI</div>
            <div className={styles.brandText}>
              <div className={styles.kicker}>{story.monthTitle}</div>
              <div className={styles.subtitle}>{story.subtitle}</div>
            </div>
          </div>
          {/* themeTag and Top action removed per request */}
        </header>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>{story.heroTitle}</h1>
            <p className={styles.lead}>{story.heroLead}</p>
            <div className={styles.riskChips} aria-label="Risk chips — click to expand">
              {story.watchouts.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`${styles.riskChip} ${w.severity === "high" ? styles.riskChipHigh : styles.riskChipMedium}`}
                  onClick={() => openRisk(w.id)}
                  aria-haspopup="dialog"
                  aria-expanded={activeRiskId === w.id}
                >
                  <span className={styles.riskChipDot} aria-hidden="true" />
                  <span className={styles.riskChipText}>{w.chipLabel || w.title}</span>
                  <span className={styles.riskChipArrow} aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* KPI strip removed per request; spacer preserves layout */}
        <div className={styles.kpiSpacer} aria-hidden="true" />

        <SectionSep label="Performance Deep Dive" />

        {/* ── Story Acts Grid ────────────────────────────────────── */}
        <div className={styles.grid}>

          {/* Dynamic Acts Rendering */}
          {(() => {
            console.log('[RENDER] Checking acts:', {
              hasActs: !!story.acts,
              actsLength: story.acts?.length,
              condition: story.acts && story.acts.length > 0
            });
            return null;
          })()}
          {story.acts && story.acts.length > 0 ? (
            <>
              {console.log('[RENDER] Using DYNAMIC acts rendering')}
              {story.acts.map((act) => {
                console.log(`[RENDER] Rendering Act ${act.actNumber}: ${act.title}`, {
                  hasChartData: !!act.chartData,
                  chartType: act.chartData?.type,
                  hasTableData: !!act.tableData,
                  tableType: act.tableData?.type
                });
                return (
              <div key={act.actNumber} className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.panelTitle}>Act {act.actNumber} — {act.title}</div>
                  <div className={`${styles.ribbon} ${
                    act.actNumber === 1 ? styles.goodRibbon :
                    act.actNumber === 4 ? styles.riskRibbon :
                    styles.warnRibbon
                  }`}>
                    {act.subtitle}
                  </div>
                </div>
                <ul className={styles.bullets}>
                  {act.insights.map((t, i) => <li key={i}>{t}</li>)}
                </ul>

                {/* Dynamic Chart Rendering */}
                {act.chartData && (
                  <div className={styles.microViz}>
                    <div className={styles.microTitle}>{act.chartData.title}</div>
                    {act.chartData.type === 'area' && act.chartData.labels && act.chartData.values && (
                      <RevenueTrendChart chartData={{labels: act.chartData.labels, values: act.chartData.values, title: act.chartData.title}} />
                    )}
                    {act.chartData.type === 'bars' && act.chartData.data && (
                      <div className={styles.shareBarGroup}>
                        {act.chartData.data.map((d) => (
                          <div key={d.brand} className={styles.shareBarRow}>
                            <div className={styles.shareBarLabel}>{d.brand}</div>
                            <div className={styles.shareBarTrack}>
                              <div className={styles.shareBarFill} style={{width: `${d.share}%`, background: d.fill || '#1a56db'}}></div>
                            </div>
                            <div className={styles.shareBarValue}>{d.share}% <span className={styles.shareBarDelta}>{d.delta}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Table Rendering */}
                {act.tableData && (
                  <div className={styles.microViz}>
                    <div className={styles.microTitle}>{act.tableData.title}</div>
                    {act.tableData.type === 'states' && act.tableData.data && (
                      <table className={styles.stateTable}>
                        <thead>
                          <tr>
                            <th>State</th>
                            <th>Vol. Share</th>
                            <th>Seq. Δ</th>
                            <th>Signal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {act.tableData.data.map((row, idx) => (
                            <tr key={idx}>
                              <td><strong>{row.state}</strong></td>
                              <td>{row.share}</td>
                              <td className={row.seq?.startsWith('-') ? styles.warn : styles.good}>{row.seq}</td>
                              <td>
                                <span className={`${styles.statusBadge} ${
                                  row.status === 'good' ? styles.statusGood :
                                  row.status === 'ok' ? styles.statusOk :
                                  styles.statusWarn
                                }`}>
                                  {row.status === 'good' ? '➚ Accelerate' : row.status === 'ok' ? '→ Monitor' : '⚠ Review'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {act.tableData.type === 'launch' && act.tableData.metricsDetails && (
                      <LaunchTracker metricsDetails={act.tableData.metricsDetails} />
                    )}
                  </div>
                )}

                {/* AI Insight */}
                {act.aiInsight && <AIInsight text={act.aiInsight} />}
              </div>
            );
              })}
            </>
          ) : (
            /* Fallback to old structure if acts not available */
            <>
              {console.log('[RENDER] Using FALLBACK static rendering')}
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.panelTitle}>Act 1 — The Win</div>
                  <div className={`${styles.ribbon} ${styles.goodRibbon}`}>Momentum</div>
                </div>
                <ul className={styles.bullets}>
                  {story.sections.wins.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                <div className={styles.microViz}>
                  <div className={styles.microTitle}>Net Revenue Index — 12-Month Trend</div>
                  <RevenueTrendChart />
                </div>
                <AIInsight text="Revenue growth is accelerating on price-mix. Watch for volume softness in Q2 if GST increase materialises — contribution mix may flip." />
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.panelTitle}>Act 2 — The Twist</div>
                  <div className={`${styles.ribbon} ${styles.warnRibbon}`}>Stock‑Up</div>
                </div>
                <ul className={styles.bullets}>
                  {story.sections.twist.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                <div className={styles.microViz}>
                  <div className={styles.microTitle}>Market Share Distribution — Jan</div>
                  <MarketShareBars />
                </div>
                <AIInsight text="Market share gain is premium-led. Economy erosion is structural — early intervention is ROI-positive vs. reactive spend post-entrenchment." />
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.panelTitle}>Act 3 — Fault Lines</div>
                  <div className={`${styles.ribbon} ${styles.warnRibbon}`}>Concentration</div>
                </div>
                <ul className={styles.bullets}>
                  {story.sections.faultLines.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                <div className={styles.microViz}>
                  <div className={styles.microTitle}>State Volume Breakdown</div>
                  <StateTable />
                </div>
                <AIInsight text="Concentration + sequential dip together signal ~70% probability of pipeline correction in Delhi/Maharashtra within 4–6 weeks." />
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div className={styles.panelTitle}>Act 4 — Innovation</div>
                  <div className={`${styles.ribbon} ${styles.riskRibbon}`}>Critical</div>
                </div>
                <ul className={styles.bullets}>
                  {story.sections.innovation.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                <LaunchTracker />
                <AIInsight text="Compact Edge at 54% of forecast at Day 60 is a red-flag. Without a GT sprint in the next 14 days, range-review risk is elevated." />
              </div>
            </>
          )}

        </div>

        <SectionSep label="Risk Analysis & Action Plan" />

        {/* ── Watchout cards 2×2 ───────────────────────────────────── */}
        <div className={styles.watchGrid}>
          {story.watchouts.map((w) => (
            <WatchoutCard key={w.id} w={w} onOpen={openRisk} />
          ))}
        </div>

        {/* ── Action playbook ─────────────────────────────────────── */}
        <div className={styles.actionSection}>
          <div className={styles.actionSectionTitle}>Action Playbook</div>
          <div className={styles.actionGrid}>
            {story.actions.map((a, i) => <ActionCard key={i} a={a} />)}
          </div>
        </div>

        {/* ── Footnotes ───────────────────────────────────────────── */}
        {story.footnotes?.length ? (
          <footer className={styles.footnotes}>
            {story.footnotes.map((f, i) => <p key={i} className={styles.footnote}>{f}</p>)}
          </footer>
        ) : null}

      </div>

      {/* ✅ ADDED: Drawer + overlay (only mounted when active) */}
      {activeRisk ? (
        <div className={styles.drawerRoot} role="presentation">
          <div className={styles.drawerOverlay} onClick={closeRisk} aria-hidden="true" />

          <div
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label={`Risk detail: ${activeRisk.title}`}
            tabIndex={-1}
            ref={drawerRef}
          >
            <div className={styles.drawerTop}>
              <div className={styles.drawerTitleWrap}>
                <div className={styles.drawerTitle}>{activeRisk.title}</div>
                <div className={`${styles.drawerPill} ${activeRisk.severity === "high" ? styles.pillHigh : styles.pillMedium}`}>
                  {activeRisk.severity.toUpperCase()}
                </div>
              </div>

              <button type="button" className={styles.drawerClose} onClick={closeRisk} aria-label="Close risk drawer">
                ✕
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerSection}>
                <div className={styles.drawerLabel}>Risk</div>
                <div className={styles.drawerText}>{activeRisk.description}</div>
              </div>

              {activeRisk.soWhat ? (
                <div className={`${styles.drawerSection} ${styles.drawerCallout}`}>
                  <div className={styles.drawerLabel}>So what</div>
                  <div className={styles.drawerText}>{activeRisk.soWhat}</div>
                </div>
              ) : null}

              {activeRisk.signals?.length ? (
                <div className={styles.drawerSection}>
                  <div className={styles.drawerLabel}>Signals to watch (weekly)</div>
                  <ul className={styles.drawerList}>
                    {activeRisk.signals.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              ) : null}

              {activeRisk.nowWhat?.length ? (
                <div className={styles.drawerSection}>
                  <div className={styles.drawerLabel}>Now what (next actions)</div>
                  <ul className={styles.drawerList}>
                    {activeRisk.nowWhat.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className={styles.drawerBottom}>
              <button type="button" className={styles.drawerCta} onClick={closeRisk}>
                Got it — back to story
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: any = Array.isArray(base) ? [...(base as unknown[])] : { ...base };
  Object.keys(override ?? {}).forEach((k) => {
    const oVal = (override as Record<string, unknown>)[k];
    const bVal = (base as Record<string, unknown>)[k];
    if (oVal && typeof oVal === "object" && !Array.isArray(oVal) && bVal && typeof bVal === "object") {
      out[k] = deepMerge(bVal as Record<string, unknown>, oVal as Partial<Record<string, unknown>>);
    } else if (oVal !== undefined) {
      out[k] = oVal;
    }
  });
  return out as T;
}