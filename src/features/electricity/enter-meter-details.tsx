'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getElectricityProviderById } from '@/features/electricity/select-electricity-provider';

export type MeterType = 'prepaid' | 'postpaid';

export type EnterMeterDetailsProps = {
  providerId?: string;
  meterNumber: string;
  onMeterNumberChange: (value: string) => void;
  meterType?: MeterType;
  onMeterTypeChange: (value: MeterType) => void;
  onChangeProvider: () => void;
  onValidate: () => void | Promise<void>;
  validating?: boolean;
};

export default function EnterMeterDetails({
  providerId,
  meterNumber,
  onMeterNumberChange,
  meterType,
  onMeterTypeChange,
  onChangeProvider,
  onValidate,
  validating,
}: EnterMeterDetailsProps) {
  const provider = getElectricityProviderById(providerId);

  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        <div className="px-6 py-4 bg-[#fff8fb] flex items-center justify-between border-b border-[#f0eeee]">
          <div className="flex items-center gap-3 min-w-0">
            {/* <div className="h-11 w-11 rounded-xl bg-white ring-1 ring-black/5 grid place-items-center overflow-hidden shrink-0">
              {provider?.logoSrc ? (
                <Image
                  src={provider.logoSrc}
                  alt=""
                  width={44}
                  height={44}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-slate-900 text-white text-[11px] font-extrabold grid place-items-center">
                  {provider?.shortName?.slice(0, 3) ?? 'ELC'}
                </div>
              )}
            </div> */}

            <div className="min-w-0">
              <div className="text-sm font-black text-[#171717] truncate">
                {provider ? `${provider.name} - ${provider.shortName}` : 'Electricity Provider'}
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#9b95a3] truncate">
                Electricity Distribution Company
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onChangeProvider}
            className="text-sm font-black text-[#f45ca0] hover:text-[#ee1c25]"
          >
            Change
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Meter Details
          </p>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl">
            Enter Meter Details
          </h2>
          <p className="mt-2 text-[#77777c] text-sm">
            Provide your meter information to proceed
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Meter Number
              </label>
              <Input
                value={meterNumber}
                onChange={(e) => onMeterNumberChange(e.target.value)}
                placeholder="0800 000 0000"
                className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent shadow-sm focus-visible:ring-0 focus-visible:border-[#f45ca0]"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Meter Type
              </label>
              <Select
                value={meterType}
                onValueChange={(v) => onMeterTypeChange(v as MeterType)}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-[#f7f7f8] w-full justify-between border-transparent shadow-sm focus:ring-0 focus:border-[#f45ca0]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prepaid">Prepaid</SelectItem>
                  <SelectItem value="postpaid">Postpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={onValidate}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white font-black shadow-sm inline-flex items-center justify-center gap-2"
              disabled={!meterNumber.trim() || !meterType || validating}
            >
              {validating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                  Validating…
                </>
              ) : (
                "Validate Meter"    
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

