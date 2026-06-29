'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminRbac } from '@/context/admin-rbac-provider'
import { mapApiUserToRow, mapUiStatusToApi } from '@/lib/admin/map-admin-user'
import { mapApiTransactionToRow } from '@/lib/admin/map-transaction'
import { useAdminTransactions } from '@/queries/admin'
import { useAdminUsers, useUpdateUserStatus } from '@/queries/admin-users'
import { cn } from '@/lib/utils'
import type { AdminUserRow } from '@/types/admin'

const TX_PAGE_SIZE = 5

const STATUS_BADGE: Record<AdminUserRow['status'], string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
  Restricted: 'bg-amber-50 text-amber-800 border-amber-200',
}

export function UserDetailPageView({ id }: { id: string }) {
  const decoded = decodeURIComponent(id)
  const { can, role } = useAdminRbac()
  const canSeeUsers = can('users')
  const canManageStatus = role === 'super_admin' || role === 'admin'
  const [reason, setReason] = useState('')
  const [txPage, setTxPage] = useState(1)
  const qc = useQueryClient()

  // Prefer resolving from the already-fetched directory list (avoids relying on backend `search` by UUID).
  const cachedUser = useMemo(() => {
    const matches = qc.getQueriesData({ queryKey: ['admin', 'users', 'list'] })
    for (const [, data] of matches) {
      const d = data as any
      const users = d?.users ?? d?.data?.users ?? d?.data ?? []
      if (!Array.isArray(users)) continue
      const rows = users.map(mapApiUserToRow)
      const found = rows.find((r: any) => r.id === decoded)
      if (found) return found as AdminUserRow
    }
    return null
  }, [qc, decoded])

  const listQuery = useMemo(
    () => ({
      search: decoded,
      limit: 25,
      page: 1,
      sort: 'createdAt' as const,
      order: 'desc' as const,
    }),
    [decoded],
  )

  const usersQuery = useAdminUsers(listQuery, canSeeUsers && !cachedUser)
  const updateStatus = useUpdateUserStatus()

  const user = useMemo(() => {
    if (cachedUser) return cachedUser
    const rows = (usersQuery.data?.users ?? []).map(mapApiUserToRow)
    return rows.find((r) => r.id === decoded) ?? null
  }, [usersQuery.data?.users, decoded, cachedUser])

  useEffect(() => {
    setTxPage(1)
  }, [user?.id])

  const txListQuery = useMemo(
    () => ({
      search: user?.email || user?.id || undefined,
      page: txPage,
      limit: TX_PAGE_SIZE,
    }),
    [user?.email, user?.id, txPage],
  )

  const txQuery = useAdminTransactions(txListQuery, Boolean(canSeeUsers && user))

  const userTransactions = useMemo(() => {
    return (txQuery.data?.transactions ?? []).map(mapApiTransactionToRow)
  }, [txQuery.data?.transactions])

  const txTotal = txQuery.data?.meta.total ?? 0
  const txTotalPages = Math.max(1, Math.ceil(txTotal / TX_PAGE_SIZE))

  if (!canSeeUsers) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title="User"
          description="You do not have access to this profile."
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Users', href: '/admin/users' },
          ]}
        />
      </div>
    )
  }

  if (!cachedUser && usersQuery.isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[420px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>
      </div>
    )
  }

  if ((!cachedUser && usersQuery.isError) || !user) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title="User not found"
          description={
            !cachedUser && usersQuery.isError
              ? 'The user directory request failed. Check the API and your permissions.'
              : `No user matches “${decoded}”. They may have been removed or the ID is invalid.`
          }
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Users', href: '/admin/users' },
          ]}
        />
      </div>
    )
  }

  const busy = updateStatus.isPending

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={user.fullName}
        description={`User account review for ${user.id}.`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: user.fullName },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl text-zinc-900">{user.fullName}</CardTitle>
              <CardDescription className="text-zinc-600">{user.email}</CardDescription>
            </div>
            <Badge variant="outline" className={cn('rounded-full border', STATUS_BADGE[user.status])}>
              {user.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Personal Information</p>
                <p className="mt-2 text-sm text-zinc-700">
                  Name: <span className="font-semibold text-zinc-900">{user.fullName}</span>
                </p>
                <p className="text-sm text-zinc-700">
                  Email: <span className="font-semibold text-zinc-900">{user.email}</span>
                </p>
                <p className="text-sm text-zinc-700">
                  Phone: <span className="font-semibold text-zinc-900">{user.phone}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Account Details</p>
                <p className="mt-2 text-sm text-zinc-700">
                  User ID: <span className="font-semibold text-zinc-900">{user.id}</span>
                </p>
                <p className="text-sm text-zinc-700">
                  Registration: <span className="font-semibold text-zinc-900">{user.registeredAt}</span>
                </p>
                <p className="text-sm text-zinc-700">
                  Status: <span className="font-semibold text-zinc-900">{user.status}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Transaction History</p>
              {txQuery.isError ? (
                <p className="text-sm text-rose-600">Could not load transactions for this user.</p>
              ) : txQuery.isLoading ? (
                <p className="text-sm text-zinc-500">Loading transactions…</p>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-zinc-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-zinc-50/80">
                          <TableHead>Service type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userTransactions.length > 0 ? (
                          userTransactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="font-medium text-zinc-900">{tx.serviceType}</TableCell>
                              <TableCell>₦{tx.amount.toLocaleString()}</TableCell>
                              <TableCell>{tx.status}</TableCell>
                              <TableCell className="text-zinc-600">{tx.date}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="py-8 text-center text-sm text-zinc-500">
                              No transactions for this user yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {txTotal > 0 ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-zinc-600">
                        Page{' '}
                        <span className="font-semibold text-zinc-900">
                          {txPage} of {txTotalPages}
                        </span>
                        <span className="text-zinc-500">
                          {' '}
                          · {txTotal} transaction{txTotal === 1 ? '' : 's'}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-zinc-200"
                          disabled={txPage <= 1 || txQuery.isFetching}
                          onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-zinc-200"
                          disabled={txPage >= txTotalPages || txQuery.isFetching}
                          onClick={() => setTxPage((p) => Math.min(txTotalPages, p + 1))}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Account Status Control</CardTitle>
            <CardDescription className="text-zinc-600">
              Admins can change status via <code className="text-xs">PATCH /admin/users/:id/status</code>. Optional note
              for your records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status-reason">Reason / note</Label>
              <Textarea
                id="status-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[110px] rounded-xl border-zinc-200"
                placeholder="Optional note for audit trail…"
              />
            </div>
            <Button
              className="w-full primary_bg rounded-xl text-white hover:bg-red-600"
              disabled={!canManageStatus || busy}
              onClick={() => updateStatus.mutate({ userId: user.id, status: mapUiStatusToApi('Active') })}
            >
              Activate Account
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-zinc-200"
              disabled={!canManageStatus || busy}
              onClick={() => updateStatus.mutate({ userId: user.id, status: mapUiStatusToApi('Suspended') })}
            >
              Suspend Account
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-zinc-200"
              disabled={!canManageStatus || busy}
              onClick={() => updateStatus.mutate({ userId: user.id, status: mapUiStatusToApi('Restricted') })}
            >
              Restrict Account
            </Button>
            {!canManageStatus ? (
              <p className="text-center text-xs text-zinc-500">You do not have permission to change account status.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
