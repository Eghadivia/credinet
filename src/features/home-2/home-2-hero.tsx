'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const featureItems = ['Secure & Encrypted', 'Instant Payments', '24/7 Support'];

const statItems = [
  {
    value: 1,
    suffix: 'M+',
    label: 'Successful transactions',
    icon: '/assets/images/home-2/b1.png',
  },
  {
    value: 30,
    suffix: 'k',
    label: 'Happy customers',
    icon: '/assets/images/home-2/b2.png',
  },
  {
    value: 99.98,
    suffix: '%',
    decimals: 2,
    label: 'Platform uptime',
    icon: '/assets/images/home-2/b3.png',
  },
  {
    value: 100,
    suffix: 'M',
    label: 'Airtime and bills processed',
    icon: '/assets/images/home-2/b4.png',
  },
] as const;

const serviceCards = [
  {
    eyebrow: 'Airtime Top up',
    title: 'MTN',
    copy: 'Instant top up',
    className: 'bg-[#fff2c6] text-[#131313]',
    content: (
      <div className="flex h-14 w-24 shrink-0 items-center justify-center self-center">
        <img
          src="/assets/images/home-2/mtv.png"
          alt=""
          aria-hidden="true"
          className="h-9 w-20 object-contain"
        />
      </div>
    ),
  },
  {
    eyebrow: 'Premium',
    title: 'DStv',
    copy: 'Renewed',
    className: 'bg-gradient-to-r from-[#c26bff] to-[#9333ea] text-white',
    content: (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center rounded-full bg-white/85">
        <img
          src="/assets/images/home-2/dstv.png"
          alt=""
          aria-hidden="true"
          className="h-7 w-11 object-contain"
        />
      </div>
    ),
  },
  {
    eyebrow: 'Data Bundle',
    title: '10GB',
    copy: 'Active 30 days',
    className: 'bg-gradient-to-r from-[#66d2ff] to-[#2ca9f4] text-white',
    content: (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center self-center rounded-full bg-[#0a9be6]/35">
        <img
          src="/assets/images/home-2/wifi.png"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 object-contain"
        />
      </div>
    ),
  },
  {
    eyebrow: 'Instant Delivery',
    title: '3 Sec',
    copy: 'avg delivery time',
    className: 'bg-gradient-to-br from-[#ff909a] to-[#ff686d] text-white',
    content: (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-[#ffd84d]">
        <img
          src="/assets/images/home-2/electercity.png"
          alt=""
          aria-hidden="true"
          className="h-7 w-7 object-contain"
        />
      </div>
    ),
  },
];

function ServiceCard({
  eyebrow,
  title,
  copy,
  className,
  content,
}: (typeof serviceCards)[number]) {
  return (
    <article className={`rounded-[28px] p-5 shadow-[0_18px_50px_rgba(72,84,159,0.12)] ${className}`}>
      <div className="flex min-h-[130px] items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-90">{eyebrow}</p>
          <h3 className="mt-2 text-3xl font-black leading-none">{title}</h3>
          <p className="mt-3 text-sm opacity-90">{copy}</p>
        </div>
        {content}
      </div>
    </article>
  );
}

function CounterStat({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    const duration = 2800;
    const start = performance.now();
    let frame = 0;

    const updateValue = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frame = window.requestAnimationFrame(updateValue);
      }
    };

    frame = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(frame);
  }, [hasStarted, value]);

  return (
    <p
      ref={ref}
      className="text-4xl font-black tracking-[-0.04em] text-[#7c3aed]"
    >
      {displayValue.toFixed(decimals)}
      {suffix}
    </p>
  );
}

export default function Home2Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(212,240,255,0.95),_rgba(232,235,255,0.95)_42%,_rgba(223,247,246,0.9)_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(199,207,255,0.12),rgba(255,255,255,0)_18%,rgba(188,183,255,0.18)_48%,rgba(255,255,255,0)_77%,rgba(166,255,240,0.16))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-[linear-gradient(135deg,rgba(199,231,255,0.5)_0%,rgba(199,231,255,0)_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[28%] bg-[linear-gradient(225deg,rgba(208,255,244,0.35)_0%,rgba(208,255,244,0)_60%)]" />

      <div className="relative mx-auto max-w-[1360px] px-4 pb-18 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
        <div className="grid items-start gap-10 xl:grid-cols-[1fr_1.43fr]">
          <div className="max-w-[520px] pt-4 lg:pt-14">
            <div className="inline-flex rounded-full border border-[#dfb8ff] bg-[#f8ecff] px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-[#1c1c1c]">
              All utility bills in one place
            </div>
            <h1 className="mt-8 text-[3.3rem] font-black leading-[0.92] tracking-[-0.06em] text-black sm:text-[4.25rem] lg:text-[78px]">
              Top up.
              <br />
              Power on.
            </h1>
            <p className="mt-8 max-w-[620px] text-lg leading-9 text-[#1c1c1c] sm:text-[1.05rem]">
              Pay airtime, data, electricity and cable bills with one clean,
              secure dashboard built for everyday Nigerians.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-16 items-center justify-center rounded-full bg-gradient-to-r from-[#ff494c] via-[#ec4ca7] to-[#8b3ff5] px-10 text-xl font-medium text-white shadow-[0_18px_40px_rgba(174,72,255,0.24)] sm:text-lg"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-xl font-medium text-[#171717] shadow-[0_12px_32px_rgba(37,37,37,0.08)] sm:text-lg"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative xl:pl-3">
            <div className="grid gap-5 xl:grid-cols-[0.96fr_1.1fr_0.9fr]">
              <div className="relative order-1 hidden min-h-[280px] items-end justify-center md:flex xl:order-none xl:min-h-[590px]">
                <img
                  src="/assets/images/home-2/business-man.png"
                  alt="CrediNet customer"
                  className="relative z-20 h-auto max-h-[440px] w-full max-w-[340px] -translate-y-[7.25rem] object-contain sm:-translate-y-[8.25rem] lg:-translate-y-[9.25rem] xl:max-h-[600px] xl:max-w-[410px] xl:translate-x-[1.25rem]"
                />
              </div>

              <div className="order-2 xl:order-none">
                <div className="relative z-10 rounded-[34px] bg-white p-6 shadow-[0_30px_90px_rgba(56,70,138,0.14)] sm:p-8">
                  <p className="text-[15px] font-medium uppercase text-[#7d7d89]">
                    Payment
                  </p>
                  <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-black sm:text-5xl">
                    Quick top up
                  </h2>

                  <div className="mt-7 grid grid-cols-4 gap-2">
                    {['MTN', 'Airtel', 'Glo', '9mobile'].map((item, index) => (
                      <div
                        key={item}
                        className={`flex h-11 items-center justify-center rounded-2xl text-sm font-medium ${
                          index === 0
                            ? 'bg-[#ff7d7b] text-white'
                            : 'bg-[#f5f5f8] text-[#242424]'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 space-y-5">
                    <div>
                      <p className="mb-3 text-sm font-medium text-[#212121]">
                        Phone number
                      </p>
                      <div className="flex h-16 items-center rounded-2xl border border-[#ececf2] bg-[#fafafa] px-5 text-xl font-semibold text-[#1a1a1a] sm:text-lg">
                        0802 345 6789
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-medium text-[#212121]">
                        Amount
                      </p>
                      <div className="flex h-16 items-center rounded-2xl border border-[#ececf2] bg-[#fafafa] px-5 text-xl font-semibold text-[#1a1a1a] sm:text-lg">
                        ₦2,000
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 flex h-16 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff494c] via-[#ec4ca7] to-[#8b3ff5] text-xl font-medium text-white shadow-[0_18px_40px_rgba(174,72,255,0.22)] sm:text-lg">
                    Continue to Pay
                  </button>
                </div>
              </div>

              <div className="order-3 grid content-start gap-5 sm:grid-cols-2 xl:order-none xl:grid-cols-1">
                {serviceCards.slice(0, 3).map((card) => (
                  <ServiceCard key={card.title} {...card} />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:absolute xl:bottom-[-22px] xl:left-[6%] xl:max-w-[610px]">
              <ServiceCard {...serviceCards[3]} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 text-center text-lg font-medium text-[#1c1c1c] lg:mt-16">
          {featureItems.map((item, index) => (
            <div key={item} className="flex items-center gap-5">
              <span>{item}</span>
              {index < featureItems.length - 1 ? (
                <span className="hidden h-7 w-px bg-[#d8d4e8] sm:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] rounded-[36px] bg-white px-8 py-8 shadow-[0_20px_70px_rgba(64,78,150,0.09)] sm:px-10 lg:mt-12 lg:rounded-[40px]">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#f7f1ff]">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <CounterStat
                    value={item.value}
                    suffix={item.suffix}
                    decimals={item.decimals}
                  />
                  <p className="mt-1 text-lg leading-7 text-[#191919]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
