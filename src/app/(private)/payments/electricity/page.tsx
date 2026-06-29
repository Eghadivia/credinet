"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import SelectElectricityProvider, {
  type ElectricityProvider,
} from "@/features/electricity/select-electricity-provider";
import EnterMeterDetails, { MeterType } from "@/features/electricity/enter-meter-details";
import MeterValidated, {
  MeterValidationResult,
  meterAccountToValidationResult,
} from "@/features/electricity/meter-validated";
import EnterPaymentAmount from "@/features/electricity/enter-payment-amount";
import { initiateElectricityPayment, validateElectricityMeter } from "@/services/electricity.api";

type ElectricityStep = "provider" | "meter-details" | "validate-meter" | "amount";

export default function ElectricityPaymentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ElectricityStep>("provider");
  const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState<MeterType | undefined>(undefined);
  const [validationResult, setValidationResult] = useState<MeterValidationResult | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [validatingMeter, setValidatingMeter] = useState(false);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  const handleSelectProvider = (provider: ElectricityProvider) => {
    setSelectedProvider(provider);
    setCurrentStep("meter-details");
  };

  const validateMeter = async () => {
    if (!selectedProvider || !meterType) return;
    const trimmed = meterNumber.trim();
    if (!trimmed) return;

    setValidatingMeter(true);
    try {
      const account = await validateElectricityMeter({
        serviceType: selectedProvider.serviceType,
        meterNumber: trimmed,
        meterType,
      });
      setValidationResult(meterAccountToValidationResult(account, selectedProvider.id));
      setCurrentStep("validate-meter");
    } finally {
      setValidatingMeter(false);
    }
  };

  const resetToMeterDetails = () => {
    setValidationResult(null);
    setCurrentStep("meter-details");
  };

  const goBackOneStep = () => {
    if (currentStep === "amount") {
      setCurrentStep("validate-meter");
      return;
    }
    if (currentStep === "validate-meter") {
      setCurrentStep("meter-details");
      return;
    }
    if (currentStep === "meter-details") {
      setCurrentStep("provider");
      return;
    }
    router.push("/payments");
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(244,92,160,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === "provider" ? (
          <Link
            href="/payments"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        ) : (
          <button
            type="button"
            onClick={goBackOneStep}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="w-full">
          {currentStep === "provider" && (
            <SelectElectricityProvider
              selectedProviderId={selectedProvider?.id}
              onSelect={handleSelectProvider}
            />
          
          )}

          {currentStep === "meter-details" && (
            <EnterMeterDetails
              providerId={selectedProvider?.id}
              meterNumber={meterNumber}
              onMeterNumberChange={setMeterNumber}
              meterType={meterType}
              onMeterTypeChange={setMeterType}
              onChangeProvider={() => setCurrentStep("provider")}
              onValidate={validateMeter}
              validating={validatingMeter}
            />
          )}

          {currentStep === "validate-meter" && validationResult && (
            <MeterValidated
              result={validationResult}
              onReEnterMeter={resetToMeterDetails}
              onProceed={() => setCurrentStep("amount")}
            />
          )}

          {currentStep === "amount" && validationResult && (
            <EnterPaymentAmount
              result={validationResult}
              amount={amount}
              onAmountChange={setAmount}
              paying={initiatingPayment}
              onContinue={async () => {
                if (initiatingPayment) return;
                if (!validationResult?.serviceType) return;
                if (!validationResult?.meterNumber) return;
                if (!amount || amount <= 0) return;

                setInitiatingPayment(true);
                try {
                  const res = await initiateElectricityPayment({
                    serviceType: validationResult.serviceType,
                    meterNumber: validationResult.meterNumber,
                    amount,
                  });

                  // Redirect to payment authorization page (Paystack)
                  if (typeof window !== "undefined") {
                    window.location.assign(res.authorization_url);
                  }
                } finally {
                  setInitiatingPayment(false);
                }
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
}
