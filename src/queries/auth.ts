
import { AuthService } from "@/services/auth.api";
import { RegisterFormData, SignInFormData, UserProfile } from "@/types/auth.type";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Cookies from "js-cookie";

// LOGIN
export const useSignIn = () => {
  return useMutation<
    { message: string; accessToken?: string; role?: string },
    any,
    SignInFormData
  >({
    mutationFn: AuthService.signIn,
  });
};

// REGISTER
export const useRegister = () =>
  useMutation<{ message: string }, any, RegisterFormData>({
    mutationFn: AuthService.register,
  });

// VERIFY OTP
export const useVerifyOtp = () =>
  useMutation<
    { message: string },
    any,
    { email: string; code: string }
  >({
    mutationFn: ({ email, code }) =>
      AuthService.verifyOtp(email, code),
  });

// FORGOT PASSWORD
export const useForgotPassword = () =>
  useMutation<{ message: string }, any, { emailOrPhone: string }>({
    mutationFn: ({ emailOrPhone }) =>
      AuthService.forgotPassword(emailOrPhone),
  });

// VERIFY RESET OTP
export const useVerifyResetOtp = () =>
  useMutation<
    { message: string },
    any,
    { email: string; code: string }
  >({
    mutationFn: ({ email, code }) =>
      AuthService.verifyResetOtp(email, code),
  });

// RESET PASSWORD
export const useResetPassword = () =>
  useMutation<
    { message: string },
    any,
    { email: string; newPassword: string }
  >({
    mutationFn: ({ email, newPassword }) =>
      AuthService.resetPassword(email, newPassword),
  });

  // CHANGE PASSWORD (LOGGED-IN)
export const useChangePassword = () =>
  useMutation<
    { message: string },
    any,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: ({ currentPassword, newPassword }) =>
      AuthService.changePassword(currentPassword, newPassword),
  });

// CURRENT USER (MOST IMPORTANT)
export const useCurrentUser = () =>
  useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: AuthService.getCurrentUser,
    retry: false, 
  });

// ✅ LOGOUT
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSettled: () => {     
      queryClient.removeQueries({ queryKey: ["me"] });

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("token", { path: "/" });

        window.location.replace("/login");
      }
    },
  });
};

// RESEND RESET OTP
export const useResendResetOtp = () =>
  useMutation<
    { message: string },
    any,
    { email: string }
  >({
    mutationFn: ({ email }) =>
      AuthService.resendResetOtp(email),
  });


  // UPDATE PROFILE
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; data: UserProfile },
    any,
    {
      firstName: string;
      lastName: string;
      phone: string;
    }
  >({
    mutationFn: (values) => AuthService.updateProfile(values),

    onSuccess: (data) => {
      // refresh current user
      queryClient.setQueryData(["me"], data.data);
    },
  });
};