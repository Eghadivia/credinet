'use client'

import Link from 'next/link'
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { useAdminRbac } from '@/context/admin-rbac-provider'
import { AdminNavLinks } from '@/components/admin/layout/admin-nav-links'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  onLogout,
  loggingOut,
}: {
  collapsed: boolean
  onToggleCollapsed: () => void
  onLogout: () => void
  loggingOut: boolean
}) {
  const { roleLabel } = useAdminRbac()

  return (
    <aside
      className={cn(
        'relative hidden h-full shrink-0 border-r border-white/5 bg-[#070b16] text-zinc-100 shadow-xl md:flex md:flex-col',
        collapsed ? 'w-[84px]' : 'w-[280px]',
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-5">
        <Link href="/admin" className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
            <img src="/logo.png" alt="CrediNet" className="h-8 w-8 object-contain" />
          </div>
          {!collapsed ? (
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">CrediNet</p>
              <p className="text-xs text-zinc-400">crediNet Admin</p>
            </div>
          ) : null}
        </Link>
        {!collapsed ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={onToggleCollapsed}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mx-auto h-9 w-9 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={onToggleCollapsed}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="bg-white/5" />

      <div className="flex-1 overflow-y-auto py-4">
        <AdminNavLinks collapsed={collapsed} />
      </div>

      <div className="border-t border-white/5 p-3">
        <div className={cn('flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10', collapsed && 'justify-center p-2')}>
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">Admin Console</p>
              <p className="truncate text-xs text-zinc-400">admin@credinet.ng</p>
              <Badge className="mt-2 bg-white/10 text-[10px] font-semibold text-white hover:bg-white/15">
                {roleLabel}
              </Badge>
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          className={cn(
            'mt-3 w-full border-white/10 bg-transparent text-zinc-100 hover:bg-white/5 hover:text-white',
            collapsed && 'px-0',
          )}
          onClick={onLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed ? <span className="ml-2">{loggingOut ? 'Signing out…' : 'Logout'}</span> : null}
        </Button>
      </div>

    </aside>
  )
}
