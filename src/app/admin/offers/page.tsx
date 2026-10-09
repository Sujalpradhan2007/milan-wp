"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";
import { slugify } from "@/lib/utils";

const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * 86400000).toISOString();

const fields: Field[] = [
  { name: "title", label: "Offer title (default)", type: "text", required: true, half: true },
  { name: "slug", label: "URL slug", type: "text", half: true, placeholder: "auto-generated if empty" },
  { name: "t", label: "Multilingual content", type: "i18n", i18nFields: [
    { key: "title", label: "Offer title", type: "text" },
    { key: "desc", label: "Description", type: "textarea", rows: 5 },
    { key: "included", label: "Included items (one per line)", type: "textarea", rows: 4 },
  ] },
  { name: "machineName", label: "Machine / product", type: "text", half: true },
  { name: "machineId", label: "Machine ID (optional)", type: "number", half: true },
  { name: "coverImage", label: "Cover image", type: "image" },
  { name: "bgImage", label: "Background image", type: "image" },
  { name: "mrp", label: "MRP (₹)", type: "price", half: true },
  { name: "companyPrice", label: "Company price (₹)", type: "price", half: true },
  { name: "offerPrice", label: "Offer price (₹)", type: "price", half: true },
  { name: "discount", label: "Discount %", type: "number", half: true, hint: "Auto-calculated if left 0" },
  { name: "startDate", label: "Start date", type: "date", half: true },
  { name: "endDate", label: "End date", type: "date", half: true },
  { name: "festivalName", label: "Festival", type: "text", half: true, placeholder: "Diwali / Rath Yatra" },
  { name: "festivalId", label: "Festival ID (optional)", type: "number", half: true },
  { name: "couponCode", label: "Coupon code", type: "text", half: true },
  { name: "sortOrder", label: "Display order", type: "number", half: true },
  { name: "includedItems", label: "Included items with photos", type: "repeat", repeatLabel: "Item", repeatTitleKey: "name", repeatFields: [
    { key: "name", label: "Item name", type: "text" },
    { key: "qty", label: "Quantity", type: "number" },
    { key: "photo", label: "Item photo", type: "image", width: "full" },
  ] },
  { name: "active", label: "Active", type: "checkbox", half: true },
  { name: "views", label: "Views counter", type: "number", half: true },
];

const columns: Column[] = [
  { key: "coverImage", label: "Image", type: "image" },
  { key: "title", label: "Offer" },
  { key: "machineName", label: "Machine" },
  { key: "offerPrice", label: "Offer price", type: "price" },
  { key: "discount", label: "Off %", type: "number" },
  { key: "startDate", label: "Starts", type: "date" },
  { key: "endDate", label: "Ends", type: "date" },
  { key: "views", label: "Views", type: "number" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminOffersPage() {
  return (
    <CrudPanel
      resource="offers"
      title="Offers & Campaigns"
      subtitle="E-commerce style offers with countdown dates, coupon codes, included freebies and festival linkage."
      fields={fields}
      columns={columns}
      searchKeys={["title", "machineName", "couponCode", "festivalName"]}
      quickFilters={[{ key: "active", label: "Status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] }]}
      defaults={{ active: true, startDate: iso(-2), endDate: iso(30), discount: 0, sortOrder: 0, views: 0, includedItems: [] }}
      transform={(v) => {
        const out = { ...v };
        out.slug = slugify(out.slug || out.title || "offer");
        const mrp = Number(out.mrp || 0);
        const price = Number(out.offerPrice || out.companyPrice || 0);
        if ((!out.discount || Number(out.discount) === 0) && mrp > price && price > 0) out.discount = Math.round(((mrp - price) / mrp) * 100);
        const t = out.t || {};
        Object.keys(t).forEach((lang) => {
          if (typeof t[lang]?.included === "string") t[lang].included = String(t[lang].included).split("\n").map((s: string) => s.trim()).filter(Boolean);
        });
        out.t = t;
        return out;
      }}
    />
  );
}
