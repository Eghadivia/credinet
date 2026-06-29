import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import HomeHeader from "@/features/home/home-header";
import { useForm } from "react-hook-form";
import { SignupFormData, signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRegister } from "@/queries/auth";
import LoaderBtn from "@/components/global/loader-btn/loader-btn";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();
  const { isPending } = registerMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
  try {
    const res = await registerMutation.mutateAsync(data);

     // REDIRECT TO OTP PAGE
    window.location.href = `/verify-otp?email=${data.email}`;
    // SUCCESS TOAST
    toast.success(res.message || "OTP sent successfully");  
    
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed";

    toast.error(message);
  }
};
  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col">
      <HomeHeader />

      <main className="relative overflow-hidden flex items-center justify-center min-h-[calc(100dvh-80px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-8 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ffebe9] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[#f2e8ff] blur-3xl" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Card className="w-full max-w-2xl mx-auto rounded-[32px] shadow-[0_24px_70px_rgba(23,23,23,0.08)] border-[#f0eeee] bg-white/90 backdrop-blur">
                <CardContent className="p-6 sm:p-8">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
                    Join Credinet
                  </p>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.05em] text-[#171717] mb-2">
                    Create your account
                  </h1>
                  <p className="text-sm sm:text-base text-[#77777c] mb-8">
                    Sign up to start paying bills and topping up instantly.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    First Name
                  </label>
                  <Input
                    {...register("firstName")}
                    placeholder="Enter first name"
                    className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] text-neutral-900 placeholder:text-sm"
                  />

                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    {...register("lastName")}
                    placeholder="Enter last name"
                    className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] text-neutral-900 placeholder:text-sm"
                  />

                  {errors.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] text-neutral-900 placeholder:text-sm"
                />

                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Mobile Number{" "}
                  <span className="text-neutral-100 placeholder:text-sm">
                    *
                  </span>
                </label>
                <div className="flex gap-2 mt-1">
                  <div className="flex items-center gap-1 px-3 h-12 rounded-2xl bg-[#f7f7f8] text-sm text-foreground min-w-17.5 justify-center border border-transparent">
                    +234 <span className="text-muted-foreground text-xs">▼</span>
                  </div>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] text-neutral-900 placeholder:text-sm"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
                <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">
                  Mandatory for two-factor authentication
                </p>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] pr-12 text-neutral-900"
                    />

                    {errors.password && (
                      <p className="text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-500 hover:text-neutral-800 hover:bg-white transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 mt-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] pr-12 text-neutral-900"
                    />

                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-500 hover:text-neutral-800 hover:bg-white transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 mt-2">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className="mt-1 h-4 w-4 accent-primary"
                />

                <div className="text-sm text-neutral-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary font-medium">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary font-medium">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              {errors.termsAccepted && (
                <p className="text-xs text-red-500">
                  {errors.termsAccepted.message as string}
                </p>
              )}

              <LoaderBtn
                type="submit"
                 disabled={isPending}
                loading={isPending}
                className="w-full h-12 rounded-full text-base font-black mt-2 bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95"
              >
                Sign Up
              </LoaderBtn>
            </form>

                  <p className="text-center mt-6 text-xs text-neutral-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#ff5a57] font-black hover:underline">
                      Log in
                    </Link>
                  </p>
                </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
