import { getTableColumns, sql, eq, desc, asc, or, like } from "drizzle-orm";
import { db } from "@/db";
import {
  machines, rawMaterials, spareParts, offers, festivals, gallery, faqs,
  enquiries, tickets, ticketUpdates, activities, newsletter, users,
} from "@/db/schema";
import { HttpError, type Resource } from "./auth";
import { normaliseColors } from "./colors";

export type ResourceDef = {
  table: any;
  permission: Resource;
  searchFields?: string[];
  numericFields?: string[];
  boolFields?: string[];
  jsonFields?: string[];
  orderBy?: any;
  label?: string;
};

export const RESOURCES: Record<string, ResourceDef> = {
  machines: { table: machines, permission: "machines", searchFields: ["name", "category", "slug"], numericFields: ["mrp", "companyPrice", "offerPrice", "discount", "productionPerHour", "sortOrder", "views"], boolFields: ["active", "featured"], jsonFields: ["t", "media", "models", "colors", "specs"], orderBy: [asc(machines.sortOrder), desc(machines.id)], label: "Machines" },
  raw_materials: { table: rawMaterials, permission: "raw_materials", searchFields: ["name", "slug", "unit"], numericFields: ["price", "mrp", "stock", "lowStockAt", "sortOrder", "views"], boolFields: ["active", "featured"], jsonFields: ["t", "specs"], orderBy: [asc(rawMaterials.sortOrder), desc(rawMaterials.id)], label: "Raw Materials" },
  spare_parts: { table: spareParts, permission: "spare_parts", searchFields: ["name", "partCode", "machineName"], numericFields: ["price", "mrp", "stock", "sortOrder", "views"], boolFields: ["active"], jsonFields: ["t", "gallery"], orderBy: [asc(spareParts.sortOrder), desc(spareParts.id)], label: "Spare Parts" },
  offers: { table: offers, permission: "offers", searchFields: ["title", "machineName", "couponCode"], numericFields: ["mrp", "companyPrice", "offerPrice", "discount", "sortOrder", "views", "machineId", "festivalId"], boolFields: ["active"], jsonFields: ["t", "includedItems"], orderBy: [asc(offers.sortOrder), desc(offers.id)], label: "Offers" },
  festivals: { table: festivals, permission: "festivals", searchFields: ["name", "key"], numericFields: ["daysBefore", "discount", "sortOrder"], boolFields: ["enabled"], jsonFields: ["t", "offerText"], orderBy: [asc(festivals.sortOrder)], label: "Festivals" },
  gallery: { table: gallery, permission: "gallery", searchFields: ["title", "category"], numericFields: ["sortOrder", "views"], boolFields: ["published"], jsonFields: ["t"], orderBy: [asc(gallery.sortOrder), desc(gallery.id)], label: "Gallery" },
  faqs: { table: faqs, permission: "faqs", searchFields: ["category"], numericFields: ["sortOrder"], boolFields: ["active"], jsonFields: ["t"], orderBy: [asc(faqs.sortOrder), desc(faqs.id)], label: "FAQ" },
  enquiries: { table: enquiries, permission: "enquiries", searchFields: ["name", "phone", "city", "machineName", "status"], numericFields: ["machineId", "price", "itemId", "assignedTo"], jsonFields: ["notes"], orderBy: [desc(enquiries.createdAt)], label: "Enquiries" },
  tickets: { table: tickets, permission: "tickets", searchFields: ["ticketNumber", "name", "phone", "subject", "status"], numericFields: ["machineId", "assignedTo"], orderBy: [desc(tickets.createdAt)], label: "Support Tickets" },
  ticket_updates: { table: ticketUpdates, permission: "tickets", numericFields: ["ticketId"], boolFields: ["byAdmin"], orderBy: [desc(ticketUpdates.createdAt)], label: "Ticket Updates" },
  newsletter: { table: newsletter, permission: "enquiries", orderBy: [desc(newsletter.createdAt)], label: "Subscribers" },
  activities: { table: activities, permission: "dashboard", orderBy: [desc(activities.createdAt)], label: "Activity" },
  users: { table: users, permission: "users", searchFields: ["name", "email", "role"], boolFields: ["active"], orderBy: [asc(users.id)], label: "Users" },
};

/** Convert a raw request body into a safe row object for the given resource. */
export function sanitise(def: ResourceDef, body: Record<string, any>) {
  const cols = getTableColumns(def.table) as Record<string, any>;
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body ?? {})) {
    if (!(key in cols)) continue;
    if (key === "id" || key === "createdAt" || key === "updatedAt") continue;
    if (def.jsonFields?.includes(key)) {
      let parsed: any = value ?? null;
      if (typeof value === "string") {
        try { parsed = JSON.parse(value); } catch { parsed = value; }
      }
      // every machine must always expose the full 10-shade standard palette
      if (key === "colors") parsed = normaliseColors(parsed);
      out[key] = parsed;
      continue;
    }
    if (def.boolFields?.includes(key)) {
      out[key] = Boolean(value);
      continue;
    }
    if (def.numericFields?.includes(key)) {
      if (value === "" || value === null || value === undefined) { out[key] = null; continue; }
      const n = Number(value);
      out[key] = Number.isFinite(n) ? n : null;
      continue;
    }
    if (value === undefined) continue;
    out[key] = value === null ? null : typeof value === "object" ? JSON.stringify(value) : value;
  }
  return out;
}

export async function listResource(key: string, params: URLSearchParams) {
  const def = RESOURCES[key];
  const rows = await db.select().from(def.table);
  const search = (params.get("q") || "").trim().toLowerCase();
  let data = rows as any[];
  if (search && def.searchFields?.length) {
    data = data.filter((r) => def.searchFields!.some((f) => String(r[f] ?? "").toLowerCase().includes(search)));
  }
  if (def.orderBy) {
    const [first, second] = def.orderBy as any[];
    data = data.sort((a: any, b: any) => {
      const fa = first?.config?.asc;
      const nameA = String(first?.config?.name ? a[first.config.name] : "");
      const nameB = String(first?.config?.name ? b[first.config.name] : "");
      const cmp = nameA.localeCompare(nameB, undefined, { numeric: true });
      const dir = fa === false ? -1 : 1;
      if (cmp !== 0) return cmp * dir;
      return Number(b.id ?? 0) - Number(a.id ?? 0);
    });
  }
  return data;
}

async function uniqueSlug(def: ResourceDef, base: string, ignoreId?: number): Promise<string> {
  const cols = getTableColumns(def.table) as Record<string, any>;
  const { slugify } = await import("./utils");
  const root = slugify(base) || "item";
  const existing = (await db.select({ id: cols.id, slug: cols.slug }).from(def.table)) as any[];
  const taken = new Set(existing.filter((r) => r.id !== ignoreId).map((r) => String(r.slug)));
  let candidate = root;
  let n = 2;
  while (taken.has(candidate)) candidate = `${root}-${n++}`;
  return candidate;
}

function friendlyError(err: any): HttpError {
  const code = err?.code || err?.cause?.code;
  const msg = String(err?.message || err);
  if (code === "23505") return new HttpError(409, "An item with this unique value (slug, code or email) already exists.");
  if (code === "23502") return new HttpError(400, "A required field is missing.");
  if (code === "23503") return new HttpError(400, "This record is linked to other data and cannot be changed that way.");
  if (code === "22P02" || code === "22001") return new HttpError(400, "One of the values has an invalid format.");
  console.error("[admin-resource]", msg);
  return new HttpError(500, "Could not save the record. Please check the fields and try again.");
}

export async function createRow(key: string, body: Record<string, any>) {
  const def = RESOURCES[key];
  const cols = getTableColumns(def.table) as Record<string, any>;
  const data = sanitise(def, body);
  if (key === "users" && data.passwordHash) {
    const { hashPassword } = await import("./auth");
    data.passwordHash = hashPassword(String(data.passwordHash));
  }
  if ("slug" in cols && !data.slug) {
    data.slug = await uniqueSlug(def, String(data.name ?? data.title ?? key));
  } else if ("slug" in cols && data.slug) {
    data.slug = await uniqueSlug(def, String(data.slug), undefined);
  }
  if (key === "tickets" && !data.ticketNumber) {
    data.ticketNumber = `ME-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }
  try {
    const [row] = (await (db.insert(def.table).values(data).returning() as any)) as any[];
    const { logActivity } = await import("./queries");
    await logActivity(String(body.__actor ?? "admin"), "created", key, String(data.name ?? data.title ?? data.partCode ?? row?.id ?? ""));
    return row;
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function updateRow(key: string, id: number, body: Record<string, any>) {
  const def = RESOURCES[key];
  const data = sanitise(def, body);
  if (key === "users" && data.passwordHash) {
    const { hashPassword } = await import("./auth");
    data.passwordHash = String(data.passwordHash).trim()
      ? hashPassword(String(data.passwordHash))
      : undefined;
    if (!data.passwordHash) delete data.passwordHash;
  }
  if (key === "users" && !data.passwordHash) delete data.passwordHash;
  const cols = getTableColumns(def.table) as Record<string, any>;
  if ("slug" in cols && data.slug) data.slug = await uniqueSlug(def, String(data.slug), id);
  if ("updatedAt" in cols) data.updatedAt = sql`now()`;
  if (Object.keys(data).length === 0) return null;
  try {
    const [row] = (await (db.update(def.table).set(data).where(eq(cols.id, id)).returning() as any)) as any[];
    const { logActivity } = await import("./queries");
    await logActivity(String(body.__actor ?? "admin"), "updated", key, String(data.name ?? data.title ?? id));
    return row;
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function deleteRow(key: string, id: number) {
  const def = RESOURCES[key];
  const cols = getTableColumns(def.table) as Record<string, any>;
  const [row] = await db.select().from(def.table).where(eq(cols.id, id)).limit(1);
  await db.delete(def.table).where(eq(cols.id, id));
  const { logActivity } = await import("./queries");
  await logActivity("admin", "deleted", key, String(row?.name ?? row?.title ?? id));
  return row;
}
