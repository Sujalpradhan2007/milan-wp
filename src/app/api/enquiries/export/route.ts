import { NextRequest, NextResponse } from "next/server";
import { HttpError, requireResource } from "@/lib/auth";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  try {
    await requireResource("enquiries");
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    const headers = ["ID", "Date", "Type", "Name", "Phone", "Email", "City", "Machine", "Model", "Colour", "Capacity", "Price", "Status", "Assigned To", "Message", "Source"];
    const lines = rows.map((r) =>
      [r.id, new Date(r.createdAt).toISOString(), r.type, r.name, r.phone, r.email, r.city, r.machineName, r.model, r.color, r.capacity, r.price, r.status, r.assignedName, r.message, r.source]
        .map(csvCell)
        .join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...lines].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="milan-enquiries-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}
