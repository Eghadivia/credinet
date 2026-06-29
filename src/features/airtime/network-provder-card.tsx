import { NetworkProvider } from "@/types/airtime";
import Image from "next/image";

interface NetworkProviderCardProps {
  provider: NetworkProvider;
  isSelected: boolean;
  onClick: () => void;
}

export default function NetworkProviderCard({
  provider,
  isSelected,
  onClick,
}: NetworkProviderCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex min-h-[180px] flex-col items-center justify-center overflow-hidden rounded-3xl border p-6 transition-all cursor-pointer ${
        isSelected
          ? "border-[#f45ca0] bg-[#fff5fa] shadow-[0_20px_50px_rgba(244,92,160,0.12)]"
          : "border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)] hover:-translate-y-1 hover:border-[#f45ca0] hover:shadow-[0_24px_70px_rgba(168,85,247,0.10)]"
      }`}
    >
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 transition ${
          isSelected
            ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7]"
            : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#ff6b68] group-hover:via-[#f45ca0] group-hover:to-[#a855f7]"
        }`}
      />
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f7f7f8] transition group-hover:scale-105">
        <Image
          src={provider.logo}
          alt={provider.name}
          width={40}
          height={40}
          className="w-auto h-auto object-contain"
        />
      </div>
      <p className="font-black text-base text-[#171717] text-center mb-2">
        {provider.name}
      </p>
      <p className="text-[11px] font-black tracking-[0.16em] text-[#9b95a3] text-center uppercase">
        {provider.status}
      </p>
    </button>
  );
}
