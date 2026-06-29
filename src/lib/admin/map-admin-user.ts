import type { AdminUserRow } from '@/types/admin'
import type { ApiAdminUser, ApiUserStatus } from '@/types/admin-api'

const STATUS_TO_UI: Record<string, AdminUserRow['status']> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  RESTRICTED: 'Restricted',
}

const UI_TO_API: Record<AdminUserRow['status'], ApiUserStatus> = {
  Active: 'ACTIVE',
  Suspended: 'SUSPENDED',
  Restricted: 'RESTRICTED',
}

export function mapApiStatusToUi(status: string | undefined): AdminUserRow['status'] {
  if (!status) return 'Active'
  const key = String(status).toUpperCase()
  return STATUS_TO_UI[key] ?? 'Active'
}

export function mapUiStatusToApi(status: AdminUserRow['status']): ApiUserStatus {
  return UI_TO_API[status]
}

export function formatUserRegisteredAt(iso: string | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function mapApiUserToRow(u: ApiAdminUser): AdminUserRow {
  const raw = u as unknown as Record<string, unknown>
  const id =
    (typeof raw.id === 'string' && raw.id) ||
    (typeof raw.userId === 'string' && raw.userId) ||
    (typeof raw.uuid === 'string' && raw.uuid) ||
    (typeof raw._id === 'string' && raw._id) ||
    String(raw.id ?? raw.userId ?? raw.uuid ?? raw._id ?? '')

  const first = u.firstName ?? ''
  const last = u.lastName ?? ''
  const fullName = `${first} ${last}`.trim() || u.email || id

  return {
    id,
    fullName,
    email: u.email ?? '—',
    phone: u.phone ?? '—',
    registeredAt: formatUserRegisteredAt(u.createdAt),
    status: mapApiStatusToUi(u.status),
  }
}

export function tabModeToApiStatus(mode: 'all' | 'suspended' | 'restricted'): ApiUserStatus | undefined {
  if (mode === 'suspended') return 'SUSPENDED'
  if (mode === 'restricted') return 'RESTRICTED'
  return undefined
}
