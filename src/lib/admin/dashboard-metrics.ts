/** Pull numeric dashboard fields from unknown API payloads */
export type DashboardMetrics = {
  totalTransactions?: number
  successfulTransactions?: number
  failedTransactions?: number
  pendingTransactions?: number
  dailyRevenueNgn?: number
  /** From `successfulTransactions.successRatePct` */
  successRatePct?: number
  totalTransactionsChangePct?: number
  successfulTransactionsChangePct?: number
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return undefined
}

/** KPI entry shape: `{ value: number, changePct?: number }` */
function kpiValue(entry: unknown): number | undefined {
  if (entry === null || entry === undefined) return undefined
  if (typeof entry === 'number') return entry
  if (typeof entry === 'object' && 'value' in entry) {
    return num((entry as { value: unknown }).value)
  }
  return undefined
}

function kpiChangePct(entry: unknown): number | undefined {
  if (!entry || typeof entry !== 'object') return undefined
  if ('changePct' in entry) return num((entry as { changePct: unknown }).changePct)
  return undefined
}

function kpiSuccessRatePct(entry: unknown): number | undefined {
  if (!entry || typeof entry !== 'object') return undefined
  if ('successRatePct' in entry) return num((entry as { successRatePct: unknown }).successRatePct)
  return undefined
}

function dailyRevenueAmount(entry: unknown): number | undefined {
  if (!entry || typeof entry !== 'object') return undefined
  const o = entry as { amount?: unknown; value?: unknown }
  return num(o.amount ?? o.value)
}

export function extractDashboardMetrics(payload: unknown): DashboardMetrics | null {
  if (payload === null || payload === undefined) return null
  const root = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null
  if (!root) return null

  const inner = (root.data as Record<string, unknown> | undefined) ?? root
  const kpis = (inner.kpis as Record<string, unknown> | undefined) ?? inner

  const totalTransactions = kpiValue(kpis.totalTransactions) ?? num(inner.totalTransactions)
  const successfulTransactions =
    kpiValue(kpis.successfulTransactions) ?? num(inner.successfulTransactions ?? inner.successCount)
  const failedTransactions = kpiValue(kpis.failedTransactions) ?? num(inner.failedTransactions ?? inner.failedCount)
  const pendingTransactions = kpiValue(kpis.pendingTransactions) ?? num(inner.pendingTransactions ?? inner.pendingCount)
  const dailyRevenueNgn =
    dailyRevenueAmount(kpis.dailyRevenue) ?? num(inner.dailyRevenue ?? inner.todayRevenue ?? inner.revenueToday)

  const successRatePct = kpiSuccessRatePct(kpis.successfulTransactions)

  if (
    totalTransactions === undefined &&
    successfulTransactions === undefined &&
    failedTransactions === undefined &&
    pendingTransactions === undefined &&
    dailyRevenueNgn === undefined
  ) {
    return null
  }

  return {
    totalTransactions,
    successfulTransactions,
    failedTransactions,
    pendingTransactions,
    dailyRevenueNgn,
    successRatePct,
    totalTransactionsChangePct: kpiChangePct(kpis.totalTransactions),
    successfulTransactionsChangePct: kpiChangePct(kpis.successfulTransactions),
  }
}
