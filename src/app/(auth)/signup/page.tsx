"use client";
import dynamic from "next/dynamic";

const SignupForm = dynamic(
  () => import("@/features/auth/signup/signup").then((mod) => mod.SignupForm),
  {
    ssr: false,
    loading: () => (
      <p className="text-lg text-center">Loading signup form...</p>
    ),
  },
);

export default function Page() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] h-full">
      <SignupForm />
    </main>
  );
}
