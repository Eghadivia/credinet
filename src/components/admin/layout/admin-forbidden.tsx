import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminForbidden() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg rounded-3xl border-zinc-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-zinc-900">Access restricted</CardTitle>
          <CardDescription className="text-zinc-600">
            Your current demo role does not include permission for this module. Switch role in the header to explore
            other areas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="primary_bg rounded-xl text-white hover:bg-red-600">
            <Link href="/admin">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/dashboard">User app</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
