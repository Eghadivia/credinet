import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

import { persistClientAuthSession, redirectToLoginAfterAuthFailure } from "@/lib/auth/clear-client-session";
import { getBrowserAuthToken } from "@/lib/auth/get-browser-auth-token";

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // IMPORTANT for refresh cookie
    headers: {
      "Content-Type": "application/json",
    },
  });

  // =========================
  // REQUEST INTERCEPTOR
  // =========================
  instance.interceptors.request.use((config) => {
    const token = getBrowserAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // =========================
  // RESPONSE INTERCEPTOR (AUTO REFRESH)
  // =========================
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const token = getBrowserAuthToken()
        const isJwt = Boolean(token && token.split('.').length === 3)

        /** Opaque dev tokens cannot be refreshed; avoid logout loop (see login dummy credentials). */
        if (!isJwt) {
          return Promise.reject(error)
        }

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken =
            (res.data as { accessToken?: string; token?: string; access_token?: string })?.accessToken ??
            (res.data as { token?: string })?.token ??
            (res.data as { access_token?: string })?.access_token;

          if (!newAccessToken || typeof newAccessToken !== "string") {
            throw new Error("Refresh response missing access token");
          }

          persistClientAuthSession(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return instance(originalRequest);
        } catch (err) {
          toast.error("Session expired. Please login again.");
          redirectToLoginAfterAuthFailure();
          return Promise.reject(err);
        }
      }

      const isSilent = originalRequest?.silent;

      if (!isSilent && error.response?.data?.message) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};