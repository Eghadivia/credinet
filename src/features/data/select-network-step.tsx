import { NETWORK_PROVIDERS, NetworkProvider } from "@/types/airtime";
import { DataTypeOption } from "@/types/data.type";
import NetworkProviderCard from "../airtime/network-provder-card";
import DataTypePicker from "./data-type-picker";

interface SelectNetworkStepProps {
  selectedProvider: NetworkProvider | null;
  selectedDataType: DataTypeOption | null;
  requiresDataTypeSelection: boolean;
  dataTypes: DataTypeOption[];
  loadingDataTypes: boolean;
  dataTypesError: boolean;
  onSelectProvider: (provider: NetworkProvider) => void;
  onSelectDataType: (dataType: DataTypeOption) => void;
}

export default function SelectNetworkStep({
  selectedProvider,
  selectedDataType,
  requiresDataTypeSelection,
  dataTypes,
  loadingDataTypes,
  dataTypesError,
  onSelectProvider,
  onSelectDataType,
}: SelectNetworkStepProps) {
  return (
    <div className="px-0 py-2">
      <div className="max-w-6xl">
        <div className="mb-8 rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Data Bundles
          </p>
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
            Select Data Provider
          </h1>
          <p className="mt-3 text-base leading-7 text-[#77777c] max-w-2xl">
            Choose your network to proceed with data bundle purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {NETWORK_PROVIDERS.map((provider) => (
            <NetworkProviderCard
              key={provider.id}
              provider={provider}
              isSelected={selectedProvider?.id === provider.id}
              onClick={() => onSelectProvider(provider)}
            />
          ))}
        </div>

        {selectedProvider && requiresDataTypeSelection && (
          <DataTypePicker
            providerName={selectedProvider.name}
            types={dataTypes}
            selectedDataType={selectedDataType}
            isLoading={loadingDataTypes}
            isError={dataTypesError}
            onSelect={onSelectDataType}
          />
        )}
      </div>
    </div>
  );
}
