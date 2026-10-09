import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, tickets, ticketUpdates } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { fillTemplate, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function nextTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await db.select().from(tickets);
  const seq = rows.length + 1042;
  return `ME-${year}-${seq}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const description = String(body.description || "").trim();

    if (name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
    if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    if (subject.length < 3) return NextResponse.json({ error: "Please enter a subject" }, { status: 400 });
    if (description.length < 10) return NextResponse.json({ error: "Please describe the problem (min 10 characters)" }, { status: 400 });

    const number = await nextTicketNumber();
    const [created] = (await db.insert(tickets).values({
      ticketNumber: number, name, phone,
      email: body.email || null, city: body.city || null,
      machineId: body.machineId ? Number(body.machineId) : null,
      machineName: body.machineName || null,
      subject, description,
      priority: ["low", "medium", "high", "urgent"].includes(body.priority) ? body.priority : "medium",
      status: "open",
    }).returning()) as any[];

    await db.insert(ticketUpdates).values({
      ticketId: created.id, status: "open",
      message: "Service request received. Our engineer will contact you shortly.",
      byAdmin: true, authorName: "Milan Enterprises",
    });

    await db.insert(events).values({ type: "ticket", path: "/support", entityId: created.id, entityName: number });

    const s = await getSettings();
    const whatsappUrl = waLink(
      s.company.whatsapp,
      fillTemplate(s.waTemplates.service, {
        name, phone, city: body.city || "—", machine: body.machineName || "—",
        ticket: number, message: `${subject} — ${description}`,
      })
    );

    return NextResponse.json({ ok: true, ticketNumber: number, id: created.id, whatsappUrl });
  } catch (err) {
    console.error("[ticket]", err);
    return NextResponse.json({ error: "Could not create the ticket" }, { status: 500 });
  }
}
