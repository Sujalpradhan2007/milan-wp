"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";

const CATS = [
  { value: "general", label: "General" },
  { value: "purchase", label: "Purchase & Price" },
  { value: "service", label: "Service & Warranty" },
  { value: "raw", label: "Raw Material & Profit" },
  { value: "delivery", label: "Delivery & Finance" },
];

const fields: Field[] = [
  { name: "category", label: "Category", type: "select", options: CATS, half: true },
  { name: "sortOrder", label: "Display order", type: "number", half: true },
  { name: "t", label: "Question & answer in 3 languages", type: "i18n", i18nFields: [
    { key: "q", label: "Question", type: "textarea", rows: 2 },
    { key: "a", label: "Answer", type: "textarea", rows: 5 },
  ] },
  { name: "active", label: "Visible on website", type: "checkbox", half: true },
];

const columns: Column[] = [
  { key: "category", label: "Category", type: "badge", badgeMap: {
    general: { label: "General", tone: "grey" }, purchase: { label: "Purchase", tone: "brand" },
    service: { label: "Service", tone: "grape" }, raw: { label: "Raw material", tone: "green" },
    delivery: { label: "Delivery", tone: "amber" },
  } },
  { key: "t", label: "Question (English)", type: "translate", langField: "q" },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminFaqsPage() {
  return (
    <CrudPanel
      resource="faqs"
      title="FAQ Manager"
      subtitle="Editable multilingual questions in English, हिन्दी and ଓଡ଼ିଆ with drag-free reordering."
      fields={fields}
      columns={columns}
      searchKeys={["category"]}
      quickFilters={[
        { key: "category", label: "Category", options: CATS },
        { key: "active", label: "Status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Hidden" }] },
      ]}
      defaults={{ category: "general", active: true, sortOrder: 0 }}
    />
  );
}
