"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowUpRight, Eye, Globe, MessageCircle, Monitor, Percent, RefreshCw, Smartphone, TrendingUp, Zap } from "lucide-react";
import { api } from "@/components/admin/api";
import { BarChart, Donut, LineChart } from "@/components/admin/charts";
import { Alert, Btn, Reveal, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

const RANGES = [7, 14, 30, 60, 90];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await api(`/api/stats?days=${days}`)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const p = data?.period ?? {};
  const funnel = [
    { name: "Page views", count: Number(p.views || 0), color: "#ff5a10" },
    { name: "Machine views", count: Number(p.machineViews || 0), color: "#7922fc" },
    { name: "WhatsApp clicks", count: Number(p.waClicks || 0), color: "#25D366" },
    { name: "Enquiries", count: Number(p.enquiryEvents || 0), color: "#e51d74" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Page views, machine views, WhatsApp clicks, enquiries, language, device and traffic source.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full glass p-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setDays(r)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-extrabold transition", days === r ? "grad-brand text-white shadow" : "text-muted hover:text-[var(--text)]")}>{r}d</button>
            ))}
          </div>
          <Btn variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh</Btn>
        </div>
      </div>

      {error && <Alert kind="error">{error}</Alert>}
      {loading && !data && <div className="grid place-items-center gap-3 rounded-3xl surface border border-[var(--border)] p-20 text-muted"><Spinner className="h-7 w-7" /> Building reports…</div>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: `Page views (${days}d)`, value: Number(p.views || 0), icon: Eye, tone: "from-brand-500 to-amber-400" },
              { label: "Machine views", value: Number(p.machineViews || 0), icon: Zap, tone: "from-grape-600 to-pink-400" },
              { label: "WhatsApp clicks", value: Number(p.waClicks || 0), icon: MessageCircle, tone: "from-emerald-500 to-teal-400" },
              { label: "Conversion rate", value: `${data.conversionRate}%`, icon: Percent, tone: "from-pink-500 to-rose-400" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="relative overflow-hidden rounded-3xl surface card-shadow border border-[var(--border)] p-5">
                  <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-25 blur-2xl", c.tone)} />
                  <span className={cn("grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", c.tone)}><c.icon className="h-5 w-5" /></span>
                  <p className="mt-4 font-display text-2xl font-black tabular-nums">{typeof c.value === "number" ? c.value.toLocaleString("en-IN") : c.value}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{c.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="rounded-3xl surface card-shadow border border-[var(--border)] p-6">
                <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><TrendingUp className="h-3.5 w-3.5" /> Daily trend — {days} days</p>
                <LineChart data={data.series || []} keys={[
                  { key: "views", label: "Page views", color: "#ff5a10" },
                  { key: "machineViews", label: "Machine views", color: "#7922fc" },
                  { key: "wa", label: "WhatsApp", color: "#25D366" },
                  { key: "enquiries", label: "Enquiries", color: "#e51d74" },
                ]} height={260} />
              </div>
            </Reveal>
            <Reveal delay={70}>
              <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
                <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted"><Activity className="h-3.5 w-3.5" /> Lead funnel</p>
                <BarChart data={funnel} horizontal valueKey="count" labelKey="name" height={220} />
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal>
              <Card title="Devices" icon={<Smartphone className="h-3.5 w-3.5" />}>
                <Donut data={(data.byDevice || []).map((d: any) => ({ key: d.key, count: d.count }))} />
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card title="Language preference" icon={<Globe className="h-3.5 w-3.5" />}>
                <Donut data={(data.byLang || []).map((d: any) => ({ key: d.key === "or" ? "ଓଡ଼ିଆ Odia" : d.key === "hi" ? "हिन्दी Hindi" : "English", count: d.count }))} />
              </Card>
            </Reveal>
            <Reveal delay={120}>
              <Card title="Traffic source" icon={<Monitor className="h-3.5 w-3.5" />}>
                <Donut data={(data.bySource || []).map((d: any) => ({ key: d.key, count: d.count }))} />
              </Card>
            </Reveal>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal>
              <Card title="Most viewed machines" icon={<Zap className="h-3.5 w-3.5" />}>
                <BarChart data={data.topMachines || []} horizontal valueKey="count" labelKey="name" />
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card title="Most viewed raw materials" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                <BarChart data={data.topRaw || []} horizontal valueKey="count" labelKey="name" color="#7922fc" />
              </Card>
            </Reveal>
            <Reveal delay={120}>
              <Card title="Event types" icon={<Activity className="h-3.5 w-3.5" />}>
                <BarChart data={(data.byType || []).map((d: any) => ({ name: d.key.replace(/_/g, " "), count: d.count }))} horizontal valueKey="count" labelKey="name" color="#e51d74" />
              </Card>
            </Reveal>
          </div>
        </>
      )}
      {loading && data && <div className="flex justify-center py-2"><Spinner /></div>}
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl surface card-shadow border border-[var(--border)] p-6">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted">{icon} {title}</p>
      {children}
    </div>
  );
}
