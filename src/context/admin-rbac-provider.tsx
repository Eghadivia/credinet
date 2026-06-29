'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ADMIN_NAV, getRequiredAdminPermission } from '@/data/mock/admin-nav-config'
import { ADMIN_RBAC_STORAGE_KEY, normalizeAdminRbacRole } from '@/lib/auth/post-login-path'
import { filterNavByRole, getRoleLabel, roleHasPermission } from '@/lib/admin/rbac'
import { useAdminMe } from '@/queries/admin'
import type { AdminNavItem, AdminPermission, AdminRoleId } from '@/types/admin'

const ROLES: AdminRoleId[] = ['super_admin', 'admin']

type AdminRbacContextValue = {
  role: AdminRoleId
  setRole: (role: AdminRoleId) => void
  roleLabel: string
  availableRoles: AdminRoleId[]
  navItems: AdminNavItem[]
  can: (permission: AdminPermission) => boolean
  allowedForPath: (pathname: string) => boolean
}

const AdminRbacContext = createContext<AdminRbacContextValue | null>(null)

export function AdminRbacProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AdminRoleId>('super_admin')
  const meQuery = useAdminMe(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(ADMIN_RBAC_STORAGE_KEY) as AdminRoleId | null
    if (saved && ROLES.includes(saved)) {
      setRoleState(saved)
    }
  }, [])

  /** Prefer backend role from `/admin/me` so JWT / real logins match permissions and sidebar. */
  useEffect(() => {
    const raw = meQuery.data?.role
    if (!raw) return
    const mapped = normalizeAdminRbacRole(String(raw))
    if (!mapped) return
    setRoleState(mapped)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_RBAC_STORAGE_KEY, mapped)
    }
  }, [meQuery.data?.role])

  const setRole = useCallback((next: AdminRoleId) => {
    setRoleState(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_RBAC_STORAGE_KEY, next)
    }
  }, [])

  const navItems = useMemo(() => filterNavByRole(ADMIN_NAV, role), [role])

  const can = useCallback(
    (permission: AdminPermission) => roleHasPermission(role, permission),
    [role],
  )

  const allowedForPath = useCallback(
    (path: string) => {
      const required = getRequiredAdminPermission(path)
      return roleHasPermission(role, required)
    },
    [role],
  )

  const value = useMemo(
    () => ({
      role,
      setRole,
      roleLabel: getRoleLabel(role),
      availableRoles: ROLES,
      navItems,
      can,
      allowedForPath,
    }),
    [role, setRole, navItems, can, allowedForPath],
  )

  return <AdminRbacContext.Provider value={value}>{children}</AdminRbacContext.Provider>
}

export function useAdminRbac() {
  const ctx = useContext(AdminRbacContext)
  if (!ctx) {
    throw new Error('useAdminRbac must be used within AdminRbacProvider')
  }
  return ctx
}
