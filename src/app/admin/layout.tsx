import type { Metadata } from "next";
import AdminShell, { type AdminUser } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Panel", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user: AdminUser | null = session ? { id: session.id, name: session.name, email: session.email, role: session.role, avatar: session.avatar } : null;
  return <AdminShell user={user}>{children}</AdminShell>;
}
