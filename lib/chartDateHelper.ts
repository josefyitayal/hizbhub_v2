type RawPoint = {
    date: string // "2026-01-10 00:00:00"
    count: number
}

type TimeRange = {
    from: Date
    to: Date
    unit: "day" | "week" | "month"
}

function startOf(date: Date, unit: "day" | "week" | "month") {
    const d = new Date(date)

    if (unit === "day") {
        d.setHours(0, 0, 0, 0)
    }

    if (unit === "week") {
        const day = d.getDay()
        d.setDate(d.getDate() - day)
        d.setHours(0, 0, 0, 0)
    }

    if (unit === "month") {
        d.setDate(1)
        d.setHours(0, 0, 0, 0)
    }

    return d
}

function add(date: Date, unit: "day" | "week" | "month") {
    const d = new Date(date)

    if (unit === "day") d.setDate(d.getDate() + 1)
    if (unit === "week") d.setDate(d.getDate() + 7)
    if (unit === "month") d.setMonth(d.getMonth() + 1)

    return d
}

function bucketKey(date: Date, unit: "day" | "week" | "month") {
    if (unit === "day") {
        return date.toISOString().slice(0, 10) // YYYY-MM-DD
    }

    if (unit === "week") {
        const d = startOf(date, "week")
        return d.toISOString().slice(0, 10)
    }

    // month
    return `${date.getFullYear()}-${date.getMonth()}`
}
export function buildTimeSeries(
    raw: RawPoint[] | undefined,
    range: TimeRange
) {
    const safeRaw = raw ?? [] // ← key line

    const result: { date: Date; value: number }[] = []

    const dataMap = new Map<string, number>()
    for (const r of safeRaw) {
        const d = new Date(r.date)
        dataMap.set(bucketKey(d, range.unit), r.count)
    }

    let cursor = startOf(range.from, range.unit)

    while (cursor <= range.to) {
        const key = bucketKey(cursor, range.unit)

        result.push({
            date: new Date(cursor),
            value: dataMap.get(key) ?? 0,
        })

        cursor = add(cursor, range.unit)
    }

    return result
}
