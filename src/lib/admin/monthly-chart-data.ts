import { monthlySalesSeries } from '@/data/mock/admin-dashboard'
import type { MonthlySalesDatum } from '@/types/admin-api'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return fallback
}

function monthLabel(entry: Record<string, unknown>): string {
  if (typeof entry.label === 'string' && entry.label.trim()) return entry.label.trim()
  const m = entry.month ?? entry.monthIndex ?? entry.m
  if (typeof m === 'number' && m >= 1 && m <= 12) return MONTH_NAMES[m - 1]!
  if (typeof m === 'string' && m.length <= 3) return m
  if (typeof m === 'string' && !Number.isNaN(Number(m))) {
    const idx = Number(m)
    if (idx >= 1 && idx <= 12) return MONTH_NAMES[idx - 1]!
  }
  return String(m ?? '')
}

function revenueFromByType(byType: Record<string, unknown>): {
  airtime: number
  data: number
  electricity: number
  cable: number
} {
  return {
    airtime: num(byType.AIRTIME ?? byType.airtime),
    data: num(byType.DATA ?? byType.data ?? byType.DATA_BUNDLE),
    electricity: num(byType.ELECTRICITY ?? byType.electricity),
    cable: num(byType.CABLE ?? byType.cable),
  }
}

/** Map `GET /admin/analytics/monthly-revenue` payloads into chart rows */
export function normalizeMonthlyRevenueChart(raw: unknown): MonthlySalesDatum[] {
  const root = raw as Record<string, unknown> | null | undefined
  const payload =
    root && typeof root === 'object' && 'data' in root && root.data !== null && root.data !== undefined
      ? (root.data as Record<string, unknown>)
      : root

  if (!payload || typeof payload !== 'object') {
    return monthlySalesSeries as MonthlySalesDatum[]
  }

  let rows: unknown[] = []
  if (Array.isArray(payload)) rows = payload
  else if (Array.isArray(payload.series)) rows = payload.series
  else if (Array.isArray(payload.months)) rows = payload.months

  if (!rows.length) {
    return monthlySalesSeries as MonthlySalesDatum[]
  }

  const out: MonthlySalesDatum[] = rows.map((r) => {
    const e = (typeof r === 'object' && r !== null ? r : {}) as Record<string, unknown>
    const rbt = e.revenueByType
    const byType =
      rbt && typeof rbt === 'object' && !Array.isArray(rbt) ? (rbt as Record<string, unknown>) : {}
    const { airtime, data, electricity, cable } = revenueFromByType(byType)

    return {
      month: monthLabel(e) || '—',
      airtime,
      data,
      electricity,
      cable,
    }
  })

  return out.length ? out : (monthlySalesSeries as MonthlySalesDatum[])
}
