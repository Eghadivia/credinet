"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTypeOption } from "@/types/data.type";
import { cn } from "@/lib/utils";

export default function DataTypePicker({
  providerName,
  types,
  selectedDataType,
  isLoading,
  isError,
  onSelect,
}: {
  providerName: string;
  types: DataTypeOption[];
  selectedDataType: DataTypeOption | null;
  isLoading: boolean;
  isError: boolean;
  onSelect: (dataType: DataTypeOption) => void;
}) {
  return (
    <div className="mt-8 rounded-[28px] border border-[#f0eeee] bg-white p-6 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#ff5a57]">
        Bundle Category
      </p>
      <h2 className="text-2xl font-black tracking-[-0.03em] text-[#171717] mb-2">
        Select Data Type
      </h2>
      <p className="text-base text-[#77777c] mb-6 max-w-2xl">
        Choose a data category for {providerName}, then pick your bundle.
      </p>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-28 rounded-full" />
          ))}
        </div>
      ) : isError || !types.length ? (
        <p className="text-sm text-rose-600">
          Could not load data types for this network. Please try again.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {types.map((item) => {
            const isSelected = selectedDataType?.serviceId === item.serviceId;
            return (
              <Button
                key={item.serviceId}
                type="button"
                variant="outline"
                onClick={() => onSelect(item)}
                className={cn(
                  "rounded-full px-5 py-2 h-11 text-sm font-black border transition",
                  isSelected
                    ? "border-[#f45ca0] bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white hover:text-white"
                    : "border-[#f0eeee] bg-white text-[#55555d] hover:border-[#f45ca0]",
                )}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
