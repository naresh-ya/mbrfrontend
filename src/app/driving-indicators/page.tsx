"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { KpiData } from "@/app/lib/data"
import { transformDrivingIndicatorsFromS3, transformNielsenIndicatorsFromS3 } from "@/app/lib/transform-driving-indicators"
import { useKPIMonths } from "@/hooks/useKPIMonths"
import { useUIMonth } from "@/contexts/UIMonthContext"
import { UnderDevelopmentBadge } from "@/components/shared/under-development-badge"

async function fetchDrivingIndicators(month: string) {
  try {
    const res = await fetch(`/api/kpi/driving-indicators?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Driving Indicators from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Driving Indicators:", error)
    return null
  }
}

export default function DrivingIndicatorsPage() {
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [userName] = useState("User")
  const [loading, setLoading] = useState(true)

  // Use getmonth_all via custom hook for dropdown options
  const { availableMonths, loading: monthsLoading } = useKPIMonths()

  // Use UIMonthContext for selected month (syncs with Outcome Indicators)
  const {
    currentMonthAbbr,
    changeMonth,
    config: uiMonthConfig
  } = useUIMonth()

  // Derive lastUpdated from global config
  const lastUpdated = uiMonthConfig?.generatedAt || uiMonthConfig?.lastUpdated

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchDrivingIndicators(currentMonthAbbr)

        let allCards: any[] = []

        // Transform sales cards (7 cards)
        if (data?.sales) {
          const salesCards = transformDrivingIndicatorsFromS3(data.sales)
          allCards = [...salesCards]
        }

        // Transform nielsen cards (4 cards - PHILIP MORRIS only)
        if (data?.nielsen) {
          const nielsenCards = transformNielsenIndicatorsFromS3(data.nielsen)
          allCards = [...allCards, ...nielsenCards]
        }

        // Sort by order
        allCards.sort((a, b) => (a.order || 999) - (b.order || 999))

        setKpiData(allCards as any)
      } catch (error) {
        console.error("Error loading Driving Indicators data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentMonthAbbr])

  return (
    <>
      <UnderDevelopmentBadge />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-white">
        <DashboardHeader
          kpiData={kpiData}
          userName={userName}
          selectedMonth={currentMonthAbbr}
          monthOptions={availableMonths}
          onMonthChange={changeMonth}
          lastUpdated={lastUpdated}
          title="Driving Indicators"
        />

        <main className="mt-8">
          {(loading || monthsLoading) ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {[...Array(11)].map((_, i) => (
                <Skeleton key={i} className="h-[230px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {kpiData
                .map((kpi) => {
                  // For driving indicators, show the actual value from the selected month
                  const displayValue = kpi.actual.value;

                  const statusTag = (
                    kpi.statusTag || kpi.confidence?.level || ""
                  ).toString().trim().toLowerCase();

                  // Use displayStatus if available (for SFA, Bias), otherwise use derived status
                  const badgeText = (kpi as any).displayStatus || (
                    statusTag === "high" ? "increasing" :
                    statusTag === "low" ? "declining" : "neutral"
                  );

                  return (
                    <div key={kpi.id || kpi.title}>
                      <KpiCard
                        category={kpi.category}
                        changeType={kpi.changeType}
                        title={kpi.title}
                        subtitle={kpi.subtitle}
                        value={displayValue}
                        comparison={kpi.comparison}
                        narrative={kpi.narrative}
                        statusTag={badgeText}
                        trend={kpi.actual.trend}
                        casualImpact={kpi.description}
                        chartData={kpi.chartData}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
