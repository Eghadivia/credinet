import type { ApiServiceType } from '@/types/admin-api'

export type ServiceManagementModule = 'all' | 'airtime' | 'databundle' | 'electricity' | 'cable'

export type ServiceTxModule = Exclude<ServiceManagementModule, 'all'>

/** Query `type` param for `GET /admin/transactions` per service hub */
export const MODULE_API_TYPE: Record<ServiceTxModule, ApiServiceType> = {
  airtime: 'AIRTIME',
  databundle: 'DATA',
  electricity: 'ELECTRICITY',
  cable: 'CABLE',
}

export function moduleToApiType(module: ServiceTxModule): ApiServiceType {
  return MODULE_API_TYPE[module]
}

export function isServiceTxModule(m: ServiceManagementModule): m is ServiceTxModule {
  return m !== 'all'
}

export function moduleTitle(module: ServiceManagementModule): string {
  if (module === 'all') return 'Service Management'
  if (module === 'airtime') return 'Airtime services'
  if (module === 'databundle') return 'Data bundle services'
  if (module === 'electricity') return 'Electricity services'
  return 'Cable TV services'
}

/** `YYYY-MM-DD` in local timezone */
export function todayDateInputValue(): string {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** ISO bounds for a calendar day (local) — pass to API `from` / `to` */
export function dayBoundsIso(dateInput: string): { from: string; to: string } {
  const [y, m, d] = dateInput.split('-').map(Number)
  if (!y || !m || !d) {
    const t = todayDateInputValue()
    return dayBoundsIso(t)
  }
  const start = new Date(y, m - 1, d, 0, 0, 0, 0)
  const end = new Date(y, m - 1, d, 23, 59, 59, 999)
  return { from: start.toISOString(), to: end.toISOString() }
}

export function formatDisplayDate(dateInput: string): string {
  const [y, m, d] = dateInput.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1)
  if (Number.isNaN(dt.getTime())) return dateInput
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
