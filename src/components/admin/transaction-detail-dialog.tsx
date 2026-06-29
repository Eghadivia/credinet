'use client'

import type { AdminTransactionRow } from '@/types/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<AdminTransactionRow['status'], string> = {
  Successful: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200',
  Refunded: 'bg-zinc-100 text-zinc-700 border-zinc-200',
}

export function TransactionDetailDialog({
  open,
  onOpenChange,
  row,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: AdminTransactionRow | null
}) {
  if (!row) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Transaction details</DialogTitle>
          <DialogDescription>Transaction audit preview.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Transaction ID</span>
            <span className="text-sm font-semibold text-zinc-900">{row.id}</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-zinc-500">User</p>
              <p className="font-medium text-zinc-900">{row.user}</p>
            </div>
            <div>
              <p className="text-zinc-500">User Email</p>
              <p className="font-medium text-zinc-900">{row.userEmail ?? 'Not available'}</p>
            </div>
            <div>
              <p className="text-zinc-500">Status</p>
              <Badge variant="outline" className={cn('mt-1 rounded-full border', STATUS_BADGE[row.status])}>
                {row.status}
              </Badge>
            </div>
            <div>
              <p className="text-zinc-500">Service</p>
              <p className="font-medium text-zinc-900">{row.serviceType}</p>
            </div>
            <div>
              <p className="text-zinc-500">Provider</p>
              <p className="font-medium text-zinc-900">{row.provider}</p>
            </div>
            <div>
              <p className="text-zinc-500">Recipient</p>
              <p className="font-medium text-zinc-900">{row.recipientDetail ?? 'Not available'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-zinc-500">Date</p>
              <p className="font-medium text-zinc-900">{row.date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-zinc-500">Provider Response</p>
              <p className="font-medium text-zinc-900">{row.providerResponse ?? 'No response available'}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between sm:gap-4">
          <Button variant="outline" className="rounded-xl px-5" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            className="primary_bg rounded-xl px-6 py-2.5 text-white shadow-sm hover:bg-red-600"
            disabled
          >
            Requery Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
