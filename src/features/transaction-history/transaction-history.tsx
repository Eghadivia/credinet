"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import {
  downloadAllTransactionReceipts,
  downloadTransactionReceipt,
  fetchTransactionById,
  fetchUserTransactions,
  type TransactionDto,
} from "@/services/transactions.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TableSkeletonRow } from "@/components/global/skelton-loading/skelton";

interface Transaction {
  id: string;
  serviceType: string;
  provider: string;
  recipientDetails: string;
  amount: number;
  dateTime: string;
  status: "success" | "pending" | "failed" | "refunded";
  icon: string;
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d);
}

function normalizeStatus(s?: string): Transaction["status"] {
  const v = (s ?? "").toLowerCase();
  if (v.includes("success")) return "success";
  if (v.includes("fail") || v.includes("error")) return "failed";
  if (v.includes("refund")) return "refunded";
  if (v.includes("pend")) return "pending";
  // fallback
  return "pending";
}

function iconForType(type?: string) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("airtime")) return "📱";
  if (t.includes("electric")) return "⚡";
  if (t.includes("cable") || t.includes("tv")) return "📺";
  if (t.includes("data")) return "🌐";
  return "🧾";
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

function titleCase(value: string) {
  return value
    .trim()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickRecipient(dto: TransactionDto) {
  const anyDto = dto as Record<string, unknown>;
  const phone = (anyDto.phone ?? anyDto.recipientPhone ?? anyDto.msisdn) as
    | string
    | undefined;
  const meter = (anyDto.meterNumber ?? anyDto.accountNumber) as
    | string
    | undefined;
  const smartcard = (anyDto.smartcardNumber ?? anyDto.cardNumber) as
    | string
    | undefined;
  const reference = (anyDto.reference ?? anyDto.txRef) as string | undefined;

  if (phone) return String(phone);
  if (meter) return `Meter ${String(meter)}`;
  if (smartcard) return `Smartcard ${String(smartcard)}`;
  if (reference) return String(reference);
  return "—";
}

function mapTransaction(dto: TransactionDto): Transaction {
  const type =
    (dto.type as string | undefined) ??
    (dto.serviceType as string | undefined) ??
    "transaction";
  const provider =
    (dto.provider as string | undefined) ??
    (dto.serviceType as string | undefined) ??
    "—";
  const amount =
    typeof dto.amount === "number" ? dto.amount : Number(dto.amount ?? 0);

  return {
    id: String(dto.id),
    serviceType: titleCase(type),
    provider: titleCase(String(provider)),
    recipientDetails: pickRecipient(dto),
    amount: Number.isFinite(amount) ? amount : 0,
    dateTime: formatDateTime(dto.createdAt as string | undefined),
    status: normalizeStatus(dto.status as string | undefined),
    icon: iconForType(type),
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "failed":
      return "bg-rose-100 text-rose-700";
    case "refunded":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function getPageItems(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: Array<number | "..."> = [];
  const add = (v: number | "...") => {
    if (items[items.length - 1] === v) return;
    items.push(v);
  };

  add(1);
  if (current > 3) add("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  )
    add(p);
  if (current < total - 2) add("...");
  add(total);
  return items;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] = useState<TransactionDto | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const typeMap: Record<string, string> = {
    airtime: "AIRTIME",
    data: "DATA",
    electricity: "ELECTRICITY",
    cable: "CABLE",
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {};
        if (filterStatus !== "all") params.status = filterStatus.toUpperCase();      
        if (filterType !== "all") {
          params.type = typeMap[filterType];
        }
        if (fromDate && toDate) {         
          params.from = new Date(fromDate).toISOString();
          params.to = new Date(toDate).toISOString();
        }

        const data = await fetchUserTransactions(params);
        if (cancelled) return;
        setRows(data.map(mapTransaction));
        setPage(1);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Failed to load transactions",
        );
        setRows([]);
        setPage(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [filterStatus, filterType, fromDate, toDate]);

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((tx) => {
      return (
        tx.serviceType.toLowerCase().includes(q) ||
        tx.provider.toLowerCase().includes(q) ||
        tx.recipientDetails.toLowerCase().includes(q)
      );
    });
  }, [rows, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  }, [filteredTransactions.length]);

  const currentPage = Math.min(page, totalPages);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    if (!detailsOpen || !detailsId) return;
    let cancelled = false;

    const run = async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      setDetails(null);
      try {
        const tx = await fetchTransactionById(detailsId);
        if (cancelled) return;
        setDetails(tx);
      } catch (e) {
        if (cancelled) return;
        setDetailsError(
          e instanceof Error ? e.message : "Failed to load transaction",
        );
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [detailsOpen, detailsId]);

 

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-10 xl:px-12 py-8">
        <div className="flex items-start justify-between gap-4 rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
              Ledger
            </p>
            <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
              Transaction History
            </h1>
            <p className="mt-3 text-[#77777c] text-sm">
              Review and manage your financial interactions across the ledger.
            </p>
          </div>

          <button
            type="button"
            disabled={
              loading ||
              Boolean(error) ||
              filteredTransactions.length === 0 ||
              exportingAll
            }
            className={[
              "inline-flex items-center gap-2 rounded-xl cursor-pointer font-semibold px-5 py-3 shadow-sm transition",
              loading ||
              Boolean(error) ||
              filteredTransactions.length === 0 ||
              exportingAll
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white",
            ].join(" ")}
            onClick={async () => {
              if (exportingAll) return;

              setExportingAll(true);
              try {
                const { blob, filename } =
                  await downloadAllTransactionReceipts();
                triggerBrowserDownload(blob, filename);
                toast.success("Report downloaded successfully.");
              } catch (e) {
                toast.error(
                  e instanceof Error ? e.message : "Failed to download report",
                );
              } finally {
                setExportingAll(false);
              }
            }}
          >
            <Download className="h-4 w-4" />
            {exportingAll ? "Preparing…" : "Export Report"}
          </button>
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by recipient or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-2xl pl-11 bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
              />
            </div>

            <div className="md:col-span-3 relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-12 rounded-2xl pl-10 bg-[#f7f7f8] border border-transparent"
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2 relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl bg-[#f7f7f8] border border-transparent px-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#ff5a57]"
              >
                <option value="all">Service Type</option>
                <option value="airtime">Airtime</option>
                <option value="electricity">Electricity</option>
                <option value="data">Data</option>
                <option value="cable">Cable TV</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <div className="md:col-span-2 relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl bg-[#f7f7f8] border border-transparent px-4 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#ff5a57]"
              >
                <option value="all">Status</option>
                <option value="success">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f7f8] border-b border-[#f0eeee] text-[11px] uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 text-left font-semibold">
                    Service Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Recipient Details
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Date &amp; Time
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
               {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableSkeletonRow key={i} />
                ))}
              </>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-rose-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 grid place-items-center">
                            <span className="text-lg">{transaction.icon}</span>
                          </div>
                          <div className="font-semibold text-slate-900">
                            {transaction.serviceType}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {transaction.provider}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {transaction.recipientDetails}
                      </td>

                      <td className="px-6 py-5 text-sm font-extrabold text-slate-900">
                        {formatNaira(transaction.amount)}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        <span
                          className={[
                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold",
                            getStatusColor(transaction.status),
                          ].join(" ")}
                        >
                          {transaction.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600 whitespace-nowrap">
                        {transaction.dateTime}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-slate-500 cursor-pointer hover:text-slate-900"
                            aria-label="View"
                            onClick={() => {
                              setDetailsId(transaction.id);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-[#F84B44] cursor-pointer hover:opacity-90"
                            aria-label="Download"
                            disabled={downloadingId === transaction.id}
                            onClick={async () => {
                              if (downloadingId) return;
                              setDownloadingId(transaction.id);
                              try {
                                const { blob, filename } =
                                  await downloadTransactionReceipt(
                                    transaction.id,
                                  );
                                triggerBrowserDownload(blob, filename);
                              } catch (e) {
                                toast.error(
                                  e instanceof Error
                                    ? e.message
                                    : "Failed to download receipt",
                                );
                              } finally {
                                setDownloadingId(null);
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No transactions found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && filteredTransactions.length > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 bg-slate-50/60 border-t border-slate-200/60">
              <div className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    currentPage * pageSize,
                    filteredTransactions.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredTransactions.length}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageItems(currentPage, totalPages).map((item, idx) =>
                  item === "..." ? (
                    <div
                      key={`ellipsis-${idx}`}
                      className="h-9 px-2 grid place-items-center text-slate-400"
                    >
                      …
                    </div>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={[
                        "h-9 w-9 rounded-lg text-sm font-semibold",
                        item === currentPage
                          ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                      aria-current={item === currentPage ? "page" : undefined}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Dialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setDetailsId(null);
            setDetails(null);
            setDetailsError(null);
            setDetailsLoading(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-3xl border border-[#f0eeee]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Transaction details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              View full information about this transaction.
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="py-10 text-center text-slate-500">Loading…</div>
          ) : detailsError ? (
            <div className="py-6">
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm font-medium">
                {detailsError}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!detailsId) return;                  
                    setDetailsOpen(false);
                    setTimeout(() => setDetailsOpen(true), 0);
                  }}
                >
                  Try again
                </Button>
              </div>
            </div>
          ) : details ? (
            <div className="space-y-5">
              {(() => {
                const anyTx = details as Record<string, unknown>;
                const phone =
                  (anyTx.phone as string | undefined) ??
                  (anyTx.recipientPhone as string | undefined) ??
                  (anyTx.msisdn as string | undefined);
                const meterNumber =
                  (anyTx.meterNumber as string | undefined) ??
                  (anyTx.accountNumber as string | undefined);
                const provider =
                  (details.provider as string | undefined) ??
                  (details.serviceType as string | undefined) ??
                  (details.type as string | undefined);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Status
                      </div>
                      <div className="mt-2">
                        <span
                          className={[
                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold",
                            getStatusColor(
                              normalizeStatus(
                                details.status as string | undefined,
                              ),
                            ),
                          ].join(" ")}
                        >
                          {normalizeStatus(
                            details.status as string | undefined,
                          ).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Amount
                      </div>
                      <div className="mt-2 text-lg font-extrabold text-slate-900">
                        {formatNaira(Number(details.amount ?? 0))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Provider
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {provider ? titleCase(String(provider)) : "—"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Service Type
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {titleCase(
                          String(
                            (details.type as string | undefined) ??
                              (details.serviceType as string | undefined) ??
                              "—",
                          ),
                        )}
                      </div>
                    </div>

                    {phone ? (
                      <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400">
                          Phone Number
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900 break-all">
                         +234 {String(phone)}
                        </div>
                      </div>
                    ) : null}

                    {meterNumber ? (
                      <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400">
                          Meter Number
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900 break-all">
                          {String(meterNumber)}
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Date &amp; Time
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {formatDateTime(
                          details.createdAt as string | undefined,
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        Reference
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 break-all">
                        {String(
                          (details.reference as string | undefined) ?? "—",
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500">
              No transaction found.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
