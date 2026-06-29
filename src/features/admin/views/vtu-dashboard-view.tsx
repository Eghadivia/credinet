'use client'

import { useMemo } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Receipt, Wallet } from 'lucide-react'

import { AdminStatCard } from '@/components/admin/cards/admin-stat-card'
import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { MonthlySalesChart } from '@/components/charts/monthly-sales-chart'
import { MonthlyTxVolumeChart } from '@/components/charts/monthly-tx-volume-chart'
import { WeeklyActivityChart } from '@/components/charts/weekly-activity-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminRbac } from '@/context/admin-rbac-provider'
import { dashboardStatCards } from '@/data/mock/admin-dashboard'
import { extractDashboardMetrics } from '@/lib/admin/dashboard-metrics'
import { useAdminDashboard, useAdminMonthlyRevenue, useAdminMonthlyVolume } from '@/queries/admin'

const ICONS = [Receipt, ArrowUpRight, ArrowDownRight, Activity, Wallet] as const

function formatRevenueHint(n: number | undefined) {
  if (n === undefined) return undefined
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(2)}M`
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)
}

export function VtuDashboardView() {
  const { can } = useAdminRbac()
  const year = new Date().getFullYear()
  const showFinancial = can('revenue')

  const dashboardQuery = useAdminDashboard(can('dashboard'))
  const revenueQuery = useAdminMonthlyRevenue(year, can('dashboard') && showFinancial)
  const volumeQuery = useAdminMonthlyVolume(year, can('dashboard') && !showFinancial)

  const stats = useMemo(() => {
    const m = extractDashboardMetrics(dashboardQuery.data)
    const base = dashboardStatCards
    if (!m) {
      const rows = base.map((c, idx) => ({
        ...c,
        icon: ICONS[idx % ICONS.length],
      }))
      return showFinancial ? rows : rows.slice(0, 4)
    }
    const daily = formatRevenueHint(m.dailyRevenueNgn)
    const full = [
      {
        ...base[0],
        value: m.totalTransactions != null ? m.totalTransactions.toLocaleString() : base[0].value,
        hint:
          m.totalTransactionsChangePct != null
            ? `${m.totalTransactionsChangePct >= 0 ? '+' : ''}${m.totalTransactionsChangePct.toFixed(1)}% vs prior period`
            : base[0].hint,
        icon: ICONS[0],
      },
      {
        ...base[1],
        value: m.successfulTransactions != null ? m.successfulTransactions.toLocaleString() : base[1].value,
        hint: m.successRatePct != null ? `${m.successRatePct.toFixed(1)}% success rate` : base[1].hint,
        icon: ICONS[1],
      },
      {
        ...base[2],
        value: m.failedTransactions != null ? m.failedTransactions.toLocaleString() : base[2].value,
        icon: ICONS[2],
      },
      {
        ...base[3],
        value: m.pendingTransactions != null ? m.pendingTransactions.toLocaleString() : base[3].value,
        icon: ICONS[3],
      },
      {
        ...base[4],
        value: daily ?? base[4].value,
        icon: ICONS[4],
      },
    ]
    return showFinancial ? full : full.slice(0, 4)
  }, [dashboardQuery.data, showFinancial])

  const revenueChartLoading = showFinancial && (revenueQuery.isLoading || revenueQuery.isFetching)
  const volumeChartLoading = !showFinancial && can('dashboard') && (volumeQuery.isLoading || volumeQuery.isFetching)

  return (
    <div className="relative space-y-10 pb-6">
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-80 max-w-[1600px] bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(248,75,68,0.14),transparent_55%)]"
        aria-hidden
      />

      <div className="relative space-y-10">
        <section className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white/90 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_48px_-24px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {roleLabel} workspace
              </div> */}
              <AdminPageHeader
                title="Dashboard overview"
             
              />
            </div>
            {/* {can('transactions') ? (
              <Button asChild className="h-11 shrink-0 rounded-xl px-5 shadow-sm">
                <Link href="/admin/transactions">Open transactions</Link>
              </Button>
            ) : null} */}
          </div>
        </section>

        {can('dashboard') ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardQuery.isLoading ? (
              Array.from({ length: showFinancial ? 5 : 4 }).map((_, i) => <Skeleton key={i} className="h-[128px] rounded-2xl" />)
            ) : (
              stats.map((s) => <AdminStatCard key={s.title} {...s} icon={s.icon} />)
            )}
          </div>
        ) : null}

        {dashboardQuery.isError ? (
          <p className="text-sm text-rose-600">Could not load dashboard metrics. Check `GET /admin/dashboard`.</p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {showFinancial ? (
            <Card className="rounded-3xl border-zinc-200/90 bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.15)] lg:col-span-2">
              <CardHeader className="border-b border-zinc-100 pb-4">
                <CardTitle className="text-lg text-zinc-900">Monthly sales analytics</CardTitle>
                {/* <CardDescription className="text-zinc-600">
                  Revenue by service type (chart units). Super Admin and financial roles only.
                </CardDescription> */}
              </CardHeader>
              <CardContent className="pt-6">
                {revenueChartLoading ? (
                  <Skeleton className="h-80 w-full rounded-2xl" />
                ) : (
                  <MonthlySalesChart data={revenueQuery.data} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl border-zinc-200/90 bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.15)] lg:col-span-2">
              <CardHeader className="border-b border-zinc-100 pb-4">
                <CardTitle className="text-lg text-zinc-900">Monthly transaction volume</CardTitle>
                <CardDescription className="text-zinc-600">
                  Non-financial trend from `GET /admin/analytics/transaction-volume` (mock fallback when the payload is
                  empty).
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {volumeChartLoading ? (
                  <Skeleton className="h-80 w-full rounded-2xl" />
                ) : (
                  <MonthlyTxVolumeChart data={volumeQuery.data} />
                )}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-3xl border-zinc-200/90 bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.15)] lg:col-span-2">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <CardTitle className="text-lg text-zinc-900">Weekly activity</CardTitle>
              <CardDescription className="text-zinc-600">
                Transaction volume by day
                {showFinancial ? ', with revenue overlay until a dedicated weekly endpoint ships.' : '.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <WeeklyActivityChart showRevenue={showFinancial} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
