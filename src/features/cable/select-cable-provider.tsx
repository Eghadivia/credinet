'use client';

import DashboardNav from '@/features/dashboard-nav/dashboard-nav';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const providers = [
  { id: 'dstv', name: 'DStv', tag: 'INSTANT ACTIVATION', description: 'Premium multi-choice streaming services.' },
  { id: 'gotv', name: 'GOtv', tag: 'SMART CARD PAYMENTS', description: 'Reliable digital terrestrial television.' },
  { id: 'startimes', name: 'StarTimes', tag: 'INSTANT ACTIVATION', description: 'Affordable digital TV for every household.' },
];

export default function CableProvider({
  onSelect,
}: {
  onSelect: (providerId: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/payments" className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-4 py-2 text-sm font-black text-[#55555d] shadow-sm hover:border-[#f45ca0] hover:text-[#ee1c25]">
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="mb-8 max-w-3xl rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Cable TV
          </p>
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
            Select Cable TV Service Provider
          </h1>
          <p className="mt-3 text-base leading-7 text-[#77777c]">
            Choose your network to proceed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onSelect(provider.id)}
              className="group relative min-h-[210px] overflow-hidden text-left bg-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,23,23,0.04)] border border-[#f0eeee] transition hover:-translate-y-1 hover:border-[#f45ca0] hover:shadow-[0_24px_70px_rgba(168,85,247,0.10)]"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#ff6b68] group-hover:via-[#f45ca0] group-hover:to-[#a855f7]" />
              <div className="w-14 h-14 bg-[#f7f7f8] rounded-2xl flex items-center justify-center mb-4 font-black text-[#171717]">
                TV
              </div>

              <p className="text-xs font-black tracking-widest text-[#9b95a3] mb-2">
                {provider.tag}
              </p>

              <h3 className="text-lg font-black text-[#171717] mb-1">
                {provider.name}
              </h3>

              <p className="text-sm text-[#77777c]">
                {provider.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}