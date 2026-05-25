
"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { KitSalesDialog } from "@/components/dashboard/kit-sales-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { KpiData } from "@/app/lib/data"
import { useUIMonth } from "@/contexts/UIMonthContext"
import { useKPIMonths } from "@/hooks/useKPIMonths"
import {
  transformNetRevenueFromS3,
  transformSecondaryVolumeFromS3,
  transformOperatingIncomeFromS3,
  transformMarketShareFromS3,
  transformOperationsInnovationFromS3
} from "@/app/lib/transform-outcome-indicators"

async function fetchNetRevenueFromS3(month: string) {
  try {
    const res = await fetch(`/api/kpi/net-revenue?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Net Revenue from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Net Revenue from S3:", error)
    return null
  }
}

async function fetchSecondaryVolumeFromS3(month: string) {
  try {
    const res = await fetch(`/api/kpi/secondary-volume?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Secondary Volume from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Secondary Volume from S3:", error)
    return null
  }
}

async function fetchOperatingIncomeFromS3(month: string) {
  try {
    const res = await fetch(`/api/kpi/operating-income?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Operating Income from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Operating Income from S3:", error)
    return null
  }
}

async function fetchMarketShareFromS3(month: string) {
  try {
    const res = await fetch(`/api/kpi/market-share?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Market Share from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Market Share from S3:", error)
    return null
  }
}

async function fetchOperationsInnovationFromS3(month: string) {
  try {
    const res = await fetch(`/api/kpi/operations-innovation?month=${encodeURIComponent(month)}`)
    if (!res.ok) {
      console.warn("Failed to fetch Operations Innovation from S3")
      return null
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching Operations Innovation from S3:", error)
    return null
  }
}

export default function KpiPage() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [selectedKpi, setSelectedKpi] = useState<KpiData | null>(null)
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)

  // Use global UI month context
  const {
    currentMonthAbbr,
    changeMonth,
    config: uiMonthConfig,
  } = useUIMonth()

  // Derive lastUpdated from global config
  const lastUpdated = uiMonthConfig?.generatedAt || uiMonthConfig?.lastUpdated || new Date().toISOString()

  // Use getmonth_all for month options
  const { availableMonths: kpiMonths, loading: monthsLoading } = useKPIMonths()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        console.log(`📊 [Outcome Indicators] Loading data for ${currentMonthAbbr}`)

        // Fetch S3 data for all KPIs in parallel with currentMonthAbbr
        const [netRevenueS3, secondaryVolumeS3, operatingIncomeS3, marketShareS3, operationsInnovationS3] =
          await Promise.all([
            fetchNetRevenueFromS3(currentMonthAbbr),
            fetchSecondaryVolumeFromS3(currentMonthAbbr),
            fetchOperatingIncomeFromS3(currentMonthAbbr),
            fetchMarketShareFromS3(currentMonthAbbr),
            fetchOperationsInnovationFromS3(currentMonthAbbr)
          ])

        let kpis: any[] = []

        // Transform Net Revenue S3 data
        if (netRevenueS3?.ytdCard && netRevenueS3?.monthlyCard && netRevenueS3?.insights) {
          const transformedNetRevenue = transformNetRevenueFromS3(
            netRevenueS3.ytdCard,
            netRevenueS3.monthlyCard,
            netRevenueS3.insights
          )
          kpis.push(transformedNetRevenue)
          console.log(`✅ [Outcome Indicators] Transformed Net Revenue`)
        }

        // Transform Secondary Volume S3 data
        if (secondaryVolumeS3?.card && secondaryVolumeS3?.insights) {
          const transformedSecondaryVolume = transformSecondaryVolumeFromS3(
            secondaryVolumeS3.card,
            secondaryVolumeS3.insights
          )
          kpis.push(transformedSecondaryVolume)
          console.log(`✅ [Outcome Indicators] Transformed Secondary Volume`)
        }

        // Transform Operating Income S3 data
        if (operatingIncomeS3?.card && operatingIncomeS3?.insights) {
          const transformedOperatingIncome = transformOperatingIncomeFromS3(
            operatingIncomeS3.card,
            operatingIncomeS3.insights
          )
          kpis.push(transformedOperatingIncome)
          console.log(`✅ [Outcome Indicators] Transformed Operating Income`)
        }

        // Transform Market Share S3 data
        if (marketShareS3?.card && marketShareS3?.insights) {
          const transformedMarketShare = transformMarketShareFromS3(
            marketShareS3.card,
            marketShareS3.insights
          )
          kpis.push(transformedMarketShare)
          console.log(`✅ [Outcome Indicators] Transformed Market Share`)
        }

        // Transform Operations Innovation S3 data (returns array of 3 cards)
        if (operationsInnovationS3) {
          const transformedOperationsInnovation = transformOperationsInnovationFromS3(operationsInnovationS3)
          kpis.push(...transformedOperationsInnovation)
          console.log(`✅ [Outcome Indicators] Transformed Operations & Innovation (${transformedOperationsInnovation.length} cards)`)
        }

        // Sort cards by order property
        kpis.sort((a, b) => (a.order || 999) - (b.order || 999))

        setKpiData(kpis)
        setUserName("User")

        console.log(`✅ [Outcome Indicators] Loaded ${kpis.length} cards`)
      } catch (error) {
        console.error("Error loading KPI data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentMonthAbbr])

  const handleKpiClick = (kpi: KpiData) => {
    setSelectedKpi(kpi)
    setIsDetailModalOpen(true)
  }


  return (
  <>
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-white">
      <DashboardHeader
        kpiData={kpiData}
        userName={userName}
        selectedMonth={currentMonthAbbr}
        monthOptions={kpiMonths}
        onMonthChange={changeMonth}
        lastUpdated={lastUpdated}
        title="Outcome Indicators"
      />

      <main className="mt-8">
        {(loading || monthsLoading) ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-[230px] w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {kpiData.map((kpi) => {
              const statusTag = (
                kpi.statusTag || kpi.confidence?.level || kpi.achievementVsRF?.status || ""
              ).toString().trim().toLowerCase();

              return (
                <div
                  key={kpi.id || kpi.title}
                  onClick={kpi.isClickable !== false ? () => handleKpiClick(kpi) : undefined}
                  className={kpi.isClickable !== false ? "cursor-pointer" : ""}
                >
                  <KpiCard
                    category={kpi.category}
                    changeType={kpi.changeType}
                    title={kpi.title}
                    subtitle={kpi.subtitle}
                    value={kpi.actual.value}
                    comparison={kpi.comparison}
                    narrative={kpi.narrative}
                    statusTag={statusTag}
                    trend={kpi.actual.trend}
                    casualImpact={kpi.causalLinks.causalImpact}
                    chartData={kpi.chartData}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>

    <KitSalesDialog
      open={isDetailModalOpen}
      onOpenChange={setIsDetailModalOpen}
      data={selectedKpi || null}
    />
  </>
);
}
