'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { mapApiTransactionToRow } from '@/lib/admin/map-transaction'
import { useAdminTransaction } from '@/queries/admin'
import { cn } from '@/lib/utils'
import type { TxStatus } from '@/types/admin'

const STATUS_BADGE: Record<TxStatus, string> = {
  Successful: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
  Refunded: 'bg-zinc-100 text-zinc-700 border-zinc-200',
}

export function TransactionDetailPageView({ id }: { id: string }) {
  const decoded = decodeURIComponent(id)
  const txQuery = useAdminTransaction(decoded, true)

  const row = useMemo(() => {
    if (!txQuery.data) return null
    return mapApiTransactionToRow(txQuery.data)
  }, [txQuery.data])

  if (txQuery.isLoading) {
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

  if (txQuery.isError || !row) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title="Transaction not found"
          description={
            txQuery.isError
              ? 'The transaction request failed. Check the API and your permissions.'
              : `No transaction matches “${decoded}”.`
          }
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Transactions', href: '/admin/transactions' },
          ]}
        />
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/transactions">Back to transactions</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Transaction ${row.id}`}
        description="Detailed transaction information for auditing and operational review."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Transactions', href: '/admin/transactions' },
          { label: row.id },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Transaction Details</CardTitle>
            <CardDescription className="text-zinc-600">
              From <code className="text-xs">GET /admin/transactions/:id</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Transaction ID</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">User</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.user}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">User Email</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.userEmail ?? 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">User Phone</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.userPhone ?? 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</p>
              <Badge variant="outline" className={cn('mt-1 rounded-full border', STATUS_BADGE[row.status])}>
                {row.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Service</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.serviceType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Provider</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.provider}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Recipient Details</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.recipientDetail ?? 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Transaction Amount</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">₦{row.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Payment Reference</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.paymentReference ?? 'Not available'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timestamp</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.date}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Service Provider Response</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{row.providerResponse ?? 'No response available'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Manual Requery</CardTitle>
            <CardDescription className="text-zinc-600">
              Send requery request to provider API for latest transaction status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full primary_bg rounded-xl text-white hover:bg-red-600" type="button" disabled>
              Requery Transaction
            </Button>
            <p className="text-xs text-zinc-600">
              Requery is useful for Pending/Uncertain records. Updated status should reflect automatically.
            </p>
            {row.failureReason ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Failure Reason: {row.failureReason}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Timeline</CardTitle>
          <CardDescription className="text-zinc-600">Immutable event log (static)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { t: 'Initiated', d: 'Customer checkout completed', time: '09:12:01' },
            { t: 'Routed', d: 'Provider route selected', time: '09:12:02' },
            { t: 'Acknowledged', d: 'Provider accepted request token', time: '09:12:04' },
          ].map((e, idx) => (
            <div key={e.t}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{e.t}</p>
                  <p className="text-sm text-zinc-600">{e.d}</p>
                </div>
                <span className="text-xs text-zinc-400">{e.time}</span>
              </div>
              {idx < 2 ? <Separator className="mt-4" /> : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
