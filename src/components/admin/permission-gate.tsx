'use client'

import type { ReactNode } from 'react'

import type { AdminPermission } from '@/types/admin'
import { useAdminRbac } from '@/context/admin-rbac-provider'

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: AdminPermission
  children: ReactNode
  fallback?: ReactNode
}) {
  const { can } = useAdminRbac()
  if (!can(permission)) return <>{fallback}</>
  return <>{children}</>
}
