"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getElectricityProviderById } from "@/features/electricity/select-electricity-provider";
import type { MeterValidationResult } from "@/features/electricity/meter-validated";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export default function EnterPaymentAmount({
  result,
  amount,
  onAmountChange,
  onContinue,
  paying,
}: {
  result: MeterValidationResult;
  amount: number | null;
  onAmountChange: (amount: number | null) => void;
  onContinue: () => void;
  paying?: boolean;
}) {
  const provider = getElectricityProviderById(result.providerId);
  const fee = 0;
  const total = useMemo(() => {
    if (!amount) return null;
    return amount + fee;
  }, [amount]);

  const quickAmounts = [1000, 5000, 10000, 20000];
  const isQuickSelected = (v: number) => amount === v;

  return (
    <div className="w-full py-2 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        {/* Left */}
        <div className="rounded-[32px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] p-6 sm:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Payment Amount
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#171717]">
            Enter Payment Amount
          </h2>
          <p className="mt-2 text-sm text-[#77777c]">
            Specify how much you would like to recharge your meter with.
          </p>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Amount to Recharge
            </label>
            <Input
              value={amount === null ? "" : String(amount)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                onAmountChange(raw ? Number(raw) : null);
              }}
              placeholder="0.00"
              className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent shadow-sm focus-visible:ring-0 focus-visible:border-[#f45ca0]"
              inputMode="numeric"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {quickAmounts.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onAmountChange(v)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-black transition border",
                  isQuickSelected(v)
                    ? "bg-[#fff5fa] text-[#ee1c25] border-[#f45ca0]"
                    : "bg-white text-[#55555d] border-[#f0eeee] hover:border-[#f45ca0]",
                ].join(" ")}
              >
                ₦{v.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onAmountChange(null)}
              className="px-4 py-2 rounded-full text-sm font-black transition border bg-white text-[#55555d] border-[#f0eeee] hover:border-[#f45ca0]"
            >
              Custom
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#f7f7f8] ring-1 ring-[#f0eeee] grid place-items-center overflow-hidden">
                {provider?.logoSrc ? (
                  <Image
                    src={provider.logoSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="h-11 w-11 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#132033] via-[#1b2b42] to-[#273b57] text-white text-[11px] font-black grid place-items-center">
                    {provider?.shortName?.slice(0, 3) ?? "ELC"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-[#171717] truncate">
                  {provider ? provider.name : "Electricity"}
                </div>
                <div className="text-xs text-[#77777c] truncate">
                  {provider?.shortName
                    ? `${provider.shortName} Post-Paid/Pre-Paid`
                    : "Post-Paid/Pre-Paid"}
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-[#f0eeee]" />

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
                  Customer Name
                </div>
                <div className="font-black text-[#171717]">
                  {result.customerName}
                </div>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
                  Meter Number
                </div>
                <div className="font-black text-[#171717]">
                  {result.meterNumber}
                </div>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
                  Service Address
                </div>
                <div className="font-black text-[#171717] text-right">
                  {result.serviceAddress ?? "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="text-sm font-black text-[#55555d]">
                Total Payment
              </div>
              <div className="text-xl font-black text-[#ee1c25]">
                {total ? formatNaira(total) : "—"}
              </div>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 text-right">
              * Includes ₦{fee.toLocaleString()}.00 service fee
            </div>

            <Button
              type="button"
              onClick={() => {
                // ✅ SAVE TO LOCAL STORAGE
                if (provider) {
                  localStorage.setItem(
                    "provider",
                    JSON.stringify({
                      providerId: provider.id,
                      providerName: provider.name,
                      providerShortName: provider.shortName,
                    }),
                  );
                }

                onContinue();
              }}
              disabled={!amount || amount <= 0 || paying}
              className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white font-black shadow-sm inline-flex items-center justify-center gap-2"
            >
              {paying ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin shrink-0"
                    aria-hidden
                  />
                  Redirecting…
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              Payment secured by 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
