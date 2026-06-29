import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AdminApiService } from '@/services/admin.api'
import type {
  AdminPricingListQuery,
  AdminRefundListQuery,
  AdminSupportTicketListQuery,
  AdminTransactionListQuery,
  ApiTicketStatus,
  ApiTxStatus,
  UpdatePricingMarkupBody,
  ApiUtilityProvider,
} from '@/types/admin-api'

export const adminQueryKeys = {
  root: ['admin'] as const,
  me: () => [...adminQueryKeys.root, 'me'] as const,
  dashboard: () => [...adminQueryKeys.root, 'dashboard'] as const,
  search: (q: string) => [...adminQueryKeys.root, 'search', q] as const,
  notifications: () => [...adminQueryKeys.root, 'notifications'] as const,
  monthlyRevenue: (year: number) => [...adminQueryKeys.root, 'analytics', 'monthly-revenue', year] as const,
  monthlyVolume: (year: number) => [...adminQueryKeys.root, 'analytics', 'tx-volume', year] as const,
  transactions: (q: AdminTransactionListQuery) => [...adminQueryKeys.root, 'transactions', q] as const,
  transaction: (id: string) => [...adminQueryKeys.root, 'transaction', id] as const,
  refunds: (q: AdminRefundListQuery) => [...adminQueryKeys.root, 'refunds', q] as const,
  tickets: (q: AdminSupportTicketListQuery) => [...adminQueryKeys.root, 'tickets', q] as const,
  services: () => [...adminQueryKeys.root, 'services'] as const,
  pricing: (q: AdminPricingListQuery) => [...adminQueryKeys.root, 'pricing', q] as const,
  staff: () => [...adminQueryKeys.root, 'staff'] as const,
  providerSettings: () => [...adminQueryKeys.root, 'provider-settings'] as const,
}

export function useAdminMe(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.me(),
    queryFn: () => AdminApiService.getMe(),
    enabled,
    staleTime: 60_000,
  })
}

export function useAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.dashboard(),
    queryFn: () => AdminApiService.getDashboard(),
    enabled,
    staleTime: 30_000,
  })
}

export function useAdminGlobalSearch(q: string, enabled: boolean) {
  return useQuery({
    queryKey: adminQueryKeys.search(q),
    queryFn: () => AdminApiService.globalSearch(q),
    enabled: enabled && q.trim().length >= 2,
    staleTime: 15_000,
  })
}

export function useAdminNotifications(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.notifications(),
    queryFn: () => AdminApiService.getNotifications(),
    enabled,
    staleTime: 30_000,
  })
}

export function useAdminMonthlyRevenue(year: number, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.monthlyRevenue(year),
    queryFn: () => AdminApiService.getMonthlyRevenueAnalytics(year),
    enabled,
    staleTime: 60_000,
  })
}

export function useAdminMonthlyVolume(year: number, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.monthlyVolume(year),
    queryFn: () => AdminApiService.getMonthlyTransactionVolume(year),
    enabled,
    staleTime: 60_000,
  })
}

export function useAdminTransactions(query: AdminTransactionListQuery, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.transactions(query),
    queryFn: () => AdminApiService.listTransactions(query),
    enabled,
    placeholderData: (prev) => prev,
  })
}

export function useAdminTransaction(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.transaction(id ?? ''),
    queryFn: () => AdminApiService.getTransactionById(id!),
    enabled: Boolean(enabled && id),
  })
}

export function useUpdateTransactionStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiTxStatus }) =>
      AdminApiService.updateTransactionStatus(id, status),
    onSuccess: () => {
      toast.success('Transaction status updated')
      qc.invalidateQueries({ queryKey: adminQueryKeys.root })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: (filters: Omit<AdminTransactionListQuery, 'page' | 'limit'>) =>
      AdminApiService.exportTransactionsCsv(filters),
    onSuccess: () => toast.success('Export started'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useAdminRefunds(query: AdminRefundListQuery, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.refunds(query),
    queryFn: () => AdminApiService.listRefunds(query),
    enabled,
    placeholderData: (prev) => prev,
  })
}

export function useAdminSupportTickets(query: AdminSupportTicketListQuery, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.tickets(query),
    queryFn: () => AdminApiService.listSupportTickets(query),
    enabled,
    placeholderData: (prev) => prev,
  })
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiTicketStatus }) =>
      AdminApiService.updateTicketStatus(id, status),
    onSuccess: () => {
      toast.success('Ticket updated')
      qc.invalidateQueries({ queryKey: adminQueryKeys.root })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useAdminServices(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.services(),
    queryFn: () => AdminApiService.listServiceConfigs(),
    enabled,
    staleTime: 30_000,
  })
}

export function useUpdateServiceConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceType, body }: { serviceType: string; body: Record<string, unknown> }) =>
      AdminApiService.updateServiceConfig(serviceType, body),
    onSuccess: () => {
      toast.success('Service configuration saved')
      qc.invalidateQueries({ queryKey: adminQueryKeys.services() })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useAdminPricing(query: AdminPricingListQuery, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.pricing(query),
    queryFn: () => AdminApiService.listPricing(query),
    enabled,
    staleTime: 30_000,
  })
}

export function useUpdatePricingMarkup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePricingMarkupBody) => AdminApiService.updatePricingMarkup(body),
    onSuccess: () => {
      toast.success('Markup updated')
      qc.invalidateQueries({ queryKey: [...adminQueryKeys.root, 'pricing'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useAdminProviderSettings(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.providerSettings(),
    queryFn: () => AdminApiService.getProviderSettings(),
    enabled,
    staleTime: 30_000,
  })
}

export function useUpdateProviderSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (provider: ApiUtilityProvider) =>
      AdminApiService.updateProviderSettings(provider),
    onSuccess: () => {
      toast.success('Utility provider updated')
      qc.invalidateQueries({ queryKey: adminQueryKeys.providerSettings() })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useAdminStaff(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.staff(),
    queryFn: () => AdminApiService.listStaff(),
    enabled,
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => AdminApiService.createStaff(body),
    onSuccess: () => {
      toast.success('Staff created')
      qc.invalidateQueries({ queryKey: adminQueryKeys.staff() })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ staffUserId, role }: { staffUserId: string; role: string }) =>
      AdminApiService.updateStaffRole(staffUserId, role),
    onSuccess: () => {
      toast.success('Role updated')
      qc.invalidateQueries({ queryKey: adminQueryKeys.staff() })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
