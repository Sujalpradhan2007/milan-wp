import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  activities,
  events,
  faqs,
  festivals,
  gallery,
  machines,
  newsletter,
  offers,
  rawMaterials,
  spareParts,
  tickets,
  enquiries,
} from "@/db/schema";
import { getSettings } from "./settings";

/* ------------------------------ machines ------------------------------ */
export async function listMachines(opts: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
  limit?: number;
} = {}) {
  const conds = [];
  if (opts.activeOnly) conds.push(eq(machines.active, true));
  if (opts.featuredOnly) conds.push(eq(machines.featured, true));
  if (opts.category) conds.push(eq(machines.category, opts.category));
  const base = db
    .select()
    .from(machines)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(asc(machines.sortOrder), desc(machines.createdAt));
  return opts.limit ? await base.limit(opts.limit) : await base;
}

export async function getMachineBySlug(slug: string, countView = false) {
  const rows = await db.select().from(machines).where(eq(machines.slug, slug)).limit(1);
  const row = rows[0];
  if (row && countView) {
    db.update(machines).set({ views: sql`${machines.views} + 1` }).where(eq(machines.id, row.id)).catch(() => {});
  }
  return row ?? null;
}

export async function listMachineCategories() {
  const rows = await db.selectDistinct({ category: machines.category }).from(machines);
  return rows.map((r) => r.category).filter(Boolean);
}

/* --------------------------- raw materials ---------------------------- */
export async function listRawMaterials(activeOnly = true) {
  const q = db
    .select()
    .from(rawMaterials)
    .where(activeOnly ? eq(rawMaterials.active, true) : undefined)
    .orderBy(asc(rawMaterials.sortOrder), desc(rawMaterials.createdAt));
  return q;
}

export async function getRawMaterialBySlug(slug: string, countView = false) {
  const rows = await db.select().from(rawMaterials).where(eq(rawMaterials.slug, slug)).limit(1);
  const row = rows[0];
  if (row && countView) {
    db.update(rawMaterials).set({ views: sql`${rawMaterials.views} + 1` }).where(eq(rawMaterials.id, row.id)).catch(() => {});
  }
  return row ?? null;
}

/* ----------------------------- spare parts ---------------------------- */
export async function listSpareParts(activeOnly = true) {
  return db
    .select()
    .from(spareParts)
    .where(activeOnly ? eq(spareParts.active, true) : undefined)
    .orderBy(asc(spareParts.sortOrder), desc(spareParts.id));
}

/* -------------------------------- offers ------------------------------ */
export async function listOffers(activeOnly = true, includeExpired = false) {
  const conds = [];
  if (activeOnly) conds.push(eq(offers.active, true));
  const now = new Date();
  if (!includeExpired) conds.push(lte(offers.startDate, now), gte(offers.endDate, now));
  return db
    .select()
    .from(offers)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(asc(offers.sortOrder), desc(offers.endDate));
}

/* ------------------------------- gallery ------------------------------ */
export async function listGallery(publishedOnly = true) {
  return db
    .select()
    .from(gallery)
    .where(publishedOnly ? eq(gallery.published, true) : undefined)
    .orderBy(asc(gallery.sortOrder), desc(gallery.createdAt));
}

/* --------------------------------- faq -------------------------------- */
export async function listFaqs(activeOnly = true) {
  return db
    .select()
    .from(faqs)
    .where(activeOnly ? eq(faqs.active, true) : undefined)
    .orderBy(asc(faqs.sortOrder), asc(faqs.id));
}

/* ------------------------------ festivals ----------------------------- */
export async function listFestivals() {
  return db.select().from(festivals).orderBy(asc(festivals.festivalDate));
}

export async function getActiveFestival() {
  const s = await getSettings();
  const cfg = s.festival as { autoMode: boolean; enabled: boolean; manualKey: string; daysBefore: number };
  if (!cfg?.enabled) return null;
  const all = await listFestivals();
  const now = Date.now();
  if (!cfg.autoMode && cfg.manualKey) {
    return all.find((f) => f.key === cfg.manualKey && f.enabled) ?? null;
  }
  const upcoming = all
    .filter((f) => f.enabled)
    .map((f) => ({ f, diff: (new Date(f.festivalDate).getTime() - now) / 86400000 }))
    .filter((x) => x.diff >= -1 && x.diff <= (x.f.daysBefore || cfg.daysBefore || 5))
    .sort((a, b) => a.diff - b.diff);
  return upcoming[0]?.f ?? null;
}

/* ------------------------------- analytics ---------------------------- */
export async function getDashboardStats(days = 30) {
  const since = new Date(Date.now() - days * 86400000);
  const counts = await db
    .select({
      machines: sql<number>`(select count(*) from machines)`,
      activeMachines: sql<number>`(select count(*) from machines where active)`,
      raw: sql<number>`(select count(*) from raw_materials)`,
      spares: sql<number>`(select count(*) from spare_parts)`,
      offers: sql<number>`(select count(*) from offers)`,
      galleryCount: sql<number>`(select count(*) from gallery)`,
      faqs: sql<number>`(select count(*) from faqs)`,
      enquiries: sql<number>`(select count(*) from enquiries)`,
      tickets: sql<number>`(select count(*) from tickets)`,
      openTickets: sql<number>`(select count(*) from tickets where status in ('open','in_progress','waiting'))`,
      subscribers: sql<number>`(select count(*) from newsletter)`,
      users: sql<number>`(select count(*) from users)`,
    })
    .from(sql`(select 1) x`)
    .limit(1);

  const period = await db
    .select({
      views: sql<number>`count(*) filter (where type = 'page_view')`,
      machineViews: sql<number>`count(*) filter (where type = 'machine_view')`,
      rawViews: sql<number>`count(*) filter (where type = 'raw_view')`,
      offerViews: sql<number>`count(*) filter (where type = 'offer_view')`,
      spareViews: sql<number>`count(*) filter (where type = 'spare_view')`,
      waClicks: sql<number>`count(*) filter (where type = 'whatsapp_click')`,
      enquiryEvents: sql<number>`count(*) filter (where type = 'enquiry')`,
      roiCalcs: sql<number>`count(*) filter (where type = 'roi_calc')`,
    })
    .from(events)
    .where(gte(events.createdAt, since));

  const newEnquiries = await db
    .select({ c: sql<number>`count(*)` })
    .from(enquiries)
    .where(gte(enquiries.createdAt, since));

  const lowStockRaw = await db
    .select({ id: rawMaterials.id, name: rawMaterials.name, stock: rawMaterials.stock, low: rawMaterials.lowStockAt })
    .from(rawMaterials)
    .where(sql`${rawMaterials.stock} <= ${rawMaterials.lowStockAt}`);

  const lowStockSpare = await db
    .select({ id: spareParts.id, name: spareParts.name, stock: spareParts.stock })
    .from(spareParts)
    .where(lte(spareParts.stock, 5));

  return {
    totals: counts[0] ?? ({} as any),
    period: period[0] ?? ({} as any),
    newEnquiries: Number(newEnquiries[0]?.c ?? 0),
    lowStockRaw,
    lowStockSpare,
  };
}

export async function getTimeSeries(days = 30) {
  const since = new Date(Date.now() - (days - 1) * 86400000);
  since.setHours(0, 0, 0, 0);
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', created_at), 'YYYY-MM-DD')`,
      views: sql<number>`count(*) filter (where type = 'page_view')`,
      machineViews: sql<number>`count(*) filter (where type = 'machine_view')`,
      wa: sql<number>`count(*) filter (where type = 'whatsapp_click')`,
      enquiries: sql<number>`count(*) filter (where type = 'enquiry')`,
    })
    .from(events)
    .where(gte(events.createdAt, since))
    .groupBy(sql`date_trunc('day', created_at)`)
    .orderBy(sql`date_trunc('day', created_at)`);
  return rows;
}

export async function getTopEntities(type: string, limit = 6) {
  const rows = await db
    .select({ name: events.entityName, id: events.entityId, c: sql<number>`count(*)` })
    .from(events)
    .where(and(eq(events.type, type), sql`${events.entityName} is not null`))
    .groupBy(events.entityName, events.entityId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
  return rows.map((r) => ({ name: r.name ?? "—", count: Number(r.c ?? 0) }));
}

export async function getBreakdown(field: "lang" | "device" | "source" | "type", days = 30) {
  const since = new Date(Date.now() - days * 86400000);
  const col = events[field];
  const rows = await db
    .select({ key: col, c: sql<number>`count(*)` })
    .from(events)
    .where(and(gte(events.createdAt, since), sql`${col} is not null`))
    .groupBy(col)
    .orderBy(desc(sql`count(*)`))
    .limit(8);
  return rows.map((r) => ({ key: String(r.key ?? "unknown"), count: Number(r.c ?? 0) }));
}

export async function listRecentEnquiries(limit = 8) {
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(limit);
}

export async function listRecentTickets(limit = 8) {
  return db.select().from(tickets).orderBy(desc(tickets.createdAt)).limit(limit);
}

export async function listActivities(limit = 25) {
  return db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
}

export async function logActivity(actor: string, action: string, entity?: string, entityName?: string, meta?: unknown) {
  try {
    await db.insert(activities).values({ actor, action, entity, entityName, meta: (meta ?? null) as any });
  } catch (err) {
    console.error("[activity] log failed", err);
  }
}

export async function listSubscribers() {
  return db.select().from(newsletter).orderBy(desc(newsletter.createdAt));
}

export { machines, rawMaterials, spareParts, offers, gallery, faqs, festivals, enquiries, tickets, events, activities, newsletter };
