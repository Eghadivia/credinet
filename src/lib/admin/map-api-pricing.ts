import { mapApiServiceTypeToLabel } from '@/lib/admin/map-transaction'
import type { ServiceManagementModule } from '@/lib/admin/service-module'
import type { PricingRow } from '@/types/admin'
import type { ApiPricingEntry, ApiServiceType } from '@/types/admin-api'

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  }
  return 0
}

export function moduleToPricingServiceType(
  module: ServiceManagementModule,
): ApiServiceType | undefined {
  if (module === 'airtime') return 'AIRTIME'
  if (module === 'databundle') return 'DATA'
  if (module === 'electricity') return 'ELECTRICITY'
  if (module === 'cable') return 'CABLE'
  return undefined
}

export function normalizePricingList(raw: unknown): ApiPricingEntry[] {
  if (Array.isArray(raw)) return raw as ApiPricingEntry[]
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    const inner = o.data && typeof o.data === 'object' ? (o.data as Record<string, unknown>) : o
    for (const key of ['pricing', 'items', 'rows', 'data'] as const) {
      const v = inner[key]
      if (Array.isArray(v)) return v as ApiPricingEntry[]
    }
  }
  return []
}

export function mapApiPricingToRow(entry: ApiPricingEntry, idx: number): PricingRow {
  const raw = entry as Record<string, unknown>
  const serviceType = String(entry.serviceType ?? entry.type ?? `UNKNOWN_${idx}`).toUpperCase()
  const providerName = String(
    entry.providerName ?? entry.provider ?? entry.providerCode ?? '—',
  ).trim()
  const basePrice = pickNumber(raw, ['basePrice', 'baseAmount', 'amount', 'cost'])
  const markupPercent = pickNumber(raw, ['markupPercent', 'markup', 'markupPercentage'])
  let finalPrice = pickNumber(raw, ['finalPrice', 'sellingPrice', 'price', 'totalPrice'])
  if (!finalPrice && basePrice > 0) {
    finalPrice = Math.round(basePrice * (1 + markupPercent / 100))
  }

  return {
    id: serviceType,
    serviceType,
    serviceName: mapApiServiceTypeToLabel(serviceType),
    providerName,
    basePrice,
    markupPercent,
    finalPrice,
  }
}

/** One markup row per `serviceType` — applies to every provider under that service. */
export function collapsePricingByServiceType(entries: ApiPricingEntry[]): PricingRow[] {
  const byType = new Map<string, ApiPricingEntry[]>()

  for (const entry of entries) {
    const st = String(entry.serviceType ?? entry.type ?? '')
      .trim()
      .toUpperCase()
    if (!st) continue
    const list = byType.get(st) ?? []
    list.push(entry)
    byType.set(st, list)
  }

  return Array.from(byType.entries()).map(([serviceType, group], idx) => {
    const hasProvider = (e: ApiPricingEntry) =>
      Boolean(
        (e.provider && String(e.provider).trim()) ||
          (e.providerName && String(e.providerName).trim()) ||
          (e.providerCode && String(e.providerCode).trim()),
      )

    const serviceLevel = group.find((e) => !hasProvider(e))
    const picked = serviceLevel ?? group[0]
    const row = mapApiPricingToRow(picked, idx)
    return { ...row, id: serviceType, serviceType, providerName: '' }
  })
}

export function pricingRowMatchesModule(module: ServiceManagementModule, row: PricingRow): boolean {
  if (module === 'all') return true
  const st = row.serviceType.toUpperCase()
  if (module === 'airtime') return st === 'AIRTIME'
  if (module === 'databundle') return st === 'DATA' || st === 'DATA_BUNDLE'
  if (module === 'electricity') return st === 'ELECTRICITY'
  if (module === 'cable') return st === 'CABLE'
  return true
}
