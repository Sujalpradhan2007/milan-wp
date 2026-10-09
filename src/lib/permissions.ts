/** Client-safe role & permission definitions (no server-only imports). */

export type Role = "super_admin" | "sales_manager" | "content_manager";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  sales_manager: "Sales Manager",
  content_manager: "Content Manager",
};

export type Resource =
  | "dashboard"
  | "machines"
  | "raw_materials"
  | "spare_parts"
  | "offers"
  | "festivals"
  | "gallery"
  | "faqs"
  | "enquiries"
  | "tickets"
  | "analytics"
  | "settings"
  | "users";

export const PERMISSIONS: Record<Role, Resource[]> = {
  super_admin: [
    "dashboard", "machines", "raw_materials", "spare_parts", "offers", "festivals",
    "gallery", "faqs", "enquiries", "tickets", "analytics", "settings", "users",
  ],
  sales_manager: [
    "dashboard", "enquiries", "tickets", "offers", "festivals", "analytics",
  ],
  content_manager: [
    "dashboard", "machines", "raw_materials", "spare_parts", "offers", "festivals",
    "gallery", "faqs",
  ],
};

export function can(role: Role | undefined | null, resource: Resource): boolean {
  if (!role) return false;
  return (PERMISSIONS[role] ?? []).includes(resource);
}
