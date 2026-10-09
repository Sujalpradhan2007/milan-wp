import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";
import { upgradeCatalogue } from "@/lib/catalogue";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || (await req.json().catch(() => ({}))).secret;
  const expected = process.env.SEED_SECRET || "milan-seed-2026";
  if (secret !== expected) return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  const result = await seedDatabase();
  const upgrade = await upgradeCatalogue();
  return NextResponse.json({ ...result, catalogue: upgrade });
}
