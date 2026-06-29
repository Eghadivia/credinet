"use client";

import dynamic from "next/dynamic";

const ResetPassword = dynamic(
  () => import("@/features/auth/reset-password/reset-password").then((mod) => mod.default),
  {
    ssr: false, // IMPORTANT FIX
    loading: () => <p className="text-lg text-center"></p>,
  },
);

export default function Page() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] h-full">
      <ResetPassword />
    </main>
  );
}