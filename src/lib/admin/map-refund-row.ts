import type { RefundRow, RefundStatus, TxStatus } from '@/types/admin'

import { mapApiTransactionToRow } from '@/lib/admin/map-transaction'
import type { ApiAdminTransaction } from '@/types/admin-api'

function txStatusToRefundStatus(s: TxStatus): RefundStatus {
  if (s === 'Refunded') return 'Completed'
  if (s === 'Pending') return 'Processing'
  if (s === 'Failed') return 'Failed'
  return 'Initiated'
}

function pickServiceType(label: string): RefundRow['serviceType'] {
  const l = label.toLowerCase()
  if (l.includes('data')) return 'Data Bundle'
  if (l.includes('electric')) return 'Electricity Payment'
  if (l.includes('cable')) return 'Cable TV Subscription'
  return 'Airtime'
}

export function mapApiTransactionToRefundRow(t: ApiAdminTransaction): RefundRow {
  const row = mapApiTransactionToRow(t)
  const serviceType = pickServiceType(row.serviceType)

  return {
    id: row.id,
    transactionId: row.id,
    userName: row.user,
    serviceType,
    provider: row.provider,
    amount: row.amount,
    refundStatus: txStatusToRefundStatus(row.status),
    refundRequestDate: row.date,
    paystackReference: row.paymentReference ?? row.id,
    refundCompletionDate: row.status === 'Refunded' ? row.date : undefined,
  }
}
