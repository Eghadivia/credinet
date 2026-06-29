import {
  BarChart3,
  Bell,
  Cable,
  LayoutDashboard,
  Plug,
  Radio,
  Receipt,
  RefreshCw,
  Settings,
  Ticket,
  Users,
  Zap,
} from 'lucide-react'

import type { AdminNavItem, AdminPermission } from '@/types/admin'

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    permission: 'users',
  },
  {
    label: 'Transaction Management',
    href: '/admin/transactions',
    icon: Receipt,
    permission: 'transactions',
  },
  {
    label: 'Refund Management',
    href: '/admin/refunds',
    icon: RefreshCw,
    permission: 'refunds',
  },
  {
    label: 'Airtime Services',
    href: '/admin/airtime',
    icon: Radio,
    permission: 'airtime',
  },
  {
    label: 'Data Bundle Services',
    href: '/admin/databundle',
    icon: Zap,
    permission: 'databundle',
  },
  {
    label: 'Electricity Services',
    href: '/admin/electricity',
    icon: Zap,
    permission: 'electricity',
  },
  {
    label: 'Cable TV Services',
    href: '/admin/cable',
    icon: Cable,
    permission: 'cable',
  },
  {
    label: 'Provider Settings',
    href: '/admin/settings/provider',
    icon: Plug,
    permission: 'provider_settings',
  },
  {
    label: 'All Services',
    href: '/admin/services',
    icon: Radio,
    permission: 'services',
    hiddenInNav: true,
  },
  {
    label: 'Support Tickets',
    href: '/admin/support/tickets',
    icon: Ticket,
    permission: 'support',
    hiddenInNav: true,
  },
  {
    label: 'Reports & Analytics',
    href: '/admin/reports',
    icon: BarChart3,
    permission: 'reports',
    hiddenInNav: true,
    children: [
      { label: 'Overview', href: '/admin/reports', icon: BarChart3, permission: 'reports' },
      {
        label: 'Revenue reports',
        href: '/admin/reports/revenue',
        icon: BarChart3,
        permission: 'revenue',
      },
      {
        label: 'Transaction reports',
        href: '/admin/reports/transactions',
        icon: Receipt,
        permission: 'reports',
      },
      {
        label: 'Service reports',
        href: '/admin/reports/services',
        icon: BarChart3,
        permission: 'reports',
      },
    ],
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    permission: 'notifications',
    hiddenInNav: true,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'settings',
    hiddenInNav: true,
    children: [
      { label: 'Overview', href: '/admin/settings', icon: Settings, permission: 'settings' },
      { label: 'General', href: '/admin/settings/general', icon: Settings, permission: 'settings' },
      { label: 'Utility provider', href: '/admin/settings/provider', icon: Settings, permission: 'settings' },
      { label: 'API configuration', href: '/admin/settings/api', icon: Settings, permission: 'settings' },
      { label: 'Admin & roles', href: '/admin/settings/admins', icon: Users, permission: 'admins' },
    ],
  },
]

/** Map first path segment (after /admin) to coarse permission for guards */
export const ADMIN_PATH_PERMISSIONS: Record<string, AdminPermission> = {
  '': 'dashboard',
  transactions: 'transactions',
  refunds: 'refunds',
  services: 'services',
  users: 'users',
  support: 'support',
  airtime: 'airtime',
  databundle: 'databundle',
  electricity: 'electricity',
  cable: 'cable',
  reports: 'reports',
  revenue: 'revenue',
  profile: 'dashboard',
  notifications: 'notifications',
  settings: 'settings',
  login: 'dashboard',
  'forgot-password': 'dashboard',
  'reset-password': 'dashboard',
}

export function getRequiredAdminPermission(pathname: string): AdminPermission {
  const clean = pathname.replace(/\/$/, '') || '/admin'
  if (clean === '/admin') return 'dashboard'
  const segments = clean.split('/').filter(Boolean)
  if (segments[0] !== 'admin') return 'dashboard'
  const first = segments[1] ?? ''
  const second = segments[2]

  if (first === 'reports') {
    if (second === 'revenue') return 'revenue'
    return 'reports'
  }

  if (first === 'settings') {
    if (second === 'admins') return 'admins'
    if (second === 'provider') return 'provider_settings'
    return 'settings'
  }

  if (first === 'provider-settings') return 'provider_settings'

  return ADMIN_PATH_PERMISSIONS[first] ?? 'dashboard'
}
