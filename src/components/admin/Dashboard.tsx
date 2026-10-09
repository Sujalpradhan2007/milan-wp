"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, AlertTriangle, ArrowUpRight, Boxes, Eye, Headset, Inbox, Megaphone,
  MessageCircle, Package, Percent, RefreshCw, TrendingUp, Users, Zap,
} from "lucide-react";
import { api } from "./api";
import { BarChart, Donut, LineChart } from "./charts";
import { Badge, Btn, Reveal, Spinner } from "@/components/ui";
import { cn, inr, timeAgo } from "@/lib/utils";

const RANGES = [7, 14, 30, 60, 90];

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      setData(await api(`/api/stats?days=${days}`));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="grid place-items-center gap-3 rounded-3xl border border-rose-500/30 bg-rose-500/8 p-16 text-center">
        <AlertTriangle className="h-8 w-8 text-rose-500" />
        <p className="font-bold">{error}</p>
        <Btn size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> Retry</Btn>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <div key={i} className="h-28 rounded-3xl skeleton" />)}</div>
        <div className="grid gap-4 lg:grid-cols-3"><div className="h-72 rounded-3xl skeleton lg:col-span-2" /><div className="h-72 rounded-3xl skeleton" /></div>
      </div>
    );
  }

  const t = data.totals || {};
  const p = data.period || {};
  const cards = [
    { label: "Website Views", value: Number(p.views || 0).toLocaleString("en-IN"), icon: Eye, tone: "from-brand-500 to-amber-400", sub: `last ${days} days`, href: "/admin/analytics" },
    { label: "Machine Views", value: Number(p.machineViews || 0).toLocaleString("en-IN"), icon: Zap, tone: "from-grape-600 to-pink-400", sub: `${t.machines || 0} machines live`, href: "/admin/machines" },
    { label: "WhatsApp Clicks", value: Number(p.waClicks || 0).toLocaleString("en-IN"), icon: MessageCircle, tone: "from-emerald-500 to-teal-400", sub: "direct leads", href: "/admin/analytics" },
    { label: "Enquiries", value: String(t.enquiries || 0), icon: Inbox, tone: "from-pink-500 to-rose-400", sub: `+${data.totals ? Number(p.enquiryEvents || 0) : 0} this period`, href: "/admin/enquiries" },
    { label: "Open Tickets", value: String(t.openTickets || 0), icon: Headset, tone: "from-sky-500 to-indigo-400", sub: `${t.tickets || 0} total`, href: "/admin/support" },
    { label: "Raw Materials", value: String(t.raw || 0), icon: Package, tone: "from-amber-500 to-orange-400", sub: `${data.lowStockRaw?.length || 0} low stock`, href: "/admin/raw-materials" },
    { label: "Live Offers", value: String(t.offers || 0), icon: Megaphone, tone: "from-fuchsia-500 to-purple-400", sub: "campaigns", href: "/admin/offers" },
    { label: "Subscribers", value: String(t.subscribers || 0), icon: Users, tone: "from-cyan-500 to-blue-400", sub: "newsletter", href: "/admin/analytics" },
  ];

  const stockAlerts = [
    ...(data.lowStockRaw || []).map((r: any) => ({ ...r, kind: "Raw material" })),
    ...(data.lowStockSpare || []).map((r: any) => ({ ...r, kind: "Spare part" })),
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Business Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Everything happening on your website and in your pipeline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full glass p-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setDays(r)}
                className={cn("rounded-full px-3.5 py-1.5 text-xs font-extrabold transition", days === r ? "grad-brand text-white shadow" : "text-muted hover:text-[var(--text)]")}>
                {r}d
              </button>
            ))}
          </div>
          <Btn variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh</Btn>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 45}>
            <Link href={c.href} className="group relative block overflow-hidden rounded-3xl surface card-shadow border border-[var(--border)] p-5 transition-all duration-500 hover:-translate-y-1.5">
              <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-25 blur-2xl transition group-hover:opacity-50", c.tone)} />
              <div className="flex items-start justify-between">
                <span className={cn("grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:rotate-12", c.tone)}>
                  <c.icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-4 font-display text-2xl font-black tabular-nums">{c.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{c.label}</p>
              <p className="mt-1 text-[11px] text-muted">{c.sub}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* conversion + stock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><Percent className="h-3.5 w-3.5" /> Conversion rate ({days}d)</p>
            <p className="mt-2 font-display text-4xl font-black grad-text">{data.conversionRate}%</p>
            <p className="mt-1 text-xs text-muted">Visitors → enquiries ({p.enquiryEvents || 0} of {p.views || 0})</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/6 dark:bg-white/10">
              <div className="h-full rounded-full grad-brand transition-all duration-1000" style={{ width: `${Math.min(100, data.conversionRate * 6)}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat icon={<TrendingUp className="h-3.5 w-3.5" />} label="ROI calcs" value={String(p.roiCalcs || 0)} />
              <MiniStat icon={<Boxes className="h-3.5 w-3.5" />} label="Offer views" value={String(p.offerViews || 0)} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={70} className="lg:col-span-2">
          <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Stock alerts</p>
              <Link href="/admin/raw-materials" className="text-[11px] font-bold text-brand-600 hover:underline">Manage →</Link>
            </div>
            {stockAlerts.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-muted">All stock levels are healthy 🎉</p>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {stockAlerts.slice(0, 6).map((s: any) => (
                  <div key={`${s.kind}-${s.id}`} className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-600"><Package className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold">{s.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{s.kind}</p>
                    </div>
                    <Badge tone={Number(s.stock) === 0 ? "red" : "amber"}>{s.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><Activity className="h-3.5 w-3.5" /> Traffic & leads — last {days} days</p>
            <LineChart
              data={data.series || []}
              keys={[
                { key: "views", label: "Page views", color: "#ff5a10" },
                { key: "machineViews", label: "Machine views", color: "#7922fc" },
                { key: "wa", label: "WhatsApp", color: "#25D366" },
                { key: "enquiries", label: "Enquiries", color: "#e51d74" },
              ]}
            />
          </div>
        </Reveal>
        <Reveal delay={70}>
          <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <p className="mb-4 text-[11px] font-black uppercase tracking-wider text-muted">Devices</p>
            <Donut data={(data.byDevice || []).map((d: any) => ({ key: d.key, count: d.count }))} />
            <p className="mb-3 mt-6 text-[11px] font-black uppercase tracking-wider text-muted">Language</p>
            <Donut data={(data.byLang || []).map((d: any) => ({ key: d.key === "or" ? "Odia" : d.key === "hi" ? "Hindi" : "English", count: d.count }))} size={120} height={150} />
          </div>
        </Reveal>
      </div>

      {/* popular */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal>
          <ChartCard title="Popular machines">
            <BarChart data={data.topMachines || []} horizontal valueKey="count" labelKey="name" />
          </ChartCard>
        </Reveal>
        <Reveal delay={60}>
          <ChartCard title="Popular raw materials">
            <BarChart data={data.topRaw || []} horizontal valueKey="count" labelKey="name" color="#7922fc" />
          </ChartCard>
        </Reveal>
        <Reveal delay={120}>
          <ChartCard title="Traffic sources">
            <BarChart data={(data.bySource || []).map((d: any) => ({ name: d.key, count: d.count }))} horizontal valueKey="count" labelKey="name" color="#e51d74" />
          </ChartCard>
        </Reveal>
      </div>

      {/* recent */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><Inbox className="h-3.5 w-3.5" /> Recent enquiries</p>
              <Link href="/admin/enquiries" className="text-[11px] font-bold text-brand-600 hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {(data.recentEnquiries || []).length === 0 && <p className="py-6 text-center text-sm text-muted">No enquiries yet.</p>}
              {(data.recentEnquiries || []).map((e: any) => (
                <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3 transition hover:border-brand-300">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl grad-brand text-[11px] font-black text-white">
                    {String(e.name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold">{e.name} <span className="font-normal text-muted">• {e.city || "—"}</span></p>
                    <p className="truncate text-[11px] text-muted">{e.machineName || e.itemName || e.type}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusPill status={e.status} />
                    <p className="mt-0.5 text-[10px] text-muted">{timeAgo(e.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="rounded-3xl surface card-shadow border border-[var(--border)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><Activity className="h-3.5 w-3.5" /> Recent activity</p>
              <Link href="/admin/support" className="text-[11px] font-bold text-brand-600 hover:underline">Tickets →</Link>
            </div>
            <ol className="space-y-3 border-l-2 border-dashed border-[var(--border)] pl-4">
              {(data.activities || []).slice(0, 8).map((a: any) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full grad-brand ring-4 ring-[var(--surface-solid)]" />
                  <p className="text-xs font-bold">
                    <span className="text-brand-600 dark:text-brand-300">{a.actor}</span> {a.action}
                    {a.entityName && <span className="text-muted"> — {a.entityName}</span>}
                  </p>
                  <p className="text-[10px] text-muted">{timeAgo(a.createdAt)}</p>
                </li>
              ))}
              {(data.activities || []).length === 0 && <p className="text-sm text-muted">No activity recorded yet.</p>}
            </ol>
            {(data.recentTickets || []).length > 0 && (
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-muted">Latest tickets</p>
                <div className="space-y-1.5">
                  {data.recentTickets.slice(0, 4).map((tk: any) => (
                    <div key={tk.id} className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-grape-600 dark:text-grape-300">{tk.ticketNumber}</span>
                      <span className="min-w-0 flex-1 truncate text-muted">{tk.subject}</span>
                      <StatusPill status={tk.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {loading && <div className="flex justify-center py-2"><Spinner /></div>}
      <p className="pb-4 text-center text-[11px] text-muted">
        Revenue pipeline value (quoted + won enquiries): {inr(0)} — see Enquiries for detailed status values.
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
      <p className="mb-4 text-[11px] font-black uppercase tracking-wider text-muted">{title}</p>
      {children}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">{icon} {label}</p>
      <p className="mt-0.5 font-display text-lg font-black tabular-nums">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: any }> = {
    new: { label: "New", tone: "grape" }, contacted: { label: "Contacted", tone: "brand" },
    quoted: { label: "Quoted", tone: "amber" }, won: { label: "Won", tone: "green" }, lost: { label: "Lost", tone: "red" },
    open: { label: "Open", tone: "grape" }, in_progress: { label: "In progress", tone: "brand" },
    waiting: { label: "Waiting", tone: "amber" }, resolved: { label: "Resolved", tone: "green" }, closed: { label: "Closed", tone: "grey" },
  };
  const m = map[status] || { label: status, tone: "grey" };
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
