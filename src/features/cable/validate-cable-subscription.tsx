"use client";

import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useValidateCable } from "@/queries/cable";
import { toast } from "sonner";

const providerMap: any = {
  dstv: { name: "DStv Nigeria" },
  gotv: { name: "GOtv Nigeria" },
  startimes: { name: "StarTimes Nigeria" },
};

export default function CableTVValidate({
  provider,
  onBack,
  onContinue,
}: {
  provider: string | null;
  onBack: () => void;
  onContinue: (data: any) => void;
}) {
  const data = providerMap[provider || "dstv"];

  const [smartCard, setSmartCard] = useState("");
  const [validatedCable, setValidatedCable] = useState<any>(null);

  const validateCableMutation = useValidateCable();

  const handleValidate = async () => {
    if (!provider || !smartCard) {
      toast.error("Please enter smartcard number");
      return;
    }

    try {
      const res = await validateCableMutation.mutateAsync({
        provider,
        smartcardNumber: smartCard,
      });

      console.log("VALIDATION RESPONSE:", res);

      if (res.status === "2000") {
        toast.success("Cable validated successfully");

        // setTimeout(() => {
        //   onContinue(smartCard);
        // }, 800);

        const customer = res.data?.[0];

        onContinue({
          smartCard,
          customerName: customer?.customerName || customer?.name,
          customerNumber: customer?.customerNumber,
          currentBouquet: customer?.currentBouquet,
          plans: res.plans,
        });

        return;
      }

      if (res.status === "4000") {
        toast.error("Check your provided details. This is incorrect.");

        return;
      }

      toast.error(res.description || "Validation failed");
    } catch (error: any) {
      console.log(error);

      toast.error("Cable validation failed");
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[28px] border border-[#f0eeee] bg-white p-5 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7]" />

              <p className="text-xs font-black text-[#9b95a3] tracking-widest mb-4">
                CURRENT PROVIDER
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f7f7f8] rounded-2xl flex items-center justify-center font-black">
                  TV
                </div>

                <div>
                  <p className="font-black text-[#171717]">{data.name}</p>

                  <p className="text-sm text-[#77777c]">Cable Television</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#f0eeee] bg-[#fff8fb] p-5">
              <p className="font-black text-[#171717] mb-2">
                Finding your ID
              </p>

              <p className="text-sm text-[#77777c] leading-relaxed">
                Your Smartcard or Decoder number is usually located on a sticker
                underneath your decoder or on the card itself.
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
                Decoder Details
              </p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-[#171717] mb-6">
                Smartcard / Decoder Number
              </h2>

              <div className="bg-[#f7f7f8] rounded-2xl p-3 mb-4">
                <Input
                  value={smartCard}
                  onChange={(e) => setSmartCard(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="bg-transparent border-none focus-visible:ring-0 h-10"
                />
              </div>

              <p className="text-sm text-[#77777c] mb-8">
                Ensure the decoder is powered on during validation.
              </p>

              <Button
                onClick={handleValidate}
                disabled={validateCableMutation.isPending}
                className="w-full h-14 text-base font-black bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 cursor-pointer rounded-full"
              >
                {validateCableMutation.isPending
                  ? "Validating..."
                  : "Validate Subscription"}
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs font-black tracking-[0.16em] text-[#9b95a3]">
                <span>SECURE TRANSACTION</span>
                <span>PCI-DSS COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
