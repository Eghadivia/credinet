/**
 * Pulls an access token from common Nest / Express / Prisma login JSON shapes.
 * Super Admin and normal users sometimes differ only by nesting or snake_case keys.
 */
export function extractAccessTokenFromLoginPayload(payload: unknown): string | undefined {
  const seen = new WeakSet<object>()

  function fromRecord(o: Record<string, unknown>): string | undefined {
    const tokenKeys = [
      'accessToken',
      'access_token',
      'token',
      'jwt',
      'id_token',
      'idToken',
      'bearerToken',
      'bearer_token',
    ] as const
    for (const k of tokenKeys) {
      const v = o[k]
      if (typeof v === 'string') {
        const t = v.trim()
        if (t.length >= 8) return t
      }
    }
    return undefined
  }

  function walk(node: unknown, depth: number): string | undefined {
    if (depth > 8 || node === null || node === undefined) return undefined
    if (typeof node === 'string') {
      const t = node.trim()
      return t.length >= 8 ? t : undefined
    }
    if (typeof node !== 'object' || Array.isArray(node)) return undefined
    if (seen.has(node as object)) return undefined
    seen.add(node as object)

    const o = node as Record<string, unknown>
    const direct = fromRecord(o)
    if (direct) return direct

    const childKeys = ['data', 'payload', 'result', 'auth', 'tokens', 'session', 'login', 'meta']
    for (const k of childKeys) {
      if (k in o) {
        const found = walk(o[k], depth + 1)
        if (found) return found
      }
    }

    if (o.user && typeof o.user === 'object' && depth <= 3) {
      const u = fromRecord(o.user as Record<string, unknown>)
      if (u) return u
    }
    return undefined
  }

  return walk(payload, 0)
}
