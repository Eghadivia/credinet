import axiosInstance from "@/lib/api/axios-instance";

export type InitiateAirtimePayload = {
  provider: string;
  phone: string;
  amount: number;
  planId?: string;
};

export type InitiateAirtimeResponse = {
  message: string;
  paymentUrl: string;
  reference: string;
};

/**
 * POST /airtime
 */
export async function initiateAirtimePayment(
  payload: InitiateAirtimePayload,
): Promise<InitiateAirtimeResponse> {
  const { data } = await axiosInstance.post<InitiateAirtimeResponse>("/airtime", payload);

  if (!data?.paymentUrl) {
    throw new Error(data?.message || "Payment initialization failed");
  }

  return data;
}

