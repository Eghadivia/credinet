"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(
  () => import("@/features/auth/login/login").then((mod) => mod.LoginForm),
  {
    ssr: false, // IMPORTANT FIX
    loading: () => <p className="text-lg text-center"></p>,
  },
);

export default function Page() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] h-full">
      <LoginForm />
    </main>
  );
}