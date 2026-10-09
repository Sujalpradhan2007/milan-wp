import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { COOKIE_NAME, signToken, verifyPassword } from "@/lib/auth";
import { logActivity } from "@/lib/queries";
import { ensureAdminUsers } from "@/lib/seed";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; at: number }>();

export async function POST(req: NextRequest) {
  try {
    await ensureAdminUsers();
    const { email, password } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rec = attempts.get(ip) || { count: 0, at: Date.now() };
    if (Date.now() - rec.at > 15 * 60000) { rec.count = 0; rec.at = Date.now(); }
    if (rec.count >= 40) {
      return NextResponse.json({ error: "Too many attempts. Please try again in 15 minutes." }, { status: 429 });
    }
    rec.count += 1;
    attempts.set(ip, rec);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const rows = await db.select().from(users).where(and(eq(users.email, String(email).toLowerCase().trim()))).limit(1);
    const user = rows[0];
    if (!user || !user.active || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await db.update(users).set({ lastLoginAt: sql`now()` }).where(eq(users.id, user.id));
    await logActivity(user.name, "logged in", "auth", user.email);

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
    attempts.delete(ip);
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, sameSite: "lax", secure: false,
      path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
