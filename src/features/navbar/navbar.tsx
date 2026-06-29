"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLoading } from "@/components/global/global-loader/global-loader";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useLoading();

  const go = (href: string) => {
    startLoading();
    router.push(href);
  };

  return (
    <nav className="sticky top-0 z-50  bg-[#0B014B] h-[81px]">
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <img
                src="/logo.png"
                alt="CrediNet"
                className="h-12 sm:h-12.5 w-auto object-contain md:object-cover md:w-33 rounded-md md:rounded-none  md:bg-transparent md:p-0"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#services"
              className="text-white hover:text-red-500 transition"
            >
              Services
            </Link>

            <Link
              href="/#how"
              className="text-white hover:text-red-500 transition"
            >
              How it Works
            </Link>

            <Link
              href="/#benefits"
              className="text-white hover:text-red-500 transition"
            >
              Benefits
            </Link>
          </div>
          {/* Desktop auth actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Login */}
            <button
              type="button"
              onClick={() => go("/login")}
              className={`px-4 py-2 rounded-md transition ${
                pathname === "/login"
                  ? "primary_bg text-white font-semibold"
                  : "text-white hover:text-red-500"
              }`}
            >
              Login
            </button>

            {/* Signup */}
            <Button
              onClick={() => go("/signup")}
              className={`px-6 py-2.5 text-base rounded-md transition ${
                pathname === "/" || pathname === "/signup"
                  ? "primary_bg text-white font-semibold"
                  : "text-white bg-transparent hover:bg-[#f83b31]"
              }`}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile hamburger (right-side menu) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 transition"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="text-white border-white/10 bg-gradient-to-b from-[#0B014B] via-[#1a0f6b] to-[#0f0a52]"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 -right-24 h-[280px] w-[280px] rounded-full bg-[#F84B44]/20 blur-3xl" />
                  <div className="absolute -bottom-28 left-12 h-[260px] w-[260px] rounded-full bg-blue-500/20 blur-3xl" />
                </div>
                <div className="relative px-6 pt-6 pb-6 flex flex-col h-full pt-10">

                  <div className="my-6 h-px bg-white/10" />

                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => go("/#services")}
                        className="rounded-xl px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 transition"
                      >
                        Services
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => go("/#how")}
                        className="rounded-xl px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 transition"
                      >
                        How it Works
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => go("/#benefits")}
                        className="rounded-xl px-3 py-3 text-white/90 hover:text-white hover:bg-white/10 transition"
                      >
                        Benefits
                      </button>
                    </SheetClose>
                  </div>

                  <div className="mt-6 h-px bg-white/10" />

                  <div className="mt-auto pt-6 grid grid-cols-1 gap-3">
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => go("/login")}
                        className={`w-full text-center rounded-lg px-4 py-3 font-semibold transition ${
                          pathname === "/login"
                            ? "primary_bg text-white"
                            : "bg-white/10 hover:bg-white/15 text-white"
                        }`}
                      >
                        Login
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button type="button" onClick={() => go("/signup")} className="w-full">
                        <Button className="w-full h-12 rounded-lg primary_bg hover:bg-[#e73f39] text-white font-semibold">
                          Sign Up
                        </Button>
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
