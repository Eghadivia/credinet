import { NETWORK_PROVIDERS, NetworkProvider } from "@/types/airtime";
import NetworkProviderCard from "./network-provder-card";

interface SelectNetworkStepProps {
  selectedProvider: NetworkProvider | null;
  onSelect: (provider: NetworkProvider) => void;
}

export default function SelectNetworkStep({
  selectedProvider,
  onSelect,
}: SelectNetworkStepProps) {
  return (
    <div className="px-0 py-2">
     <div className="max-w-6xl">
        <div className="mb-8 rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Airtime Recharge
          </p>
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
            Select Network Provider
          </h1>
          <p className="mt-3 text-base leading-7 text-[#77777c] max-w-2xl">
            Choose your telecommunication network to proceed with the airtime
            recharge. We support all major providers with instant delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {NETWORK_PROVIDERS.map((provider) => (
            <NetworkProviderCard
              key={provider.id}
              provider={provider}
              isSelected={selectedProvider?.id === provider.id}
              onClick={() => onSelect(provider)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}