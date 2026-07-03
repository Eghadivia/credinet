'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#security', label: 'Security' },
  { href: '#faq', label: 'FAQ' },
];

export default function Home2Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/home-2" className="flex items-center">
          <img
            src="/assets/images/newlogo.png"
            alt="CrediNet"
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-10 text-[15px] font-medium text-[#191919] lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#ff4d54]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="text-[15px] font-medium text-[#191919] underline-offset-4 hover:underline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-13 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4b4b] via-[#ee4cae] to-[#7c3aed] px-8 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(164,55,255,0.22)]"
          >
            Create Account
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/login" className="text-sm font-medium text-[#191919]">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4b4b] via-[#ee4cae] to-[#7c3aed] px-4 text-sm font-semibold text-white"
          >
            Create Account
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ebeaf3] text-[#191919]"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88%] max-w-80 border-l border-[#ece8f7] bg-white p-0"
            >
              <div className="flex h-full flex-col px-6 py-8">
                <img
                  src="/assets/images/newlogo.png"
                  alt="CrediNet"
                  className="h-10 w-fit"
                />
                <nav className="mt-8 flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        className="rounded-2xl border border-[#f0edf8] px-4 py-4 text-base font-semibold text-[#191919]"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto grid gap-3">
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-[#ece8f7] text-sm font-semibold text-[#191919]"
                    >
                      Sign in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/signup"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4b4b] via-[#ee4cae] to-[#7c3aed] text-sm font-semibold text-white"
                    >
                      Create Account
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
