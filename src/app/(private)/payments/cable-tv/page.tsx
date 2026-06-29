"use client";

import CableProvider from "@/features/cable/select-cable-provider";
import CableTVValidate from "@/features/cable/validate-cable-subscription";
import CablePackageSelection from "@/features/cable/cable-package-selection";
import { useState } from "react";

export default function CablePage() {
  const [step, setStep] = useState<"select" | "validate" | "packages">(
    "select",
  );
  const [provider, setProvider] = useState<string | null>(null);
  const [validatedCable, setValidatedCable] = useState<any>(null);

  return (
    <>
      {/* STEP 1 */}
      {step === "select" && (
        <CableProvider
          onSelect={(p) => {
            setProvider(p);
            setStep("validate");
          }}
        />
      )}

      {/* STEP 2 */}
      {step === "validate" && (
        <CableTVValidate
          provider={provider}
          onBack={() => setStep("select")}
          onContinue={(data) => {
            setValidatedCable(data);
            setStep("packages");
          }}
        />
      )}

      {/* STEP 3 */}
      {step === "packages" && (
        <CablePackageSelection
          provider={provider || ""}
          smartCard={validatedCable?.smartCard}
          customerName={validatedCable?.customerName}
          customerNumber={validatedCable?.customerNumber}
          currentBouquet={validatedCable?.currentBouquet}
          verifiedPlans={validatedCable?.plans}
          onBack={() => setStep("validate")}
        />
      )}
    </>
  );
}
