'use client';

import { useEffect, useRef } from "react";

export default function FeaturesSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll<HTMLElement>(".u-reveal"));

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "160px 0px -10% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Airtime Purchase',
      description:
        'Instantly recharge your mobile balance anytime with a fast, secure, and reliable top-up experience across major networks.',
      bullets: [
        'Quick and secure top-ups',
        'Supports all major networks',
        'Instant confirmation',
      ],
      icon: 'phone' as const,
    },
    {
      title: 'Data Bundle Purchase',
      description:
        'Purchase data bundles for any network in seconds and stay connected with affordable plans and seamless activation.',
      bullets: ['Affordable data bundles', 'Works across all providers', 'Instant activation'],
      icon: 'wifi' as const,
    },
    {
      title: 'Electricity Bills',
      description:
        'Pay your electricity bills quickly and securely. Get instant confirmation and stay powered without delays.',
      bullets: ['Fast bill settlement', 'Secure payment processing', 'Instant confirmation'],
      icon: 'zap' as const,
    },
    {
      title: 'Cable TV Subscription',
      description:
        'Renew your cable TV subscription in seconds and keep your entertainment running without interruption.',
      bullets: ['Seamless renewal', 'Fast subscription updates', 'Reliable confirmation'],
      icon: 'tv' as const,
    },
  ];

  const iconMap = {
    phone: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="M12 18h.01" />
      </svg>
    ),
    wifi: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12.55a11 11 0 0 1 14 0" />
        <path d="M1 9a16 16 0 0 1 22 0" />
        <path d="M9.5 15.5a6 6 0 0 1 5 0" />
        <path d="M12 19h.01" />
      </svg>
    ),
    zap: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
      </svg>
    ),
    tv: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M8 21v2h8v-2" />
        <path d="M17 3H7" />
      </svg>
    ),
  } as const;

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div ref={rootRef}>
        <div className="container mx-auto">
          <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <h2
              className="u-reveal text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-gray-900 leading-tight"
              style={{ animationDelay: "80ms" }}
            >
              Everything you need to{' '}
              <span className="pjs_font primary_clr">manage</span> your{' '}
              <span className="pjs_font primary_clr">bills</span>
            </h2>
            <p
              className="u-reveal text-base sm:text-[18px] lg:text-[20px] text-neutral-500 leading-relaxed max-w-[640px]"
              style={{ animationDelay: "140ms" }}
            >
              Pay, recharge, and manage all your utility services in one secure
              and seamless platform for quick and effortless payments anytime.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="u-reveal bg-neutral-50 rounded-3xl p-8 space-y-6 h-full border border-neutral-100 hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${idx * 120 + 220}ms` }}
              >
                <div className="w-16 h-16 primary_bg rounded-full flex items-center justify-center">
                  {iconMap[feature.icon]}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {feature.bullets.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 primary_bg rounded-full flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="text-neutral-500 text-sm sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
