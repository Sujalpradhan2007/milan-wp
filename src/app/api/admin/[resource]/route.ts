import { NextRequest, NextResponse } from "next/server";
import { HttpError, requireResource } from "@/lib/auth";
import { RESOURCES, createRow, listResource } from "@/lib/adminResources";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try {
    await requireResource(def.permission);
    const data = await listResource(resource, req.nextUrl.searchParams);
    return NextResponse.json({ data });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const session = await requireResource(def.permission);
    const body = await req.json();
    const row = await createRow(resource, { ...body, __actor: session.name });
    return NextResponse.json({ data: row }, { status: 201 });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}
