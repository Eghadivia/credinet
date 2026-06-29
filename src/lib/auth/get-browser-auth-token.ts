import Cookies from "js-cookie";

import { getAccessToken } from "@/lib/api/access-token-store";

/**
 * Token sources the SPA uses for `Authorization: Bearer …` on API calls.
 * Order: in-memory (same tab, before reload) → localStorage → cookies (`accessToken`, `token`).
 *
 * Note: cookies set on the **app origin** are not automatically sent to a **different-origin**
 * API URL in the `Cookie` header; this helper reads them in JS so we can attach Bearer instead.
 * HttpOnly cookies are invisible here — backend must return a body token for those flows.
 */
export function getBrowserAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const mem = getAccessToken()?.trim();
  if (mem) return mem;

  try {
    const ls = localStorage.getItem("token")?.trim();
    if (ls) return ls;
  } catch {
    /* storage blocked */
  }

  const fromAccess = Cookies.get("accessToken")?.trim();
  if (fromAccess) return fromAccess;

  const fromToken = Cookies.get("token")?.trim();
  if (fromToken) return fromToken;

  return null;
}
