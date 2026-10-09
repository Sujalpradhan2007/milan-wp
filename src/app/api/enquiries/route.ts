import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries, events } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { fillTemplate, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export type EnquiryPayload = {
  type?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  message?: string;
  machineId?: number | null;
  machineName?: string;
  model?: string;
  color?: string;
  capacity?: string;
  price?: number;
  itemId?: number | null;
  itemName?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EnquiryPayload;
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    if (name.length < 2) return NextResponse.json({ error: "Please enter your full name" }, { status: 400 });
    if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });

    const s = await getSettings();
    const row = {
      type: body.type || "general",
      name, phone,
      email: body.email || null,
      city: body.city || null,
      state: body.state || s.company.state,
      message: body.message || null,
      machineId: body.machineId ? Number(body.machineId) : null,
      machineName: body.machineName || null,
      model: body.model || null,
      color: body.color || null,
      capacity: body.capacity || null,
      price: body.price ? Number(body.price) : null,
      itemId: body.itemId ? Number(body.itemId) : null,
      itemName: body.itemName || null,
      status: "new",
      source: body.source || "website",
      notes: [] as any,
    };
    const [created] = (await db.insert(enquiries).values(row).returning()) as any[];

    await db.insert(events).values({
      type: "enquiry", path: `/enquiry/${row.type}`, entityId: created?.id ?? null,
      entityName: name, lang: "en", device: "unknown", source: row.source,
    });

    const tplKey = (["machine", "raw_material", "offer", "service", "general"].includes(String(row.type))
      ? String(row.type)
      : "general") as keyof typeof s.waTemplates;
    const message = fillTemplate(s.waTemplates[tplKey], {
      name: row.name, phone: row.phone, city: row.city || "—",
      machine: row.machineName || "—", model: row.model || "—", color: row.color || "—",
      capacity: row.capacity || "—", price: row.price ? `₹${row.price}` : "—",
      item: row.itemName || "—", ticket: "—", message: row.message || "—",
    });
    const whatsappUrl = waLink(s.company.whatsapp, message);

    return NextResponse.json({ ok: true, id: created?.id ?? null, whatsappUrl, message });
  } catch (err) {
    console.error("[enquiry]", err);
    return NextResponse.json({ error: "Could not save your enquiry. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  const rows = await db.select().from(enquiries).limit(1);
  return NextResponse.json({ ok: true, sample: rows[0] ?? null });
}
