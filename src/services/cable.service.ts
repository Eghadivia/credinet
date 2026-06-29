import axiosInstance from "@/lib/api/axios-instance";

/* ---------------- TYPES ---------------- */

export type CablePlanDto = {
  code: string;
  name: string;
  price: number;
  monthsPaidFor: number;
};

export type CablePlansResponse = {
  status: string;
  description: string;
  data: CablePlanDto[];
};

export type ValidateCablePayload = {
  provider: string;
  smartcardNumber: string;
};

export type ValidateCableResponse = {
  status: string;
  description: string;
  data: Array<{
    id: number;
    price: number;
    code: string | null;
    name: string;
    customerName: string;
    customerNumber: string | null;
    serviceType: string;
    accountNumber: string;
    currentBouquet: string | null;
  }>;
  plans?: CablePlanDto[];
};

/* ---------------- FETCH PLANS ---------------- */

export async function fetchCablePlans(provider: string) {
  if (!provider) return { data: [] }; // ✅ prevent undefined

  const res = await axiosInstance.get<CablePlansResponse>(
    `/cable/billers/${provider}`,
  );

  // ✅ ALWAYS return something
  return res?.data ?? { data: [] };
}

/* ---------------- VALIDATE CABLE ---------------- */

export async function validateCable(
  payload: ValidateCablePayload,
): Promise<ValidateCableResponse> {
  const { data } = await axiosInstance.post<ValidateCableResponse>(
    "/cable/validate",
    payload,
  );

  return data;
}
/* ---------------- INITIATE PAYMENT ---------------- */

export type InitiateCablePayload = {
  provider: string;
  smartcardNumber: string;
  amount: number;
  productCode: string;
};
export type InitiateCableResponse = {
  message: string;
  authorization_url: string;
  reference: string;
};

export async function initiateCablePayment(
  payload: InitiateCablePayload,
): Promise<InitiateCableResponse> {
  const { data } = await axiosInstance.post<InitiateCableResponse>(
    "/cable",
    payload,
  );

  if (!data?.authorization_url) {
    throw new Error(data?.message || "Cable payment initialization failed");
  }

  return data;
}
