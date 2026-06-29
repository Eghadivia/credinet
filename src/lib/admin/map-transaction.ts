import type { AdminTransactionRow, TxStatus } from '@/types/admin'
import type { ApiAdminTransaction, ApiPaymentStatus, ApiServiceType, ApiTxStatus } from '@/types/admin-api'

const SERVICE_LABELS: Record<string, string> = {
  AIRTIME: 'Airtime',
  DATA: 'Data Bundle',
  DATA_BUNDLE: 'Data Bundle',
  ELECTRICITY: 'Electricity',
  CABLE: 'Cable TV',
}

const PENDING_TX_STATUSES = new Set(['INITIATED', 'PENDING_PAYMENT', 'PENDING', 'PROCESSING', 'RETRY'])

/** Prisma `PaymentStatus` + `TxStatus` → admin UI label */
export function mapApiTxStatusToUi(
  txStatus: string | undefined,
  paymentStatus?: string | undefined,
): TxStatus {
  const tx = String(txStatus ?? '')
    .trim()
    .toUpperCase()
  const pay = String(paymentStatus ?? '')
    .trim()
    .toUpperCase()

  if (tx === 'FAILED') return 'Failed'
  if (tx === 'REFUNDED' || tx === 'REFUND_PENDING') return 'Refunded'

  // Successful = payment received (`PaymentStatus.PAID`) and/or VTU `TxStatus.SUCCESS`
  if (pay === 'PAID') return 'Successful'
  if (tx === 'SUCCESS' && pay !== 'PENDING') return 'Successful'

  if (pay === 'PENDING' || PENDING_TX_STATUSES.has(tx)) return 'Pending'

  return 'Pending'
}

export function isSuccessfulPayment(t: Pick<ApiAdminTransaction, 'status' | 'paymentStatus'>): boolean {
  const pay = String(t.paymentStatus ?? '')
    .trim()
    .toUpperCase()
  return pay === 'PAID'
}

export type AdminTransactionApiFilters = {
  status?: ApiTxStatus | string
  paymentStatus?: ApiPaymentStatus | string
}

/** Map UI status filter → query params for `GET /admin/transactions` (Prisma enums) */
export function txUiFilterToApiQuery(ui: TxStatus | 'all'): AdminTransactionApiFilters {
  if (ui === 'all') return {}

  switch (ui) {
    case 'Successful':
      return { paymentStatus: 'PAID' }
    case 'Pending':
      return { paymentStatus: 'PENDING' }
    case 'Failed':
      return { status: 'FAILED' }
    case 'Refunded':
      return { status: 'REFUNDED' }
    default:
      return {}
  }
}

/** @deprecated Use `txUiFilterToApiQuery` — returns `status` only for legacy callers */
export function txUiFilterToApiStatus(mode: TxStatus | 'all'): string | undefined {
  const q = txUiFilterToApiQuery(mode)
  return q.status as string | undefined
}

export function rowMatchesUiStatus(rowStatus: TxStatus, uiFilter: TxStatus): boolean {
  return rowStatus === uiFilter
}

export function mapApiServiceTypeToLabel(t: ApiServiceType | string | undefined): string {
  if (!t) return '—'
  const k = String(t).toUpperCase()
  return SERVICE_LABELS[k] ?? String(t).replace(/_/g, ' ')
}

function looksLikeOpaqueId(s: string): boolean {
  const t = s.trim()
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)) return true
  if (/^[0-9a-f]{24}$/i.test(t)) return true
  if (/^c[a-z0-9]{20,}$/i.test(t)) return true
  return false
}

function formatTxDate(iso: string | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function mapApiTransactionToRow(t: ApiAdminTransaction): AdminTransactionRow {
  const raw = t as unknown as Record<string, unknown>
  const id =
    (typeof t.id === 'string' && t.id) ||
    (typeof t.transactionId === 'string' && t.transactionId) ||
    (typeof raw.reference === 'string' && raw.reference) ||
    String(t.id ?? t.transactionId ?? '')

  const u = t.user
  const first = u?.firstName ?? ''
  const last = u?.lastName ?? ''
  const fromNestedName = `${first} ${last}`.trim()
  const userIdStr = typeof raw.userId === 'string' ? raw.userId.trim() : ''

  let user =
    fromNestedName ||
    (typeof u?.email === 'string' && u.email) ||
    (typeof u?.phone === 'string' && u.phone) ||
    ''

  if (!user || user === userIdStr || looksLikeOpaqueId(user)) {
    user = (typeof u?.email === 'string' && u.email) || (typeof u?.phone === 'string' && u.phone) || 'Customer'
  }

  const amount =
    typeof t.amount === 'number'
      ? t.amount
      : typeof raw.amount === 'string' && !Number.isNaN(Number(raw.amount))
        ? Number(raw.amount)
        : 0

  const provider = t.provider ?? t.providerName ?? (typeof raw.vendor === 'string' ? raw.vendor : '—')

  const recipientDetail =
    t.recipientDetail ??
    t.recipient ??
    t.recipientPhone ??
    (typeof raw.meterNumber === 'string' ? raw.meterNumber : undefined) ??
    (typeof raw.smartcard === 'string' ? raw.smartcard : undefined)

  const serviceKey = [t.serviceType, t.type, raw.type, raw.serviceType].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0,
  )

  const txStatusRaw = [t.status, raw.status].find((v): v is string => typeof v === 'string' && v.length > 0)
  const paymentStatusRaw = [t.paymentStatus, raw.paymentStatus].find(
    (v): v is string => typeof v === 'string' && v.length > 0,
  )

  return {
    id,
    user,
    userEmail: u?.email,
    userPhone: u?.phone,
    serviceType: mapApiServiceTypeToLabel(serviceKey),
    provider: String(provider),
    recipientDetail,
    amount,
    status: mapApiTxStatusToUi(txStatusRaw, paymentStatusRaw),
    paymentReference:
      t.paymentReference ??
      t.paystackReference ??
      (typeof raw.paystackId === 'string' ? raw.paystackId : undefined) ??
      (typeof raw.reference === 'string' ? raw.reference : undefined),
    providerResponse: t.providerResponse,
    failureReason: t.failureReason ?? t.errorMessage,
    date: formatTxDate(t.createdAt ?? t.updatedAt),
  }
}
