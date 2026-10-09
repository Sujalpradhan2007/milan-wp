"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";
import { slugify } from "@/lib/utils";

const UNITS = ["kg", "piece", "ream", "bag", "roll", "box", "bundle", "litre"].map((u) => ({ value: u, label: u }));

const fields: Field[] = [
  { name: "name", label: "Item name (default)", type: "text", required: true, half: true },
  { name: "slug", label: "URL slug", type: "text", half: true, placeholder: "auto-generated if empty" },
  { name: "t", label: "Multilingual content", type: "i18n", i18nFields: [
    { key: "name", label: "Item name", type: "text" },
    { key: "short", label: "Short description", type: "textarea", rows: 2 },
    { key: "full", label: "Full description", type: "textarea", rows: 5 },
  ] },
  { name: "image", label: "Photo", type: "image" },
  { name: "price", label: "Selling price (₹)", type: "price", half: true },
  { name: "mrp", label: "MRP (₹)", type: "price", half: true },
  { name: "unit", label: "Unit", type: "select", options: UNITS, half: true },
  { name: "stock", label: "Stock quantity", type: "number", half: true },
  { name: "lowStockAt", label: "Low-stock alert at", type: "number", half: true, hint: "Dashboard alerts when stock ≤ this number" },
  { name: "grade", label: "Grade", type: "text", half: true, placeholder: "Virgin / Recycled / PE Coated" },
  { name: "gsm", label: "GSM / Size", type: "text", half: true, placeholder: "80–150 GSM" },
  { name: "sortOrder", label: "Display order", type: "number", half: true },
  { name: "views", label: "Views counter", type: "number", half: true },
  { name: "active", label: "Active (visible on website)", type: "checkbox", half: true },
  { name: "featured", label: "Featured on homepage", type: "checkbox", half: true },
];

const columns: Column[] = [
  { key: "image", label: "Photo", type: "image" },
  { key: "name", label: "Item" },
  { key: "price", label: "Price", type: "price" },
  { key: "mrp", label: "MRP", type: "price" },
  { key: "unit", label: "Unit" },
  { key: "stock", label: "Stock", type: "number" },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "views", label: "Views", type: "number" },
  { key: "featured", label: "Featured", type: "bool" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminRawMaterialsPage() {
  return (
    <CrudPanel
      resource="raw_materials"
      title="Raw Materials"
      subtitle="Paper, PE coated rolls, jiggit powder, bamboo sticks, packing — with trilingual names, pricing and live stock."
      fields={fields}
      columns={columns}
      searchKeys={["name", "slug", "unit", "grade"]}
      quickFilters={[
        { key: "active", label: "Status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Hidden" }] },
        { key: "unit", label: "Unit", options: UNITS },
      ]}
      defaults={{ unit: "kg", active: true, featured: false, stock: 0, lowStockAt: 10, sortOrder: 0, views: 0, price: 0, mrp: 0 }}
      transform={(v) => ({ ...v, slug: slugify(v.slug || v.name || "material") })}
    />
  );
}
