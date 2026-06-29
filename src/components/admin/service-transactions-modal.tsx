'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'

import { TransactionDetailDialog } from '@/components/admin/transaction-detail-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  isSuccessfulPayment,
  mapApiTransactionToRow,
  mapApiServiceTypeToLabel,
  txUiFilterToApiQuery,
} from '@/lib/admin/map-transaction'
import { computeServiceDayStatsFromTransactions } from '@/lib/admin/service-day-stats'
import {
  dayBoundsIso,
  formatDisplayDate,
  moduleToApiType,
  todayDateInputValue,
  type ServiceTxModule,
} from '@/lib/admin/service-module'
import { useAdminTransactions, useExportTransactions } from '@/queries/admin'
import type { AdminTransactionRow } from '@/types/admin'
import type { ApiServiceType } from '@/types/admin-api'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20
const STATS_FETCH_LIMIT = 2000

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)
}

type Props = {
  module: ServiceTxModule
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceTransactionsModal({ module, open, onOpenChange }: Props) {
  const apiType = moduleToApiType(module)
  const serviceLabel = mapApiServiceTypeToLabel(apiType)

  const [selectedDate, setSelectedDate] = useState(todayDateInputValue)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState<AdminTransactionRow | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { from, to } = useMemo(() => dayBoundsIso(selectedDate), [selectedDate])
  const successFilters = useMemo(() => txUiFilterToApiQuery('Successful'), [])

  useEffect(() => {
    if (open) {
      setSelectedDate(todayDateInputValue())
      setPage(1)
    }
  }, [open, module])

  useEffect(() => {
    setPage(1)
  }, [selectedDate, module])

  const listQuery = useMemo(
    () => ({
      type: apiType as ApiServiceType,
      from,
      to,
      ...successFilters,
      page,
      limit: PAGE_SIZE,
    }),
    [apiType, from, to, successFilters, page],
  )

  const statsListQuery = useMemo(
    () => ({
      type: apiType as ApiServiceType,
      from,
      to,
      ...successFilters,
      page: 1,
      limit: STATS_FETCH_LIMIT,
    }),
    [apiType, from, to, successFilters],
  )

  const txQuery = useAdminTransactions(listQuery, open)
  const statsQuery = useAdminTransactions(statsListQuery, open)
  const exportTx = useExportTransactions()

  const rows = useMemo(() => {
    return (txQuery.data?.transactions ?? [])
      .map(mapApiTransactionToRow)
      .filter((r) => r.status === 'Successful')
  }, [txQuery.data?.transactions])

  const stats = useMemo(() => {
    const txs = (statsQuery.data?.transactions ?? []).filter(isSuccessfulPayment)
    return computeServiceDayStatsFromTransactions(txs, statsQuery.data?.meta, txs.length)
  }, [statsQuery.data])

  const handleExport = () => {
    exportTx.mutate({
      type: apiType as ApiServiceType,
      from,
      to,
      ...successFilters,
    })
  }

  const totalPages = Math.max(1, Math.ceil((txQuery.data?.meta.total ?? rows.length) / PAGE_SIZE))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-4xl">
          <DialogHeader className="border-b border-zinc-100 px-6 py-5 text-left">
            <DialogTitle className="text-xl text-zinc-900">{serviceLabel} — successful transactions</DialogTitle>
            <DialogDescription>
              Select a date to view paid transactions for this service. Only successful payments are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="date"
                value={selectedDate}
                max={todayDateInputValue()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-[180px] rounded-xl border-zinc-200 bg-white pl-10"
                aria-label="Transaction date"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-zinc-200"
              disabled={exportTx.isPending || !selectedDate}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </div>

          <div className="grid gap-3 border-b border-zinc-100 bg-zinc-50/60 px-6 py-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Successful transactions</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {statsQuery.isLoading || txQuery.isLoading
                  ? '…'
                  : stats.successfulCount.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{formatDisplayDate(selectedDate)}</p>
            </div>
            <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total successful payments</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {statsQuery.isLoading ? '…' : formatNaira(stats.successfulAmountNgn)}
              </p>
              {stats.amountMayBePartial ? (
                <p className="mt-0.5 text-xs text-amber-700">
                  Amount from first {STATS_FETCH_LIMIT.toLocaleString()} rows
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-zinc-500">paymentStatus = PAID</p>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
            {txQuery.isError ? (
              <p className="text-sm text-rose-600">Could not load transactions for this date.</p>
            ) : txQuery.isLoading ? (
              <p className="py-12 text-center text-sm text-zinc-500">Loading transactions…</p>
            ) : rows.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">
                No successful transactions on {formatDisplayDate(selectedDate)}.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/80">
                      <TableHead className="w-12 text-center">S/N</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r, idx) => (
                      <TableRow key={r.id} className="hover:bg-zinc-50/60">
                        <TableCell className="text-center text-sm text-zinc-600">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </TableCell>
                        <TableCell className="text-zinc-700">{r.user}</TableCell>
                        <TableCell className="text-zinc-700">{r.provider}</TableCell>
                        <TableCell className="text-right font-semibold text-zinc-900">
                          {formatNaira(r.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200')}
                          >
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-600">{r.date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-zinc-200"
                            onClick={() => {
                              setDetailRow(r)
                              setDetailOpen(true)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 text-sm text-zinc-500">
            <span>
              Page <span className="font-semibold text-zinc-800">{page}</span> of{' '}
              <span className="font-semibold text-zinc-800">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionDetailDialog open={detailOpen} onOpenChange={setDetailOpen} row={detailRow} />
    </>
  )
}
