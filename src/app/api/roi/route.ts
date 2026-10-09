import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { calculateRoi } from "@/lib/roi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = calculateRoi({
      productionPerHour: Number(body.productionPerHour),
      hoursPerDay: Number(body.hoursPerDay),
      daysPerMonth: Number(body.daysPerMonth),
      sellingPrice: Number(body.sellingPrice),
      rawMaterialCost: Number(body.rawMaterialCost),
      machinePrice: Number(body.machinePrice),
      otherMonthlyCost: Number(body.otherMonthlyCost ?? 0),
    });
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    db.insert(events).values({ type: "roi_calc", path: "/roi", entityName: `payback ${result.paybackMonths ?? "∞"}m` }).catch(() => {});
    return NextResponse.json(result);
  } catch (err) {
    console.error("[roi]", err);
    return NextResponse.json({ ok: false, error: "Calculation failed" }, { status: 500 });
  }
}
