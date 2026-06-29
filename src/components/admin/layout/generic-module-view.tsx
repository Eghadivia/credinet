import { Activity, ShieldCheck } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function humanizeSlug(slug: string) {
  return slug
    .split('/')
    .filter(Boolean)
    .map((part) =>
      part
        .split('-')
        .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
        .join(' '),
    )
    .join(' · ')
}

const MOCK_ROWS = [
  { a: 'Primary route', b: 'Operational', c: '99.2%', d: 'Auto' },
  { a: 'Failover route', b: 'Warm standby', c: '—', d: 'Manual' },
  { a: 'Webhook callbacks', b: 'Healthy', c: '100%', d: 'Auto' },
]

export function GenericModuleView({
  slugKey,
  description,
}: {
  slugKey: string
  description?: string
}) {
  const title = humanizeSlug(slugKey) || 'Module'

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={title}
        description={
          description ??
          'Static CrediNet admin workspace. Replace with API-backed screens when endpoints are ready.'
        }
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          ...slugKey.split('/').filter(Boolean).map((seg, idx, arr) => {
            const hrefPath = `/admin/${arr.slice(0, idx + 1).join('/')}`
            const isLast = idx === arr.length - 1
            return {
              label: humanizeSlug(seg),
              href: isLast ? undefined : hrefPath,
            }
          }),
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">Operational health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-zinc-900">Stable</p>
              <p className="text-xs text-zinc-500">Mock uptime 99.98%</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">24h volume</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-zinc-900">₦18.4M</p>
              <p className="text-xs text-emerald-600">+4.6% vs yesterday</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">Open tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-zinc-900">7</p>
            <p className="text-xs text-zinc-500">SLA: cleared within 6h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-zinc-900">Operational checklist</CardTitle>
          <Button className="primary_bg rounded-xl text-white hover:bg-red-600">Create task</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80">
                  <TableHead>Item</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Automation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ROWS.map((r) => (
                  <TableRow key={r.a}>
                    <TableCell className="font-medium text-zinc-900">{r.a}</TableCell>
                    <TableCell className="text-zinc-700">{r.b}</TableCell>
                    <TableCell className="text-zinc-700">{r.c}</TableCell>
                    <TableCell className="text-right text-zinc-700">{r.d}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
