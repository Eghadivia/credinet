import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

import { getAccessToken, setAccessToken } from "@/lib/api/access-token-store";
import { persistClientAuthSession, redirectToLoginAfterAuthFailure } from "@/lib/auth/clear-client-session";
import { getBrowserAuthToken } from "@/lib/auth/get-browser-auth-token";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    silent?: boolean;
  }
}

export { setAccessToken, getAccessToken };

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // for refresh cookie
});

/**
 * REQUEST INTERCEPTOR
 */
axiosInstance.interceptors.request.use((config) => {
  const token = getBrowserAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;

    if (is401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = getBrowserAuthToken();
      const isJwt = Boolean(token && token.split(".").length === 3);

      if (!isJwt) {
        return Promise.reject(error);
      }

      try {
        // refresh using httpOnly cookie
        const res = await axiosInstance.post("/auth/refresh");

        const newToken = res.data.accessToken;

        persistClientAuthSession(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        toast.error("Session expired. Please login again.");
        redirectToLoginAfterAuthFailure();
        return Promise.reject(err);
      }
    }

    if (!originalRequest?.silent && error.response?.data?.message) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
