'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Trend = 'up' | 'down'

export type AdminStatCardProps = {
  title: string
  value: string
  /** Omit when showing live counts without a period comparison */
  delta?: string
  trend?: Trend
  hint?: string
  icon: LucideIcon
}

export function AdminStatCard({
  title,
  value,
  delta,
  trend,
  hint,
  icon: Icon,
}: AdminStatCardProps) {
  const positive = trend === 'up'
  const showDelta = delta !== undefined && trend !== undefined

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(248,75,68,0.08),transparent_45%)]" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-600">{title}</CardTitle>
        <div className="rounded-xl bg-zinc-100 p-2 text-zinc-700 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-zinc-900">{value}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {showDelta ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold',
                positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-zinc-500">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  )
}
