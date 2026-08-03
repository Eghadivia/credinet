'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const slideImages = [
  '/assets/images/home-2/slider_0.png',
  '/assets/images/home-2/slider_1.png',
  '/assets/images/home-2/slider_2.png',
  '/assets/images/home-2/slider_3.png',
  '/assets/images/home-2/slider_4.png',
];

const slides = slideImages.map((image, index) => ({
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
  image,
  imageAlt: `CrediNet service slide ${index + 1}`,
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

const statItems = [
  {
    value: 1,
    suffix: 'M+',
    decimals: 0,
    label: 'Successful transactions',
    icon: '/assets/images/home-2/b1.png',
  },
  {
    value: 30,
    suffix: 'k',
    decimals: 0,
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
    decimals: 0,
    label: 'Airtime and bills processed',
    icon: '/assets/images/home-2/b4.png',
  },
];

function AnimatedStatValue({
  value,
  suffix,
  decimals,
}: Pick<(typeof statItems)[number], 'value' | 'suffix' | 'decimals'>) {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = valueRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplayValue(value);
          return;
        }

        const duration = 4000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(value * easedProgress);

          if (progress < 1) {
            window.requestAnimationFrame(animate);
          }
        };

        window.requestAnimationFrame(animate);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <p
      ref={valueRef}
      className="text-2xl font-black leading-none tracking-[-0.04em] text-[#7c3aed] sm:text-[1.7rem]"
    >
      {displayValue.toFixed(decimals)}{suffix}
    </p>
  );
}

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
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: 'start',
    duration: 28,
    loop: true,
  });
  const slide = slides[activeSlide];

  useEffect(() => {
    if (!carouselApi) return;

    const updateActiveSlide = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    updateActiveSlide();
    carouselApi.on('select', updateActiveSlide);
    carouselApi.on('reInit', updateActiveSlide);

    return () => {
      carouselApi.off('select', updateActiveSlide);
      carouselApi.off('reInit', updateActiveSlide);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (
      !carouselApi ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      carouselApi.scrollNext();
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeSlide, carouselApi]);

  const showPrevious = () => {
    carouselApi?.scrollPrev();
  };

  const showNext = () => {
    carouselApi?.scrollNext();
  };

  return (
    <>
      <section
        aria-label="CrediNet payment services"
        className="relative overflow-hidden bg-[linear-gradient(90deg,#dff2ff_0%,#e5e5ff_52%,#defafa_100%)]"
      >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_30%,rgba(204,186,255,0.2),transparent_29%),radial-gradient(circle_at_95%_32%,rgba(203,249,255,0.35),transparent_25%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-7 pt-10 sm:px-6 sm:pt-12 lg:px-8 xl:px-10 xl:pb-9 xl:pt-16">
        <div className="grid min-w-0 items-start gap-10 xl:grid-cols-[0.93fr_1.15fr_1.12fr] xl:gap-9 2xl:gap-12">
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
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4656] via-[#ee3fa0] to-[#862bf5] px-9 text-base font-extrabold tracking-[-0.01em] text-white shadow-[0_15px_34px_rgba(169,53,230,0.24)]"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-extrabold tracking-[-0.01em] text-[#7025e8] shadow-[0_12px_30px_rgba(46,48,100,0.08)]"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative mx-auto min-w-0 w-full max-w-[520px] xl:max-w-[340px]">
            <div
              ref={carouselRef}
              className="aspect-[941/1393] touch-pan-y overflow-hidden rounded-[34px] bg-[#ded3ff] shadow-[0_24px_65px_rgba(87,68,155,0.13)] [transform:translateZ(0)]"
            >
              <div className="flex h-full cursor-grab select-none [backface-visibility:hidden] [will-change:transform] active:cursor-grabbing">
                {slides.map((item) => (
                  <div key={item.id} className="h-full min-w-0 shrink-0 grow-0 basis-full">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      draggable={false}
                      className="h-full w-full object-cover [backface-visibility:hidden]"
                    />
                  </div>
                ))}
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
                  onClick={() => carouselApi?.scrollTo(index)}
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
                className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff4656] via-[#ee3fa0] to-[#862bf5] text-base font-extrabold tracking-[-0.01em] text-white shadow-[0_14px_32px_rgba(169,53,230,0.2)]"
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

      <section
        aria-label="CrediNet platform statistics"
        className="bg-[#f8f8ff] px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1360px] rounded-[30px] bg-white px-5 py-6 shadow-[0_18px_55px_rgba(63,68,132,0.08)] sm:px-7 lg:px-9">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            {statItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center gap-4 px-3 py-2 ${
                  index > 0 ? 'xl:border-l xl:border-[#eceaf4] xl:pl-7' : ''
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f5edff] sm:h-16 sm:w-16">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                  />
                </div>
                <div>
                  <AnimatedStatValue
                    value={item.value}
                    suffix={item.suffix}
                    decimals={item.decimals}
                  />
                  <p className="mt-1 text-xs font-medium leading-5 text-[#22223a] sm:text-sm">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
