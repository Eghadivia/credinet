'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { TransactionDetailDialog } from '@/components/admin/transaction-detail-dialog'
import { AdminTransactionsTable } from '@/components/tables/admin-transactions-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mapApiTransactionToRow, txUiFilterToApiQuery } from '@/lib/admin/map-transaction'
import { dayBoundsIso, todayDateInputValue } from '@/lib/admin/service-module'
import { useAdminTransactions, useExportTransactions } from '@/queries/admin'
import type { AdminTransactionRow, TxStatus } from '@/types/admin'
import { cn } from '@/lib/utils'

const FILTER_TABS: { label: string; href: string; value: 'all' | TxStatus }[] = [
  { label: 'All', href: '/admin/transactions', value: 'all' },
  { label: 'Successful', href: '/admin/transactions/successful', value: 'Successful' },
  { label: 'Pending', href: '/admin/transactions/pending', value: 'Pending' },
  { label: 'Failed', href: '/admin/transactions/failed', value: 'Failed' },
  { label: 'Refunds', href: '/admin/transactions/refunds', value: 'Refunded' },
]

const PAGE_SIZE = 20

export function TransactionsWorkspaceView({
  mode,
}: {
  mode: 'all' | TxStatus
}) {
  const pathname = usePathname()
  const [selected, setSelected] = useState<AdminTransactionRow | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const dateRange = useMemo(() => {
    if (!selectedDate.trim()) return undefined
    return dayBoundsIso(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [mode, debouncedSearch, selectedDate])

  const apiFilters = useMemo(() => (mode === 'all' ? {} : txUiFilterToApiQuery(mode)), [mode])

  const listQuery = useMemo(
    () => ({
      ...(dateRange ? { from: dateRange.from, to: dateRange.to } : {}),
      ...apiFilters,
      search: debouncedSearch.trim() || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [dateRange, apiFilters, debouncedSearch, page],
  )

  const txQuery = useAdminTransactions(listQuery, true)
  const exportTx = useExportTransactions()

  const rows = useMemo(
    () => (txQuery.data?.transactions ?? []).map(mapApiTransactionToRow),
    [txQuery.data?.transactions],
  )

  const total = txQuery.data?.meta.total ?? 0

  const title = mode === 'all' ? 'Transactions' : `${mode} transactions`

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={title}
       
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Transactions', href: '/admin/transactions' },
          ...(mode === 'all' ? [] : [{ label: title }]),
        ]}
      />

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-zinc-900">Transaction List</CardTitle>
              {/* <CardDescription className="text-zinc-600">
               View transaction ID, user name, service type, provider, amount, status, and date/time.
              </CardDescription> */}
            </div>
            <div className="flex w-full flex-wrap gap-2 rounded-2xl bg-zinc-100 p-1 lg:w-auto">
              {FILTER_TABS.map((t) => {
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
          {txQuery.isError ? (
            <p className="text-sm text-rose-600">Could not load transactions. Verify the admin API and your role.</p>
          ) : (
            <AdminTransactionsTable
              rows={rows}
              filter="all"
              showStatusFilter={false}
              showDateFilter
              dateValue={selectedDate}
              onDateChange={setSelectedDate}
              maxDate={todayDateInputValue()}
              search={searchInput}
              onSearchChange={setSearchInput}
              isLoading={txQuery.isLoading}
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onExport={() =>
                exportTx.mutate({
                  ...(dateRange ? { from: dateRange.from, to: dateRange.to } : {}),
                  ...apiFilters,
                  search: debouncedSearch.trim() || undefined,
                })
              }
              onView={(row) => {
                setSelected(row)
                setOpen(true)
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Failed Transaction Review</CardTitle>
          <CardDescription className="text-zinc-600">
            Failed and pending rows from the current page for quick scanning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {failedAndPendingRows.length === 0 ? (
              <p className="text-sm text-zinc-500">No failed or pending rows on this page.</p>
            ) : (
              failedAndPendingRows.map((row) => (
                <div
                  key={`review-${row.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{row.id}</p>
                    <p className="text-sm text-zinc-700">
                      {row.user} • {row.serviceType} • {row.provider}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {row.failureReason ?? 'No failure reason available'} • {row.date}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {row.status}
                    </span>
                    <Button
                      variant="outline"
                      className="rounded-xl border-zinc-200"
                      onClick={() => {
                        setSelected(row)
                        setOpen(true)
                      }}
                    >
                      View
                    </Button>
                    <Button variant="outline" className="rounded-xl border-zinc-200" type="button" disabled>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Requery
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card> */}

      <TransactionDetailDialog open={open} onOpenChange={setOpen} row={selected} />
    </div>
  )
}
