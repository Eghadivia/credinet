"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
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
    <section id="how" className="bg-white py-16 md:py-24">
      <div ref={rootRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2
              className="u-reveal text-3xl sm:text-4xl lg:text-[52px] font-extrabold leading-tight pjs_font"
              style={{ animationDelay: "80ms" }}
            >
              How Virtual <span className="pjs_font primary_clr">Top-Up</span>{" "}
              Works
            </h2>
            <p
              className="u-reveal inter_font text-base sm:text-xl text-neutral-500 leading-relaxed"
              style={{ animationDelay: "140ms" }}
            >
              Get started in minutes and handle your everyday utility payments
              faster, with clear steps and instant confirmation.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-5">
              {[
                {
                  title: "Create an Account",
                  desc: "Sign up once using your basic details to get started securely.",
                },
                {
                  title: "Select Service",
                  desc: "Choose the utility you want (Airtime, Data, Electricity, Cable TV).",
                },
                {
                  title: "Make Payment",
                  desc: "Pay instantly using your preferred method and confirm your request.",
                },
                {
                  title: "Receive Confirmation",
                  desc: "Get delivery/activation confirmation right away—no waiting.",
                },
              ].map((step, idx) => (
                <div
                  key={step.title}
                  className="u-reveal flex gap-4 items-start"
                  style={{ animationDelay: `${idx * 130 + 240}ms` }}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl primary_bg text-white flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-neutral-500 inter_font">{step.desc}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-center lg:justify-start">
                <Link href="/signup">
                  <Button className="primary_bg h-auto hover:bg-red-600 text-white px-6 py-3 text-lg font-semibold u-anim-glow">
                    Start Top-Up <ArrowRight />
                  </Button>
                </Link>
              </div>
            </div>

          
              <div className="relative w-full max-w-135">
                <Image
                  src="/assets/images/transaction-sucess.png"
                  alt="Transaction Success"
                  width={540}
                  height={475}
                  className="w-full h-auto rounded-[20px]"
                  priority
                />
              </div>
           
          </div>
        </div>
      </div>
    </section>
  );
}
