'use client'

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
