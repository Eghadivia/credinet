"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Percent } from "lucide-react";
import Image from "next/image";

export default function CashbackSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = Array.from(
      root.querySelectorAll<HTMLElement>(".u-reveal"),
    );

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
      { threshold: 0.12, rootMargin: "160px 0px -10% 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-linear-to-br from-[#0B014B] via-[#1a0f6b] to-[#0f0a52]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-[#F84B44]/30 blur-3xl" />
        <div className="absolute -left-24 top-24 h-75 w-75 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div ref={rootRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center py-10 sm:py-12 lg:py-16">
            <div className="text-white space-y-8">
              <h2
                className="u-reveal text-4xl sm:text-5xl xl:text-[52px] font-extrabold leading-tight"
                style={{ animationDelay: "120ms" }}
              >
                <span className="pjs_font primary_clr">10% Cashback</span> on{" "}
                <br /> First Payment
              </h2>
              <p
                className="u-reveal text-[#DBEAFE] text-base sm:text-xl leading-relaxed max-w-[560px] w-full inter_font"
                style={{ animationDelay: "240ms" }}
              >
                Join the elite circle of CrediNet users today and reclaim a
                fraction of your utility spend. Experience the fusion of luxury
                and utility.
              </p>
              <Button
                className="u-anim-glow primary_bg h-auto hover:bg-red-600 text-white px-6 py-3 text-lg font-semibold"
                style={{ animationDelay: "360ms" }}
              >
                Claim Reward Now <ArrowRight />
              </Button>
            </div>
            <div className="flex h-full justify-center md:justify-end md:items-end">
              <div
                className="u-reveal w-full"
                style={{ animationDelay: "420ms" }}
              >
                <div className="relative mx-auto h-[240px] w-full sm:h-[280px] md:mx-0 md:h-[320px] lg:h-[360px] xl:h-[400px] overflow-visible">
                  <Image
                    src="/business-man.png"
                    alt="Businessman holding cash"
                    fill
                    priority
                    sizes="(min-width: 1280px) 540px, (min-width: 1024px) 520px, (min-width: 768px) 460px, 100vw"
                    className="object-contain object-right-bottom scale-[1.12] sm:scale-[1.18] md:scale-[1.28] lg:scale-[1.33] translate-x-2 sm:translate-x-4 md:translate-x-6 lg:translate-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
