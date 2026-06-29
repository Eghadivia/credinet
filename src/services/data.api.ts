import axiosInstance from "@/lib/api/axios-instance";
import {
  DataPlanDto,
  DataTypesResponse,
  InitiateDataPayload,
  InitiateDataResponse,
} from "@/types/data.type";

function normalizeDataTypesResponse(raw: unknown): DataTypesResponse {
  const root = (raw ?? {}) as Record<string, unknown>;
  const payload =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? root
      : root;
  const inner = payload as Record<string, unknown>;
  const list = Array.isArray(inner.data) ? inner.data : [];

  const items = list.map((item) => {
    const row = item as Record<string, unknown>;
    const serviceId = String(row.serviceId ?? row.service_id ?? "");
    const dataType = String(row.dataType ?? row.data_type ?? "");
    const label = String(row.label ?? dataType);
    return {
      serviceId,
      dataType,
      label,
      networkName:
        typeof row.networkName === "string"
          ? row.networkName
          : typeof row.network_name === "string"
            ? row.network_name
            : undefined,
    };
  });

  return {
    requiresDataTypeSelection: Boolean(
      inner.requiresDataTypeSelection ?? items.length > 0,
    ),
    items: items.filter((item) => item.serviceId && item.dataType),
  };
}

export async function fetchDataTypes(provider: string): Promise<DataTypesResponse> {
  const res = await axiosInstance.get("/data/types", {
    params: { provider },
  });
  return normalizeDataTypesResponse(res.data);
}

export async function fetchDataPlans(provider: string, serviceId?: string) {
  const res = await axiosInstance.get("/data/plans", {
    params: { provider, serviceId },
  });

  return res.data.data as DataPlanDto[];
}

export async function initiateDataPayment(
  payload: InitiateDataPayload,
): Promise<InitiateDataResponse> {
  const { data } = await axiosInstance.post<InitiateDataResponse>("/data", payload);

  if (!data?.authorization_url) {
    throw new Error(data?.message || "Payment initialization failed");
  }

  return data;
}
