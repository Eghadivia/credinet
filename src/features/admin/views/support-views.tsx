'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminPageHeader } from '@/components/admin/layout/admin-page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { mapApiTicketToListItem } from '@/lib/admin/map-support-ticket'
import { useAdminSupportTickets, useUpdateTicketStatus } from '@/queries/admin'

export function SupportTicketsView() {
  const [page] = useState(1)
  const ticketsQuery = useAdminSupportTickets({ page, limit: 50 }, true)

  const items = useMemo(
    () => (ticketsQuery.data?.tickets ?? []).map(mapApiTicketToListItem),
    [ticketsQuery.data?.tickets],
  )

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Support tickets"
        description="Tickets from `GET /admin/support/tickets`."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Support', href: '/admin/support/tickets' },
          { label: 'Tickets' },
        ]}
      />

      <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-zinc-900">Queue</CardTitle>
            <CardDescription className="text-zinc-600">Open and in-progress tickets</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticketsQuery.isError ? (
            <p className="text-sm text-rose-600">Could not load tickets.</p>
          ) : ticketsQuery.isLoading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            items.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/30 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.id}</p>
                  <p className="text-sm text-zinc-700">{t.topic}</p>
                  <p className="text-xs text-zinc-500">{t.user}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-zinc-200">
                    {t.status}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-amber-800">
                    {t.pri}
                  </Badge>
                  <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                    <Link href={`/admin/support/tickets/${encodeURIComponent(t.id)}`}>Open</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function SupportTicketDetailView({ id }: { id: string }) {
  const decoded = decodeURIComponent(id)
  const ticketsQuery = useAdminSupportTickets({ page: 1, limit: 200 }, true)
  const updateTicket = useUpdateTicketStatus()

  const ticket = useMemo(() => {
    const raw = ticketsQuery.data?.tickets ?? []
    const found = raw.find((t) => {
      const tid = String(t.id ?? t.ticketId ?? '')
      return tid === decoded
    })
    return found ?? null
  }, [ticketsQuery.data?.tickets, decoded])

  const listItem = ticket ? mapApiTicketToListItem(ticket) : null

  if (ticketsQuery.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (ticketsQuery.isError || !ticket || !listItem) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          title="Ticket not found"
          description={ticketsQuery.isError ? 'Failed to load tickets.' : `No ticket matches “${decoded}”.`}
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Support', href: '/admin/support/tickets' },
          ]}
        />
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/support/tickets">Back to tickets</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Ticket ${listItem.id}`}
        description={listItem.topic}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Support', href: '/admin/support/tickets' },
          { label: 'Tickets', href: '/admin/support/tickets' },
          { label: listItem.id },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Conversation</CardTitle>
            <CardDescription className="text-zinc-600">
              {ticket.description ? 'Latest details from the ticket record.' : 'Thread preview (no messages in API).'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px] rounded-2xl border border-zinc-200 bg-zinc-50/40 p-4">
              <div className="space-y-4 text-sm">
                {ticket.description ? (
                  <p className="text-zinc-700">{String(ticket.description)}</p>
                ) : (
                  <p className="text-zinc-500">No conversation payload from the API.</p>
                )}
              </div>
            </ScrollArea>
            <div className="mt-4 space-y-2">
              <Textarea placeholder="Write a reply… (UI only — wire message API when available)" className="min-h-[110px] rounded-2xl" disabled />
              <Button className="primary_bg rounded-xl text-white hover:bg-red-600" type="button" disabled>
                Send reply
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900">Controls</CardTitle>
            <CardDescription className="text-zinc-600">
              Updates ticket via <code className="text-xs">PATCH /admin/support/tickets/:id</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full rounded-xl border-zinc-200" type="button" disabled>
              Escalate to engineering
            </Button>
            <Button variant="outline" className="w-full rounded-xl border-zinc-200" type="button" disabled>
              Link transaction
            </Button>
            <Button
              className="w-full primary_bg rounded-xl text-white hover:bg-red-600"
              type="button"
              disabled={updateTicket.isPending}
              onClick={() => updateTicket.mutate({ id: listItem.id, status: 'CLOSED' })}
            >
              Close ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
