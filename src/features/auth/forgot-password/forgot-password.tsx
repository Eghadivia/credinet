"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HomeHeader from "@/features/home/home-header";
import { useForgotPassword } from "@/queries/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoaderBtn from "@/components/global/loader-btn/loader-btn";


export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");  
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await forgotPasswordMutation.mutateAsync({
        emailOrPhone: email,
      });

      toast.success(res.message || "OTP sent successfully");     
      router.push(`/verify-otp?email=${email}&type=reset`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <HomeHeader />

      <div className="relative flex items-center justify-center px-4 py-20">
        <div className="pointer-events-none absolute left-1/2 top-8 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ffebe9] blur-3xl" />
        <div className="relative w-full max-w-lg bg-white/90 rounded-[32px] p-8 shadow-[0_24px_70px_rgba(23,23,23,0.08)] border border-[#f0eeee]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Password help
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-[#171717] mb-3">
            Forgot Password
          </h1>

          <p className="text-base text-[#77777c] mb-8">
            Enter your registered email address and we’ll send you a one-time
            password (OTP) to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-neutral-600 mb-3">
                Email Address
              </label>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 mt-2 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] placeholder:text-sm text-neutral-600 mb-2"
                required
              />
            </div>

            <LoaderBtn
              type="submit"
              disabled={forgotPasswordMutation.isPending}
                loading={forgotPasswordMutation.isPending}
              className="w-full h-12 rounded-full text-base font-black bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white hover:bg-[#ee1c25] cursor-pointer"
            >
              Send OTP
            </LoaderBtn>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            
            <Link
              href="/login"
              className="text-[#ff5a57] font-black hover:underline ml-1 cursor-pointer"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
