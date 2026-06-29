'use client'

import type { ActivityItem } from '@/types/admin'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const toneStyles: Record<ActivityItem['tone'], string> = {
  success: 'border-l-emerald-500 bg-emerald-50/40',
  warning: 'border-l-amber-500 bg-amber-50/40',
  danger: 'border-l-rose-500 bg-rose-50/40',
  info: 'border-l-sky-500 bg-sky-50/40',
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-zinc-900">System activity</CardTitle>
        <p className="text-sm text-zinc-500">Live operational feed (mock)</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[520px] pr-3">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl border border-zinc-100 bg-white p-4 shadow-sm transition hover:shadow-md',
                  'border-l-4',
                  toneStyles[item.tone],
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
