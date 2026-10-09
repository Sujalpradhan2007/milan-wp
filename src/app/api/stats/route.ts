import { NextRequest, NextResponse } from "next/server";
import { HttpError, requireResource } from "@/lib/auth";
import {
  getBreakdown, getDashboardStats, getTimeSeries, getTopEntities, listActivities,
  listRecentEnquiries, listRecentTickets,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireResource("dashboard");
    const days = Math.min(90, Math.max(7, Number(req.nextUrl.searchParams.get("days") || 30)));
    const [totals, series, topMachines, topRaw, byLang, byDevice, bySource, byType, enqs, tks, acts] = await Promise.all([
      getDashboardStats(days),
      getTimeSeries(days),
      getTopEntities("machine_view", 6),
      getTopEntities("raw_view", 6),
      getBreakdown("lang", days),
      getBreakdown("device", days),
      getBreakdown("source", days),
      getBreakdown("type", days),
      listRecentEnquiries(8),
      listRecentTickets(8),
      listActivities(20),
    ]);
    const visitors = Number(totals.period?.views ?? 0);
    const leads = Number(totals.period?.enquiryEvents ?? 0);
    return NextResponse.json({
      days,
      totals,
      series,
      topMachines,
      topRaw,
      byLang, byDevice, bySource, byType,
      recentEnquiries: enqs,
      recentTickets: tks,
      activities: acts,
      conversionRate: visitors > 0 ? Number(((leads / visitors) * 100).toFixed(2)) : 0,
    });
  } catch (err) {
    const e = err as HttpError;
    return NextResponse.json({ error: e.message || "Forbidden" }, { status: e.status || 500 });
  }
}
