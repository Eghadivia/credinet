'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PricingRow } from '@/types/admin'
import type { ApiServiceType, UpdatePricingMarkupBody } from '@/types/admin-api'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: PricingRow | null
  isSaving?: boolean
  onSave: (body: UpdatePricingMarkupBody) => void
}

export function PricingMarkupDialog({ open, onOpenChange, row, isSaving, onSave }: Props) {
  const [markupInput, setMarkupInput] = useState('')

  useEffect(() => {
    if (row) setMarkupInput(String(row.markupPercent))
  }, [row])

  const markupNum = Number(markupInput)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!row) return
    if (Number.isNaN(markupNum) || markupNum < 0) return
    onSave({
      serviceType: row.serviceType as ApiServiceType,
      markupPercent: markupNum,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update markup</DialogTitle>
            <DialogDescription>
              {row
                ? `Applies to all ${row.serviceName} providers.`
                : 'Set the platform markup percentage for this service type.'}
            </DialogDescription>
          </DialogHeader>

          {row ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="markup-percent">Markup percentage</Label>
                <Input
                  id="markup-percent"
                  type="number"
                  min={0}
                  step={0.1}
                  value={markupInput}
                  onChange={(e) => setMarkupInput(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={!row || isSaving || Number.isNaN(markupNum)}>
              {isSaving ? 'Saving…' : 'Save markup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
