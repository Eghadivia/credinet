"use client";

import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  History,
  Search,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Zap,
  Lightbulb,
} from "lucide-react";
import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import ServiceCard from "@/features/dashboard/service-card";
import TransactionTable from "@/features/dashboard/transaction-table";
import { useTransactions } from "@/queries/transaction";
import { useCurrentUser } from "@/queries/auth";
import Link from "next/link";

function mapStatus(
  status?: string,
): "SUCCESSFUL" | "PENDING" | "FAILED" | "REFUNDED" {
  const s = (status || "").toLowerCase();

  if (s.includes("success")) return "SUCCESSFUL";
  if (s.includes("fail")) return "FAILED";
  if (s.includes("refund")) return "REFUNDED";
  if (s.includes("pend")) return "PENDING";

  return "PENDING";
}

function getIcon(type?: string) {
  const t = (type || "").toLowerCase();

  if (t.includes("airtime"))
    return <Smartphone className="w-5 h-5 text-red-600" />;
  if (t.includes("data")) return <Wifi className="w-5 h-5 text-green-600" />;
  if (t.includes("electric"))
    return <Lightbulb className="w-5 h-5 text-yellow-600" />;
  if (t.includes("tv")) return <Tv className="w-5 h-5 text-blue-600" />;

  return <Smartphone className="w-5 h-5 text-gray-500" />;
}

export function Dashboard() {
  const { data, isLoading } = useTransactions();
  const { data: user } = useCurrentUser();

  // ✅ TAKE ONLY LATEST 4
  const transactions = (data || [])
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    )
    .slice(0, 4)
    .map((tx) => ({
      id: tx.id,
      serviceType: tx.type || "Unknown",
      provider: tx.provider || "N/A",
      amount: Number(tx.amount || 0),
      dateTime: new Date(tx.createdAt!).toLocaleString(),
      status: mapStatus(tx.status),
      icon: getIcon(tx.type),
    }));

  const serviceCards = [
    {
      icon: <Smartphone className="w-8 h-8 text-red-600" />,
      title: "Airtime Recharge",
      description: "Top up mobile credits instantly",
      href: "/payments/airtime",
      accent: "bg-[#ff6b68]",
      iconColor: "bg-red-100" as const,
      iconColorDark: "text-red-600" as const,
    },
    {
      icon: <Wifi className="w-8 h-8 text-green-600" />,
      title: "Data Bundle Purchase",
      description: "Stay connected anywhere",
      href: "/payments/data",
      accent: "bg-[#17c964]",
      iconColor: "bg-green-100" as const,
      iconColorDark: "text-green-600" as const,
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "Electricity Bill Payment",
      description: "Power up your home",
      href: "/payments/electricity",
      accent: "bg-[#f5c542]",
      iconColor: "bg-yellow-100" as const,
      iconColorDark: "text-yellow-600" as const,
    },
    {
      icon: <Tv className="w-8 h-8 text-blue-600" />,
      title: "Cable TV Subscription",
      description: "Renew your cable channels",
      href: "/payments/cable-tv",
      accent: "bg-[#4f9cff]",
      iconColor: "bg-blue-100" as const,
      iconColorDark: "text-blue-600" as const,
    },
  ];

  const firstName = user?.firstName || "User";
  const allTransactions = data || [];
  const totalSpent = allTransactions.reduce(
    (sum, tx) => sum + Number(tx.amount || 0),
    0,
  );
  const successfulCount = allTransactions.filter((tx) =>
    String(tx.status || "").toLowerCase().includes("success"),
  ).length;
  const totalTransactions = allTransactions.length;
  const lastTransaction = allTransactions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    )[0];
  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div className="mx-auto max-w-7xl">
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#f2dfe9] bg-[#fff2f7] px-6 py-8 shadow-[0_18px_50px_rgba(168,85,247,0.06)] sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.20),transparent_28%),radial-gradient(circle_at_72%_75%,rgba(244,92,160,0.16),transparent_24%)]" />
            <img
              src="/assets/images/phone.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 hidden w-75 -translate-y-1/2 select-none md:block lg:right-10 lg:w-85"
            />
            <div className="relative">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#d9467c]">
                Welcome to Credinet
              </p>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
                Good morning, {firstName}! 👋
              </h1>
              <p className="mt-4 text-lg font-medium text-[#55555d]">
                What would you like to do today?
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/payments"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] px-7 text-sm font-black text-white shadow-[0_18px_38px_rgba(242,33,124,0.18)]"
                >
                  Make a Payment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/transaction-history"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#e7d8ee] bg-white/70 px-7 text-sm font-black text-[#6d4a87] backdrop-blur hover:bg-white"
                >
                  View History
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Total Spend",
                value: formatNaira(totalSpent),
                hint: "Across all transactions",
              },
              {
                label: "Successful",
                value: String(successfulCount),
                hint: `${totalTransactions} total transaction${totalTransactions === 1 ? "" : "s"}`,
              },
              {
                label: "Last Activity",
                value: lastTransaction ? mapStatus(lastTransaction.status) : "None",
                hint: lastTransaction
                  ? new Date(lastTransaction.createdAt!).toLocaleDateString()
                  : "Start your first payment",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#eeeaf3] bg-white p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b1a8bb]">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#171717]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-[#77777c]">{item.hint}</p>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <h2 className="text-xl font-black text-[#171717]">Quick Actions</h2>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((card, index) => (
              <ServiceCard key={index} {...card} />
            ))}
          </div>

          <div className="mb-6 grid gap-4 rounded-2xl border border-[#eadff5] bg-[#fbf7ff] p-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BadgeCheck,
                title: "Fast, Secure & Reliable",
                copy: "All transactions are processed instantly and securely.",
              },
              {
                icon: Zap,
                title: "Instant Delivery",
                copy: "Quick & reliable",
              },
              {
                icon: ShieldCheck,
                title: "100% Secure",
                copy: "Your security is our priority",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                copy: "We're here to help",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-center gap-3 lg:border-r lg:border-[#e4d7f1] lg:last:border-r-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8b5cf6] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#2b2434]">{title}</p>
                  <p className="text-xs leading-5 text-[#77777c]">{copy}</p>
                </div>
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-[28px] border border-[#f0eeee] bg-white p-6 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
              <p className="text-[#77777c]">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="rounded-2xl border border-[#eeeaf3] bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#171717]">
                  Recent Transactions
                </h2>
                <a
                  href="/transaction-history"
                  className="inline-flex items-center gap-2 text-[#8b5cf6] hover:text-[#f45ca0] font-black text-sm"
                >
                  View all history <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <TransactionTable transactions={transactions} />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#eeeaf3] bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-[#171717]">
                  Recent Transactions
                </h2>
              </div>
              <div className="flex min-h-70 flex-col items-center justify-center text-center">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#f5efff] text-[#8b5cf6]">
                  <Search className="h-11 w-11" />
                  <span className="absolute -right-2 top-4 text-[#f45ca0]">✦</span>
                  <span className="absolute -left-2 bottom-5 text-[#8b5cf6]">✦</span>
                </div>
                <h3 className="text-lg font-black text-[#171717]">
                  No transactions yet
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#77777c]">
                  You haven't made any transactions yet. Your recent transactions
                  will appear here.
                </p>
                <Link
                  href="/payments"
                  className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] px-7 text-sm font-black text-white shadow-[0_18px_38px_rgba(242,33,124,0.18)]"
                >
                  Make Your First Transaction
                </Link>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
