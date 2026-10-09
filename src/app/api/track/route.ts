import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "page_view", "machine_view", "raw_view", "offer_view", "spare_view",
  "gallery_view", "whatsapp_click", "enquiry", "ticket", "newsletter", "roi_calc", "faq_view",
]);

function deviceOf(ua: string) {
  if (!ua) return "unknown";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = String(body.type || "");
    if (!ALLOWED.has(type)) return NextResponse.json({ ok: false, error: "Unknown event type" }, { status: 400 });
    const ua = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const source =
      /wa\.me|whatsapp/i.test(referer) ? "whatsapp"
      : /google/i.test(referer) ? "google"
      : /facebook|instagram/i.test(referer) ? "social"
      : referer ? "referral" : String(body.source || "direct");

    await db.insert(events).values({
      type,
      path: String(body.path || "").slice(0, 300) || null,
      entityId: Number(body.entityId) || null,
      entityName: body.entityName ? String(body.entityName).slice(0, 200) : null,
      lang: ["en", "hi", "or"].includes(String(body.lang)) ? String(body.lang) : "en",
      device: deviceOf(ua),
      source,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
