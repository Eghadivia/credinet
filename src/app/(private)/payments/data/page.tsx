"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import SelectNetworkStep from "@/features/data/select-network-step";
import { NetworkProvider } from "@/types/airtime";
import SelectDataBundle from "@/features/data/select-data-bundle";
import EnterPhoneStep from "@/features/airtime/enter-phone-steps";
import ConfirmDataPayment from "@/features/data/confirm-data-payment";

import { fetchDataTypes, initiateDataPayment } from "@/services/data.api";
import { DataTypeOption, SelectedDataPlan } from "@/types/data.type";

type DataStep = "provider" | "bundle" | "phone" | "confirm";

export default function DataPaymentPage() {
  const [currentStep, setCurrentStep] = useState<DataStep>("provider");
  const [selectedProvider, setSelectedProvider] =
    useState<NetworkProvider | null>(null);
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeOption | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedDataPlan | null>(
    null,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientType, setRecipientType] = useState<"self" | "others">("self");
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [loadingDataTypes, setLoadingDataTypes] = useState(false);
  const [dataTypesError, setDataTypesError] = useState(false);
  const [requiresDataTypeSelection, setRequiresDataTypeSelection] =
    useState(false);
  const [dataTypes, setDataTypes] = useState<DataTypeOption[]>([]);

  const handleSelectProvider = async (provider: NetworkProvider) => {
    setSelectedProvider(provider);
    setSelectedDataType(null);
    setSelectedPlan(null);
    setDataTypes([]);
    setDataTypesError(false);
    setLoadingDataTypes(true);

    try {
      const types = await fetchDataTypes(provider.id);
      setRequiresDataTypeSelection(types.requiresDataTypeSelection);
      setDataTypes(types.items);

      if (!types.requiresDataTypeSelection) {
        setCurrentStep("bundle");
      } else {
        setCurrentStep("provider");
      }
    } catch {
      setRequiresDataTypeSelection(false);
      setDataTypesError(true);
      setCurrentStep("bundle");
    } finally {
      setLoadingDataTypes(false);
    }
  };

  const handleBackToProvider = () => {
    setSelectedPlan(null);
    setCurrentStep("provider");
  };

  const handleSelectDataType = (dataType: DataTypeOption) => {
    setSelectedDataType(dataType);
    setSelectedPlan(null);
    setCurrentStep("bundle");
  };

  const handleBundleContinue = (plan: SelectedDataPlan) => {
    setSelectedPlan(plan);
    setCurrentStep("phone");
  };

  const handlePhoneContinue = () => {
    if (phoneNumber.trim()) {
      setCurrentStep("confirm");
    }
  };

  const handleEditDetails = () => {
    setCurrentStep("bundle");
  };

  const normalizePhone = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "");
    return digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly;
  };

  const handleProceedToPayment = async () => {
    if (initiatingPayment) return;
    if (!selectedProvider || !selectedPlan) return;

    const phone = normalizePhone(phoneNumber.trim());
    if (!phone) return;

    setInitiatingPayment(true);
    try {
      const res = await initiateDataPayment({
        provider: selectedProvider.id,
        phone,
        amount: selectedPlan.price,
        planId: selectedPlan.id,
        serviceId: selectedDataType?.serviceId,
      });

      if (typeof window !== "undefined") {
        window.location.assign(res.authorization_url);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      setInitiatingPayment(false);
    }
  };

  return (
    <div className=" min-h-screen overflow-y-hidden bg-[#fbfbfb]">
      <DashboardNav />

      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/payments"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div>
          {currentStep === "provider" && (
            <SelectNetworkStep
              selectedProvider={selectedProvider}
              selectedDataType={selectedDataType}
              requiresDataTypeSelection={requiresDataTypeSelection}
              dataTypes={dataTypes}
              loadingDataTypes={loadingDataTypes}
              dataTypesError={dataTypesError}
              onSelectProvider={handleSelectProvider}
              onSelectDataType={handleSelectDataType}
            />
          )}

          {currentStep === "bundle" && selectedProvider && (
            <SelectDataBundle
              selectedProvider={selectedProvider}
              serviceId={selectedDataType?.serviceId}
              dataTypeLabel={selectedDataType?.label}
              requiresServiceId={requiresDataTypeSelection}
              onChangeProvider={handleBackToProvider}
              onContinue={handleBundleContinue}
            />
          )}

          {currentStep === "phone" && selectedProvider && selectedPlan && (
            <EnterPhoneStep
              selectedProvider={selectedProvider}
              onChangeProvider={handleBackToProvider}
              phoneNumber={phoneNumber}
              onPhoneChange={setPhoneNumber}
              recipientType={recipientType}
              onRecipientTypeChange={setRecipientType}
              onContinue={handlePhoneContinue}
              isLoading={false}
            />
          )}

          {currentStep === "confirm" &&
            selectedProvider &&
            selectedPlan &&
            phoneNumber.trim() && (
              <ConfirmDataPayment
                selectedProvider={selectedProvider}
                phoneNumber={phoneNumber}
                selectedPlan={selectedPlan}
                onConfirm={handleProceedToPayment}
                onEditDetails={handleEditDetails}
                isLoading={initiatingPayment}
              />
            )}
        </div>
      </div>
    </div>
  );
}
