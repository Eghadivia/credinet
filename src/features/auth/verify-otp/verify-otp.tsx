"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import HomeHeader from "@/features/home/home-header";
import { toast } from "sonner";
import {
  useResendResetOtp,
  useVerifyOtp,
  useVerifyResetOtp,
} from "@/queries/auth";
import LoaderBtn from "@/components/global/loader-btn/loader-btn";

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const verifyOtpMutation = useVerifyOtp();
  const verifyResetOtpMutation = useVerifyResetOtp();
  const [timer, setTimer] = useState(60);
  const resendMutation = useResendResetOtp();

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!email) return;

    try {
      const res = await resendMutation.mutateAsync({ email });

      toast.success(res.message || "OTP resent");

      setTimer(120); // reset countdown
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP";

      toast.error(message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    try {
      let res;

      if (type === "reset") {
        res = await verifyResetOtpMutation.mutateAsync({
          email: email,
          code: otp,
        });

        toast.success(res.message || "OTP verified");

        router.push(`/reset-password?email=${email}`);
      } else {
        // REGISTER FLOW
        res = await verifyOtpMutation.mutateAsync({
          email,
          code: otp,
        });

        toast.success(res.message || "Account verified");

        router.push("/dashboard");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "OTP verification failed";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col">
      <HomeHeader />

      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="pointer-events-none absolute left-1/2 top-8 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ffebe9] blur-3xl" />
        <Card className="relative w-full max-w-md shadow-[0_24px_70px_rgba(23,23,23,0.08)] border-[#f0eeee] rounded-[32px] bg-white/90">
          <CardContent className="p-8">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
                  OTP verification
                </p>
                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717]">Verify Your Identity</h1>

                <p className="text-sm text-[#77777c] mt-2">
                  Enter the 6-digit OTP sent to your email.
                  {/* We've sent a 6-digit code to your registered mobile number +234 (555) 000-0000. Please enter it below to activate your account. */}
                </p>
              </div>

              {/* OTP INPUT */}
              <div className="flex justify-start">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-black bg-[#f7f7f8] border border-transparent rounded-2xl focus:border-[#ff5a57] focus:ring-[#ff5a57]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* SUBMIT */}
              <LoaderBtn
                type="submit"
                className="w-full rounded-full h-12 text-base font-black cursor-pointer bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95"
                disabled={
                  verifyOtpMutation.isPending ||
                  verifyResetOtpMutation.isPending
                }
                loading={
                  verifyOtpMutation.isPending ||
                  verifyResetOtpMutation.isPending
                }
              >
                Verify
              </LoaderBtn>

              {/* RESEND */}
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Didn't receive the code?{" "}
                {timer > 0 ? (
                  <span className="text-gray-400 font-semibold">
                    Resend in {timer}s
                  </span>
                ) : (
                  <LoaderBtn
                    type="button"
                    onClick={handleResend}
                    disabled={resendMutation.isPending}
                    className="bg-transparent! border-none! shadow-none! p-0 h-auto text-[#ff5a57] hover:underline cursor-pointer"
                  >
                    Resend OTP
                    {resendMutation.isPending}
                  </LoaderBtn>
                )}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
