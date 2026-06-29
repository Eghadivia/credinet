"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { NetworkProvider } from "@/types/airtime";
import { useDataPlans } from "@/queries/data";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPlanCardSkeleton } from "./skelton-card-loading/skelton-card-loading";
import { DataPlanDto, SelectedDataPlan } from "@/types/data.type";

/* ---------------- HELPERS ---------------- */

function extractSize(text: string) {
  const match = text.match(/(\d+(\.\d+)?\s?(GB|MB|TB))/i);
  return match ? match[0].toUpperCase() : text;
}

function extractValidity(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("daily")) return "1 Day";
  if (lower.includes("weekly")) return "7 Days";
  if (lower.includes("monthly")) return "30 Days";

  const match = text.match(/(\d+)[-\s]?(day|days|month|months)/i);
  if (match) return match[0];

  return "N/A";
}



/* ---------------- COMPONENT ---------------- */

export default function SelectDataBundle({
  selectedProvider,
  serviceId,
  dataTypeLabel,
  requiresServiceId = false,
  onChangeProvider,
  onContinue,
}: {
  selectedProvider: NetworkProvider;
  serviceId?: string;
  dataTypeLabel?: string;
  requiresServiceId?: boolean;
  onChangeProvider: () => void;
  onContinue: (selectedPlan: SelectedDataPlan) => void;
}) {
  const plansEnabled = !requiresServiceId || !!serviceId;
  const { data: plans = [], isLoading } = useDataPlans(
    selectedProvider.id,
    serviceId,
    plansEnabled,
  );

  // ✅ store FULL object
  const [selectedPlan, setSelectedPlan] = useState<DataPlanDto | null>(null);

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  /* ---------------- LOADING ---------------- */

 if (isLoading) {
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        {/* Header skeleton */}
        <div className="bg-[#fff8fb] px-5 py-4 flex items-center justify-between border-b border-[#f0eeee]">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-3 w-28 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="p-6">
          {/* Title */}
          <Skeleton className="h-8 w-64 mb-3" />
          <Skeleton className="h-4 w-80 mb-6" />

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <DataPlanCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

  /* ---------------- HELPER: GET CORRECT VALUE ---------------- */

  const getPlanValue = (plan: DataPlanDto) => {
    const provider = selectedProvider.name.toLowerCase();

    if (provider.includes("mtn")) return plan.tarrifTypeId;
    if (provider.includes("airtel")) return plan.planId;
    if (provider.includes("glo")) return plan.planId;
    if (provider.includes("9mobile")) return String(plan.id);

    return null;
  };

 

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-4xl border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        {/* -------- Provider Header -------- */}
        <div className="bg-[#fff8fb] px-5 py-4 flex items-center justify-between border-b border-[#f0eeee]">
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
                Network Provider
              </p>
              <p className="font-black text-[#171717] text-base">
                {selectedProvider.name}
              </p>
            </div>
          </div>

          <button
            onClick={onChangeProvider}
            className="text-[#f45ca0] text-sm font-black hover:text-[#ee1c25]"
          >
            Change
          </button>
        </div>

        <main className="p-6">
          {/* -------- Title -------- */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
              Data Plans
            </p>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl mb-2">
              Select Data Bundle
            </h1>
            <p className="text-base text-[#77777c] mt-3">
              {dataTypeLabel
                ? `Choose a ${dataTypeLabel} bundle to proceed with data purchase.`
                : "Choose a bundle to proceed with data purchase."}
            </p>
          </div>

          {/* -------- Plans Grid -------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const isSelected = String(selectedPlan?.id) === String(plan.id);

              const name = `${selectedProvider.name} Data Plan`;
              const size = extractSize(plan.name);
              const validity = extractValidity(
                plan.name + " " + (plan.description || ""),
              );
              const price = Number(plan.price);

              return (
                <Card
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all border bg-white ${
                    isSelected
                      ? "border-[#f45ca0] bg-[#fff5fa] shadow-[0_20px_60px_rgba(244,92,160,0.13)]"
                      : "border-[#f0eeee] shadow-[0_14px_40px_rgba(23,23,23,0.04)] hover:-translate-y-1 hover:border-[#f45ca0]"
                  }`}
                >
                  <div
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-1 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7]"
                        : "bg-transparent"
                    }`}
                  />
                  <div className="flex items-start justify-between">
                    <p className="text-base font-black text-[#171717]">
                      {name}
                    </p>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "border-[#f45ca0] bg-[#f45ca0]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <p className="text-4xl font-black text-[#171717] mt-3">
                    {size}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Validity: {validity}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-lg font-black text-[#171717]">
                      {formatPrice(price)}
                    </p>

                    {isSelected ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();

                          const planValue = getPlanValue(plan);

                          // ✅ store correct value
                          localStorage.setItem(
                            "provider",
                            JSON.stringify({
                              providerId: selectedProvider.id,
                              providerName: selectedProvider.name,
                              planValue, // 🔥 correct field for API
                              rawPlan: plan, // optional debug
                              planSize: size,
                              amount: price,
                            }),
                          );

                          onContinue({
                            id: String(planValue), // 🔥 important
                            name,
                            size,
                            validity,
                            price,
                          });
                        }}
                        className="bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white rounded-full px-4 py-1 text-xs font-black cursor-pointer"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Info className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
