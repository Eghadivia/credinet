import type { ApiSupportTicket } from '@/types/admin-api'

export type SupportTicketListItem = {
  id: string
  user: string
  topic: string
  status: string
  pri: string
}

export function mapApiTicketToListItem(t: ApiSupportTicket): SupportTicketListItem {
  const raw = t as unknown as Record<string, unknown>
  const id =
    (typeof t.id === 'string' && t.id) ||
    (typeof t.ticketId === 'string' && t.ticketId) ||
    String(raw.id ?? raw.ticketId ?? '')

  const u = t.user
  const userFromNested =
    u && typeof u === 'object'
      ? `${String((u as { firstName?: string }).firstName ?? '')} ${String((u as { lastName?: string }).lastName ?? '')}`.trim() ||
        String((u as { name?: string }).name ?? '') ||
        String((u as { email?: string }).email ?? '')
      : ''
  const user = userFromNested || (typeof t.userName === 'string' ? t.userName : 'Customer')

  const topic =
    (typeof t.subject === 'string' && t.subject) ||
    (typeof t.title === 'string' && t.title) ||
    (typeof t.topic === 'string' && t.topic) ||
    (typeof t.description === 'string' ? t.description.slice(0, 80) : 'Support ticket')

  const status = String(t.status ?? 'OPEN')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const pri = String(t.priority ?? 'Medium')

  return { id, user, topic, status, pri }
}
