import authApi from "@/lib/api/instance/authApi";
import requestData from "@/lib/api/request-data";
import { extractAccessTokenFromLoginPayload } from "@/lib/auth/extract-login-token";
import { extractLoginRoleFromApiData } from "@/lib/auth/post-login-path";
import {
  RegisterFormData,
  SignInFormData,
  UserProfile,
} from "@/types/auth.type";

export const AuthService = {
  // LOGIN
  async signIn(
    values: SignInFormData
  ): Promise<{ message: string; accessToken?: string; role?: string }> {
    const response = await requestData<SignInFormData, any>(
      authApi,
      "post",
      "/auth/login",
      values
    );

    if (!response?.success) {
      throw new Error(response?.message || "Login failed");
    }

    const root = response as unknown as Record<string, unknown>;
    const nested = root.data;

    /** Flat Nest body: `{ success, message, accessToken, role, refreshToken }` — read root first. */
    const accessToken =
      (typeof root.accessToken === "string" && root.accessToken.trim()) ||
      (typeof root.token === "string" && root.token.trim()) ||
      extractAccessTokenFromLoginPayload(nested) ||
      extractAccessTokenFromLoginPayload(root);

    const role =
      (typeof root.role === "string" && root.role.trim()) ||
      extractLoginRoleFromApiData(nested) ||
      extractLoginRoleFromApiData(root);

    return {
      message: String(response.message ?? "Login successful"),
      accessToken,
      role,
    };
  },

  // REGISTER
  async register(values: RegisterFormData): Promise<{ message: string }> {
    const response = await requestData<RegisterFormData, { message: string }>(
      authApi,
      "post",
      "/auth/register",
      values
    );
    const data = response?.data ?? response;

    if (!data?.message) {
      throw new Error("Registration failed");
    }

    return { message: response.message! };
  },
  // VERIFY OTP
  async verifyOtp(email: string, code: string) {
    const response = await requestData<
      { email: string; code: string },
      { success: boolean; message: string }
    >(authApi, "post", "/auth/verify-otp", {
      email,
      code,
    });

    const data = response?.data ?? response;

    if (!data?.success) {
      throw new Error(data?.message || "OTP verification failed");
    }

    return { message: response.message! };
  },

  // FORGOT PASSWORD
  async forgotPassword(emailOrPhone: string): Promise<{ message: string }> {
    const response = await requestData<
      { emailOrPhone: string },
      { message: string }
    >(authApi, "post", "/auth/forgot-password", {
      emailOrPhone,
    });

    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }
    return { message: response.message! };
  },

  // VERIFY RESET OTP
  async verifyResetOtp(
    email: string,
    code: string
  ): Promise<{ message: string }> {
    const response = await requestData<
      { email: string; code: string },
      { message: string }
    >(authApi, "post", "/auth/verify-reset-otp", {
      email,
      code,
    });
    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }
    return { message: response.message! };
  },

  // RESET PASSWORD
  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await requestData<
      { email: string; newPassword: string },
      { message: string }
    >(authApi, "post", "/auth/reset-password", {
      email,
      newPassword,
    });

    const data = response?.data ?? response;
    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }
    return { message: response.message! };
  },

  // CHANGE PASSWORD (LOGGED-IN USER)
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await requestData<
      { currentPassword: string; newPassword: string },
      { message: string }
    >(authApi, "post", "/auth/change-password", {
      currentPassword,
      newPassword,
    });

    if (!response.success) {
      throw new Error(response.message || "Change password failed");
    }

    return { message: response.message! };
  },

  // GET CURRENT USER (VERY IMPORTANT)
  async getCurrentUser(): Promise<UserProfile> {
    const response = await requestData<null, any>(authApi, "get", "/auth/me");

    // fallback for raw response
    if (response.success === undefined) {
      return response as unknown as UserProfile;
    }

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user");
    }

    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await requestData<null, { message: string }>(
      authApi,
      "post",
      "/auth/logout"
    );

    if (!response.success) {
      throw new Error(response.message || "Logout failed");
    }

    return { message: response.message! };
  },

  async refresh(): Promise<{ accessToken: string }> {
    const response = await requestData<null, { accessToken: string }>(
      authApi,
      "post",
      "/auth/refresh"
    );

    if (!response.data) {
      throw new Error("Logout failed");
    }

    return response.data;
  },

  // RESEND RESET OTP
  async resendResetOtp(email: string): Promise<{ message: string }> {
    const response = await requestData<{ email: string }, { message: string }>(
      authApi,
      "post",
      "/auth/resend-reset-otp",
      {
        email,
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Resend OTP failed");
    }

    return { message: response.message! };
  },

  // UPDATE PROFILE
  async updateProfile(values: {
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<{ message: string; data: UserProfile }> {
    const response = await requestData<
      {
        firstName: string;
        lastName: string;
        phone: string;
      },
      {
        message: string;
        data: UserProfile;
      }
    >(authApi, "put", "/auth/update-profile", values);

    if (!response.success) {
      throw new Error(response.message || "Profile update failed");
    }

    return {
      message: response.message!,
      data: response.data,
    };
  },
};
