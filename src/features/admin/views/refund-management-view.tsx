'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mapApiTransactionToRefundRow } from '@/lib/admin/map-refund-row'
import { useAdminRefunds } from '@/queries/admin'
import { cn } from '@/lib/utils'
import type { RefundStatus } from '@/types/admin'

const REFUND_BADGE: Record<RefundStatus, string> = {
  Initiated: 'bg-sky-50 text-sky-700 border-sky-200',
  Processing: 'bg-amber-50 text-amber-800 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function RefundManagementView() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | RefundStatus>('all')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  const refundQuery = useAdminRefunds({ page, limit: PAGE_SIZE }, true)

  const apiRows = useMemo(
    () => (refundQuery.data?.transactions ?? []).map(mapApiTransactionToRefundRow),
    [refundQuery.data?.transactions],
  )

  const rows = useMemo(() => {
    return apiRows.filter((row) => {
      const byStatus = status === 'all' ? true : row.refundStatus === status
      const q = query.trim().toLowerCase()
      const byQuery =
        !q ||
        row.transactionId.toLowerCase().includes(q) ||
        row.userName.toLowerCase().includes(q) ||
        row.serviceType.toLowerCase().includes(q) ||
        row.provider.toLowerCase().includes(q) ||
        row.paystackReference.toLowerCase().includes(q)
      return byStatus && byQuery
    })
  }, [apiRows, query, status])

  const total = refundQuery.data?.meta.total ?? apiRows.length

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Refund Management"
        // description="Monitor refund transactions, track Paystack refund lifecycle, and reconcile refund outcomes."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Refund Management' },
        ]}
      />

      {refundQuery.isError ? (
        <p className="text-sm text-rose-600">Could not load refunds. Verify `GET /admin/refunds`.</p>
      ) : null}

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Refund List</CardTitle>
          {/* <CardDescription className="text-zinc-600">
            Tracks refund-related transactions returned by the admin API.
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transaction ID, user, provider, Paystack reference..."
              className="h-11 max-w-xl rounded-xl border-zinc-200 bg-white placeholder:text-sm"
            />
            <Select value={status} onValueChange={(v) => setStatus(v as 'all' | RefundStatus)}>
              <SelectTrigger className="h-11 w-[220px] rounded-xl border-zinc-200 bg-white">
                <SelectValue placeholder="Refund status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Initiated">Initiated</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80">
                  <TableHead>S no.</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Service Provider</TableHead>
                  <TableHead>Transaction Amount</TableHead>
                  <TableHead>Refund Status</TableHead>
                  <TableHead>Refund Request Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-zinc-500">
                      Loading refunds…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-zinc-500">
                      No refund records match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow key={row.id}>
                       <TableCell>{index + 1}</TableCell>
                      {/* <TableCell className="font-medium text-zinc-900">{row.transactionId}</TableCell> */}
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.serviceType}</TableCell>
                      <TableCell>{row.provider}</TableCell>
                      <TableCell>{formatNaira(row.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('rounded-full border', REFUND_BADGE[row.refundStatus])}>
                          {row.refundStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.refundRequestDate}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm" className="rounded-lg border-zinc-200">
                          <Link href={`/admin/refunds/${encodeURIComponent(row.id)}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Page {page} · {total} total from API
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={page <= 1 || refundQuery.isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={refundQuery.isLoading || page * PAGE_SIZE >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Refund Status Tracking</CardTitle>
          <CardDescription className="text-zinc-600">Same dataset as above, focused on Paystack references.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80">
                  <TableHead>Paystack Reference ID</TableHead>
                  <TableHead>Refund Status</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Refund Completion Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={`${row.id}-tracking`}>
                    <TableCell className="font-medium text-zinc-900">{row.paystackReference}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('rounded-full border', REFUND_BADGE[row.refundStatus])}>
                        {row.refundStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatNaira(row.amount)}</TableCell>
                    <TableCell>{row.refundCompletionDate ?? 'Not completed yet'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                        <Link href={`/admin/transactions/${encodeURIComponent(row.transactionId)}`}>View Transaction</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
