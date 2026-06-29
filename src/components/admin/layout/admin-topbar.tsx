'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bell, Menu, Search } from 'lucide-react'

import { useAdminRbac } from '@/context/admin-rbac-provider'
import { flattenGlobalSearchResults } from '@/lib/admin/parse-global-search'
import { useAdminGlobalSearch, useAdminMe } from '@/queries/admin'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function AdminTopbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { roleLabel } = useAdminRbac()
  const meQuery = useAdminMe(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(searchInput.trim()), 350)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const searchQuery = useAdminGlobalSearch(debounced, debounced.length >= 2)

  const hits = useMemo(() => flattenGlobalSearchResults(searchQuery.data), [searchQuery.data])

  const initials = useMemo(() => {
    const u = meQuery.data
    if (!u) return 'AD'
    const a = (u.firstName?.[0] ?? u.email?.[0] ?? 'A').toUpperCase()
    const b = (u.lastName?.[0] ?? u.email?.[1] ?? 'D').toUpperCase()
    return `${a}${b}`
  }, [meQuery.data])

  const displayName = useMemo(() => {
    const u = meQuery.data
    if (!u) return 'Admin'
    const n = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
    return n || u.email || 'Admin'
  }, [meQuery.data])

  const today = new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-zinc-200 bg-white md:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <div className="relative hidden min-w-[220px] flex-1 md:block lg:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <PopoverTrigger asChild>
              <Input
                placeholder="Search transactions, users, tickets…"
                className="h-11 rounded-xl border-zinc-200 bg-white pl-10 placeholder:text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchOpen(true)}
              />
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-xl p-0" align="start">
            <div className="max-h-80 overflow-y-auto p-2 text-sm">
              {debounced.length < 2 ? (
                <p className="px-2 py-3 text-zinc-500">Type at least 2 characters to search.</p>
              ) : searchQuery.isLoading ? (
                <p className="px-2 py-3 text-zinc-500">Searching…</p>
              ) : searchQuery.isError ? (
                <p className="px-2 py-3 text-rose-600">Search failed.</p>
              ) : hits.length === 0 ? (
                <p className="px-2 py-3 text-zinc-500">No structured results — check raw API payload.</p>
              ) : (
                <ul className="space-y-1">
                  {hits.map((h) => (
                    <li key={`${h.href}-${h.title}`}>
                      <Link
                        href={h.href}
                        className="block rounded-lg px-2 py-2 hover:bg-zinc-100"
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="font-medium text-zinc-900">{h.title}</span>
                        {h.subtitle ? <span className="mt-0.5 block text-xs text-zinc-500">{h.subtitle}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right text-xs leading-tight text-zinc-500 sm:block">
            <p className="font-medium text-zinc-800">{today}</p>
            <p className="text-[11px]">WAT</p>
          </div>

          <Badge variant="outline" className="hidden rounded-full border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 sm:inline-flex">
            {roleLabel}
          </Badge>

          <Button asChild variant="outline" size="icon" className="relative h-10 w-10 rounded-xl border-zinc-200 bg-white">
            <Link href="/admin/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-10 gap-2 rounded-xl border-zinc-200 bg-white px-2 sm:px-3">
            <Link href="/admin/profile">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-semibold text-zinc-900 md:inline">{displayName}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
