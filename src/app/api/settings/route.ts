import { NextRequest, NextResponse } from "next/server";
import { HttpError, getSession, requireResource } from "@/lib/auth";
import { getSettings, setSetting } from "@/lib/settings";
import { logActivity } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Public safe subset — never exposes secrets or admin config. */
export async function GET() {
  const s = await getSettings();
  const session = await getSession();
  if (session?.role) return NextResponse.json({ data: s, admin: true });
  return NextResponse.json({
    data: { company: s.company, counters: s.counters, festival: s.festival, features: s.features, seo: s.seo },
    admin: false,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireResource("settings");
    const body = await req.json();
    for (const [key, value] of Object.entries(body || {})) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const current = (await getSettings()) as any;
        await setSetting(key, { ...(current[key] || {}), ...(value as object) });
      } else {
        await setSetting(key, value);
      }
    }
    await logActivity(session.name, "updated settings", "settings", Object.keys(body || {}).join(", "));
    return NextResponse.json({ ok: true, data: await getSettings() });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}
