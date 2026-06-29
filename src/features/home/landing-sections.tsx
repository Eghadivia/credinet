import Link from 'next/link';
import { ChevronDown, Sparkles, Star } from 'lucide-react';
import { faqs, reviews, security, services, stats, steps } from './landing-data';
import type { ServiceItem } from './landing-data';

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, copy }: ServiceItem) {
  return (
    <article className="rounded-2xl border border-[#f0eeee] bg-white p-5 shadow-[0_18px_50px_rgba(23,23,23,0.04)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(238,28,37,0.10)]">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4f4] text-[#ee1c25]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-[15px] font-bold text-[#171717]">{title}</h3>
      <p className="text-sm leading-6 text-[#77777c]">{copy}</p>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our services"
          title="Recharge has never felt this good."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="bg-[#171719] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={value}>
            <p className="text-3xl font-black text-[#ff5a57] sm:text-4xl">
              {value}
            </p>
            <p className="mt-2 text-sm font-medium text-white/55">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="How it works" title="Done before your tea cools." />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, copy]) => (
            <article
              key={number}
              className="rounded-2xl border border-[#f0eeee] bg-white p-7"
            >
              <p className="mb-8 text-2xl font-black text-[#ff5a57]">
                {number}
              </p>
              <h3 className="mb-2 text-lg font-black">{title}</h3>
              <p className="text-sm leading-6 text-[#77777c]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SecuritySection() {
  return (
    <section id="security" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Safe by design"
          title="Your money, fully protected."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {security.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#f0eeee] bg-white p-5"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4f4] text-[#ee1c25]">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mb-2 text-sm font-black">{title}</h3>
              <p className="text-sm leading-6 text-[#77777c]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Reviews" title="Customers love us." />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map(([name, quote]) => (
            <article
              key={name}
              className="rounded-2xl border border-[#f0eeee] bg-white p-6"
            >
              <div className="mb-5 flex gap-1 text-[#ffbf2f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#ffbf2f]" />
                ))}
              </div>
              <p className="mb-5 text-sm leading-6 text-[#55555d]">
                &quot;{quote}&quot;
              </p>
              <p className="text-sm font-black">{name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Quick answers." />
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-2xl border border-[#f0eeee] bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-6 text-[#77777c]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] px-6 py-14 text-center text-white shadow-[0_30px_90px_rgba(242,33,124,0.24)] sm:py-16">
        <Sparkles className="mx-auto mb-5 h-8 w-8" />
        <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-5xl">
          Get on Credinet today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
          Join thousands already paying bills faster with a secure, simple
          dashboard.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-black text-[#ee1c25] transition hover:bg-[#fff6f6]"
        >
          Create Account
        </Link>
      </div>
    </section>
  );
}
