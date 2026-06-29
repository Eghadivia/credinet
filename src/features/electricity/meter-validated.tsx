'use client';

import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getElectricityProviderById } from '@/features/electricity/select-electricity-provider';
import type { ValidateMeterAccountDto } from '@/services/electricity.api';

export type MeterValidationResult = {
  providerId: string;
  serviceType: string;
  customerName: string;
  meterNumber: string;
  /** Not always returned by validate API */
  serviceAddress: string | null;
  customerNumber?: string | null;
  balance?: number;
  validationAccountId?: number;
};

export function meterAccountToValidationResult(
  account: ValidateMeterAccountDto,
  providerId: string,
): MeterValidationResult {
  return {
    providerId,
    serviceType: account.serviceType,
    customerName: account.customerName?.trim() || "—",
    meterNumber: (account.accountNumber ?? "").trim(),
    serviceAddress: null,
    customerNumber: account.customerNumber,
    balance: account.balance,
    validationAccountId: account.id,
  };
}

export default function MeterValidated({
  result,
  onReEnterMeter,
  onProceed,
}: {
  result: MeterValidationResult;
  onReEnterMeter: () => void;
  onProceed: () => void;
}) {
  const provider = getElectricityProviderById(result.providerId);

  return (
    <div className="w-full flex flex-col items-center py-4 sm:py-10">
      <div className="h-14 w-14 rounded-full bg-[#fff5fa] grid place-items-center">
        <div className="h-9 w-9 rounded-full bg-emerald-500 grid place-items-center">
          <Check className="h-5 w-5 text-white" />
        </div>
      </div>

      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#171717] text-center">
        Meter Validated Successfully
      </h2>
      <p className="mt-2 text-sm text-[#77777c] text-center max-w-xl">
        Please confirm the details above are correct before proceeding to payment.
      </p>

      <div className="mt-8 w-full max-w-5xl rounded-[32px] bg-white border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.04)] px-6 sm:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
              Customer Name
            </div>
            <div className="mt-1 text-sm font-black text-[#171717]">
              {result.customerName}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
              Electricity Provider
            </div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-[#f0eeee] bg-[#f7f7f8] px-3 py-2">
              {/* <div className="h-7 w-7 rounded-md bg-white ring-1 ring-black/5 grid place-items-center overflow-hidden">
                {provider?.logoSrc ? (
                  <Image
                    src={provider.logoSrc}
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6 object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-extrabold text-slate-700">
                    {provider?.shortName?.slice(0, 3) ?? 'ELC'}
                  </span>
                )}
              </div> */}
              <div className="text-sm font-black text-[#171717]">
                {provider ? `${provider.name} - ${provider.shortName}` : 'Electricity Provider'}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
              Meter Number
            </div>
            <div className="mt-1 text-sm font-black text-[#171717]">
              {result.meterNumber}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
              Service Address
            </div>
            <div className="mt-1 text-sm font-black text-[#171717]">
              {result.serviceAddress ?? "—"}
            </div>
          </div>

          {result.customerNumber ? (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#9b95a3]">
                Customer Number
              </div>
              <div className="mt-1 text-sm font-black text-[#171717]">
                {result.customerNumber}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#f0eeee]">
          <div className="text-xs text-slate-500"> 
            <span className="italic">Incorrect details?</span>{' '}
            <button
              type="button"
              onClick={onReEnterMeter}
              className="text-[#f45ca0] font-black hover:text-[#ee1c25]"
            >
              Re-enter meter number
            </button>
          </div>

          <Button
            type="button"
            onClick={onProceed}
            className="h-12 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white font-black px-6 shadow-sm cursor-pointer"
          >
            Proceed to Payment Amount <ArrowRight/>
          </Button>
        </div>
      </div>
    </div>
  );
}

