"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, Boxes, CalendarDays, ChevronRight, ExternalLink, Gauge, HelpCircle,
  Headset, Image as ImageIcon, Inbox, LayoutDashboard, LogOut, Menu, Moon, Package,
  Settings as SettingsIcon, Sun, Tag, Users as UsersIcon, Wrench, Zap, X,
} from "lucide-react";
import { ToastProvider } from "@/components/ui";
import { useApp } from "@/components/providers";
import { PERMISSIONS, ROLE_LABELS, type Resource, type Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export type AdminUser = { id: number; name: string; email: string; role: Role; avatar?: string | null };

type NavItem = { href: string; label: string; icon: any; resource: Resource; group: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, resource: "dashboard", group: "Overview" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, resource: "analytics", group: "Overview" },
  { href: "/admin/machines", label: "Machines", icon: Zap, resource: "machines", group: "Catalogue" },
  { href: "/admin/raw-materials", label: "Raw Materials", icon: Package, resource: "raw_materials", group: "Catalogue" },
  { href: "/admin/spare-parts", label: "Spare Parts", icon: Wrench, resource: "spare_parts", group: "Catalogue" },
  { href: "/admin/offers", label: "Offers", icon: Tag, resource: "offers", group: "Catalogue" },
  { href: "/admin/festivals", label: "Festivals", icon: CalendarDays, resource: "festivals", group: "Catalogue" },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, resource: "gallery", group: "Content" },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle, resource: "faqs", group: "Content" },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, resource: "enquiries", group: "Sales & Support" },
  { href: "/admin/support", label: "Support Tickets", icon: Headset, resource: "tickets", group: "Sales & Support" },
  { href: "/admin/settings", label: "Company Settings", icon: SettingsIcon, resource: "settings", group: "System" },
  { href: "/admin/users", label: "Users & Roles", icon: UsersIcon, resource: "users", group: "System" },
];

export default function AdminShell({ user, children }: { user: AdminUser | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!user && !isLogin) router.replace("/admin/login");
  }, [user, isLogin, router]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const allowed = useMemo(() => (user ? PERMISSIONS[user.role] : []), [user]);
  const nav = useMemo(() => NAV.filter((n) => allowed.includes(n.resource)), [allowed]);
  const groups = useMemo(() => Array.from(new Set(nav.map((n) => n.group))), [nav]);

  if (isLogin) return <ToastProvider>{children}</ToastProvider>;
  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center gap-3 text-sm font-semibold text-muted">
        <Gauge className="h-8 w-8 animate-spin text-brand-500" /> Checking your session…
      </div>
    );
  }

  const current = NAV.find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)));

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[var(--bg-soft)]">
        {/* sidebar */}
        <aside className={cn("fixed inset-y-0 left-0 z-[90] w-[264px] shrink-0 overflow-y-auto border-r border-[var(--border)] surface transition-transform duration-500 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center gap-2.5 border-b border-[var(--border)] p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl grad-brand font-display text-sm font-black text-white">ME</span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-extrabold">Milan Enterprises</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Admin Control</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto rounded-lg p-1.5 lg:hidden" aria-label="Close menu"><X className="h-4 w-4" /></button>
          </div>

          <nav className="p-3">
            {groups.map((g) => (
              <div key={g} className="mb-4">
                <p className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-muted">{g}</p>
                <div className="space-y-0.5">
                  {nav.filter((n) => n.group === g).map((n) => {
                    const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
                    return (
                      <Link key={n.href} href={n.href}
                        className={cn("group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-all duration-300",
                          active ? "grad-brand text-white shadow-lg shadow-brand-500/20" : "text-muted hover:bg-brand-500/8 hover:text-[var(--text)]")}>
                        <n.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active && "text-white")} />
                        <span className="flex-1 truncate">{n.label}</span>
                        {active && <ChevronRight className="h-3.5 w-3.5" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-2 border-t border-[var(--border)] p-3">
            <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-muted transition hover:bg-grape-500/10 hover:text-grape-600">
              <ExternalLink className="h-4 w-4" /> View website
            </Link>
            <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
              <p className="truncate text-xs font-extrabold">{user.name}</p>
              <p className="truncate text-[10px] text-muted">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full grad-brand px-2.5 py-1 text-[10px] font-black text-white">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <button
              onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/admin/login"); }}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-rose-500 transition hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-[80] flex items-center gap-3 border-b border-[var(--border)] surface px-4 py-3 backdrop-blur-xl sm:px-6">
            <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] lg:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-extrabold sm:text-lg">{current?.label ?? "Admin"}</p>
              <p className="hidden text-[11px] font-semibold text-muted sm:block">{pathname}</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full bg-emerald-500/12 px-3 py-1.5 text-[11px] font-black text-emerald-600 dark:text-emerald-400">● Live</span>
              <span className="rounded-full glass px-3 py-1.5 text-[11px] font-bold text-muted">{ROLE_LABELS[user.role]}</span>
            </div>
            <button onClick={toggleTheme} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] transition hover:border-grape-400">
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-grape-500" />}
            </button>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

export const ADMIN_ICONS = { Boxes, CalendarDays, Gauge, ImageIcon, Package, Tag, Wrench, Zap };
