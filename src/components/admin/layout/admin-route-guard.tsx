'use client'

import { usePathname } from 'next/navigation'

import { useAdminRbac } from '@/context/admin-rbac-provider'

import { AdminForbidden } from '@/components/admin/layout/admin-forbidden'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { allowedForPath } = useAdminRbac()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!allowedForPath(pathname)) {
    return <AdminForbidden />
  }

  return <>{children}</>
}
