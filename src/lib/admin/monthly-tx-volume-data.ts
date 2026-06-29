import { monthlySalesSeries } from '@/data/mock/admin-dashboard'

export type MonthlyTxVolumeDatum = {
  month: string
  total: number
  successful?: number
  failed?: number
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return fallback
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

function fallbackFromMockSales(): MonthlyTxVolumeDatum[] {
  return (monthlySalesSeries as { month: string; airtime: number; data: number; electricity: number; cable: number }[]).map(
    (r) => ({
      month: r.month,
      total: r.airtime + r.data + r.electricity + r.cable,
    }),
  )
}

/** Map `GET /admin/analytics/transaction-volume` payloads into chart rows (best-effort). */
export function normalizeMonthlyTransactionVolume(raw: unknown): MonthlyTxVolumeDatum[] {
  const root = raw as Record<string, unknown> | null | undefined
  const payload =
    root && typeof root === 'object' && 'data' in root && root.data !== null && root.data !== undefined
      ? (root.data as Record<string, unknown>)
      : root

  if (!payload || typeof payload !== 'object') {
    return fallbackFromMockSales()
  }

  let rows: unknown[] = []
  if (Array.isArray(payload)) rows = payload
  else if (Array.isArray(payload.series)) rows = payload.series
  else if (Array.isArray(payload.months)) rows = payload.months

  if (!rows.length) {
    return fallbackFromMockSales()
  }

  const out: MonthlyTxVolumeDatum[] = rows.map((r) => {
    const e = (typeof r === 'object' && r !== null ? r : {}) as Record<string, unknown>
    const total =
      num(e.total) ||
      num(e.count) ||
      num(e.transactions) ||
      num(e.volume) ||
      num(e.txCount) ||
      num(e.all) ||
      num(e.TOTAL)

    const succ = num(e.successful) || num(e.success) || num(e.SUCCESSFUL)
    const fail = num(e.failed) || num(e.FAILED)

    return {
      month: monthLabel(e) || '—',
      total: total > 0 ? total : succ + fail,
      successful: succ > 0 ? succ : undefined,
      failed: fail > 0 ? fail : undefined,
    }
  })

  return out.length ? out : fallbackFromMockSales()
}
