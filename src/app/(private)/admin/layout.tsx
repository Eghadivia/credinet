'use client'

import React from 'react'

import { AdminShell } from '@/components/admin/layout/admin-shell'
import { AdminRbacProvider } from '@/context/admin-rbac-provider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRbacProvider>
      <AdminShell>{children}</AdminShell>
    </AdminRbacProvider>
  )
}
