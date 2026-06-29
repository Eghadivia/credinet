'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NetworkProvider } from '@/types/airtime';
import SelectNetworkStep from '@/features/airtime/select-network-step';
import EnterPhoneStep from '@/features/airtime/enter-phone-steps';
import SelectAmountStep from '@/features/airtime/select-amount-step';
import DashboardNav from '@/features/dashboard-nav/dashboard-nav';
import { initiateAirtimePayment } from '@/services/airtime.api';


type AirtimeStep = 'provider' | 'phone' | 'amount';

export default function AirtimePaymentPage() {
  const [currentStep, setCurrentStep] = useState<AirtimeStep>('provider');
  const [selectedProvider, setSelectedProvider] = useState<NetworkProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recipientType, setRecipientType] = useState<'self' | 'others'>('self');
  const [amount, setAmount] = useState(0);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  const handleSelectProvider = (provider: NetworkProvider) => {
    setSelectedProvider(provider);
    
  localStorage.setItem(
    "provider",
    JSON.stringify({
      providerId: provider.id,
      providerName: provider.name,
    })
  );
    setCurrentStep('phone');
  };

  const handleBackToProvider = () => {
    setCurrentStep('provider');
  };

  const handlePhoneContinue = () => {
    if (phoneNumber.trim()) {
      setCurrentStep('amount');
    }
  };

  const normalizePhone = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, '');
    // UI already prefixes +234; users might type 080..., so remove leading 0 if present.
    return digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
  };

  const handleProceedToPayment = async () => {
    if (initiatingPayment) return;
    if (!(amount > 0) || !selectedProvider) return;

    const phone = normalizePhone(phoneNumber.trim());
    if (!phone) return;

    setInitiatingPayment(true);
    try {
      const res = await initiateAirtimePayment({
        provider: selectedProvider.id,
        phone,
        amount,
      });

      if (typeof window !== 'undefined') {
        window.location.assign(res.paymentUrl);
      }
    } finally {
      setInitiatingPayment(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-hidden bg-[#fbfbfb]">
      <DashboardNav />
       
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/payments"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div >
          {currentStep === 'provider' && (
            <SelectNetworkStep
              selectedProvider={selectedProvider}
              onSelect={handleSelectProvider}
            />
          )}

          {currentStep === 'phone' && selectedProvider && (
            <EnterPhoneStep
              selectedProvider={selectedProvider}
              onChangeProvider={handleBackToProvider}
              phoneNumber={phoneNumber}
              onPhoneChange={setPhoneNumber}
              recipientType={recipientType}
              onRecipientTypeChange={setRecipientType}
              onContinue={handlePhoneContinue}
              isLoading={initiatingPayment}
            />
          )}

          {currentStep === 'amount' && (
            <SelectAmountStep
              amount={amount}
              onAmountChange={setAmount}
              onProceed={handleProceedToPayment}
              isLoading={initiatingPayment}
            />
          )}
        </div>
     
      </div>
    </div>
  );
}
