import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PRESET_AMOUNTS } from '@/types/airtime';
import { ArrowRight } from 'lucide-react';

interface SelectAmountStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  onProceed: () => void;
  isLoading?: boolean;
}

export default function SelectAmountStep({
  amount,
  onAmountChange,
  onProceed,
  isLoading = false,
}: SelectAmountStepProps) {
  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    onAmountChange(value ? parseInt(value) : 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="flex items-start justify-center py-4">
      <div className='w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]'>
       <div className="bg-white px-5 py-4">
        <div className="mb-8 mt-4">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Airtime Amount
          </p>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl">Select Amount</h1>
          <p className="text-[#77777c] text-base mt-3">Please select amount for payment</p>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-neutral-600 mb-2 block">Enter Custom Amount</label>
          <div className="relative">
            <Input
              type="text"
              value={amount > 0 ? amount.toString() : ''}
              onChange={handleCustomAmount}
              placeholder="0.00"
              className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] text-foreground"
            />
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-neutral-600 tracking-wider uppercase mb-3">Quick Select</p>
          <div className="flex flex-wrap gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => onAmountChange(preset)}
                className={`px-5 py-2.5 rounded-full font-black transition-all cursor-pointer text-sm border ${
                  amount === preset
                    ? 'bg-[#fff5fa] text-[#ee1c25] border-[#f45ca0]'
                    : 'bg-white text-[#55555d] border-[#f0eeee] hover:border-[#f45ca0]'
                }`}
              >
                ₦{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Total & Proceed */}
        <div className="flex items-end justify-between mb-4 mt-4">
          <div>
            <p className="text-sm font-medium text-neutral-600">Total Payable</p>
            <p className="text-3xl font-black text-[#171717]">{formatCurrency(amount)}</p>
          </div>
          <Button
            onClick={onProceed}
            disabled={amount <= 0 || isLoading}
            className="rounded-full px-8 py-6 text-sm font-black cursor-pointer bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white hover:opacity-95"
          >
            Proceed to Payment <ArrowRight/>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
