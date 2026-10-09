import { NextRequest, NextResponse } from "next/server";
import { HttpError, requireResource } from "@/lib/auth";
import { RESOURCES, deleteRow, updateRow } from "@/lib/adminResources";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const session = await requireResource(def.permission);
    const body = await req.json();
    const row = await updateRow(resource, Number(id), { ...body, __actor: session.name });
    return NextResponse.json({ data: row });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  return PUT(req, ctx);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try {
    await requireResource(def.permission);
    await deleteRow(resource, Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}
