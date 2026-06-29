"use client";

import dynamic from "next/dynamic";

const VerifyOtpForm = dynamic(
  () => import("@/features/auth/verify-otp/verify-otp").then((mod) => mod.default),
  {
    ssr: false, // IMPORTANT FIX
    loading: () => <p className="text-lg text-center"></p>,
  },
);

export default function Page() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] h-full">
      <VerifyOtpForm />
    </main>
  );
}