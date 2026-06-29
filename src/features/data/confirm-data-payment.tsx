"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NetworkProvider } from "@/types/airtime";
import { SelectedDataPlan } from "@/types/data.type";


function formatMoney(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function ConfirmDataPayment({
  selectedProvider,
  phoneNumber,
  selectedPlan,
  serviceFee = 0,
  onConfirm,
  onEditDetails,
  isLoading = false,
}: {
  selectedProvider: NetworkProvider;
  phoneNumber: string;
  selectedPlan: SelectedDataPlan;
  serviceFee?: number;
  onConfirm: () => void;
  onEditDetails: () => void;
  isLoading?: boolean;
}) {
  const total = selectedPlan.price + serviceFee;

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        <div className="bg-[#fff8fb] px-6 py-5 border-b border-[#f0eeee]">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl">
                <Image
                  src={"/network-logo.png"}
                  alt={selectedProvider.name}
                  width={20}
                  height={19}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-[10.5px] font-black tracking-[0.14em] text-[#9b95a3] uppercase">
                  Service Type
                </p>
                <p className="font-black text-[#171717] text-base">Data Bundle</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10.5px] font-black tracking-[0.14em] text-[#9b95a3] uppercase">
                Provider
              </p>
              <p className="font-black text-[#171717] text-base">
                {selectedProvider.name}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10.5px] font-black tracking-[0.14em] text-[#9b95a3] uppercase">
                Recipient
              </p>
              <p className="font-black text-[#171717] text-sm mt-1">
                {phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-black tracking-[0.14em] text-[#9b95a3] uppercase">
                Selected Plan
              </p>
              <p className="font-black text-[#171717] text-sm mt-1">
                {selectedPlan.size} {selectedPlan.validity} Data
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6">
          <div className="bg-white rounded-[28px] border border-[#f0eeee] p-6">
            <p className="text-xs font-black text-[#171717] uppercase tracking-wide">
              Financial Breakdown
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between text-gray-700">
                <span>Plan Amount</span>
                <span className="font-medium text-gray-900">
                  {formatMoney(selectedPlan.price)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Service Fee</span>
                <span className="font-medium text-gray-900">
                  {formatMoney(serviceFee)}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-black text-[#171717]">Total Amount Payable</p>
                <p className="text-[11px] text-gray-500">
                  Inclusive of all taxes
                </p>
              </div>
              <div className="text-3xl font-black text-[#ee1c25]">
                {formatMoney(total)}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#f7f7f8] border border-[#f0eeee] p-4">
              <div className="mt-0.5 text-[#ee1c25]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[12px] leading-5 text-gray-600">
                Your payment is secured. This transaction is protected by our 100%
                security guarantee.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white font-black cursor-pointer"
            >
              Confirm &amp; Pay
            </Button>

            <button
              type="button"
              onClick={onEditDetails}
              className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 cursor-pointer"
            >
              Edit Transaction Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

