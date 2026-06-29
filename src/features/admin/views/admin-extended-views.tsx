'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, CheckCircle2, KeyRound, Plug, Receipt, Settings, Shield, Users } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { TransactionsWorkspaceView } from '@/features/admin/views/transactions-workspace-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminRbac } from '@/context/admin-rbac-provider'
import { mapApiTransactionToRefundRow } from '@/lib/admin/map-refund-row'
import {
  useAdminProviderSettings,
  useAdminRefunds,
  useAdminStaff,
  useAdminTransaction,
  useUpdateProviderSettings,
} from '@/queries/admin'
import type { ApiUtilityProvider } from '@/types/admin-api'
import { cn } from '@/lib/utils'

export function ReportsHubView() {
  const { can } = useAdminRbac()

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Reports & analytics"
        description="Jump to revenue, transaction volume, or service-level reporting. Export actions live on each report page."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
              <BarChart3 className="h-5 w-5 text-zinc-600" />
              Revenue reports
            </CardTitle>
            <CardDescription className="text-zinc-600">
              Monthly revenue by service type and trend charts. Super Admin only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {can('revenue') ? (
              <Button asChild className="rounded-xl">
                <Link href="/admin/reports/revenue">Open revenue reports</Link>
              </Button>
            ) : (
              <p className="text-sm text-zinc-500">Your role does not include financial analytics.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
              <Receipt className="h-5 w-5 text-zinc-600" />
              Transaction reports
            </CardTitle>
            <CardDescription className="text-zinc-600">
              Filter, inspect, and export the full transaction ledger.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/reports/transactions">Open transaction reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
              <Settings className="h-5 w-5 text-zinc-600" />
              Service reports
            </CardTitle>
            <CardDescription className="text-zinc-600">
              Service mix and configuration snapshot (ties into service management APIs).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/reports/services">Open service reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdminTransactionReportsView() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Transaction reports"
        description="Use the same workspace as operations: search, status filters, CSV export, and paging."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Transactions' },
        ]}
      />
      <TransactionsWorkspaceView mode="all" />
    </div>
  )
}

export function AdminServiceReportsView() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Service reports"
        description="Per-service sales and health will aggregate here once backend exposes `GET /admin/reports/services` (or equivalent). Until then, use each service hub under the sidebar."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Services' },
        ]}
      />
      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Service mix (placeholder)</CardTitle>
          <CardDescription className="text-zinc-600">
            Wire this card to a dedicated service-report endpoint when available.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/admin/airtime">Airtime hub</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/admin/databundle">Data bundle hub</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/admin/electricity">Electricity hub</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/admin/cable">Cable TV hub</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsHubView() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Super Admin configuration: platform defaults, provider API keys, and staff roles."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings' },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">General</CardTitle>
            <CardDescription className="text-zinc-600">Branding, support contacts, maintenance toggles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/settings/general">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Utility provider</CardTitle>
            <CardDescription className="text-zinc-600">Switch between TopupBox and VTUGate for airtime, data, electricity, and cable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/settings/provider">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">API configuration</CardTitle>
            <CardDescription className="text-zinc-600">VTU provider credentials and webhooks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/settings/api">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Admin & roles</CardTitle>
            <CardDescription className="text-zinc-600">Manage staff accounts from `GET /admin/staff`.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-xl border-zinc-200">
              <Link href="/admin/settings/admins">Open</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdminGeneralSettingsView() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="General settings"
        description="Placeholder UI until `PATCH /admin/settings/general` (or similar) exists."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'General' },
        ]}
      />
      <Card className="max-w-lg rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Platform defaults</CardTitle>
          <CardDescription className="text-zinc-600">Forms here should bind to backend settings DTOs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="support-email">Support email</Label>
            <Input id="support-email" type="email" placeholder="support@example.com" disabled className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company display name</Label>
            <Input id="company" placeholder="Credinet VTU" disabled className="rounded-xl" />
          </div>
          <Button type="button" disabled className="rounded-xl">
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const PROVIDER_OPTIONS: { id: ApiUtilityProvider; label: string; description: string }[] = [
  {
    id: 'TOPUPBOX',
    label: 'TopupBox',
    description: 'Use TopupBox for airtime, data, electricity, and cable TV.',
  },
  {
    id: 'VTUGATE',
    label: 'VTUGate',
    description: 'Use VTUGate for airtime, data, electricity, and cable TV.',
  },
]

export function AdminProviderSettingsView() {
  const { can } = useAdminRbac()
  const canManageProvider = can('provider_settings')
  const settingsQuery = useAdminProviderSettings(canManageProvider)
  const updateMutation = useUpdateProviderSettings()
  const [selected, setSelected] = useState<ApiUtilityProvider>('TOPUPBOX')

  const activeProvider = settingsQuery.data?.provider ?? 'TOPUPBOX'
  const hasChanges = selected !== activeProvider

  useEffect(() => {
    if (settingsQuery.data?.provider) {
      setSelected(settingsQuery.data.provider)
    }
  }, [settingsQuery.data?.provider])

  const handleSave = async () => {
    if (!hasChanges) return
    await updateMutation.mutateAsync(selected)
  }

  if (!canManageProvider) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title="Provider settings"
          description="You do not have permission to change the utility provider."
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Provider settings' },
          ]}
        />
        <Card className="max-w-lg rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardContent className="py-8 text-sm text-zinc-600">
            Contact a Super Admin if you need access to switch between TopupBox and VTUGate.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Provider settings"
        description="Enable exactly one VTU provider at a time. All utility purchases (airtime, data, electricity, cable) use the selected provider."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Provider settings' },
        ]}
      />
      <Card className="max-w-xl rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
            <Plug className="h-5 w-5 text-zinc-600" />
            Active utility provider
          </CardTitle>
          <CardDescription className="text-zinc-600">
            Only one provider can be active. Selecting a new provider automatically disables the other.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsQuery.isLoading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : settingsQuery.isError ? (
            <p className="text-sm text-rose-600">Could not load provider settings. Please try again.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  Currently active:{' '}
                  <strong>{activeProvider === 'TOPUPBOX' ? 'TopupBox' : 'VTUGate'}</strong>
                </span>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Active utility provider">
                {PROVIDER_OPTIONS.map((option) => {
                  const isSelected = selected === option.id
                  const isActive = activeProvider === option.id

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
                      )}
                    >
                      <input
                        type="radio"
                        name="utility-provider"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelected(option.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">{option.label}</span>
                          {isActive ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                              Active
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-sm text-zinc-600">{option.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={
              settingsQuery.isLoading ||
              settingsQuery.isError ||
              updateMutation.isPending ||
              !hasChanges
            }
            className="rounded-xl"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save provider'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminApiSettingsView() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="API configuration"
        description="Placeholder for secret rotation UI. Prefer server-side env in production; expose read-only status here if needed."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'API' },
        ]}
      />
      <Card className="max-w-lg rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
            <KeyRound className="h-5 w-5 text-zinc-600" />
            Provider keys
          </CardTitle>
          <CardDescription className="text-zinc-600">Awaiting secure admin endpoints for key management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary VTU API key</Label>
            <Input type="password" value="••••••••••••" readOnly disabled className="rounded-xl font-mono text-sm" />
          </div>
          <Button type="button" disabled variant="outline" className="rounded-xl border-zinc-200">
            Rotate key (backend required)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminStaffRolesView() {
  const staffQuery = useAdminStaff(true)

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Admin management"
        description="Staff list from `GET /admin/staff`. Create and role updates use existing mutations when the API returns structured users."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Admins' },
        ]}
      />

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
            <Users className="h-5 w-5 text-zinc-600" />
            Staff directory
          </CardTitle>
          <CardDescription className="text-zinc-600">
            Raw rows render as JSON until the backend stabilizes on `id`, `email`, and `role` fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffQuery.isLoading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : staffQuery.isError ? (
            <p className="text-sm text-rose-600">Could not load staff.</p>
          ) : (
            <pre className="max-h-[420px] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800">
              {JSON.stringify(staffQuery.data ?? [], null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const REFUND_BADGE: Record<string, string> = {
  Initiated: 'bg-sky-50 text-sky-700 border-sky-200',
  Processing: 'bg-amber-50 text-amber-800 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
}

export function RefundDetailView({ id }: { id: string }) {
  const txQuery = useAdminTransaction(id, Boolean(id))
  const refundQuery = useAdminRefunds({ page: 1, limit: 100 }, Boolean(id))

  const fromList = refundQuery.data?.transactions?.find((t) => String(t.id ?? (t as { _id?: string })._id) === id)
  const row = txQuery.data
    ? mapApiTransactionToRefundRow(txQuery.data)
    : fromList
      ? mapApiTransactionToRefundRow(fromList)
      : null

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Refund details"
        description="Single refund / transaction view. Uses `GET /admin/transactions/:id` when available."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Refunds', href: '/admin/refunds' },
          { label: id },
        ]}
      />

      {txQuery.isLoading && !fromList ? (
        <Skeleton className="h-56 w-full rounded-2xl" />
      ) : txQuery.isError && !row ? (
        <p className="text-sm text-rose-600">Could not load this refund. Verify the transaction id.</p>
      ) : !row ? (
        <p className="text-sm text-zinc-600">No matching refund record.</p>
      ) : (
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Refund summary</CardTitle>
            <CardDescription className="text-zinc-600">Status, amount, and references.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[200px] font-medium text-zinc-500">Transaction ID</TableCell>
                  <TableCell className="font-mono text-sm">{row.transactionId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">User</TableCell>
                  <TableCell>{row.userName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Service</TableCell>
                  <TableCell>{row.serviceType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Provider</TableCell>
                  <TableCell>{row.provider}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Amount</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
                      row.amount,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Refund status</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                        REFUND_BADGE[row.refundStatus] ?? 'bg-zinc-100 text-zinc-700',
                      )}
                    >
                      {row.refundStatus}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Paystack reference</TableCell>
                  <TableCell className="font-mono text-sm">{row.paystackReference}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Requested</TableCell>
                  <TableCell>{row.refundRequestDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-zinc-500">Completed</TableCell>
                  <TableCell>{row.refundCompletionDate ?? '—'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                <Link href="/admin/refunds">Back to refunds</Link>
              </Button>
              <Button asChild className="rounded-xl">
                <Link href={`/admin/transactions/${encodeURIComponent(row.transactionId)}`}>Open transaction</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function AdminAuthPortalView({ variant }: { variant: 'login' | 'forgot' | 'reset' }) {
  const copy =
    variant === 'login'
      ? {
          title: 'Admin login',
          body: 'Authentication is handled by the main Credinet login flow. Use your staff credentials on the primary sign-in page.',
        }
      : variant === 'forgot'
        ? {
            title: 'Forgot password',
            body: 'Password reset is initiated from the public forgot-password flow. Backend should send the reset email for the staff account email on file.',
          }
        : {
            title: 'Reset password',
            body: 'Complete password reset using the link from your email. This route is a placeholder for deep links from marketing pages.',
          }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="flex justify-center">
        <Shield className="h-12 w-12 text-zinc-400" />
      </div>
      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl text-zinc-900">{copy.title}</CardTitle>
          <CardDescription className="text-center text-zinc-600">{copy.body}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/login">Go to app login</Link>
          </Button>
          {variant !== 'forgot' ? (
            <Button asChild variant="ghost" className="rounded-xl text-zinc-600">
              <Link href="/forgot-password">Forgot password</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
