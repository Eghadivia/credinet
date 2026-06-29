import axiosInstance from "@/lib/api/axios-instance";

function getFilenameFromContentDisposition(headerValue?: string, fallback = "receipt.pdf") {
  if (!headerValue) return fallback;

  // Examples:
  // attachment; filename=receipt-ABC.pdf
  // attachment; filename="receipt-ABC.pdf"
  const match =
    /filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/i.exec(headerValue);
  const raw = decodeURIComponent((match?.[1] ?? match?.[2] ?? "").trim());
  return raw || fallback;
}

export async function downloadTransactionReceipt(id: string): Promise<{ blob: Blob; filename: string }> {
  const res = await axiosInstance.get(`/transactions/${id}/receipt`, {
    responseType: "blob",
    silent: true,
  });

  const filename = getFilenameFromContentDisposition(
    res.headers?.["content-disposition"],
    `receipt-${id}.pdf`,
  );

  const blob = res.data as Blob;
  return { blob, filename };
}

export type TransactionStatus = string;
export type TransactionType = string;

export type TransactionDto = {
  id: string;
  status?: TransactionStatus;
  type?: TransactionType;
  amount?: number;
  createdAt?: string;
  provider?: string | null;
  serviceType?: string | null;
  reference?: string | null;
  [key: string]: unknown;
};

export type GetTransactionsParams = {
  status?: string;
  type?: string;
  from?: string; // ISO date string
  to?: string; // ISO date string
};

/**
 * GET /transactions (auth required)
 */
export async function fetchUserTransactions(params: GetTransactionsParams = {}): Promise<TransactionDto[]> {
  const { data } = await axiosInstance.get<any>("/transactions", {
    params,
  });

  // Backend may return either:
  // - TransactionDto[]
  // - { success: true, data: TransactionDto[] }
  // - { data: TransactionDto[] }
  // - { transactions: TransactionDto[] }
  const maybeArray =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.transactions) ? data.transactions :
    Array.isArray(data?.result) ? data.result :
    [];

  return maybeArray as TransactionDto[];
}

/**
 * GET /transactions/:id (auth required)
 */
export async function fetchTransactionById(id: string): Promise<TransactionDto | null> {
  if (!id) return null;
  const { data } = await axiosInstance.get<any>(`/transactions/${id}`);

  // Backend may return TransactionDto or wrapper { data: TransactionDto }
  const tx = (data?.data ?? data) as TransactionDto | null | undefined;
  return tx ?? null;
}

export async function downloadAllTransactionReceipts(): Promise<{ blob: Blob; filename: string }> {
  const res = await axiosInstance.get(`/transactions/receipts/all`, {
    responseType: "blob",
    silent: true,
  });

  const filename = getFilenameFromContentDisposition(
    res.headers?.["content-disposition"],
    `transactions.pdf`,
  );

  return {
    blob: res.data as Blob,
    filename,
  };
}

/**
 * ✅ GET /transactions/paystack/:paystackId
 */
export async function fetchTransactionByPaystackId(
  paystackId: string,
): Promise<TransactionDto | null> {
  if (!paystackId) return null;

  const { data } = await axiosInstance.get<any>(
    `/transactions/paystack/${paystackId}`,
  );

  const tx = (data?.data ?? data) as
    | TransactionDto
    | null
    | undefined;

  return tx ?? null;
}

