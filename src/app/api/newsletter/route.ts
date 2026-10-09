import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, newsletter } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    const existing = await db.select().from(newsletter).limit(500);
    if (existing.some((e) => e.email === email)) {
      return NextResponse.json({ ok: true, already: true });
    }
    await db.insert(newsletter).values({ email, name: body.name || null });
    await db.insert(events).values({ type: "newsletter", path: "/newsletter", entityName: email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }
}
