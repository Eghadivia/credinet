"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu, Settings } from "lucide-react";
import { useCurrentUser, useLogout } from "@/queries/auth";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Payments", href: "/payments", active: false },
  { label: "History", href: "/transaction-history", active: false },
  { label: "Settings", href: "/settings", active: false },
];

export default function DashboardNav() { 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);  
  const logoutMutation = useLogout();
  const { data: user } = useCurrentUser();
  const pathname = usePathname();

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        toast("You have been logged out successfully");
      },
    });
  }; 
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-black/4 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl">
        <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/assets/images/new-logo.png"
              alt="CrediNet"
              className="h-14 w-auto sm:h-16"
            />
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#f0eeee] bg-[#fbfbfb] p-1 shadow-[0_12px_30px_rgba(23,23,23,0.04)]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-bold transition px-5 py-2.5 rounded-full text-sm ${
                  isActive(item.href)
                    ? "text-white bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] shadow-[0_12px_28px_rgba(242,33,124,0.18)]"
                    : "text-[#4d4d55] hover:text-[#ee1c25]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative hidden rounded-full border border-[#f0eeee] bg-white p-3 text-[#27272a] shadow-sm transition hover:border-[#ff5a57] hover:text-[#ee1c25] sm:inline-flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff5a57] rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="hidden sm:flex items-center gap-2 rounded-full border border-[#f0eeee] bg-white px-2 py-2 pr-4 shadow-sm transition hover:border-[#ff5a57]"
              >
                <div className="w-9 h-9 bg-linear-to-br from-[#ff5a57] to-[#8128ff] rounded-full flex items-center justify-center text-white font-black text-sm">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
                <span className="text-[#27272a] font-bold text-sm">
                  {user?.firstName || "User"}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl border border-[#f0eeee] shadow-[0_18px_50px_rgba(23,23,23,0.10)] p-2 z-10">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#fff4f4] hover:text-[#ee1c25] transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                   <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#fff4f4] hover:text-[#ee1c25] transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                </div>
              )}
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
                  <img src="/assets/images/new-logo.png" alt="Credinet" className="h-14 w-fit" />
                  <nav className="mt-8 flex flex-col gap-3">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={`rounded-2xl border px-4 py-4 text-base font-black shadow-[0_12px_30px_rgba(23,23,23,0.04)] transition ${
                            isActive(item.href)
                              ? "border-[#ff5a57] bg-[#fff4f4] text-[#ee1c25]"
                              : "border-[#f0eeee] bg-white text-[#27272a]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto rounded-[28px] border border-[#f0eeee] bg-white p-4 shadow-[0_18px_50px_rgba(23,23,23,0.06)]">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-[#ff5a57] to-[#8128ff] rounded-full flex items-center justify-center text-white font-black text-sm">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#171717]">{user?.firstName || "User"}</p>
                        <p className="text-xs text-[#77777c]">Signed in</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-sm font-black text-white shadow-[0_18px_38px_rgba(242,33,124,0.22)]"
                      >
                        Logout
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
    <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="rounded-3xl border-[#f0eeee]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            Are you sure you want to logout?
          </p>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="md:w-45 rounded-full"
            >
              Cancel
            </Button>

            <Button
              onClick={confirmLogout}
              disabled={logoutMutation.isPending}
              className="bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white md:w-45 rounded-full font-black shadow-[0_18px_38px_rgba(242,33,124,0.22)] hover:opacity-95"
            >
              {logoutMutation.isPending
                ? "Logging out..."
                : "Yes, Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
  );
}
