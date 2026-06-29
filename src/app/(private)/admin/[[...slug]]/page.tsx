import { AdminPageRenderer } from '@/features/admin/admin-page-renderer'

export default async function AdminCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return <AdminPageRenderer slug={slug} />
}
