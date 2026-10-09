"use client";

import CrudPanel, { type Column } from "@/components/admin/CrudPanel";
import type { Field } from "@/components/admin/fields";
import { Alert, Reveal } from "@/components/ui";
import { PERMISSIONS, ROLE_LABELS, type Role } from "@/lib/permissions";

const ROLES = [
  { value: "super_admin", label: "Super Admin — full access" },
  { value: "sales_manager", label: "Sales Manager — enquiries, offers, support, analytics" },
  { value: "content_manager", label: "Content Manager — machines, materials, gallery, FAQ, offers" },
];

const fields: Field[] = [
  { name: "name", label: "Full name", type: "text", required: true, half: true },
  { name: "email", label: "Email (login ID)", type: "text", required: true, half: true },
  { name: "passwordHash", label: "Password", type: "text", half: true, placeholder: "min 8 characters", hint: "Stored as a salted hash. Leave blank when editing to keep the current password." },
  { name: "role", label: "Role", type: "select", options: ROLES, half: true },
  { name: "phone", label: "Phone", type: "text", half: true },
  { name: "active", label: "Account active", type: "checkbox", half: true },
];

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", type: "badge", badgeMap: {
    super_admin: { label: "Super Admin", tone: "brand" },
    sales_manager: { label: "Sales Manager", tone: "grape" },
    content_manager: { label: "Content Manager", tone: "green" },
  } },
  { key: "phone", label: "Phone" },
  { key: "lastLoginAt", label: "Last login", type: "date" },
  { key: "active", label: "Active", type: "bool" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Reveal>
        <Alert kind="info">
          Permissions are verified on the server for every API request — hiding a menu item in the UI is never enough.
        </Alert>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[]).map((role) => (
          <div key={role} className="rounded-3xl surface card-shadow border border-[var(--border)] p-5">
            <p className="font-display text-sm font-extrabold">{ROLE_LABELS[role]}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {PERMISSIONS[role].map((p) => (
                <li key={p} className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold capitalize text-brand-700 dark:text-brand-300">
                  {p.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <CrudPanel
        resource="users"
        title="Users & Roles"
        subtitle="Create staff accounts, assign roles and disable access instantly."
        fields={fields}
        columns={columns}
        searchKeys={["name", "email", "role"]}
        quickFilters={[{ key: "role", label: "Role", options: ROLES.map((r) => ({ value: r.value, label: r.label.split(" — ")[0] })) }]}
        defaults={{ role: "content_manager", active: true }}
        transform={(v) => {
          const out: Record<string, any> = { ...v, email: String(v.email || "").toLowerCase().trim() };
          if (!out.passwordHash || String(out.passwordHash).trim().length < 4) delete out.passwordHash;
          return out;
        }}
      />
    </div>
  );
}
