"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import HomeHeader from "@/features/home/home-header";
import { toast } from "sonner";
import { useResetPassword } from "@/queries/auth";
import LoaderBtn from "@/components/global/loader-btn/loader-btn";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordMutation = useResetPassword();

  const hasLength = password.length >= 12;
  const hasMix =
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!hasLength || !hasMix) {
      toast.error("Password does not meet security requirements");
      return;
    }

    try {
      const res = await resetPasswordMutation.mutateAsync({
        email,
        newPassword: password,
      });

      toast.success(res.message || "Password reset successful");

      // ✅ redirect to login after reset
      router.push("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Password reset failed";

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
                  Secure reset
                </p>
                <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717]">
                  Create New Password
                </h1>
                <p className="text-sm text-[#77777c] mt-2">
                  Your identity has been verified. Please choose a strong password.
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] pr-12 h-12 rounded-2xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] pr-12 h-12 rounded-2xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-[#f7f7f8] rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Security Checklist
                </p>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      hasLength ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm">At least 12 characters</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      hasMix ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm">
                    Letters, numbers & symbols
                  </span>
                </div>
              </div>

              {/* Submit */}
              <LoaderBtn
                type="submit"
                className="w-full rounded-full h-12 text-base font-black bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95"
                loading={resetPasswordMutation.isPending}
                disabled={resetPasswordMutation.isPending}
              >
                Reset Password
              </LoaderBtn>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}