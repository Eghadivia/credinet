'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { LogOut, Menu } from 'lucide-react'

import { AdminNavLinks } from '@/components/admin/layout/admin-nav-links'
import { AdminRouteGuard } from '@/components/admin/layout/admin-route-guard'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useLogout } from '@/queries/auth'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success('Signed out'),
    })
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-50">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        onLogout={handleLogout}
        loggingOut={logoutMutation.isPending}
      />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[300px] border-white/5 bg-[#070b16] p-0 text-white">
          <div className="border-b border-white/5 px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <img src="/logo.png" alt="CrediNet" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">CrediNet</p>
                <p className="text-xs text-zinc-400">CrediNet Admin</p>
              </div>
            </div>
          </div>
          <div className="py-4">
            <AdminNavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="border-t border-white/5 p-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">{logoutMutation.isPending ? 'Signing out…' : 'Logout'}</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-zinc-200/80 bg-white px-4 py-3 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl border-zinc-200"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">CrediNet Admin</p>
            <p className="text-xs text-zinc-500">VTU console</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <AdminRouteGuard>{children}</AdminRouteGuard>
          </div>
        </main>
      </div>
    </div>
  )
}
