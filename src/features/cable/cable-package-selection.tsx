"use client";

import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useCablePlans, useInitiateCablePayment } from "@/queries/cable";
import { CablePlanDto } from "@/services/cable.service";
import { toast } from "sonner";

export default function CablePackageSelection({
  provider,
  smartCard,
  customerName,
  customerNumber,
  currentBouquet,
  verifiedPlans,
  onBack,
}: {
  provider: string;
  smartCard: string;
  customerName?: string;
  customerNumber?: string;
  currentBouquet?: string;
  verifiedPlans?: CablePlanDto[];
  onBack: () => void;
}) {
  const hasVerifiedPlans = Boolean(verifiedPlans?.length);
  const { data, isLoading } = useCablePlans(provider, !hasVerifiedPlans);

  const packages = hasVerifiedPlans ? verifiedPlans! : (data?.data ?? []);

  const [selected, setSelected] = useState<any>(null);

  const initiatePaymentMutation = useInitiateCablePayment();

  const formatPrice = (price: number | string) =>
    `₦${Number(price).toLocaleString()}.00`;

  const shouldScroll = packages.length > 6;

  /* ---------------- HANDLE PAYMENT ---------------- */

 const handlePayment = async () => {
  if (!selected) {
    toast.error("Please select a package");
    return;
  }

  try {
    const res = await initiatePaymentMutation.mutateAsync({
      
      provider,
      smartcardNumber: smartCard,
      amount: selected.price,
      productCode: selected.code, // from validate API
    });

    toast.success("Redirecting to payment...");

    window.location.href = res.authorization_url;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to initialize payment",
    );
  }
};

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-8 rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Cable Package
          </p>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl mb-2">
            Select Subscription Package
          </h1>

          <p className="text-[#77777c] text-sm">
            Choose your package to proceed with cable subscription
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <div className="rounded-[28px] border border-[#f0eeee] bg-white p-5 shadow-[0_18px_50px_rgba(23,23,23,0.04)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f7f7f8] rounded-2xl flex items-center justify-center font-black text-[#171717]">
                TV
              </div>

              <div>
                <p className="text-sm font-black text-[#9b95a3]">
                  Verified Subscriber
                </p>

                <p className="font-black text-[#171717]">User Details</p>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#77777c] text-sm">
                    Customer Name:
                  </span>

                  <span className="font-black text-right text-sm text-[#171717]">
                    {customerName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#77777c] text-sm">
                    Customer Number:
                  </span>

                  <span className="font-black text-right text-sm text-[#171717]">
                    {customerNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#77777c]">Provider</span>

                <span className="font-black text-[#171717]">{provider}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#77777c]">
                  Smart Card Number
                </span>

                <span className="font-black text-[#171717]">{smartCard}</span>
              </div>

              <div className="flex justify-between items-start gap-4">
                <span className="text-[#77777c]">
                  Current Bouquet
                </span>

                <span className="font-black text-right text-sm text-[#171717]">
                  {currentBouquet || "N/A"}
                </span>
              </div>
            </div>

            <button className="text-[#f45ca0] text-sm font-black hover:text-[#ee1c25]">
              Change Account Details
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2 space-y-6">
            {!hasVerifiedPlans && isLoading ? (
              <div className="rounded-[28px] border border-[#f0eeee] bg-white p-6 text-[#77777c] shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
                Loading packages...
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                    shouldScroll
                      ? "max-h-105 overflow-y-auto pr-2"
                      : ""
                  }`}
                >
                  {packages.map((pkg: any) => {
                    const isActive = selected?.code === pkg.code;

                    return (
                      <button
                        key={pkg.code}
                        onClick={() => setSelected(pkg)}
                        className={`relative overflow-hidden text-left p-5 rounded-3xl border transition bg-white ${
                          isActive
                            ? "border-[#f45ca0] bg-[#fff5fa] shadow-[0_20px_60px_rgba(244,92,160,0.13)]"
                            : "border-[#f0eeee] shadow-[0_14px_40px_rgba(23,23,23,0.04)] hover:-translate-y-1 hover:border-[#f45ca0]"
                        }`}
                      >
                        <div
                          aria-hidden
                          className={`absolute inset-x-0 top-0 h-1 ${
                            isActive
                              ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7]"
                              : "bg-transparent"
                          }`}
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-black text-[#171717]">
                              {pkg.name}
                            </p>

                            <p className="text-xs text-[#77777c]">
                              {pkg.monthsPaidFor} Month Subscription
                            </p>
                          </div>

                          <div
                            className={`w-4 h-4 rounded-full border ${
                              isActive
                                ? "bg-[#f45ca0] border-[#f45ca0]"
                                : "border-gray-300"
                            }`}
                          />
                        </div>

                        <p className="mt-4 text-lg font-black text-[#171717]">
                          {formatPrice(pkg.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-4 bg-white p-5 rounded-[28px] border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black tracking-[0.16em] text-[#9b95a3]">
                      TOTAL PAYABLE
                    </p>

                    <p className="text-xl font-black text-[#ee1c25]">
                      {selected
                        ? formatPrice(selected.price)
                        : "₦0.00"}
                    </p>
                  </div>

                  <button
                    disabled={
                      !selected ||
                      initiatePaymentMutation.isPending
                    }
                    onClick={handlePayment}
                    className="bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white px-6 py-3 rounded-full font-black disabled:opacity-50 cursor-pointer hover:opacity-95"
                  >
                    {initiatePaymentMutation.isPending
                      ? "Processing..."
                      : "Proceed to Payment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}