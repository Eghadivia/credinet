// hooks/use-transactions.ts
import { fetchUserTransactions } from '@/services/transactions.api';
import { useQuery } from '@tanstack/react-query';

export function useTransactions(params = {}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchUserTransactions(params),
  });
}