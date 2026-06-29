"use client";


import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("@/features/dashboard/dashboard").then((mod) => mod.Dashboard),
  {
    ssr: false,
    loading: () => <p className="text-lg text-center"></p>,
  },
);

export default function Page() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] h-full">
      <Dashboard />
    </main>
  );
}