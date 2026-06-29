import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-8 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ffebe9] blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#8d8d95]">
            All utility bills in one place
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#111114] sm:text-7xl lg:text-[92px]">
            Top up.
            <span className="block bg-gradient-to-r from-[#ff4d54] via-[#f22078] to-[#8128ff] bg-clip-text text-transparent">
              Power on.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#696971] sm:text-lg">
            Pay airtime, data, electricity and cable bills with one clean,
            secure dashboard built for everyday Nigerians.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] px-7 text-sm font-bold text-white transition hover:bg-[#ee1c25]"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#e9e9e9] bg-white px-7 text-sm font-bold text-[#171717] shadow-sm transition hover:border-[#ff5a57] hover:text-[#ee1c25]"
            >
              Sign in <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-12 flex min-h-[420px] max-w-6xl items-center justify-center sm:min-h-[470px]">
          <div className="absolute left-0 top-14 hidden h-[108px] w-[290px] rotate-[-3deg] rounded-[18px] bg-[#ffdb18] px-12 py-7 text-center shadow-[0_30px_70px_rgba(255,196,0,0.24)] md:block lg:left-12">
            <p className="text-[11px] font-black tracking-tight text-black">
              +₦2,000
            </p>
            <p className="text-3xl font-black leading-none tracking-[-0.04em] text-black">
              MTN
            </p>
            <p className="mt-1 text-xs font-bold text-black/65">just now</p>
          </div>
          <div className="absolute left-0 top-[176px] hidden h-[108px] w-[290px] rotate-[3deg] rounded-[18px] bg-[#11c5e5] px-12 py-7 text-center shadow-[0_30px_70px_rgba(17,197,229,0.24)] md:block lg:left-12">
            <p className="text-[11px] font-black tracking-tight text-black">
              10GB Data
            </p>
            <p className="text-3xl font-black leading-none tracking-[-0.04em] text-black">
              Glo
            </p>
            <p className="mt-1 text-xs font-bold text-black/65">
              Active 30 days
            </p>
          </div>
          <div className="absolute right-0 top-14 hidden h-[108px] w-[290px] rotate-[5deg] rounded-[18px] bg-[#ff5757] px-12 py-7 text-center text-white shadow-[0_30px_70px_rgba(255,87,87,0.25)] md:block lg:right-12">
            <p className="text-[11px] font-black tracking-tight text-white/85">
              ⚡ Instant
            </p>
            <p className="text-4xl font-black leading-none tracking-[-0.05em] text-white">
              3 sec
            </p>
            <p className="mt-1 text-xs font-bold text-white/75">
              avg delivery
            </p>
          </div>
          <div className="absolute right-0 top-[176px] hidden h-[108px] w-[290px] rotate-[-4deg] rounded-[18px] bg-[#8c13f5] px-12 py-7 text-center text-white shadow-[0_30px_70px_rgba(132,45,255,0.25)] md:block lg:right-12">
            <p className="text-[11px] font-black tracking-tight text-white/85">
              DStv Premium
            </p>
            <p className="text-3xl font-black leading-none tracking-[-0.04em] text-white">
              Renewed
            </p>
          </div>

          <div className="relative z-10 w-full max-w-[330px] rounded-[26px] border border-[#f1eeee] bg-white p-5 shadow-[0_28px_90px_rgba(24,24,27,0.14)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#9b9ba3]">
                  Payment
                </p>
                <p className="text-xl font-black">Quick top up</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0ef] text-[#ee1c25]">
                <Zap className="h-5 w-5 fill-[#ee1c25]" />
              </div>
            </div>

            <div className="mb-5 grid grid-cols-4 gap-2">
              {['MTN', 'Airtel', 'Glo', '9mobile'].map((network, index) => (
                <div
                  key={network}
                  className={`rounded-2xl py-3 text-center text-[10px] font-black ${
                    index === 0
                      ? 'bg-[#fff4b7] text-[#171717]'
                      : 'bg-[#f7f7f8] text-[#7a7a82]'
                  }`}
                >
                  {network}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-[#f7f7f8] p-4">
                <p className="text-xs font-bold text-[#9898a0]">
                  Phone number
                </p>
                <p className="mt-1 text-sm font-black">0802 345 6789</p>
              </div>
              <div className="rounded-2xl bg-[#f7f7f8] p-4">
                <p className="text-xs font-bold text-[#9898a0]">Amount</p>
                <p className="mt-1 text-sm font-black">₦2,000</p>
              </div>
              <button className="h-12 w-full rounded-2xl bg-[#ff5a57] text-sm font-black text-white shadow-[0_16px_34px_rgba(255,90,87,0.25)]">
                Continue to Pay
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {['MTN', 'Airtel', 'Glo', '9mobile'].map((item, index) => (
            <span
              key={item}
              className={`rounded-full px-4 py-2 text-xs font-black ${
                [
                  'bg-[#ffd329]',
                  'bg-[#ee1c25] text-white',
                  'bg-[#0ebd64] text-white',
                  'bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white',
                ][index]
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
