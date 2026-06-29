'use client'

import Link from 'next/link'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useAdminMe, useAdminNotifications } from '@/queries/admin'

export function AdminSettingsView() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Configure admin experience and platform defaults — static controls for now."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Security</CardTitle>
            <CardDescription className="text-zinc-600">Session and authentication posture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Require MFA for admins</p>
                <p className="text-xs text-zinc-600">Adds TOTP on sensitive actions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">IP allowlist</p>
                <p className="text-xs text-zinc-600">Restrict admin access to known IPs</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Notifications</CardTitle>
            <CardDescription className="text-zinc-600">Operational alerts to admin emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ops-email">Operations email</Label>
              <Input id="ops-email" defaultValue="ops@credinet.ng" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finance-email">Finance email</Label>
              <Input id="finance-email" defaultValue="finance@credinet.ng" className="h-11 rounded-xl" />
            </div>
            <Button className="primary_bg rounded-xl text-white hover:bg-red-600">Save changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdminProfileView() {
  const meQuery = useAdminMe(true)

  const fullName = meQuery.data
    ? `${meQuery.data.firstName ?? ''} ${meQuery.data.lastName ?? ''}`.trim() || meQuery.data.email || 'Admin'
    : ''

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Admin profile"
        description="Admin Details"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Profile' },
        ]}
      />

      {meQuery.isError ? (
        <p className="text-sm text-rose-600">Could not load profile. Check your session and admin role.</p>
      ) : null}

      <Card className="max-w-2xl rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-900">Personal details</CardTitle>
          <CardDescription className="text-zinc-600">Read-only view of the authenticated admin user.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {meQuery.isLoading ? (
            <>
              <Skeleton className="h-11 sm:col-span-2" />
              <Skeleton className="h-11" />
              <Skeleton className="h-11" />
            </>
          ) : meQuery.data ? (
            <>
              <div className="space-y-2 sm:col-span-2">
                <Label>Full name</Label>
                <Input readOnly value={fullName} className="h-11 rounded-xl bg-zinc-50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input readOnly value={meQuery.data.email ?? ''} className="h-11 rounded-xl bg-zinc-50" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input readOnly value={meQuery.data.phone ?? ''} className="h-11 rounded-xl bg-zinc-50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Role</Label>
                <Input readOnly value={String(meQuery.data.role ?? '')} className="h-11 rounded-xl bg-zinc-50" />
              </div>
            </>
          ) : null}
          <div className="sm:col-span-2">
            <Button className="primary_bg rounded-xl text-white hover:bg-red-600" type="button" disabled>
              Update profile
            </Button>
            <p className="mt-2 text-xs text-zinc-500">Profile updates require a dedicated API when available.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminNotificationsView() {
  const notificationsQuery = useAdminNotifications(true)
  const items = notificationsQuery.data ?? []

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Notifications"
        description="From `GET /admin/notifications`."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Notifications' },
        ]}
      />

      {notificationsQuery.isError ? (
        <p className="text-sm text-rose-600">Could not load notifications.</p>
      ) : null}

      <div className="space-y-3">
        {notificationsQuery.isLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-600">No notifications.</p>
        ) : (
          items.map((n, idx) => {
            const title = String(n.title ?? n.message ?? `Notice ${idx + 1}`)
            const body = String(n.body ?? n.message ?? '')
            const time =
              n.createdAt && !Number.isNaN(Date.parse(n.createdAt))
                ? new Date(n.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                : ''
            const key = String(n.id ?? title + idx)
            return (
              <Card key={key} className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base text-zinc-900">{title}</CardTitle>
                    {time ? <span className="text-xs text-zinc-400">{time}</span> : null}
                  </div>
                  {body && body !== title ? <CardDescription className="text-zinc-600">{body}</CardDescription> : null}
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="rounded-xl border-zinc-200" type="button" disabled>
                    Mark as read
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export function AdminLoginDemoView() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center space-y-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">CrediNet Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">Sign in (UI demo)</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This route is a static design surface. Your app&apos;s real auth remains at{' '}
          <Link className="font-semibold text-primary underline" href="/login">
            /login
          </Link>
          .
        </p>
      </div>

      <Card className="rounded-[28px] border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-900">Admin credentials</CardTitle>
          <CardDescription className="text-zinc-600">Mock fields only — no authentication performed here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="admin@credinet.ng" className="h-12 rounded-xl bg-zinc-50" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-zinc-50" />
          </div>
          <Button className="h-12 w-full primary_bg rounded-xl text-base font-semibold text-white hover:bg-red-600">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
