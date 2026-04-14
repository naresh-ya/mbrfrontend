
"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { KitSalesDialog } from "@/components/dashboard/kit-sales-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatChartMonth, sortMonthLabelsDescending } from "@/lib/month"
import type { DashboardResponse, KpiData } from "@/app/lib/data"

// type KpiDetails = {
//   title: string
//   description: string
//   actual: string
//   target: string
//   forecast: string
//   confidence: string
//   actualTrend?: "up" | "down"
//   forecastTrend?: "up" | "down"
//   causalImpact: string
// }

// type KpiData = {
//   id: string
//   title: string
//   value: string
//   change: string
//   trend: "up" | "down"
//   subtitle: string
//   details: KpiDetails
// }

// type DashboardResponse = {
//   userName: string
//   kpis: KpiData[]
// }

async function fetchKpiData(): Promise<DashboardResponse> {
  const res = await fetch("/api/kpi")
  if (!res.ok) {
    throw new Error("Failed to fetch KPI data")
  }
  return res.json()
}

export default function KpiPage() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [selectedKpi, setSelectedKpi] = useState<KpiData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [monthOptions, setMonthOptions] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchKpiData()
        setKpiData(data.kpis)
        setUserName(data.userName)

        const monthSet = new Set<string>()
        data.kpis.forEach((kpi) => {
          kpi.chartData.forEach((point) => {
            const label = formatChartMonth(point.month)
            if (label) monthSet.add(label)
          })
        })

        const sortedOptions = sortMonthLabelsDescending(Array.from(monthSet)).slice(0, 3)
        setMonthOptions(sortedOptions)
        if (sortedOptions.length > 0) {
          setSelectedMonth(sortedOptions[0])
        }
      } catch (error) {
        console.error("Error loading KPI data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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
        selectedMonth={selectedMonth}
        monthOptions={monthOptions}
        onMonthChange={setSelectedMonth}
      />

      <main className="mt-8">
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[230px] w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {kpiData
              .filter((k) => k.id !== "bias" && k.id !== "industry-monthly-trend")
              .map((kpi) => {
                const filteredChartData = kpi.chartData.filter(
                  (point) => formatChartMonth(point.month) === selectedMonth
                );

                return { kpi, filteredChartData };
              })
              .filter(({ filteredChartData }) => filteredChartData.length > 0)
              .map(({ kpi, filteredChartData }) => {
                const selectedPoint = filteredChartData[0];
                const displayValue = selectedPoint
                  ? selectedPoint.value.toLocaleString("en-US")
                  : kpi.actual.value;

                // derive a statusTag from available fields for backward compatibility
                const statusTag = (
                  kpi.statusTag || kpi.confidence?.level || kpi.achievementVsRF?.status || ""
                ).toString().trim().toLowerCase();

                return (
                  <div
                    key={kpi.title}
                    onClick={() => handleKpiClick(kpi)}
                    // className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-2"
                  >

{/* <KpiCard
  title={kpi.title}
  value={displayValue}
  change={kpi.change}
  changeType={kpi.changeType}
  chartData={filteredChartData}   
/> */}


<KpiCard
  category={kpi.category}
  changeType={kpi.changeType}
  title={kpi.title}
  subtitle={kpi.subtitle}
  value={displayValue}
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
