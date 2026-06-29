"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { LoginFormData, loginSchema } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { useSignIn } from "@/queries/auth";
import { toast } from "@/components/ui/sonner";
import LoaderBtn from "@/components/global/loader-btn/loader-btn";
import HomeHeader from "@/features/home/home-header";
import { clearClientAuthSession, persistClientAuthSession } from "@/lib/auth/clear-client-session";
import { getPostLoginPath, syncAdminRbacStorage } from "@/lib/auth/post-login-path";

const DUMMY_ADMIN_CREDENTIALS = {
  role: "admin",
  email: "test@yopmail.com",
  password: "test@123#",
  /** Not a JWT — only for local UI smoke tests. */
  token: "test-admin-token",
} as const;

const DUMMY_LOGINS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DUMMY_ADMIN_LOGIN === "true";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");

  /** After refresh failure we land with ?force=1; clear client + server cookies before removing the query. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("force") !== "1") return;

    let cancelled = false;
    clearClientAuthSession();

    void (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (base) {
          await fetch(`${base}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch {
        /* session may already be invalid */
      }
      if (!cancelled) {
        router.replace("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
const { mutate: signIn, isPending: pending} = useSignIn();

// const onSubmit = (data: LoginFormData) => {
//   setErrorMsg("");

//   signIn(
//     {
//       emailOrPhone: data.emailOrPhone,
//       password: data.password,
//     },
//     {
//       onSuccess: (res) => {         
//         toast.success(res.message || "OTP sent successfully");   
//         console.log("res:", res);
              
//         if (res?.accessToken) {      
//           Cookies.set("accessToken", res.accessToken, {
//             sameSite: "lax",
//             secure: process.env.NODE_ENV === "production",
//             path: "/",
//           });
//           localStorage.setItem("token", res.accessToken);
//           setAccessToken(res.accessToken);
//         }
//         window.location.assign("/dashboard");
//       },

//       onError: (error: any) => {
//         const message =
//           error?.response?.data?.message ||
//           error?.message ||
//           "Login failed";

//         setErrorMsg(message);
//       },
//     }
//   );
// };
  const onSubmit = (data: LoginFormData) => {
  setErrorMsg("");

  const email = data.emailOrPhone.trim().toLowerCase();
  /** Super Admin must use the real API — a former dummy shortcut used the same email/password and overwrote cookies with `test-super-admin-token`. */
  const matchedDummyAdmin =
    DUMMY_LOGINS_ENABLED &&
    DUMMY_ADMIN_CREDENTIALS.email === email &&
    DUMMY_ADMIN_CREDENTIALS.password === data.password
      ? DUMMY_ADMIN_CREDENTIALS
      : undefined;

  // Optional dev-only fake Admin (no JWT). Super Admin is always `signIn` → real JWT.
  if (matchedDummyAdmin) {
    const fakeToken = matchedDummyAdmin.token;

    persistClientAuthSession(fakeToken);

    toast.success("Admin (dummy) login — not a real JWT");

    const path = getPostLoginPath(matchedDummyAdmin.role, fakeToken);
    syncAdminRbacStorage(path, matchedDummyAdmin.role, fakeToken);
    window.location.assign(path);

    return;
  }

  // ✅ NORMAL LOGIN API
  signIn(
    {
      emailOrPhone: data.emailOrPhone,
      password: data.password,
    },
    {
      onSuccess: (res) => {
        toast.success(res.message || "Login successful");

        if (!res?.accessToken) {
          toast.error(
            "Login succeeded but no access token was found in the response. Cookies were not set, so APIs will return 401. Ask backend to return a JWT in the JSON body (e.g. accessToken, access_token, or token), or document the exact field name.",
          );
          return;
        }

        persistClientAuthSession(res.accessToken);

        const path = getPostLoginPath(res.role, res.accessToken);
        syncAdminRbacStorage(path, res.role, res.accessToken);
        window.location.assign(path);
      },

      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Login failed";

        setErrorMsg(message);
      },
    }
  );
};
return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <HomeHeader />

      <main className="relative overflow-hidden flex items-center justify-center min-h-[calc(100dvh-80px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-8 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ffebe9] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[#f2e8ff] blur-3xl" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mx-auto w-full max-w-xl rounded-[32px] bg-white/90 backdrop-blur border border-[#f0eeee] shadow-[0_24px_70px_rgba(23,23,23,0.08)] p-6 sm:p-8">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
                  Welcome back
                </p>
                <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.05em] text-[#171717] mb-2">
                  Log in
                </h1>
                <p className="text-sm sm:text-base text-[#77777c] mb-8">
                  Use your email/phone and password to continue.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700 mb-3">
                      Email or phone
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email or phone"
                      {...register("emailOrPhone")}
                      className="h-12 mt-1 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] placeholder:text-sm text-neutral-900"
                    />

                    {errors.emailOrPhone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.emailOrPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700 mb-3">
                      Password
                    </label>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className="h-12 mt-1 rounded-2xl bg-[#f7f7f8] border border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57] placeholder:text-sm text-neutral-900 pr-12"
                      />

                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1">
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

                  {errorMsg && (
                    <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-neutral-700 font-medium hover:underline"
                    >
                      Forgot password?
                    </Link>
                    <Link
                      href="/signup"
                    className="text-sm font-black text-[#ff5a57] hover:underline"
                    >
                      Create account
                    </Link>
                  </div>

                  <LoaderBtn
                    type="submit"
                    disabled={pending}
                    loading={pending}
                    className="w-full h-12 rounded-full text-base font-black mt-2 bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 cursor-pointer"
                  >
                    Login
                  </LoaderBtn>
                </form>

                <p className="mt-6 text-xs text-neutral-500">
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-neutral-800">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-neutral-800">
                    Privacy Policy
                  </Link>
                  .
                </p>
          </div>
        </div>
      </main>
    </div>
  );
}
