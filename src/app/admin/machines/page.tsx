"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";
import { defaultColorRows, normaliseColors } from "@/lib/colors";
import { slugify } from "@/lib/utils";

const CATEGORIES = [
  { value: "Paper Plate Machine", label: "Paper Plate Machine" },
  { value: "Paper Cup Machine", label: "Paper Cup Machine" },
  { value: "Agarbatti Machine", label: "Agarbatti Machine" },
  { value: "Slipper & Footwear Machine", label: "Slipper & Footwear Machine" },
  { value: "Scrubber Machine", label: "Scrubber Machine" },
  { value: "Packing Machine", label: "Packing Machine" },
  { value: "Food Processing Machine", label: "Food Processing Machine" },
  { value: "Wire & Metal Machine", label: "Wire & Metal Machine" },
  { value: "Puja & Devotional Machine", label: "Puja & Devotional Machine" },
  { value: "Combo Machine", label: "Combo Machine" },
  { value: "Other Machine", label: "Other Machine" },
];

const fields: Field[] = [
  { name: "name", label: "Machine name (default)", type: "text", required: true, half: true, placeholder: "Hydraulic Paper Plate Making Machine" },
  { name: "slug", label: "URL slug", type: "text", half: true, placeholder: "auto-generated if empty", hint: "Used in the URL: /machines/<slug>" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, half: true },
  { name: "sortOrder", label: "Display order", type: "number", half: true, hint: "Lower number appears first" },
  { name: "t", label: "Multilingual content", type: "i18n", i18nFields: [
    { key: "name", label: "Machine name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "short", label: "Short description", type: "textarea", rows: 3 },
    { key: "full", label: "Full description", type: "textarea", rows: 8 },
    { key: "features", label: "Key features (one per line)", type: "textarea", rows: 5 },
  ] },
  { name: "mrp", label: "MRP (₹)", type: "price", third: true, half: true },
  { name: "companyPrice", label: "Company price (₹)", type: "price", half: true },
  { name: "offerPrice", label: "Offer price (₹)", type: "price", half: true },
  { name: "discount", label: "Discount %", type: "number", half: true, hint: "Auto-calculated from MRP → offer price if left 0" },
  { name: "coverImage", label: "Cover photo", type: "image" },
  { name: "media", label: "Additional photos & videos", type: "media" },
  { name: "models", label: "Models", type: "repeat", repeatLabel: "Model", repeatTitleKey: "name", repeatFields: [
    { key: "name", label: "Model name", type: "text" },
    { key: "code", label: "Model code", type: "text" },
    { key: "capacity", label: "Capacity / size", type: "text" },
    { key: "pph", label: "Production / hour", type: "number" },
    { key: "price", label: "Price (₹)", type: "number" },
    { key: "active", label: "Active", type: "checkbox" },
  ] },
  { name: "colors", label: "Machine colours — 10 standard shades", type: "colors",
    hint: "Customers can pick any of these 10 colours on the website and the machine photo changes instantly." },
  { name: "specs", label: "Specifications", type: "repeat", repeatLabel: "Specification", repeatTitleKey: "label", repeatFields: [
    { key: "group", label: "Group", type: "text", placeholder: "General / Output / Technical / Build" },
    { key: "label", label: "Label", type: "text" },
    { key: "value", label: "Value", type: "text" },
  ] },
  { name: "capacity", label: "Capacity", type: "text", half: true, placeholder: '4" – 12" plates' },
  { name: "productionPerHour", label: "Production / hour", type: "number", half: true },
  { name: "power", label: "Power", type: "text", half: true, placeholder: "2.2 kW (3 HP)" },
  { name: "warranty", label: "Warranty", type: "text", half: true, placeholder: "1 Year Comprehensive" },
  { name: "active", label: "Active (visible on website)", type: "checkbox", half: true },
  { name: "featured", label: "Featured on homepage", type: "checkbox", half: true },
  { name: "views", label: "Views counter", type: "number", half: true },
];

const columns: Column[] = [
  { key: "coverImage", label: "Photo", type: "image" },
  { key: "name", label: "Machine" },
  { key: "category", label: "Category", type: "badge", badgeMap: {
    "Paper Plate Machine": { label: "Plate", tone: "brand" },
    "Paper Cup Machine": { label: "Cup", tone: "grape" },
    "Agarbatti Machine": { label: "Agarbatti", tone: "green" },
    "Slipper & Footwear Machine": { label: "Slipper", tone: "amber" },
    "Scrubber Machine": { label: "Scrubber", tone: "grape" },
    "Packing Machine": { label: "Packing", tone: "brand" },
    "Food Processing Machine": { label: "Food", tone: "green" },
    "Wire & Metal Machine": { label: "Wire/Metal", tone: "red" },
    "Puja & Devotional Machine": { label: "Puja", tone: "amber" },
    "Combo Machine": { label: "Combo", tone: "grey" },
  } },
  { key: "offerPrice", label: "Price", type: "price" },
  { key: "discount", label: "Off %", type: "number" },
  { key: "productionPerHour", label: "Prod/hr", type: "number" },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "views", label: "Views", type: "number" },
  { key: "featured", label: "Featured", type: "bool" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminMachinesPage() {
  return (
    <CrudPanel
      resource="machines"
      title="Machines"
      subtitle="Add machines with trilingual content, models, colours, specs, photos, videos and pricing."
      fields={fields}
      columns={columns}
      searchKeys={["name", "category", "slug"]}
      quickFilters={[
        { key: "active", label: "Status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Hidden" }] },
        { key: "category", label: "Category", options: CATEGORIES },
      ]}
      defaults={{ category: "Paper Plate Machine", active: true, featured: false, sortOrder: 0, discount: 0, productionPerHour: 0, views: 0, models: [], colors: defaultColorRows(""), specs: [], media: [] }}
      transform={(v) => {
        const out = { ...v };
        out.slug = slugify(out.slug || out.name || "machine");
        // always ship the full 10-shade palette, tinting falls back to the cover photo
        out.colors = normaliseColors(out.colors);
        const mrp = Number(out.mrp || 0);
        const final = Number(out.offerPrice || out.companyPrice || 0);
        if ((!out.discount || Number(out.discount) === 0) && mrp > final && final > 0) {
          out.discount = Math.round(((mrp - final) / mrp) * 100);
        }
        const t = out.t || {};
        Object.keys(t).forEach((lang) => {
          if (typeof t[lang]?.features === "string") {
            t[lang].features = String(t[lang].features).split("\n").map((s: string) => s.trim()).filter(Boolean);
          }
        });
        out.t = t;
        return out;
      }}
    />
  );
}
