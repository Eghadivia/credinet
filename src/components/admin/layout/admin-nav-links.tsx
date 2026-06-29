'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { useAdminRbac } from '@/context/admin-rbac-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function AdminNavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { navItems } = useAdminRbac()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          if (!item.children?.length) {
            const link = (
              <Link key={item.href} href={item.href} onClick={onNavigate} className="block">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/5 hover:text-white',
                    active && 'bg-white/10 text-white shadow-sm ring-1 ring-white/10',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Button>
              </Link>
            )

            if (!collapsed) return link

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} onClick={onNavigate} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-center rounded-xl text-zinc-200 hover:bg-white/5 hover:text-white',
                        active && 'bg-white/10 text-white',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return (
            <Collapsible key={item.href} defaultOpen={active} className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    'w-full justify-between gap-2 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/5 hover:text-white',
                    active && 'bg-white/10 text-white ring-1 ring-white/10',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-3">
                {item.children?.map((child) => {
                  const ChildIcon = child.icon
                  const childActive = pathname === child.href
                  return (
                    <Link key={child.href} href={child.href} onClick={onNavigate} className="block">
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white',
                          childActive && 'bg-white/10 text-white',
                        )}
                      >
                        <ChildIcon className="h-4 w-4 shrink-0 opacity-90" />
                        <span className="truncate">{child.label}</span>
                      </Button>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
