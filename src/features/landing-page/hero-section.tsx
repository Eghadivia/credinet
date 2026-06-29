"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Smartphone,
  Tv,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll<HTMLElement>(".u-reveal"));

    // Fallback: if IntersectionObserver isn't available, just show everything.
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

  return (
    <section className="relative overflow-hidden bg-[#0B014B]">
      <div ref={rootRef}>
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0">

          <div className="absolute inset-0 bg-[#0B014B]/70" />
          <div
            className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#F84B44]/25 blur-3xl"
          />
          <div
            className="absolute -left-32 top-20 h-90 w-90 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-14 sm:py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="max-w-142 text-white space-y-8">
                {/* Badge */}
                <div
                  className="u-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-700/60 bg-white/5 backdrop-blur"
                  style={{ animationDelay: "120ms" }}
                >
                  <div className="w-2 h-2 bg-[#F84B44] rounded-full" />
                  <span className="text-sm font-medium">
                    The #1 Utility Payment Platform
                  </span>
                </div>

                <h1
                  className="u-reveal text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight pjs_font"
                  style={{ animationDelay: "220ms" }}
                >
                  Simplify Your{" "}
                  <span className="pjs_font primary_clr">Utility Payments</span>{" "}
                  in One Place
                </h1>

                <p
                  className="u-reveal text-[#DBEAFE] text-base sm:text-lg lg:text-xl leading-relaxed inter_font"
                  style={{ animationDelay: "320ms" }}
                >
                  Fast, secure, and reliable platform to pay for your airtime,
                  data bundles, electricity bills, and cable TV subscriptions
                  instantly.
                </p>

                <div
                  className="u-reveal flex flex-col sm:flex-row gap-3 sm:gap-4"
                  style={{ animationDelay: "420ms" }}
                >
                  <Link href="/signup">
                    <Button className="primary_bg h-auto hover:bg-red-700 font-semibold text-white py-3 text-lg px-8 sm:px-10 cursor-pointer">
                      Get Started Now <ArrowRight />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-[#2563EB] bg-[#1E40AF] h-auto font-semibold text-white hover:bg-blue-500 hover:text-white text-lg py-3 px-8 sm:px-10 cursor-pointer"
                    >
                      Login to Account
                    </Button>
                  </Link>
                </div>

                <div
                  className="u-reveal flex flex-wrap gap-x-6 gap-y-3 pt-4"
                  style={{ animationDelay: "560ms" }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F84B44]" />
                    <span className="text-sm font-medium text-[#BFDBFE]">
                      Instant Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F84B44]" />
                    <span className="text-sm font-medium text-[#BFDBFE]">
                      24/7 Support
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F84B44]" />
                    <span className="text-sm font-medium text-[#BFDBFE]">
                      Secure Payments
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Illustration and Quick Services */}
              <div className="relative">
                <div className="mx-auto w-full max-w-130 lg:max-w-none">
                  {/* Mock "person" illustration (no external image dependency) */}
                  <div
                    className="u-reveal relative rounded-[30px] overflow-hidden border border-white/10 bg-linear-to-br from-white/10 to-white/5 shadow-2xl"
                    style={{ animationDelay: "180ms" }}
                  >
                    <div
                      className="absolute -top-24 -right-24 h-65 w-65 rounded-full bg-[#F84B44]/30 blur-2xl"
                    />
                    <div
                      className="absolute -bottom-28 left-10 h-60 w-60 rounded-full bg-blue-500/25 blur-2xl"
                    />
                    <div className="relative p-6 sm:p-8 h-90 sm:h-100 lg:h-115">
                      <Image
                        src="/men.png"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                      />

                    </div>
                  </div>

                  {/* Quick Services Card */}
                  <div className="relative -mt-14 sm:-mt-16 lg:absolute lg:-bottom-6 lg:left-0 lg:translate-y-0">
                    <div
                      className="u-reveal bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-neutral-100 w-full sm:w-85 lg:w-[288px] mx-auto lg:mx-0"
                      style={{ animationDelay: "360ms" }}
                    >
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4">
                        Quick Services
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center gap-2 transition hover:scale-[1.03]">
                          <div className="w-29.5 h-17.5 bg-blue-50 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <span className="text-[11px] font-medium text-gray-700 mt-1">
                              Airtime
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 transition hover:scale-[1.03]">
                          <div className="w-29.5 h-17.5 bg-red-50 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <Wifi className="w-5 h-5 text-red-500" />
                            <span className="text-[11px] font-medium text-gray-700 mt-1">
                              Data
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 transition hover:scale-[1.03]">
                          <div className="w-29.5 h-17.5 bg-sky-50 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <Lightbulb className="w-5 h-5 text-sky-600" />
                            <span className="text-[11px] font-medium text-gray-700 mt-1">
                              Power
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 transition hover:scale-[1.03]">
                          <div className="w-29.5 h-17.5 bg-slate-100 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <Tv className="w-5 h-5 text-slate-600" />
                            <span className="text-[11px] font-medium text-gray-700 mt-1">
                              Cable TV
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
