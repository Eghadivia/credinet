"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchElectricityBillers,
  type ElectricityBillerDto,
} from "@/services/electricity.api";
import { Skeleton } from "@/components/ui/skeleton";

export type ElectricityProvider = {
  id: string;
  shortName: string;
  name: string;
  logoSrc?: string;
  billerId: number;
  productId: number;
  serviceType: string;
};

function ProviderCardSkeleton() {
  return (
    <div className="w-full rounded-3xl bg-white px-6 py-6 border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
      <div className="flex items-center justify-center">
        <Skeleton className="h-16 w-16 rounded-2xl" />
      </div>

      <div className="mt-4 text-center">
        <Skeleton className="h-4 w-16 mx-auto mb-2" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
    </div>
  );
}

/** Populated after GET /electricity/billers; used by getElectricityProviderById on later steps. */
let electricityProvidersCache: ElectricityProvider[] = [];

export function setElectricityProvidersCache(providers: ElectricityProvider[]) {
  electricityProvidersCache = providers;
}

const LOGO_BY_SERVICE_PREFIX: Record<string, string> = {
  eko: "/providers/ekedc.png",
  ikeja: "/providers/ikedc.png",
  abuja: "/providers/aedc.png",
  portharcourt: "/providers/phed.png",
  kedco: "/providers/kedco.png",
  enugu: "/providers/eedc.png",
  benin: "/providers/bedc.png",
  ibadan: "/providers/ibedc.png",
};

function logoSrcForServiceType(serviceType: string): string | undefined {
  const prefix = serviceType.split("_")[0]?.toLowerCase();
  if (!prefix) return undefined;
  return LOGO_BY_SERVICE_PREFIX[prefix];
}

function mapBillerToProvider(b: ElectricityBillerDto): ElectricityProvider {
  const firstWord = b.name.trim().split(/\s+/)[0] ?? "";
  const shortName = (
    firstWord.slice(0, 5) ||
    b.serviceType.split("_")[0] ||
    "ELC"
  ).toUpperCase();

  return {
    id: String(b.billerId),
    shortName,
    name: b.name.replace(/\b\w/g, (c) => c.toUpperCase()),
    logoSrc: logoSrcForServiceType(b.serviceType),
    billerId: b.billerId,
    productId: b.productId,
    serviceType: b.serviceType,
  };
}

export function getElectricityProviderById(id?: string) {
  if (!id) return undefined;
  return electricityProvidersCache.find((p) => p.id === id);
}

function LogoFallback({ label }: { label: string }) {
  return (
    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#132033] via-[#1b2b42] to-[#273b57] grid place-items-center shadow-sm">
      <span className="text-xs font-extrabold tracking-wide text-white">
        {label}
      </span>
    </div>
  );
}

export function ProviderCard({
  provider,
  isSelected,
  onClick,
}: {
  provider: ElectricityProvider;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(provider.logoSrc) && !logoFailed;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative overflow-hidden w-full rounded-3xl bg-white px-6 py-6 text-left border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] transition",
        "hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(168,85,247,0.10)] hover:border-[#f45ca0]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F84B44]",
        isSelected
          ? "border-[#f45ca0] bg-[#fff5fa] shadow-[0_20px_60px_rgba(244,92,160,0.13)]"
          : "",
      ].join(" ")}
      aria-pressed={isSelected}
    >
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 ${
          isSelected
            ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7]"
            : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#ff6b68] group-hover:via-[#f45ca0] group-hover:to-[#a855f7]"
        }`}
      />
      <div className="flex items-center justify-center">
        <div className="h-16 w-16 rounded-3xl bg-[#f7f7f8] grid place-items-center ring-1 ring-[#f0eeee] transition group-hover:scale-105">
          {showLogo ? (
            <Image
              src={provider.logoSrc!}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <LogoFallback label={provider.shortName.slice(0, 3)} />
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-base font-black tracking-wide text-[#171717]">
          {provider.shortName}
        </div>
        <div className="mt-1 text-xs text-[#77777c] leading-snug">
          {provider.name}
        </div>
      </div>
    </button>
  );
}

export default function SelectElectricityProvider({
  selectedProviderId,
  onSelect,
}: {
  selectedProviderId?: string;
  onSelect?: (provider: ElectricityProvider) => void;
}) {
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState<ElectricityProvider[]>(() => [
    ...electricityProvidersCache,
  ]);
  const [loading, setLoading] = useState(
    () => electricityProvidersCache.length === 0,
  );
  const [error, setError] = useState<string | null>(null);

  const loadBillers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const billers = await fetchElectricityBillers();
      const mapped = billers.map(mapBillerToProvider);
      setProviders(mapped);
      setElectricityProvidersCache(mapped);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load providers";
      setError(message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (electricityProvidersCache.length > 0) {
      setProviders([...electricityProvidersCache]);
      setLoading(false);
      return;
    }
    void loadBillers();
  }, [loadBillers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => {
      return (
        p.shortName.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.serviceType.toLowerCase().includes(q)
      );
    });
  }, [query, providers]);

  return (
    <div className="w-full">
      <div className="max-w-3xl rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
          Electricity Bills
        </p>
        <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
          Select Electricity Provider
        </h1>
        <p className="mt-3 text-base leading-7 text-[#77777c]">
          Pick your electricity provider for a smooth and secure payment
          experience
        </p>
      </div>

      <div className="mt-6 w-full max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b95a3]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your provider"
            disabled={loading || Boolean(error)}
            className="h-12 rounded-full pl-11 bg-white border border-[#f0eeee] shadow-sm focus-visible:ring-0 focus-visible:border-[#f45ca0]"
          />
        </div>
      </div>

      {loading && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="mt-14 flex w-full flex-col items-center justify-center text-center">
          <p className="max-w-md text-sm sm:text-base font-medium text-slate-700">
            {error}
          </p>
          <Button
            type="button"
            onClick={loadBillers}
            className="mt-5 h-11 rounded-full px-8 font-black bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white shadow-sm"
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-full">
          {filtered.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              isSelected={selectedProviderId === p.id}
              onClick={onSelect ? () => onSelect(p) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
