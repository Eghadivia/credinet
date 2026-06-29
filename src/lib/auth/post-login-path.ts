import type { AdminRoleId } from "@/types/admin";

import { decodeJwtPayload } from "@/lib/auth/jwt-payload";

/** Pull role string from common Nest / Prisma login response shapes (flat or nested). */
export function extractLoginRoleFromApiData(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  if (typeof d.role === "string" && d.role.trim()) return d.role.trim();
  if (typeof d.userRole === "string" && d.userRole.trim()) return d.userRole.trim();

  const user = d.user;
  if (user && typeof user === "object") {
    const u = user as Record<string, unknown>;
    if (typeof u.role === "string" && u.role.trim()) return u.role.trim();
  }

  const nested = d.data ?? d.payload ?? d.result;
  if (nested && typeof nested === "object") {
    const inner = extractLoginRoleFromApiData(nested);
    if (inner) return inner;
  }

  return undefined;
}

const ADMIN_RBAC_STORAGE_KEY = "credinet_admin_mock_role";

export function extractRolesFromJwtPayload(payload: Record<string, unknown>): string[] {
  const out: string[] = [];

  const role = payload.role;
  if (typeof role === "string") out.push(role);
  if (Array.isArray(role)) {
    for (const x of role) {
      if (typeof x === "string") out.push(x);
    }
  }

  const roles = payload.roles;
  if (Array.isArray(roles)) {
    for (const x of roles) {
      if (typeof x === "string") out.push(x);
    }
  }

  const authorities = payload.authorities;
  if (Array.isArray(authorities)) {
    for (const x of authorities) {
      if (typeof x === "string") out.push(x.replace(/^ROLE_/i, ""));
    }
  }

  return out;
}

function normalizeKey(role: string): string {
  return role.toUpperCase().replace(/-/g, "_");
}

/** True if this role should use the admin panel after login. */
export function isAdminPortalRole(role: string): boolean {
  const u = normalizeKey(role);
  return (
    u === "ADMIN" ||
    u === "SUPER_ADMIN" ||
    u === "SUPERADMIN" ||
    u === "ROLE_SUPER_ADMIN" ||
    u === "ROLE_ADMIN"
  );
}

export function normalizeAdminRbacRole(raw: string | undefined | null): AdminRoleId | null {
  if (!raw) return null;
  const u = normalizeKey(raw);
  if (u === "SUPER_ADMIN" || u === "SUPERADMIN") return "super_admin";
  if (u === "ADMIN") return "admin";
  /** Prisma / Nest sometimes emit enum member names */
  if (u === "ROLE_SUPER_ADMIN" || u === "ROLE_SUPERADMIN") return "super_admin";
  if (u === "ROLE_ADMIN") return "admin";
  return null;
}

/** Where to send the user after a successful login (API role hint + JWT fallback). */
export function getPostLoginPath(
  explicitRole: string | null | undefined,
  accessToken: string | null | undefined,
): "/admin" | "/dashboard" {
  if (explicitRole) {
    return isAdminPortalRole(explicitRole) ? "/admin" : "/dashboard";
  }
  if (!accessToken) return "/dashboard";
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return "/dashboard";
  const roles = extractRolesFromJwtPayload(payload);
  return roles.some(isAdminPortalRole) ? "/admin" : "/dashboard";
}

/** Persist admin RBAC hint for the admin shell; clear when logging in as a normal user. */
export function syncAdminRbacStorage(
  path: "/admin" | "/dashboard",
  explicitRole: string | null | undefined,
  accessToken: string | null | undefined,
) {
  if (typeof window === "undefined") return;
  if (path === "/dashboard") {
    localStorage.removeItem(ADMIN_RBAC_STORAGE_KEY);
    return;
  }
  let rbac: AdminRoleId | null =
    normalizeAdminRbacRole(explicitRole) ??
    (() => {
      if (!accessToken) return null;
      const payload = decodeJwtPayload(accessToken);
      if (!payload) return null;
      for (const r of extractRolesFromJwtPayload(payload)) {
        const n = normalizeAdminRbacRole(r);
        if (n) return n;
      }
      return null;
    })();
  if (!rbac) rbac = "admin";
  localStorage.setItem(ADMIN_RBAC_STORAGE_KEY, rbac);
}

export { ADMIN_RBAC_STORAGE_KEY };
