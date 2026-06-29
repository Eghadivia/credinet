'use client'

import {
  AdminApiSettingsView,
  AdminAuthPortalView,
  AdminGeneralSettingsView,
  AdminProviderSettingsView,
  AdminServiceReportsView,
  AdminStaffRolesView,
  AdminTransactionReportsView,
  RefundDetailView,
  ReportsHubView,
  SettingsHubView,
} from '@/features/admin/views/admin-extended-views'
import { AdminNotificationsView, AdminProfileView } from '@/features/admin/views/core-views'
import { RefundManagementView } from '@/features/admin/views/refund-management-view'
import { RevenueAnalyticsView } from '@/features/admin/views/revenue-analytics-view'
import { ServiceManagementView } from '@/features/admin/views/service-management-view'
import { SupportTicketDetailView, SupportTicketsView } from '@/features/admin/views/support-views'
import { TransactionDetailPageView } from '@/features/admin/views/transaction-detail-page-view'
import { TransactionsWorkspaceView } from '@/features/admin/views/transactions-workspace-view'
import { UserDetailPageView } from '@/features/admin/views/user-detail-page-view'
import { UsersWorkspaceView } from '@/features/admin/views/users-workspace-view'
import { VtuDashboardView } from '@/features/admin/views/vtu-dashboard-view'
import type { TxStatus } from '@/types/admin'

const RESERVED_TX = new Set(['successful', 'pending', 'failed', 'refunds'])
const RESERVED_USERS = new Set(['suspended', 'restricted'])

function transactionModeFromSegment(segment: string | undefined): 'all' | TxStatus {
  switch (segment) {
    case 'successful':
      return 'Successful'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    case 'refunds':
      return 'Refunded'
    default:
      return 'all'
  }
}

function userModeFromSegment(segment: string | undefined): 'all' | 'suspended' | 'restricted' {
  if (segment === 'suspended') return 'suspended'
  if (segment === 'restricted') return 'restricted'
  return 'all'
}

export function AdminPageRenderer({ slug }: { slug?: string[] }) {
  const segments = slug ?? []
  const key = segments.join('/')

  if (key === '' || key === 'dashboard') {
    return <VtuDashboardView />
  }

  const first = segments[0] ?? ''
  const second = segments[1]
  const third = segments[2]

  if (first === 'login') return <AdminAuthPortalView variant="login" />
  if (first === 'forgot-password') return <AdminAuthPortalView variant="forgot" />
  if (first === 'reset-password') return <AdminAuthPortalView variant="reset" />

  if (first === 'reports') {
    if (segments.length === 1) return <ReportsHubView />
    if (second === 'revenue') return <RevenueAnalyticsView />
    if (second === 'transactions') return <AdminTransactionReportsView />
    if (second === 'services') return <AdminServiceReportsView />
    return <ReportsHubView />
  }

  if (first === 'provider-settings') return <AdminProviderSettingsView />

  if (first === 'settings') {
    if (segments.length === 1) return <SettingsHubView />
    if (second === 'general') return <AdminGeneralSettingsView />
    if (second === 'provider') return <AdminProviderSettingsView />
    if (second === 'api') return <AdminApiSettingsView />
    if (second === 'admins') return <AdminStaffRolesView />
    return <SettingsHubView />
  }

  if (first === 'services') return <ServiceManagementView module="all" />
  if (first === 'refunds') {
    if (segments.length === 2 && second) {
      return <RefundDetailView id={second} />
    }
    return <RefundManagementView />
  }
  if (first === 'revenue') return <RevenueAnalyticsView />
  if (first === 'profile') return <AdminProfileView />
  if (first === 'notifications') return <AdminNotificationsView />

  if (first === 'airtime') return <ServiceManagementView module="airtime" />
  if (first === 'databundle') return <ServiceManagementView module="databundle" />
  if (first === 'electricity') return <ServiceManagementView module="electricity" />
  if (first === 'cable') return <ServiceManagementView module="cable" />

  if (first === 'transactions') {
    if (segments.length === 2 && second && !RESERVED_TX.has(second)) {
      return <TransactionDetailPageView id={second} />
    }
    return <TransactionsWorkspaceView mode={transactionModeFromSegment(second)} />
  }

  if (first === 'users') {
    if (segments.length === 2 && second && !RESERVED_USERS.has(second)) {
      return <UserDetailPageView id={second} />
    }
    return <UsersWorkspaceView mode={userModeFromSegment(second)} />
  }

  if (first === 'support') {
    if ((second === 'tickets' && segments.length === 2) || segments.length === 1) {
      return <SupportTicketsView />
    }
    if (second === 'tickets' && third) {
      return <SupportTicketDetailView id={third} />
    }
  }

  return <VtuDashboardView />
}
