import type { AxiosRequestConfig } from 'axios'

import authApi from '@/lib/api/instance/authApi'
import requestData from '@/lib/api/request-data'
import { normalizePricingList } from '@/lib/admin/map-api-pricing'
import { normalizeMonthlyRevenueChart } from '@/lib/admin/monthly-chart-data'
import { normalizeMonthlyTransactionVolume } from '@/lib/admin/monthly-tx-volume-data'
import type { ApiResponse } from '@/types/auth.type'
import type {
  AdminListMeta,
  AdminRefundListQuery,
  AdminSupportTicketListQuery,
  AdminSupportTicketListResult,
  AdminTransactionListQuery,
  AdminTransactionListResult,
  AdminUserListQuery,
  AdminUserListResult,
  AdminUserStatsNormalized,
  ApiAdminNotification,
  ApiAdminProfile,
  ApiAdminTransaction,
  ApiAdminUser,
  ApiAdminUserListPayload,
  AdminPricingListQuery,
  ApiPricingEntry,
  ApiServiceConfig,
  ApiServiceType,
  ApiSupportTicket,
  UpdatePricingMarkupBody,
  ApiTicketStatus,
  ApiTxStatus,
  ApiUserRole,
  ApiUserStatus,
  ApiUtilityProvider,
  ApiProviderSettings,
  MonthlySalesDatum,
} from '@/types/admin-api'
import type { MonthlyTxVolumeDatum } from '@/lib/admin/monthly-tx-volume-data'

type SilentConfig = AxiosRequestConfig & { silent?: boolean }

function pickNumber(obj: Record<string, unknown> | null | undefined, keys: string[]): number {
  if (!obj || typeof obj !== 'object') return 0
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  }
  return 0
}

function normalizeStatsPayload(raw: unknown): AdminUserStatsNormalized {
  const r = raw as Record<string, unknown> | null | undefined
  const o =
    r && typeof r === 'object' && 'data' in r && r.data && typeof r.data === 'object' && !Array.isArray(r.data)
      ? (r.data as Record<string, unknown>)
      : (r ?? {})

  return {
    totalUsers: pickNumber(o, ['totalUsers', 'total', 'allUsers', 'count', 'TotalUsers']),
    newUsers7d: pickNumber(o, ['newUsers7d', 'newUsersLast7Days', 'last7Days', 'new7d', 'newUsers7d']),
    restrictedUsers: pickNumber(o, ['restrictedUsers', 'restricted', 'restrictedCount', 'RestrictedUsers']),
    suspendedUsers: pickNumber(o, ['suspendedUsers', 'suspended', 'suspendedCount', 'SuspendedUsers']),
    activeUsers: pickNumber(o, ['activeUsers', 'active', 'activeCount', 'ActiveUsers']),
  }
}

function normalizeListPayload(raw: unknown): AdminUserListResult {
  const r = raw as ApiAdminUserListPayload | ApiAdminUser[] | null | undefined
  if (Array.isArray(r)) {
    return {
      users: r,
      meta: { total: r.length, page: 1, limit: r.length },
    }
  }

  const root = (r as ApiAdminUserListPayload) ?? {}
  const inner = (root.data as ApiAdminUserListPayload | undefined) ?? root

  const users =
    inner.users ??
    inner.items ??
    (Array.isArray(inner.data) ? inner.data : undefined) ??
    []

  const meta =
    inner.meta ??
    (inner.total !== undefined
      ? {
          total: inner.total ?? users.length,
          page: inner.page ?? 1,
          limit: inner.limit ?? users.length,
        }
      : {
          total: users.length,
          page: 1,
          limit: users.length,
        })

  return {
    users,
    meta: {
      total: meta.total ?? users.length,
      page: meta.page ?? 1,
      limit: meta.limit ?? users.length,
      totalPages: meta.totalPages,
    },
  }
}

function normalizeMeta(inner: Record<string, unknown>, fallbackLen: number): AdminListMeta {
  const meta = inner.meta as AdminListMeta | undefined
  if (meta && typeof meta.total === 'number') {
    return {
      total: meta.total,
      page: meta.page ?? 1,
      limit: meta.limit ?? fallbackLen,
      totalPages: meta.totalPages,
    }
  }
  const total = typeof inner.total === 'number' ? inner.total : fallbackLen
  return {
    total,
    page: typeof inner.page === 'number' ? inner.page : 1,
    limit: typeof inner.limit === 'number' ? inner.limit : fallbackLen,
    totalPages: typeof inner.totalPages === 'number' ? inner.totalPages : undefined,
  }
}

function normalizeTransactionList(raw: unknown): AdminTransactionListResult {
  const r = raw as Record<string, unknown> | ApiAdminTransaction[] | null | undefined
  if (Array.isArray(r)) {
    return { transactions: r, meta: { total: r.length, page: 1, limit: r.length } }
  }
  const root = (r ?? {}) as Record<string, unknown>
  const inner = (root.data as Record<string, unknown> | undefined) ?? root
  const transactions =
    (Array.isArray(inner.transactions) ? inner.transactions : null) ??
    (Array.isArray(inner.items) ? inner.items : null) ??
    (Array.isArray(inner.data) ? inner.data : null) ??
    []
  const tx = transactions as ApiAdminTransaction[]
  return {
    transactions: tx,
    meta: normalizeMeta(inner, tx.length),
  }
}

function normalizeTicketList(raw: unknown): AdminSupportTicketListResult {
  const r = raw as Record<string, unknown> | ApiSupportTicket[] | null | undefined
  if (Array.isArray(r)) {
    return { tickets: r, meta: { total: r.length, page: 1, limit: r.length } }
  }
  const root = (r ?? {}) as Record<string, unknown>
  const inner = (root.data as Record<string, unknown> | undefined) ?? root
  const tickets =
    (Array.isArray(inner.tickets) ? inner.tickets : null) ??
    (Array.isArray(inner.items) ? inner.items : null) ??
    (Array.isArray(inner.data) ? inner.data : null) ??
    []
  const list = tickets as ApiSupportTicket[]
  return { tickets: list, meta: normalizeMeta(inner, list.length) }
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')) as Partial<T>
}

function throwIfFailed<T>(response: ApiResponse<T>, fallback: string) {
  if (response && response.success === false) {
    throw new Error(response.message || fallback)
  }
}

function unwrapData<T>(response: ApiResponse<T>): T {
  if (response.data !== undefined && response.data !== null) {
    return response.data as T
  }
  return response as unknown as T
}

export const AdminApiService = {
  async getMe(): Promise<ApiAdminProfile> {
    const response = await requestData<null, ApiAdminProfile>(authApi, 'get', '/admin/me', undefined, {
      silent: true,
    } as SilentConfig)
    throwIfFailed(response, 'Failed to load admin profile')
    return unwrapData(response) as ApiAdminProfile
  },

  async getDashboard(): Promise<unknown> {
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/dashboard')
    throwIfFailed(response, 'Failed to load dashboard')
    return unwrapData(response)
  },

  async globalSearch(q: string): Promise<unknown> {
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/search', undefined, {
      params: { q },
    })
    throwIfFailed(response, 'Search failed')
    return unwrapData(response)
  },

  async getNotifications(): Promise<ApiAdminNotification[]> {
    const response = await requestData<null, ApiAdminNotification[]>(authApi, 'get', '/admin/notifications')
    throwIfFailed(response, 'Failed to load notifications')
    const data = unwrapData(response) as unknown
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items)) {
      return (data as { items: ApiAdminNotification[] }).items
    }
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data)) {
      return (data as { data: ApiAdminNotification[] }).data
    }
    return []
  },

  async getMonthlyRevenueAnalytics(year: number): Promise<MonthlySalesDatum[]> {
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/analytics/monthly-revenue', undefined, {
      params: { year },
    })
    throwIfFailed(response, 'Failed to load revenue analytics')
    const payload = unwrapData(response)
    return normalizeMonthlyRevenueChart(payload)
  },

  async getMonthlyTransactionVolume(year: number): Promise<MonthlyTxVolumeDatum[]> {
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/analytics/transaction-volume', undefined, {
      params: { year },
    })
    throwIfFailed(response, 'Failed to load transaction volume')
    return normalizeMonthlyTransactionVolume(unwrapData(response))
  },

  async exportTransactionsCsv(filters: Omit<AdminTransactionListQuery, 'page' | 'limit'>): Promise<void> {
    const params = stripUndefined(filters as Record<string, unknown>)
    const res = await authApi.get('/admin/transactions/export', {
      params,
      responseType: 'blob',
      silent: true,
    } as SilentConfig)

    const blob = res.data as Blob
    const cd = res.headers['content-disposition'] as string | undefined
    let filename = 'transactions-export.csv'
    if (cd) {
      const m = /filename\*?=(?:UTF-8'')?["']?([^;"']+)/i.exec(cd)
      if (m?.[1]) filename = decodeURIComponent(m[1].trim())
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  async listTransactions(query: AdminTransactionListQuery): Promise<AdminTransactionListResult> {
    const params = stripUndefined({
      status: query.status,
      paymentStatus: query.paymentStatus,
      type: query.type,
      search: query.search,
      page: query.page,
      limit: query.limit,
      from: query.from,
      to: query.to,
    } as Record<string, unknown>)

    const response = await requestData<null, unknown>(authApi, 'get', '/admin/transactions', undefined, { params })
    throwIfFailed(response, 'Failed to load transactions')
    const payload = unwrapData(response)
    return normalizeTransactionList(payload)
  },

  async getTransactionById(id: string): Promise<ApiAdminTransaction> {
    const response = await requestData<null, ApiAdminTransaction>(
      authApi,
      'get',
      `/admin/transactions/${encodeURIComponent(id)}`,
    )
    throwIfFailed(response, 'Failed to load transaction')
    const payload = unwrapData(response) as unknown
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const inner = (payload as { data: unknown }).data
      if (inner && typeof inner === 'object') return inner as ApiAdminTransaction
    }
    return payload as ApiAdminTransaction
  },

  async updateTransactionStatus(id: string, status: ApiTxStatus): Promise<void> {
    const response = await requestData<{ status: ApiTxStatus }, unknown>(
      authApi,
      'patch',
      `/admin/transactions/${encodeURIComponent(id)}/status`,
      { status },
    )
    throwIfFailed(response, 'Failed to update transaction status')
  },

  async listRefunds(query: AdminRefundListQuery): Promise<AdminTransactionListResult> {
    const params = stripUndefined({
      status: query.status,
      page: query.page,
      limit: query.limit,
    } as Record<string, unknown>)
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/refunds', undefined, { params })
    throwIfFailed(response, 'Failed to load refunds')
    return normalizeTransactionList(unwrapData(response))
  },

  async listSupportTickets(query: AdminSupportTicketListQuery): Promise<AdminSupportTicketListResult> {
    const params = stripUndefined({
      status: query.status,
      page: query.page,
      limit: query.limit,
    } as Record<string, unknown>)
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/support/tickets', undefined, { params })
    throwIfFailed(response, 'Failed to load tickets')
    return normalizeTicketList(unwrapData(response))
  },

  async createSupportTicket(body: Record<string, unknown>): Promise<unknown> {
    const response = await requestData<Record<string, unknown>, unknown>(authApi, 'post', '/admin/support/tickets', body)
    throwIfFailed(response, 'Failed to create ticket')
    return unwrapData(response)
  },

  async updateTicketStatus(id: string, status: ApiTicketStatus): Promise<void> {
    const response = await requestData<{ status: ApiTicketStatus }, unknown>(
      authApi,
      'patch',
      `/admin/support/tickets/${encodeURIComponent(id)}`,
      { status },
    )
    throwIfFailed(response, 'Failed to update ticket')
  },

  async listServiceConfigs(): Promise<ApiServiceConfig[]> {
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/services')
    throwIfFailed(response, 'Failed to load services')
    const data = unwrapData(response) as unknown
    if (Array.isArray(data)) return data as ApiServiceConfig[]
    if (data && typeof data === 'object' && Array.isArray((data as { services: unknown }).services)) {
      return (data as { services: ApiServiceConfig[] }).services
    }
    if (data && typeof data === 'object' && Array.isArray((data as { data: unknown }).data)) {
      return (data as { data: ApiServiceConfig[] }).data
    }
    return []
  },

  async updateServiceConfig(serviceType: string, body: Record<string, unknown>): Promise<void> {
    const response = await requestData<Record<string, unknown>, unknown>(
      authApi,
      'patch',
      `/admin/services/${encodeURIComponent(serviceType)}`,
      body,
    )
    throwIfFailed(response, 'Failed to update service')
  },

  async listPricing(query: AdminPricingListQuery = {}): Promise<ApiPricingEntry[]> {
    const params = stripUndefined({
      serviceType: query.serviceType,
      provider: query.provider,
    } as Record<string, unknown>)
    const response = await requestData<null, unknown>(authApi, 'get', '/admin/pricing', undefined, {
      params,
    })
    throwIfFailed(response, 'Failed to load pricing')
    return normalizePricingList(unwrapData(response))
  },

  async updatePricingMarkup(body: UpdatePricingMarkupBody): Promise<unknown> {
    const response = await requestData<UpdatePricingMarkupBody, unknown>(
      authApi,
      'patch',
      '/admin/pricing/markup',
      body,
    )
    throwIfFailed(response, 'Failed to update markup')
    return unwrapData(response)
  },

  async listStaff(): Promise<unknown[]> {
    const response = await requestData<null, unknown[]>(authApi, 'get', '/admin/staff')
    throwIfFailed(response, 'Failed to load staff')
    const data = unwrapData(response) as unknown
    return Array.isArray(data) ? data : []
  },

  async createStaff(body: Record<string, unknown>): Promise<unknown> {
    const response = await requestData<Record<string, unknown>, unknown>(authApi, 'post', '/admin/staff', body)
    throwIfFailed(response, 'Failed to create staff')
    return unwrapData(response)
  },

  async updateStaffRole(staffUserId: string, role: ApiUserRole): Promise<void> {
    const response = await requestData<{ role: ApiUserRole }, unknown>(
      authApi,
      'patch',
      `/admin/staff/${encodeURIComponent(staffUserId)}/role`,
      { role },
    )
    throwIfFailed(response, 'Failed to update staff role')
  },

  async getUserStats(): Promise<AdminUserStatsNormalized> {
    const response = await requestData<null, AdminUserStatsNormalized>(authApi, 'get', '/admin/users/stats')
    if (response.success === false) {
      throw new Error(response.message || 'Failed to load user stats')
    }
    const payload =
      response.data !== undefined && response.data !== null
        ? response.data
        : (response as unknown as Record<string, unknown>)
    return normalizeStatsPayload(payload as unknown)
  },

  async listUsers(query: AdminUserListQuery): Promise<AdminUserListResult> {
    const params = stripUndefined({
      status: query.status,
      search: query.search,
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
      role: query.role,
    } as Record<string, unknown>)

    const response = await requestData<null, ApiAdminUserListPayload>(authApi, 'get', '/admin/users', undefined, {
      params,
    })

    if (response.success === false) {
      throw new Error(response.message || 'Failed to load users')
    }

    const payload =
      response.data !== undefined && response.data !== null ? response.data : (response as unknown)
    return normalizeListPayload(payload)
  },

  async getProviderSettings(): Promise<ApiProviderSettings> {
    const response = await requestData<null, ApiProviderSettings>(
      authApi,
      'get',
      '/admin/provider-settings',
    )
    throwIfFailed(response, 'Failed to load provider settings')
    return unwrapData(response) as ApiProviderSettings
  },

  async updateProviderSettings(provider: ApiUtilityProvider): Promise<ApiProviderSettings> {
    const response = await requestData<{ provider: ApiUtilityProvider }, ApiProviderSettings>(
      authApi,
      'patch',
      '/admin/provider-settings',
      { provider },
    )
    throwIfFailed(response, 'Failed to update provider settings')
    return unwrapData(response) as ApiProviderSettings
  },

  async updateUserStatus(userId: string, status: ApiUserStatus): Promise<void> {
    const response = await requestData<{ status: ApiUserStatus }, unknown>(
      authApi,
      'patch',
      `/admin/users/${encodeURIComponent(userId)}/status`,
      { status },
    )
    if (response.success === false) {
      throw new Error(response.message || 'Failed to update user status')
    }
  },
}
