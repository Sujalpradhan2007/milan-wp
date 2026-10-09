"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";

const fields: Field[] = [
  { name: "name", label: "Festival name (English)", type: "text", required: true, half: true },
  { name: "key", label: "Unique key", type: "text", required: true, half: true, placeholder: "diwali", hint: "Lowercase, no spaces — used by the automatic festival engine" },
  { name: "t", label: "Multilingual content", type: "i18n", i18nFields: [
    { key: "name", label: "Festival name", type: "text" },
    { key: "offer", label: "Offer headline", type: "textarea", rows: 2 },
    { key: "wish", label: "Greeting message", type: "text" },
  ] },
  { name: "festivalDate", label: "Festival date", type: "date", required: true, half: true },
  { name: "daysBefore", label: "Show banner … days before", type: "number", half: true, hint: "Default 5 days" },
  { name: "colorA", label: "Theme colour A", type: "color", half: true },
  { name: "colorB", label: "Theme colour B", type: "color", half: true },
  { name: "bannerUrl", label: "Festival banner image", type: "image" },
  { name: "bgImage", label: "Site background override", type: "image" },
  { name: "discount", label: "Headline discount %", type: "number", half: true },
  { name: "couponCode", label: "Coupon code", type: "text", half: true },
  { name: "sortOrder", label: "Display order", type: "number", half: true },
  { name: "enabled", label: "Enabled", type: "checkbox", half: true },
];

const columns: Column[] = [
  { key: "bannerUrl", label: "Banner", type: "image" },
  { key: "name", label: "Festival" },
  { key: "key", label: "Key" },
  { key: "festivalDate", label: "Date", type: "date" },
  { key: "daysBefore", label: "Days before", type: "number" },
  { key: "discount", label: "Discount", type: "number" },
  { key: "couponCode", label: "Coupon" },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "enabled", label: "Enabled", type: "bool" },
];

export default function AdminFestivalsPage() {
  return (
    <CrudPanel
      resource="festivals"
      title="Festival Engine"
      subtitle="Diwali, Holi, Rath Yatra, Raja, Nuakhai, Dasahara, Durga Puja, Christmas and more — the site switches banners and offers automatically."
      fields={fields}
      columns={columns}
      searchKeys={["name", "key"]}
      quickFilters={[{ key: "enabled", label: "Status", options: [{ value: "true", label: "Enabled" }, { value: "false", label: "Disabled" }] }]}
      defaults={{ enabled: true, daysBefore: 5, colorA: "#ff5a10", colorB: "#7922fc", discount: 10, sortOrder: 0 }}
      transform={(v) => ({ ...v, key: String(v.key || v.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") })}
    />
  );
}
