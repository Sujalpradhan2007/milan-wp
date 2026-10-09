import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ticketUpdates, tickets } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  const { number } = await ctx.params;
  const key = String(number || "").trim();
  if (!key) return NextResponse.json({ error: "Ticket number required" }, { status: 400 });
  const rows = await db.select().from(tickets).where(eq(tickets.ticketNumber, key.toUpperCase())).limit(1);
  const ticket = rows[0];
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const updates = await db.select().from(ticketUpdates).where(eq(ticketUpdates.ticketId, ticket.id));
  return NextResponse.json({
    ticket: {
      ticketNumber: ticket.ticketNumber, name: ticket.name, phone: ticket.phone, city: ticket.city,
      machineName: ticket.machineName, subject: ticket.subject, description: ticket.description,
      priority: ticket.priority, status: ticket.status, assignedName: ticket.assignedName,
      createdAt: ticket.createdAt, updatedAt: ticket.updatedAt,
    },
    updates: updates.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  });
}
