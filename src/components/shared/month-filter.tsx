'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type MonthFilterProps = {
  selectedMonth: string
  monthOptions: string[]
  onMonthChange: (month: string) => void
  label?: string
}

export function MonthFilter({
  selectedMonth,
  monthOptions,
  onMonthChange,
  label,
}: MonthFilterProps) {
  // HYDRATION FIX: Track client-side mount to prevent SSR mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        ) : null}
        <div className="flex h-10 w-full min-w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
          <span className="text-muted-foreground">Select month</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      ) : null}
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-full min-w-[150px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
