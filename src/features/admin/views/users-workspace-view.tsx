'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { AdminStatCard } from '@/components/admin/cards/admin-stat-card'
import { AdminUsersTable } from '@/components/tables/admin-users-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminRbac } from '@/context/admin-rbac-provider'
import { mapApiUserToRow, tabModeToApiStatus } from '@/lib/admin/map-admin-user'
import { useAdminUserStats, useAdminUsers, useUpdateUserStatus } from '@/queries/admin-users'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const TABS: { label: string; href: string; value: 'all' | 'suspended' | 'restricted' }[] = [
  { label: 'All users', href: '/admin/users', value: 'all' },
  { label: 'Suspended', href: '/admin/users/suspended', value: 'suspended' },
  { label: 'Restricted', href: '/admin/users/restricted', value: 'restricted' },
]

export function UsersWorkspaceView({
  mode,
}: {
  mode: 'all' | 'suspended' | 'restricted'
}) {
  const pathname = usePathname()
  const { can, role } = useAdminRbac()
  const canSeeUsers = can('users')
  const canManageStatus = role === 'super_admin' || role === 'admin'

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState<'createdAt' | 'updatedAt'>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [mode, debouncedSearch])

  const listQuery = useMemo(
    () => ({
      status: tabModeToApiStatus(mode),
      search: debouncedSearch.trim() || undefined,
      page,
      limit: PAGE_SIZE,
      sort,
      order,
    }),
    [mode, debouncedSearch, page, sort, order],
  )

  const statsQuery = useAdminUserStats(canSeeUsers)
  const usersQuery = useAdminUsers(listQuery, canSeeUsers)
  const updateStatus = useUpdateUserStatus()

  const title =
    mode === 'all'
      ? 'User management'
      : mode === 'suspended'
        ? 'Suspended users'
        : 'Restricted users'

  const rows = useMemo(() => {
    const mapped = (usersQuery.data?.users ?? []).map(mapApiUserToRow)
    if (mode === 'all') return mapped
    const want = mode === 'suspended' ? ('Suspended' as const) : ('Restricted' as const)
    return mapped.filter((r) => r.status === want)
  }, [usersQuery.data?.users, mode])

  const total = usersQuery.data?.meta.total ?? 0

  const stats = statsQuery.data

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={title}
       
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          ...(mode === 'all' ? [] : [{ label: title }]),
        ]}
      />

      {/* <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          title="Total users"
          value={statsQuery.isLoading ? '…' : (stats?.totalUsers ?? 0).toLocaleString()}
          hint="all registrations"
          icon={Users}
        />
        <AdminStatCard
          title="New (7d)"
          value={statsQuery.isLoading ? '…' : (stats?.newUsers7d ?? 0).toLocaleString()}
          hint="recent sign-ups"
          icon={Users}
        />
        <AdminStatCard
          title="Restricted users"
          value={statsQuery.isLoading ? '…' : (stats?.restrictedUsers ?? 0).toLocaleString()}
          hint="needs review"
          icon={Users}
        />
      </div> */}

      {statsQuery.isError ? (
        <p className="text-sm text-rose-600">
          Could not load user stats. Check your session and API configuration.
        </p>
      ) : null}

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-zinc-900">User list</CardTitle>
              {/* <CardDescription className="text-zinc-600">Search, filter, sort, and open user profiles</CardDescription> */}
            </div>
            <div className="flex w-full flex-wrap gap-2 rounded-2xl bg-zinc-100 p-1 lg:w-auto">
              {TABS.map((t) => {
                const active = pathname === t.href
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900',
                      active && 'bg-white text-zinc-900 shadow-sm',
                    )}
                  >
                    {t.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!canSeeUsers ? (
            <p className="text-sm text-zinc-600">You do not have access to the user directory.</p>
          ) : usersQuery.isError ? (
            <p className="text-sm text-rose-600">
              Could not load users. Verify `GET /admin/users` and your admin role.
            </p>
          ) : (
            <AdminUsersTable
              rows={rows}
              isLoading={usersQuery.isLoading}
              search={searchInput}
              onSearchChange={setSearchInput}
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
              sort={sort}
              order={order}
              onSortChange={(s, o) => {
                setSort(s)
                setOrder(o)
              }}
              canManageStatus={canManageStatus}
              statusBusyId={updateStatus.isPending ? updateStatus.variables?.userId ?? null : null}
              onStatusChange={(userId, status) => {
                updateStatus.mutate({ userId, status })
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
