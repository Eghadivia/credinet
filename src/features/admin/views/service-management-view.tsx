'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Download, Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'

import { PricingMarkupDialog } from '@/components/admin/pricing-markup-dialog'
import { TransactionDetailDialog } from '@/components/admin/transaction-detail-dialog'

import { useAdminRbac } from '@/context/admin-rbac-provider'

import {
  collapsePricingByServiceType,
  moduleToPricingServiceType,
  pricingRowMatchesModule,
} from '@/lib/admin/map-api-pricing'

import {
  isSuccessfulPayment,
  mapApiTransactionToRow,
  mapApiServiceTypeToLabel,
  txUiFilterToApiQuery,
} from '@/lib/admin/map-transaction'

import {
  dayBoundsIso,
  formatDisplayDate,
  moduleToApiType,
  ServiceTxModule,
  todayDateInputValue,
  type ServiceManagementModule,
} from '@/lib/admin/service-module'

import {
  useAdminPricing,
  useAdminTransactions,
  useUpdatePricingMarkup,
  useExportTransactions,
} from '@/queries/admin'

import type { PricingRow, AdminTransactionRow } from '@/types/admin'
import type {
  ApiServiceType,
  UpdatePricingMarkupBody,
} from '@/types/admin-api'

import { cn } from '@/lib/utils'

const PAGE_SIZE = 10
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

export function ServiceManagementView({
  module = 'all',
}: {
  module?: ServiceManagementModule
}) {
  const { role } = useAdminRbac()
  const isSuper = role === 'super_admin'

  const [pricingRow, setPricingRow] = useState<PricingRow | null>(null)
  const [pricingOpen, setPricingOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState(todayDateInputValue())
  const [page, setPage] = useState(1)

  const [detailRow, setDetailRow] =
    useState<AdminTransactionRow | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)

  // ---------------- PRICING ----------------

  const pricingListQuery = useMemo(
    () => ({
      serviceType: moduleToPricingServiceType(module),
    }),
    [module],
  )

  const pricingQuery = useAdminPricing(pricingListQuery, isSuper)

  const updateMarkup = useUpdatePricingMarkup()

  const filteredPricing = useMemo(() => {
    return collapsePricingByServiceType(
      pricingQuery.data ?? [],
    ).filter((row) => pricingRowMatchesModule(module, row))
  }, [pricingQuery.data, module])

  const serviceMarkupRows = useMemo(() => {
    if (filteredPricing.length > 0) return filteredPricing

    const st = moduleToPricingServiceType(module)

    if (!st) return []

    return [
      {
        id: st,
        serviceType: st,
        serviceName: mapApiServiceTypeToLabel(st),
        providerName: '',
        basePrice: 0,
        markupPercent: 0,
        finalPrice: 0,
      },
    ]
  }, [filteredPricing, module])

  const handleSaveMarkup = (body: UpdatePricingMarkupBody) => {
    updateMarkup.mutate(body, {
      onSuccess: () => {
        setPricingOpen(false)
        setPricingRow(null)
      },
    })
  }

  // ---------------- TRANSACTIONS ----------------

 const apiType =
  module !== 'all'
    ? moduleToApiType(module as ServiceTxModule)
    : undefined

  const successFilters = useMemo(
    () => txUiFilterToApiQuery('Successful'),
    [],
  )

  const { from, to } = useMemo(
    () => dayBoundsIso(selectedDate),
    [selectedDate],
  )

  useEffect(() => {
    setPage(1)
  }, [selectedDate])

  const txQueryPayload = useMemo(
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

  const statsPayload = useMemo(
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

  const txQuery = useAdminTransactions(txQueryPayload)

  const statsQuery = useAdminTransactions(statsPayload)

  const exportTx = useExportTransactions()

  const rows = useMemo(() => {
    return (txQuery.data?.transactions ?? [])
      .map(mapApiTransactionToRow)
      .filter((r) => r.status === 'Successful')
  }, [txQuery.data?.transactions])

const successfulStatsRows = useMemo(() => {
  return (statsQuery.data?.transactions ?? [])
    .map(mapApiTransactionToRow)
    .filter((tx) => tx.status === 'Successful')
}, [statsQuery.data?.transactions])

const totalPayments = useMemo(() => {
  return successfulStatsRows.reduce((sum, tx) => {
    return sum + Number(tx.amount ?? 0)
  }, 0)
}, [successfulStatsRows])

const currentMarkupPercent = useMemo(() => {
  // get markup percentage from backend pricing row
  return Number(serviceMarkupRows?.[0]?.markupPercent ?? 0)
}, [serviceMarkupRows])

const markupAmount = useMemo(() => {
  return (totalPayments * currentMarkupPercent) / 100
}, [totalPayments, currentMarkupPercent])

const totalProviderCost = useMemo(() => {
  return totalPayments - markupAmount
}, [totalPayments, markupAmount])

const totalProfit = markupAmount
  const totalPages = Math.max(
    1,
    Math.ceil((txQuery.data?.meta?.total ?? rows.length) / PAGE_SIZE),
  )

  const handleExport = () => {
    exportTx.mutate({
      type: apiType as ApiServiceType,
      from,
      to,
      ...successFilters,
    })
  }

  return (
    <div className="space-y-8">
      {/* Pricing Table */}

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">
            Pricing & Markup Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!isSuper ? (
            <p className="text-sm text-zinc-600">
              Pricing and markup updates are available to Super Admins
              only.
            </p>
          ) : pricingQuery.isError ? (
            <p className="text-sm text-rose-600">
              Could not load pricing.
            </p>
          ) : pricingQuery.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/80">
                    <TableHead>Service type</TableHead>
                    <TableHead>Markup</TableHead>
                    <TableHead className="text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {serviceMarkupRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-12 text-center text-sm text-zinc-500"
                      >
                        No markup configured.
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceMarkupRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-zinc-900">
                          {row.serviceName}
                        </TableCell>

                        <TableCell>
                          {row.markupPercent}%
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            className="rounded-xl border-zinc-200"
                            type="button"
                            disabled={updateMarkup.isPending}
                            onClick={() => {
                              setPricingRow(row)
                              setPricingOpen(true)
                            }}
                          >
                            <Settings2 className="mr-2 h-4 w-4" />
                            Update Markup
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-blue-200/50 bg-blue-50 shadow-sm">
          <CardHeader>
            <CardTitle>Total Payments</CardTitle>

            <CardDescription>
              Successful customer payments
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatNaira(totalPayments)}
            </div>

            <p className="mt-2 text-sm text-zinc-600">
              {successfulStatsRows.length} successful transaction
              {successfulStatsRows.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-red-200/50 bg-red-50 shadow-sm">
          <CardHeader>
            <CardTitle>Total Payable to Provider</CardTitle>

            <CardDescription>
              Provider settlement amount
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatNaira(totalProfit)}
            </div>

            {/* <p className="mt-2 text-sm text-zinc-600">
              Profit:{' '}
              <span className="font-semibold text-green-600">
                {formatNaira(totalProfit)}
              </span>
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-lg text-zinc-900">
              Successful Transactions
            </CardTitle>

            
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <Input
                type="date"
                value={selectedDate}
                max={todayDateInputValue()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-[200px] rounded-xl border-zinc-200 bg-white pl-10"
              />
            </div>

            <Button
              onClick={handleExport}
              variant="outline"
              className="h-11 rounded-xl border-zinc-200"
              disabled={exportTx.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {txQuery.isError ? (
            <p className="text-sm text-rose-600">
              Could not load transactions.
            </p>
          ) : txQuery.isLoading ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              Loading transactions...
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/80">
                    <TableHead className="w-12 text-center">
                      S/N
                    </TableHead>

                    <TableHead>Customer</TableHead>

                    <TableHead>Provider</TableHead>

                    <TableHead className="text-right">
                      Amount
                    </TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Date</TableHead>

                    <TableHead className="text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.length > 0 ? (
                    rows.map((r, idx) => (
                      <TableRow
                        key={r.id}
                        className="hover:bg-zinc-50/60"
                      >
                        <TableCell className="text-center text-sm text-zinc-600">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </TableCell>

                        <TableCell className="text-zinc-700">
                          {r.user}
                        </TableCell>

                        <TableCell className="text-zinc-700">
                          {r.provider}
                        </TableCell>

                        <TableCell className="text-right font-semibold text-zinc-900">
                          {formatNaira(r.amount)}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700',
                            )}
                          >
                            {r.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm text-zinc-600">
                          {r.date}
                        </TableCell>

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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-zinc-500"
                      >
                        No successful transactions found for{' '}
                        {formatDisplayDate(selectedDate)}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}

          <div className="flex items-center justify-between pt-2 text-sm text-zinc-500">
            <span>
              Page{' '}
              <span className="font-semibold text-zinc-800">
                {page}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-zinc-800">
                {totalPages}
              </span>
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
        </CardContent>
      </Card>

      {/* Dialogs */}

      <PricingMarkupDialog
        open={pricingOpen}
        onOpenChange={setPricingOpen}
        row={pricingRow}
        isSaving={updateMarkup.isPending}
        onSave={handleSaveMarkup}
      />

      <TransactionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}  
        row={detailRow}
      />
    </div>
  )
}