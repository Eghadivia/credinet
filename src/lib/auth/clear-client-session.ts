import Cookies from "js-cookie";

import { setAccessToken } from "@/lib/api/access-token-store";

/**
 * Persists the access token everywhere the HTTP client looks:
 * `localStorage.token`, `accessToken` + `token` cookies, and in-memory store.
 * Matches `createAxiosInstance` cookie options so refresh / admin calls stay authenticated.
 */
export function persistClientAuthSession(accessToken: string) {
  if (typeof window === "undefined") return;
  const t = accessToken.trim();
  if (!t) return;

  localStorage.setItem("token", t);
  setAccessToken(t);

  const secure = window.location.protocol === "https:";
  const cookieOpts = {
    sameSite: (secure ? "none" : "lax") as "none" | "lax",
    secure,
    path: "/",
  };
  Cookies.set("accessToken", t, cookieOpts);
  Cookies.set("token", t, cookieOpts);
}

/** Clears tokens readable from the browser. HttpOnly cookies require a server logout. */
export function clearClientAuthSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("token");
  } catch {
    /* ignore */
  }
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("token", { path: "/" });
  setAccessToken(null);
}

let authFailureRedirectScheduled = false;

/** One redirect per page load to avoid refresh storms from parallel 401s. */
export function redirectToLoginAfterAuthFailure() {
  if (typeof window === "undefined") return;
  if (authFailureRedirectScheduled) return;
  authFailureRedirectScheduled = true;
  clearClientAuthSession();
  window.location.replace(`${window.location.origin}/login?force=1`);
}

