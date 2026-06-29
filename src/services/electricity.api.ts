import axiosInstance from "@/lib/api/axios-instance";
import axios from "axios";

export type ElectricityBillerDto = {
  name: string;
  serviceType: string;
  billerId: number;
  productId: number;
};

type ElectricityBillersResponse = {
  status: string;
  description: string;
  data: ElectricityBillerDto[];
};

/**
 * GET /electricity/billers — uses NEXT_PUBLIC_API_URL as base (e.g. http://localhost:3130).
 */
export async function fetchElectricityBillers(): Promise<ElectricityBillerDto[]> {
  try {
    const { data } =
      await axiosInstance.get<ElectricityBillersResponse>("/electricity/billers");

    if (data.status !== "2000" || !Array.isArray(data.data)) {
      throw new Error(data.description || "Failed to load electricity providers");
    }

    return data.data;
  } catch (err: unknown) {
    // TopupBox/backend may return `{ statusCode: 500, message: "Internal server error" }`
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const serverMessage =
        (err.response?.data as any)?.message ||
        (err.response?.data as any)?.error ||
        (err.response?.data as any)?.description;

      if (status && status >= 500) {
        throw new Error(
          "We can’t load electricity providers right now (server error). Please try again in a moment.",
        );
      }

      if (typeof serverMessage === "string" && serverMessage.trim()) {
        throw new Error(serverMessage);
      }
    }

    throw err instanceof Error ? err : new Error("Failed to load providers");
  }
}

export type ValidateMeterPayload = {
  serviceType: string;
  meterNumber: string;
  meterType: "prepaid" | "postpaid";
};

/** Single row returned from POST /electricity/validate (API field names preserved). */
export type ValidateMeterAccountDto = {
  id: number;
  price: number;
  balance: number;
  hasDiscount: boolean;
  code: string | null;
  name: string | null;
  cusAccType: string | null;
  customerName: string | null;
  serviceType: string;
  description: string | null;
  accountNumber: string | null;
  accountStatus: string | null;
  customerNumber: string | null;
  csutomerType: string | null;
  currentBouquet: string | null;
};

type ValidateMeterResponse = {
  status: string;
  description: string;
  data: ValidateMeterAccountDto[];
};

/**
 * POST /electricity/validate
 */
export async function validateElectricityMeter(
  payload: ValidateMeterPayload,
): Promise<ValidateMeterAccountDto> {
  const { data } = await axiosInstance.post<ValidateMeterResponse>("/electricity/validate", payload);

  if (data.status !== "2000" || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error(data.description || "Meter validation failed");
  }

  return data.data[0];
}

export type InitiateElectricityPaymentPayload = {
  serviceType: string;
  meterNumber: string;
  amount: number;
};

export type InitiateElectricityPaymentResponse = {
  message: string;
  authorization_url: string;
  reference: string;
};

/**
 * POST /electricity
 */
export async function initiateElectricityPayment(
  payload: InitiateElectricityPaymentPayload,
): Promise<InitiateElectricityPaymentResponse> {
  const { data } = await axiosInstance.post<InitiateElectricityPaymentResponse>("/electricity", payload);

  if (!data?.authorization_url) {
    throw new Error(data?.message || "Payment initialization failed");
  }

  return data;
}
