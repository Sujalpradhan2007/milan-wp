"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";

const CATS = [
  { value: "factory", label: "Factory" },
  { value: "products", label: "Products" },
  { value: "customers", label: "Customers" },
  { value: "team", label: "Team" },
];

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, half: true },
  { name: "category", label: "Category", type: "select", options: CATS, half: true },
  { name: "sortOrder", label: "Sort order", type: "number", half: true },
  { name: "url", label: "Image", type: "image", required: true },
  { name: "description", label: "Description (English)", type: "textarea", rows: 3 },
  { name: "t", label: "Multilingual title & description", type: "i18n", i18nFields: [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea", rows: 3 },
  ] },
  { name: "published", label: "Published", type: "checkbox", half: true },
  { name: "views", label: "Views counter", type: "number", half: true },
];

const columns: Column[] = [
  { key: "url", label: "Image", type: "image" },
  { key: "title", label: "Title" },
  { key: "category", label: "Category", type: "badge", badgeMap: {
    factory: { label: "Factory", tone: "brand" }, products: { label: "Products", tone: "grape" },
    customers: { label: "Customers", tone: "green" }, team: { label: "Team", tone: "amber" },
  } },
  { key: "sortOrder", label: "Order", type: "number" },
  { key: "views", label: "Views", type: "number" },
  { key: "published", label: "Published", type: "bool" },
];

export default function AdminGalleryPage() {
  return (
    <CrudPanel
      resource="gallery"
      title="Gallery"
      subtitle="Upload factory, product, customer and team photos. Reorder, rename, unpublish or delete at any time."
      fields={fields}
      columns={columns}
      searchKeys={["title", "category", "description"]}
      quickFilters={[
        { key: "category", label: "Category", options: CATS },
        { key: "published", label: "Status", options: [{ value: "true", label: "Published" }, { value: "false", label: "Draft" }] },
      ]}
      defaults={{ category: "factory", published: true, sortOrder: 0, views: 0 }}
    />
  );
}
