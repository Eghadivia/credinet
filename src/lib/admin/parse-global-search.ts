/** Flatten heterogeneous `GET /admin/search` payloads into compact links */
export type GlobalSearchHit = {
  title: string
  subtitle?: string
  href: string
}

function idOf(x: Record<string, unknown>): string {
  return String(x.id ?? x.userId ?? x.transactionId ?? x.ticketId ?? '')
}

export function flattenGlobalSearchResults(raw: unknown): GlobalSearchHit[] {
  const out: GlobalSearchHit[] = []
  const root = raw as Record<string, unknown> | null | undefined
  if (!root || typeof root !== 'object') return out

  const data = (root.data as Record<string, unknown> | undefined) ?? root

  const tryArray = (arr: unknown, kind: 'user' | 'tx' | 'ticket') => {
    if (!Array.isArray(arr)) return
    for (const item of arr.slice(0, 8)) {
      if (!item || typeof item !== 'object') continue
      const o = item as Record<string, unknown>
      const id = idOf(o)
      if (!id) continue
      if (kind === 'user') {
        const name = `${String(o.firstName ?? '')} ${String(o.lastName ?? '')}`.trim() || String(o.email ?? 'User')
        out.push({
          title: name,
          subtitle: String(o.email ?? o.phone ?? ''),
          href: `/admin/users/${encodeURIComponent(id)}`,
        })
      } else if (kind === 'tx') {
        out.push({
          title: `Transaction ${id}`,
          subtitle: String(o.serviceType ?? ''),
          href: `/admin/transactions/${encodeURIComponent(id)}`,
        })
      } else {
        out.push({
          title: String(o.subject ?? o.title ?? o.topic ?? `Ticket ${id}`),
          subtitle: String(o.status ?? ''),
          href: `/admin/support/tickets/${encodeURIComponent(id)}`,
        })
      }
    }
  }

  tryArray(data.users, 'user')
  tryArray(data.items, 'user')
  tryArray(data.transactions, 'tx')
  tryArray(data.tickets, 'ticket')

  for (const [key, val] of Object.entries(data)) {
    if (['users', 'items', 'transactions', 'tickets', 'meta', 'success', 'message'].includes(key)) continue
    if (Array.isArray(val)) {
      if (key.toLowerCase().includes('user')) tryArray(val, 'user')
      else if (key.toLowerCase().includes('transaction') || key.toLowerCase().includes('tx')) tryArray(val, 'tx')
      else if (key.toLowerCase().includes('ticket')) tryArray(val, 'ticket')
    }
  }

  return out.slice(0, 12)
}
