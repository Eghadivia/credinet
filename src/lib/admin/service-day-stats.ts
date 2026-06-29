import { isSuccessfulPayment } from '@/lib/admin/map-transaction'
import type { AdminListMeta } from '@/types/admin-api'
import type { ApiAdminTransaction } from '@/types/admin-api'

export type ServiceDayStats = {
  totalCount: number
  successfulCount: number
  successfulAmountNgn: number
  /** True when list was truncated for amount aggregation */
  amountMayBePartial: boolean
}

function num(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return 0
}

/** Prefer backend summary on meta when present */
export function extractServiceDayStatsFromMeta(meta: AdminListMeta | undefined): Partial<ServiceDayStats> | null {
  const m = meta as AdminListMeta & {
    summary?: Record<string, unknown>
    stats?: Record<string, unknown>
  }
  const s = m?.summary ?? m?.stats
  if (!s || typeof s !== 'object') return null

  const totalCount = num(s.totalCount ?? s.total ?? s.count)
  const successfulCount = num(s.successfulCount ?? s.successCount)
  const successfulAmountNgn = num(
    s.successfulAmountNgn ?? s.successfulAmount ?? s.successRevenue ?? s.revenue,
  )

  if (!totalCount && !successfulAmountNgn) return null

  return {
    totalCount: totalCount || undefined,
    successfulCount: successfulCount || undefined,
    successfulAmountNgn: successfulAmountNgn || undefined,
    amountMayBePartial: false,
  }
}

export function computeServiceDayStatsFromTransactions(
  transactions: ApiAdminTransaction[],
  meta: AdminListMeta | undefined,
  fetchedCount: number,
): ServiceDayStats {
  const fromMeta = extractServiceDayStatsFromMeta(meta)
  if (fromMeta?.totalCount != null && fromMeta.successfulAmountNgn != null) {
    return {
      totalCount: fromMeta.totalCount,
      successfulCount: fromMeta.successfulCount ?? 0,
      successfulAmountNgn: fromMeta.successfulAmountNgn,
      amountMayBePartial: false,
    }
  }

  const totalCount = meta?.total ?? transactions.length
  let successfulCount = 0
  let successfulAmountNgn = 0

  for (const t of transactions) {
    if (!isSuccessfulPayment(t)) continue
    successfulCount += 1
    successfulAmountNgn += num(t.amount)
  }

  const amountMayBePartial = Boolean(meta?.total && meta.total > fetchedCount)

  return {
    totalCount,
    successfulCount: fromMeta?.successfulCount ?? successfulCount,
    successfulAmountNgn: fromMeta?.successfulAmountNgn ?? successfulAmountNgn,
    amountMayBePartial,
  }
}
