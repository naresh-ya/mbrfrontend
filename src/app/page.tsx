"use client";

import styles from "../../src/components/dashboard/dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <h1>
          Good afternoon <span className={styles.name}>Shivam Sharma!</span>
        </h1>
        <p>What should we navigate today?</p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBox}>
        <input placeholder="How may we help you today?" />
        <div className={styles.icons}>
          <button className={styles.iconBtn}>🎤</button>
          <button className={styles.sendBtn}>➤</button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className={styles.prompts}>
        {[
          "What does Dec look like?",
          "What should we be doing differently in Jan?",
          "Where are the top sales in India?",
        ].map((p, i) => (
          <div key={i} className={styles.promptCard}>
            <span className={styles.promptIcon}>📈</span> {p}
          </div>
        ))}
      </div>

      {/* KPI Chips */}
      <div className={styles.sectionHeader} style={{ marginTop: "5rem" }}>
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

      </div>

      {/* Executive Narrative */}
      {/* <div className={styles.sectionHeader}>
        <span>Executive narrative</span>
        <a href="#">VIEW ALL →</a>
      </div>

      <div className={styles.cardGrid}>
        {[1, 2].map((n) => (
          <NarrativeCard key={n} />
        ))}
      </div> */}

      {/* Pinned Indicators */}
      <div className={styles.sectionHeader}>
        <span>Pinned Driving Indicators</span>
        <a href="#">VIEW ALL DRIVING INDICATORS →</a>
      </div>

      <div className={styles.indicatorRow}>
        {[1, 2, 3].map((n) => (
          <IndicatorCard key={n} />
        ))}
        <div className={styles.addCard}>+</div>
      </div>
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
