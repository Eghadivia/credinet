'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';

const slides = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  eyebrow: 'All your payments in one place',
  title: (
    <>
      Top up.
      <br />
      Power on.
    </>
  ),
  copy:
    'Pay airtime, data, electricity and cable bills with one clean, secure dashboard built for everyday Nigerians.',
  image: '/assets/images/home-2/hero-phone-woman-wide.png',
  imageAlt: 'Smiling CrediNet customer using her phone',
}));

const serviceCards = [
  {
    eyebrow: 'Airtime',
    label: 'Top up',
    title: 'MTN',
    copy: 'Instant top up',
    className: 'bg-[#fff1bd] text-[#11112a]',
    logo: '/assets/images/home-2/mtv.png',
    logoClassName: 'h-9 w-20',
  },
  {
    eyebrow: 'Premium',
    label: '',
    title: 'DStv',
    copy: 'Renewed',
    className:
      'bg-gradient-to-br from-[#c957ff] via-[#a638f0] to-[#8528ee] text-white',
    logo: '/assets/images/home-2/dstv.png',
    logoClassName: 'h-7 w-12',
  },
  {
    eyebrow: 'Data Bundle',
    label: '',
    title: '10GB',
    copy: 'Active 30 days',
    className:
      'bg-gradient-to-br from-[#58ccfa] to-[#24a9ed] text-white',
    logo: '/assets/images/home-2/wifi.png',
    logoClassName: 'h-8 w-8',
  },
];

const trustItems = [
  {
    title: 'Secure & Encrypted',
    copy: 'Your data is always protected',
    icon: ShieldCheck,
  },
  {
    title: 'Instant Payments',
    copy: 'Pay in seconds and get value instantly',
    icon: Zap,
  },
  {
    title: '24/7 Support',
    copy: "We're here anytime, anywhere",
    icon: Headphones,
  },
  {
    title: '100% Reliable',
    copy: 'Trusted by thousands across Nigeria',
    icon: LockKeyhole,
  },
];

function ServiceCard({
  eyebrow,
  label,
  title,
  copy,
  className,
  logo,
  logoClassName,
}: (typeof serviceCards)[number]) {
  return (
    <article
      className={`flex min-h-[142px] items-center justify-between gap-3 rounded-[24px] p-5 shadow-[0_18px_45px_rgba(71,72,130,0.1)] ${className}`}
    >
      <div>
        <p className="text-sm font-medium opacity-90">{eyebrow}</p>
        {label ? <p className="text-sm font-medium opacity-90">{label}</p> : null}
        <h3 className="mt-2 text-[28px] font-extrabold leading-none">{title}</h3>
        <p className="mt-3 text-sm leading-5 opacity-90">{copy}</p>
      </div>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/85">
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className={`object-contain ${logoClassName}`}
        />
      </div>
    </article>
  );
}

export default function Home2Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[activeSlide];

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <section
      aria-label="CrediNet payment services"
      className="relative overflow-hidden bg-[#f8f8ff]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_30%,rgba(204,186,255,0.2),transparent_29%),radial-gradient(circle_at_95%_32%,rgba(203,249,255,0.35),transparent_25%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-7 pt-10 sm:px-6 sm:pt-12 lg:px-8 xl:px-10 xl:pb-9 xl:pt-16">
        <div className="grid min-w-0 items-center gap-10 xl:grid-cols-[0.93fr_1.15fr_1.12fr] xl:gap-9 2xl:gap-12">
          <div
            key={`copy-${slide.id}`}
            className="mx-auto min-w-0 w-full max-w-[560px] text-center xl:mx-0 xl:text-left"
          >
            <p className="inline-flex max-w-full justify-center rounded-full bg-gradient-to-r from-[#f2eaff] to-[#f8eaff] px-5 py-3 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[#321494] sm:px-6 sm:text-xs sm:tracking-[0.24em]">
              {slide.eyebrow}
            </p>
            <h1 className="mt-7 text-[3.25rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#090934] sm:text-[4.25rem] xl:text-[4.35rem] 2xl:text-[5rem]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-[500px] text-base leading-8 text-[#4e506d] sm:text-lg xl:mx-0 xl:mt-7 xl:leading-9">
              {slide.copy}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row xl:justify-start">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4656] via-[#ee3fa0] to-[#862bf5] px-9 text-base font-semibold text-white shadow-[0_15px_34px_rgba(169,53,230,0.24)]"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-semibold text-[#7025e8] shadow-[0_12px_30px_rgba(46,48,100,0.08)]"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative mx-auto min-w-0 w-full max-w-[520px]">
            <div className="relative h-[430px] overflow-hidden rounded-[34px] bg-[#ded3ff] shadow-[0_24px_65px_rgba(87,68,155,0.13)] sm:h-[510px] xl:h-[530px]">
              <img
                key={`image-${slide.id}`}
                src={slide.image}
                alt={slide.imageAlt}
                className="h-full w-full object-cover object-center"
              />

              <div className="absolute left-6 top-7 z-10 max-w-[170px] sm:left-9 sm:top-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/90 text-[#7b2cf1] shadow-[0_12px_30px_rgba(74,52,138,0.1)] backdrop-blur-sm">
                  <Smartphone className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <p className="mt-6 text-base font-bold text-[#15152d]">
                  Airtime Top Up
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5c5d78]">
                  Instant top up for all networks
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Show previous slide"
              onClick={showPrevious}
              className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#121438] shadow-[0_10px_28px_rgba(32,34,78,0.14)] transition hover:scale-105"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Show next slide"
              onClick={showNext}
              className="absolute right-0 top-1/2 z-10 flex h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#121438] shadow-[0_10px_28px_rgba(32,34,78,0.14)] transition hover:scale-105"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div
              className="mt-5 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Choose hero slide"
            >
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={`Show slide ${index + 1}`}
                  aria-selected={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index
                      ? 'w-6 bg-[#8332ef]'
                      : 'w-2.5 bg-[#e8e4f6] hover:bg-[#cfc5ee]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-[1.4fr_0.9fr] xl:grid-cols-[1.2fr_0.86fr]">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_24px_70px_rgba(61,64,120,0.1)] sm:p-7">
              <p className="text-sm font-medium uppercase tracking-wide text-[#838397]">
                Payment
              </p>
              <h2 className="mt-2 text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#08082f]">
                Quick
                <br />
                top up
              </h2>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {['MTN', 'Airtel', 'Glo', '9mobile'].map((network, index) => (
                  <div
                    key={network}
                    className={`flex h-10 items-center justify-center rounded-full text-xs font-medium ${
                      index === 0
                        ? 'bg-[#ff6268] text-white'
                        : 'bg-[#f5f5f8] text-[#555568]'
                    }`}
                  >
                    {network}
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-[#303047]">
                    Phone number
                  </span>
                  <span className="mt-2 flex h-14 items-center rounded-2xl border border-[#e8e8ef] bg-[#fbfbfc] px-4 text-base font-semibold text-[#18182b]">
                    0802 345 6789
                  </span>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-[#303047]">
                    Amount
                  </span>
                  <span className="mt-2 flex h-14 items-center rounded-2xl border border-[#e8e8ef] bg-[#fbfbfc] px-4 text-base font-semibold text-[#18182b]">
                    ₦2,000
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff4656] via-[#ee3fa0] to-[#862bf5] text-base font-semibold text-white shadow-[0_14px_32px_rgba(169,53,230,0.2)]"
              >
                Continue to Pay
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {serviceCards.map((card) => (
                <ServiceCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1360px] rounded-[30px] bg-white px-5 py-5 shadow-[0_18px_55px_rgba(63,68,132,0.08)] sm:px-7 lg:mt-12">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 px-3 py-2 ${
                    index > 0 ? 'xl:border-l xl:border-[#eceaf4]' : ''
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f5edff] text-[#8332ef]">
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#11122f]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#5d5f7a]">
                      {item.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
