import { fetchDataPlans, fetchDataTypes } from "@/services/data.api";
import { useQuery } from "@tanstack/react-query";

export function useDataTypes(provider?: string) {
  return useQuery({
    queryKey: ["data-types", provider],
    queryFn: () => fetchDataTypes(provider!),
    enabled: !!provider,
  });
}

export function useDataPlans(
  provider?: string,
  serviceId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["data-plans", provider, serviceId ?? null],
    queryFn: () => fetchDataPlans(provider!, serviceId),
    enabled: !!provider && enabled,
  });
}
