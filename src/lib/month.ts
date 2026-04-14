const MONTH_NAME_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

export function parseRawChartMonth(raw: string) {
  const apostropheMatch = raw.match(/^([A-Za-z]+)'(\d{2})$/)
  if (apostropheMatch) {
    const month = MONTH_NAME_INDEX[apostropheMatch[1]]
    const year = 2000 + Number(apostropheMatch[2])
    if (month !== undefined) {
      return { month, year }
    }
  }

  const spacedMatch = raw.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (spacedMatch) {
    const month = MONTH_NAME_INDEX[spacedMatch[1]]
    const year = Number(spacedMatch[2])
    if (month !== undefined) {
      return { month, year }
    }
  }

  const shortMatch = raw.match(/^([A-Za-z]{3})$/)
  if (shortMatch) {
    const month = MONTH_NAME_INDEX[shortMatch[1]]
    const year = new Date().getFullYear()
    if (month !== undefined) {
      return { month, year }
    }
  }

  return null
}

export function formatChartMonth(raw: string) {
  const parsed = parseRawChartMonth(raw)
  if (!parsed) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed.year, parsed.month, 1))
}

export function sortMonthLabelsDescending(labels: string[]) {
  return [...labels].sort((a, b) => {
    const dateA = new Date(`${a} 1`)
    const dateB = new Date(`${b} 1`)
    return dateB.getTime() - dateA.getTime()
  })
}

export function createRecentMonthOptions(count = 12) {
  const options: string[] = []
  const today = new Date()
  for (let index = 0; index < count; index += 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1)
    options.push(
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
      }).format(date)
    )
  }
  return options
}
