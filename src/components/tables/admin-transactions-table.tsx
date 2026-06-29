'use client'

import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'

import type { AdminTransactionRow, TxStatus } from '@/types/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rowMatchesUiStatus } from '@/lib/admin/map-transaction'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<TxStatus, string> = {
  Successful: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
  Refunded: 'bg-zinc-100 text-zinc-700 border-zinc-200',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AdminTransactionsTable({
  rows,
  onView,
  filter = 'all',
  search: controlledSearch,
  onSearchChange,
  isLoading,
  total: serverTotal,
  page = 1,
  pageSize = 20,
  onPageChange,
  onExport,
  statusFilter: controlledStatus,
  onStatusFilterChange,
  showExport = true,
  dateValue,
  onDateChange,
  maxDate,
  showDateFilter = false,
  showStatusFilter = true,
}: {
  rows: AdminTransactionRow[]
  onView?: (row: AdminTransactionRow) => void
  filter?: TxStatus | 'all'
  search?: string
  onSearchChange?: (q: string) => void
  isLoading?: boolean
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (p: number) => void
  onExport?: () => void
  /** When set, status filter is controlled by the parent (e.g. service hub + API export). */
  statusFilter?: 'all' | TxStatus
  onStatusFilterChange?: (status: 'all' | TxStatus) => void
  showExport?: boolean
  dateValue?: string
  onDateChange?: (date: string) => void
  maxDate?: string
  showDateFilter?: boolean
  /** Hide status dropdown when status is controlled via route tabs (transaction management). */
  showStatusFilter?: boolean
}) {
  const [internalQuery, setInternalQuery] = useState('')
  const [internalStatus, setInternalStatus] = useState<'all' | TxStatus>('all')

  const query = controlledSearch !== undefined ? controlledSearch : internalQuery
  const setQuery = onSearchChange ?? setInternalQuery
  const status = controlledStatus !== undefined ? controlledStatus : internalStatus
  const setStatus = onStatusFilterChange ?? setInternalStatus

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const byRoute = filter === 'all' ? true : r.status === filter
      const bySelect =
        status === 'all' ? true : rowMatchesUiStatus(r.status, status as TxStatus)
      const q = query.trim().toLowerCase()
      const byQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q)
      return byRoute && bySelect && byQuery
    })
  }, [rows, query, status, filter])

  const total = serverTotal ?? rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transaction ID, user, service…"
          className="h-11 max-w-md rounded-xl border-zinc-200 bg-white placeholder:text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          {showDateFilter && dateValue !== undefined && onDateChange ? (
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="date"
                value={dateValue}
                max={maxDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="h-11 w-[168px] rounded-xl border-zinc-200 bg-white pl-10"
                aria-label="Filter by date (optional)"
              />
            </div>
          ) : null}
          {showStatusFilter ? (
            <Select value={status} onValueChange={(v) => setStatus(v as 'all' | TxStatus)}>
              <SelectTrigger className="h-11 w-[180px] rounded-xl border-zinc-200 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Successful">Successful</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
          {onExport && showExport ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-zinc-200 bg-white"
              onClick={() => onExport()}
            >
              Export CSV
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/80">
              <TableHead className="w-14 text-center">S/N</TableHead>
              {/* <TableHead className="w-35">Transaction ID</TableHead> */}
              <TableHead>Full Name</TableHead>
              {/* <TableHead>Service</TableHead> */}
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-sm text-zinc-500">
                  Loading transactions…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-sm text-zinc-500">
                  No transactions match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, idx) => {
                const serial = (page - 1) * pageSize + idx + 1
                return (
                <TableRow key={r.id} className="hover:bg-zinc-50/60">
                  <TableCell className="text-center text-sm text-zinc-600">{serial}</TableCell>
                  {/* <TableCell className="font-medium text-zinc-900">{r.id}</TableCell> */}
                  <TableCell className="text-zinc-700">{r.user}</TableCell>
                  {/* <TableCell className="text-zinc-700">{r.serviceType}</TableCell> */}
                  <TableCell className="text-zinc-700">{r.provider}</TableCell>
                  <TableCell className="text-right font-semibold text-zinc-900">{formatCurrency(r.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('rounded-full border', STATUS_BADGE[r.status])}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600">{r.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-zinc-200"
                      onClick={() => onView?.(r)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Showing <span className="font-semibold text-zinc-800">{filtered.length}</span> on this page
          {serverTotal !== undefined ? (
            <>
              {' '}
              · <span className="font-semibold text-zinc-800">{serverTotal}</span> total
            </>
          ) : (
            <>
              {' '}
              · <span className="font-semibold text-zinc-800">{rows.length}</span> loaded
            </>
          )}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={!onPageChange || page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={!onPageChange || page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
