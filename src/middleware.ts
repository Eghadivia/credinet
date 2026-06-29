import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPostLoginPath } from "@/lib/auth/post-login-path";

const AUTH_ONLY_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/payments",
  "/transaction-history",
  "/settings",
];

function base64UrlDecodeToString(input: string): string {
  // JWT uses base64url (RFC 7515): '-' -> '+', '_' -> '/', with optional padding.
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLen);
  return Buffer.from(padded, "base64").toString("utf8");
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  // Opaque / dummy tokens (e.g. admin test credentials) must NOT count as a session here,
  // or /login redirects to /dashboard while APIs 401 → refresh fails → infinite loop.
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(base64UrlDecodeToString(parts[1]));
    if (!payload?.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Support both cookie names seen in this codebase/backends.
  const token =
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("token")?.value;
  const isValid = isTokenValid(token);

  const forceAuthScreen =
    request.nextUrl.searchParams.get("force") === "1";

  // Let users stay on login/signup after a failed refresh (see redirectToLoginAfterAuthFailure).
  if (forceAuthScreen && AUTH_ONLY_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Already logged-in user should NEVER see login/signup/etc.
  if (isValid && AUTH_ONLY_ROUTES.includes(pathname)) {
    const dest = getPostLoginPath(null, token);
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payments/:path*",
    "/transaction-history/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
