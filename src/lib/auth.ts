import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { PERMISSIONS, ROLE_LABELS, can, type Resource, type Role } from "./permissions";

export { PERMISSIONS, ROLE_LABELS, can };
export type { Resource, Role };

const SECRET = process.env.AUTH_SECRET || "milan-enterprises-dev-secret-change-me";
export const COOKIE_NAME = "me_session";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function signToken(payload: Record<string, unknown>, ttlSeconds = 60 * 60 * 24 * 7): string {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const data = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyToken<T = Record<string, unknown>>(token?: string | null): T | null {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = sign(data);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T & { exp: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export type SessionUser = { id: number; name: string; email: string; role: Role; avatar?: string | null };

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const payload = verifyToken<SessionUser>(token);
  return payload;
}

export async function requireResource(resource: Resource): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Not authenticated");
  if (!can(session.role, resource)) throw new HttpError(403, "You do not have permission for this action");
  return session;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
