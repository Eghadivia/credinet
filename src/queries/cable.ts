import { fetchCablePlans, initiateCablePayment, validateCable } from "@/services/cable.service";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useCablePlans(provider?: string, enabled = true) {
  return useQuery({
    queryKey: ["cable-plans", provider],
    queryFn: () => fetchCablePlans(provider!),
    enabled: !!provider && enabled,
  });
}


/* ---------------- VALIDATE ---------------- */

export function useValidateCable() {
  return useMutation({
    mutationFn: validateCable,
  });
}


export function useInitiateCablePayment() {
  return useMutation({
    mutationFn: initiateCablePayment,
  });
}