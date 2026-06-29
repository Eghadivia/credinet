"use client";

import { TableSkeletonRow } from "@/components/global/skelton-loading/skelton";
import { useState } from "react";

interface Transaction {
  id: string;
  serviceType: string;
  provider: string;
  amount: number;
  dateTime: string;
  status: string; // 👈 allow raw string from API
  icon: React.ReactNode;
}

interface Props {
  transactions?: Transaction[]; // 👈 prevent map crash
  loading?: boolean;
}

// ✅ SAME LOGIC as HistoryPage
function normalizeStatus(s?: string) {
  const v = (s ?? "").toLowerCase().trim();

  if (v.includes("success")) return "SUCCESSFUL";
  if (v.includes("fail") || v.includes("error")) return "FAILED";
  if (v.includes("refund")) return "REFUNDED";
  if (v.includes("pend")) return "PENDING";

  return "PENDING";
}

function formatDateTime(date?: string) {
  if (!date) return "—";

  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export default function TransactionTable({ transactions = [] , loading = false,}: Props) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Service
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Provider
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ LOADING STATE */}
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableSkeletonRow key={i} />
                ))}
              </>
            ) : transactions.length > 0 ? (
              /* ✅ DATA STATE */
              transactions.map((tx) => {
                const status = normalizeStatus(tx.status);

                return (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 flex items-center gap-3">
                      {tx.icon}
                      <span className="font-medium">{tx.serviceType}</span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">{tx.provider}</td>

                    <td className="px-4 py-4 font-semibold">₦{tx.amount}</td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDateTime(tx.dateTime)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* ✅ EMPTY STATE */
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Transaction Details</h2>
              <button onClick={() => setSelectedTx(null)}>✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <Detail label="Service" value={selectedTx.serviceType} />
              <Detail label="Provider" value={selectedTx.provider} />
              <Detail label="Amount" value={`₦${selectedTx.amount}`} />
              <Detail
                label="Date"
                value={formatDateTime(selectedTx.dateTime)}
              />

              {/* ✅ FIXED MODAL STATUS */}
              <Detail
                label="Status"
                value={normalizeStatus(selectedTx.status)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
