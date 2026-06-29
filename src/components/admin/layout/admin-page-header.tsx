import Link from 'next/link'
import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type BreadcrumbEntry = { label: string; href?: string }

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbEntry[]
  actions?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      {breadcrumbs?.length ? (
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-zinc-500">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={`${b.label}-${idx}`}>
                <BreadcrumbItem>
                  {b.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={b.href}>{b.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{b.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
