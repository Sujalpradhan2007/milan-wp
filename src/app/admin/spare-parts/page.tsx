"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";

const AVAIL = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "on_order", label: "On order" },
];

const fields: Field[] = [
  { name: "name", label: "Part name (default)", type: "text", required: true, half: true },
  { name: "partCode", label: "Part code", type: "text", required: true, half: true, placeholder: "ME-DIE-07" },
  { name: "t", label: "Multilingual content", type: "i18n", i18nFields: [
    { key: "name", label: "Part name", type: "text" },
    { key: "short", label: "Short description", type: "textarea", rows: 2 },
    { key: "full", label: "Full description", type: "textarea", rows: 4 },
  ] },
  { name: "image", label: "Part photo", type: "image", hint: "Upload a clear photo of the spare part" },
  { name: "machineName", label: "Compatible machine", type: "text", half: true, placeholder: "Hydraulic Paper Plate Making Machine" },
  { name: "material", label: "Material", type: "text", half: true, placeholder: "EN-8 Steel / SS 304 / Rubber" },
  { name: "price", label: "Selling price (₹)", type: "price", half: true },
  { name: "mrp", label: "MRP (₹)", type: "price", half: true },
  { name: "stock", label: "Stock quantity", type: "number", half: true },
  { name: "availability", label: "Availability", type: "select", options: AVAIL, half: true },
  { name: "warranty", label: "Warranty", type: "text", half: true, placeholder: "6 Months" },
  { name: "sortOrder", label: "Display order", type: "number", half: true },
  { name: "active", label: "Active (visible on website)", type: "checkbox", half: true },
  { name: "views", label: "Views counter", type: "number", half: true },
];

const columns: Column[] = [
  { key: "image", label: "Photo", type: "image" },
  { key: "name", label: "Part" },
  { key: "partCode", label: "Code" },
  { key: "machineName", label: "Machine" },
  { key: "price", label: "Price", type: "price" },
  { key: "stock", label: "Stock", type: "number" },
  { key: "availability", label: "Availability", type: "badge", badgeMap: {
    in_stock: { label: "In stock", tone: "green" },
    low_stock: { label: "Low", tone: "amber" },
    out_of_stock: { label: "Out", tone: "red" },
    on_order: { label: "On order", tone: "grape" },
  } },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminSparePartsPage() {
  return (
    <CrudPanel
      resource="spare_parts"
      title="Spare Parts"
      subtitle="Dies, seals, heaters, bearings, belts and pumps — with photos, codes, stock and WhatsApp enquiry support."
      fields={fields}
      columns={columns}
      searchKeys={["name", "partCode", "machineName"]}
      quickFilters={[
        { key: "active", label: "Status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Hidden" }] },
        { key: "availability", label: "Availability", options: AVAIL },
      ]}
      defaults={{ active: true, availability: "in_stock", stock: 0, price: 0, mrp: 0, sortOrder: 0, views: 0, warranty: "6 Months" }}
      transform={(v) => ({ ...v, partCode: String(v.partCode || "").toUpperCase().trim() || `ME-${Date.now().toString(36).toUpperCase()}` })}
    />
  );
}
