import type { AdminNavItem, AdminPermission, AdminRoleId } from '@/types/admin'

const ROLE_PERMISSIONS: Record<AdminRoleId, AdminPermission[]> = {
  super_admin: [
    'dashboard',
    'transactions',
    'refunds',
    'services',
    'users',
    'airtime',
    'databundle',
    'electricity',
    'cable',
    'revenue',
    'reports',
    'finance',
    'support',
    'monitoring',
    'admins',
    'settings',
    'provider_settings',
    'notifications',
    'profile',
  ],
  admin: [
    'dashboard',
    'transactions',
    'refunds',
    'services',
    'users',
    'airtime',
    'databundle',
    'electricity',
    'cable',
    'reports',
    'support',
    'provider_settings',
    'notifications',
    'profile',
  ],
  finance_manager: [],
  support_agent: [],
  operations_manager: [],
}

const ROLE_LABELS: Record<AdminRoleId, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  finance_manager: 'Finance Manager',
  support_agent: 'Support Agent',
  operations_manager: 'Operations Manager',
}

export function getRoleLabel(role: AdminRoleId): string {
  return ROLE_LABELS[role]
}

export function roleHasPermission(
  role: AdminRoleId,
  permission: AdminPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function filterNavByRole(
  items: AdminNavItem[],
  role: AdminRoleId,
): AdminNavItem[] {
  return items
    .map((item) => {
      if (item.hiddenInNav) return null

      const children = item.children
        ? filterNavByRole(item.children, role)
        : undefined

      const selfAllowed = roleHasPermission(role, item.permission)
      const hasChildren = Boolean(children?.length)

      if (!selfAllowed && !hasChildren) return null
      return { ...item, children }
    })
    .filter(Boolean) as AdminNavItem[]
}
