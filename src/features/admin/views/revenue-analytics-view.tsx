'use client'

import { useMemo, useState } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { AdminStatCard } from '@/components/admin/cards/admin-stat-card'
import { MonthlySalesChart } from '@/components/charts/monthly-sales-chart'
import { RevenuePieChart } from '@/components/charts/revenue-pie-chart'
import { topServices } from '@/data/mock/admin-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminMonthlyRevenue } from '@/queries/admin'

export function RevenueAnalyticsView() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const revenueQuery = useAdminMonthlyRevenue(year, true)

  const totals = useMemo(() => {
    const rows = revenueQuery.data ?? []
    let sum = 0
    for (const r of rows) {
      sum += r.airtime + r.data + r.electricity + r.cable
    }
    return { sum, rows }
  }, [revenueQuery.data])

  const grossHint = totals.sum > 0 ? `~₦${totals.sum.toFixed(0)}m (chart units)` : 'all services'

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Revenue analytics"
        description="Monthly revenue from `GET /admin/analytics/monthly-revenue`."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Revenue' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="text-sm text-zinc-600">Year</span>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="h-10 w-[120px] rounded-xl border-zinc-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2].map((d) => {
              const y = currentYear - d
              return (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Gross revenue (chart)"
          value={revenueQuery.isLoading ? '…' : totals.sum > 0 ? `₦${totals.sum.toFixed(0)}m` : '—'}
          hint={grossHint}
          icon={BarChart3}
        />
        <AdminStatCard title="Net after commissions" value="—" hint="needs finance API" icon={TrendingUp} />
        <AdminStatCard title="Avg ticket size" value="—" hint="needs analytics API" icon={BarChart3} />
        <AdminStatCard title="Refund exposure" value="—" hint="needs analytics API" icon={TrendingUp} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Monthly earnings</CardTitle>
            <CardDescription className="text-zinc-600">Revenue by service type (₦ millions per month, multi-line)</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueQuery.isLoading ? <Skeleton className="h-[320px] w-full rounded-xl" /> : <MonthlySalesChart data={revenueQuery.data} />}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Revenue breakdown</CardTitle>
            <CardDescription className="text-zinc-600">Share by service category (sample)</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenuePieChart />
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <p className="font-semibold text-zinc-900">Legend</p>
              <div className="grid grid-cols-2 gap-2">
                <span>Airtime 38%</span>
                <span>Data 32%</span>
                <span>Electricity 16%</span>
                <span>Cable TV 14%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Top performing services</CardTitle>
          <CardDescription className="text-zinc-600">Ranked by gross volume (mock)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {topServices.map((s) => (
            <div key={s.name} className="rounded-2xl border border-zinc-200 bg-zinc-50/40 p-4">
              <p className="text-sm font-semibold text-zinc-900">{s.name}</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{s.volume}</p>
              <p className="text-xs text-zinc-500">Share of VTU volume: {s.share}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
