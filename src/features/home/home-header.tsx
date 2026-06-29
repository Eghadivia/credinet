'use client';

import Link from 'next/link';
import { ArrowRight, Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { navLinks } from './landing-data';

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/4 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/assets/images/newlogo.png"
            alt="Credinet"
            className="h-14 w-auto sm:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4d4d55] md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#ee1c25]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-semibold text-[#27272a]">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#ff5a57] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(238,28,37,0.22)] transition hover:bg-[#ee1c25]"
          >
            Create Account
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ececec] text-[#27272a] transition hover:border-[#ff5a57] hover:text-[#ee1c25] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[86%] max-w-90 overflow-hidden border-l border-[#f0eeee] bg-white text-[#171717]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[#ffebe9] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-6 h-56 w-56 rounded-full bg-[#f2e8ff] blur-3xl" />

            <div className="relative flex h-full flex-col px-6 pb-8 pt-8">
              {/* <div className="mb-8 rounded-[28px] border border-[#f0eeee] bg-[#fbfbfb] p-5 shadow-[0_18px_50px_rgba(23,23,23,0.05)]"> */}
                <img src="/assets/images/new-logo.png" alt="Credinet" className="h-14 w-fit" />
                {/* <p className="mt-4 text-sm leading-6 text-[#77777c]">
                  Recharge, pay bills and stay connected with one secure
                  dashboard.
                </p> */}
              {/* </div> */}

              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-center justify-between rounded-2xl border border-[#f0eeee] bg-white px-4 py-4 text-base font-black text-[#27272a] shadow-[0_12px_30px_rgba(23,23,23,0.04)] transition hover:border-[#ff5a57] hover:text-[#ee1c25]"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-4 w-4 text-[#b5b5bb] transition group-hover:translate-x-1 group-hover:text-[#ee1c25]" />
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto rounded-[28px] border border-[#f0eeee] bg-white p-4 shadow-[0_18px_50px_rgba(23,23,23,0.06)]">
                <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.22em] text-[#ff5a57]">
                  Get started
                </p>
                <div className="grid gap-3">
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-[#ececec] bg-white text-sm font-black text-[#171717] transition hover:border-[#ff5a57] hover:text-[#ee1c25]"
                    >
                      Sign in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/signup"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-sm font-black text-white shadow-[0_18px_38px_rgba(242,33,124,0.22)]"
                    >
                      Create Account
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
