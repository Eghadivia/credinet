import { AdminApiService } from '@/services/admin.api'
import type { AdminUserListQuery, ApiUserStatus } from '@/types/admin-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const adminUsersQueryKeys = {
  root: ['admin', 'users'] as const,
  stats: () => [...adminUsersQueryKeys.root, 'stats'] as const,
  list: (q: AdminUserListQuery) => [...adminUsersQueryKeys.root, 'list', q] as const,
}

export function useAdminUserStats(enabled = true) {
  return useQuery({
    queryKey: adminUsersQueryKeys.stats(),
    queryFn: () => AdminApiService.getUserStats(),
    enabled,
  })
}

export function useAdminUsers(query: AdminUserListQuery, enabled = true) {
  return useQuery({
    queryKey: adminUsersQueryKeys.list(query),
    queryFn: () => AdminApiService.listUsers(query),
    enabled,
    placeholderData: (prev) => prev,
  })
}

export function useUpdateUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: ApiUserStatus }) =>
      AdminApiService.updateUserStatus(userId, status),
    onSuccess: () => {
      toast.success('Account status updated')
      qc.invalidateQueries({ queryKey: adminUsersQueryKeys.root })
    },
  })
}
