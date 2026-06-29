"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import axios from "axios";
import {
  downloadTransactionReceipt,
  fetchTransactionByPaystackId,
} from "@/services/transactions.api";
import DashboardNav from "../dashboard-nav/dashboard-nav";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  const [providerName, setProviderName] = useState<string | null>(null);

  const reference = params.get("reference");

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [tx, setTx] = useState<any>(null);

  useEffect(() => {
    if (!reference) return;

    const verify = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}payments/verify/${reference}`,
        );

        setTx(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference]);

  useEffect(() => {
    const stored = localStorage.getItem("provider");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setProviderName(parsed.providerName || null);

        localStorage.removeItem("provider");
      } catch (e) {
        console.error("Failed to parse payment meta", e);
      }
    }
  }, []);

  // ✅ DOWNLOAD RECEIPT
  const handleDownload = async () => {
    try {
      setDownloading(true);

      // ✅ Paystack transaction id
      const paystackId = tx?.data?.id || tx?.id;

      if (!paystackId) {
        console.error("Paystack ID not found");
        return;
      }

      // ✅ Get transaction details using paystackId
      const transaction =
        await fetchTransactionByPaystackId(
          String(paystackId),
        );

      // ✅ Actual DB transaction id
      const transactionId = transaction?.id;

      if (!transactionId) {
        console.error(
          "Database transaction ID not found",
        );
        return;
      }

      // ✅ Download receipt using DB id
      const { blob, filename } =
        await downloadTransactionReceipt(
          String(transactionId),
        );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = filename;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Failed to download receipt",
        error,
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Verifying payment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center mt-0 px-4">
        {/* SUCCESS ICON */}
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle className="text-green-600 w-8 h-8" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Transaction Successful
        </h1>

        <p className="text-gray-500 text-center max-w-md mb-8">
          Please confirm the account information below
          is correct. This step prevents recharging the
          wrong smartcard or service provider.
        </p>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
          <p className="text-xs text-gray-400 mb-1">
            PLAN DETAILS
          </p>

          <h2 className="font-semibold text-lg mb-4">
            {tx?.type || "Service Payment"}
          </h2>

          <div className="flex justify-between mb-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs">
                PROVIDER
              </p>

              <p className="font-medium">
                {tx?.provider ||
                  providerName ||
                  "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">
                RECIPIENT
              </p>

              <p className="font-medium">
                {tx?.data?.id ||
                  tx?.id ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between text-sm">
            <div className="text-gray-500">
              {tx?.data?.createdAt
                ? new Date(
                    tx.data.createdAt,
                  ).toLocaleString()
                : "N/A"}
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs">
                TOTAL CHARGED
              </p>

              <p className="font-bold text-gray-800">
                ₦
                {Number(
                  tx?.data?.amount_naira ||
                    tx?.amount_naira ||
                    0,
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow disabled:opacity-50"
        >
          <Download className="w-4 h-4" />

          {downloading
            ? "Downloading..."
            : "Download Receipt"}
        </button>
      </div>
    </div>
  );
}