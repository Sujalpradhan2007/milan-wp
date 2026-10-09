"use client";

import { useState } from "react";
import {
  CheckCircle2, ClipboardList, Clock, Hash, LifeBuoy, MessageCircle, Search,
  Send, TicketCheck, User, Wrench,
} from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Alert, Badge, Btn, Reveal, Spinner, useToast } from "@/components/ui";
import { useSite } from "./SiteShell";
import { cn, formatDateTime } from "@/lib/utils";

type Machine = { id: number; name: string };

const STATUS_STEPS = ["open", "in_progress", "waiting", "resolved", "closed"];

export default function SupportPanel({ machines, company }: { machines: Machine[]; company: { whatsapp: string; phone: string; email: string; name: string } }) {
  const { t } = useApp();
  const toast = useToast();
  const { whatsapp } = useSite();

  /* -------- create ticket -------- */
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", machineId: "", subject: "", description: "", priority: "medium" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  /* -------- track ticket -------- */
  const [trackNo, setTrackNo] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setCreated(null);
    setBusy(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, machineId: form.machineId ? Number(form.machineId) : null, machineName: machines.find((m) => m.id === Number(form.machineId))?.name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("common.error"));
      track("ticket", { entityName: json.ticketNumber });
      setCreated(json.ticketNumber);
      toast({ kind: "success", text: `${t("sup.saved")} ${json.ticketNumber}` });
      setTrackNo(json.ticketNumber);
      setForm({ name: "", phone: "", email: "", city: "", machineId: "", subject: "", description: "", priority: "medium" });
      if (json.whatsappUrl) window.open(json.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError((err as Error).message);
      toast({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function doTrack(e?: React.FormEvent) {
    e?.preventDefault();
    if (!trackNo.trim()) return;
    setTracking(true); setTrackError(""); setTicket(null); setUpdates([]);
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(trackNo.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error === "not_found" ? t("sup.notFound") : json.error || t("common.error"));
      setTicket(json.ticket); setUpdates(json.updates);
    } catch (err) {
      setTrackError((err as Error).message);
    } finally {
      setTracking(false);
    }
  }

  const stepIndex = ticket ? Math.max(0, STATUS_STEPS.indexOf(ticket.status)) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ---------------- request form ---------------- */}
      <Reveal variant="left">
        <div className="h-full rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl grad-brand text-white shadow-lg"><Wrench className="h-6 w-6" /></span>
            <div>
              <h2 className="font-display text-xl font-extrabold">{t("sup.raise")}</h2>
              <p className="text-xs text-muted">Engineer response within 24–48 hours in Odisha</p>
            </div>
          </div>

          {created && (
            <div className="mt-6">
              <Alert kind="success">
                <span className="font-bold">{t("sup.saved")} <span className="font-mono">{created}</span></span>
                <p className="mt-1 text-xs opacity-80">Track the progress in the panel on the right.</p>
              </Alert>
            </div>
          )}
          {error && <div className="mt-6"><Alert kind="error">{error}</Alert></div>}

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label={`${t("common.name")} *`}><input required value={form.name} onChange={set("name")} className={inputCls} /></F>
              <F label={`${t("common.phone")} *`}><input required value={form.phone} onChange={set("phone")} className={inputCls} inputMode="tel" /></F>
              <F label={t("common.email")}><input type="email" value={form.email} onChange={set("email")} className={inputCls} /></F>
              <F label={t("common.city")}><input value={form.city} onChange={set("city")} className={inputCls} /></F>
              <F label="Machine">
                <select value={form.machineId} onChange={set("machineId")} className={inputCls}>
                  <option value="">— select machine —</option>
                  {machines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </F>
              <F label={`${t("sup.priority")} *`}>
                <select value={form.priority} onChange={set("priority")} className={inputCls}>
                  <option value="low">Low</option><option value="medium">Medium</option>
                  <option value="high">High</option><option value="urgent">Urgent — production stopped</option>
                </select>
              </F>
            </div>
            <F label={`${t("sup.subject")} *`}><input required value={form.subject} onChange={set("subject")} className={inputCls} placeholder="e.g. Oil leaking from hydraulic cylinder" /></F>
            <F label={`${t("sup.desc")} *`}><textarea required rows={4} value={form.description} onChange={set("description")} className={inputCls} placeholder="When did it start? Any noise, error or damage? Minimum 10 characters." /></F>
            <div className="flex flex-wrap gap-2">
              <Btn type="submit" loading={busy} size="lg"><Send className="h-4 w-4" /> {busy ? t("common.sending") : t("sup.raise")}</Btn>
              <Btn type="button" variant="whatsapp" size="lg" onClick={() => { track("whatsapp_click", { entityName: "support" }); whatsapp(`Hello ${company.name},\nI need service support for my machine.\nName: ${form.name || "-"}\nPhone: ${form.phone || "-"}\nMachine: ${machines.find((m) => m.id === Number(form.machineId))?.name || "-"}\nIssue: ${form.subject || "-"} ${form.description || ""}`, "service"); }}>
                <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
              </Btn>
            </div>
          </form>
        </div>
      </Reveal>

      {/* ---------------- tracking ---------------- */}
      <Reveal variant="right" delay={120}>
        <div className="h-full rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-grape-600 text-white shadow-lg shadow-grape-600/25"><TicketCheck className="h-6 w-6" /></span>
            <div>
              <h2 className="font-display text-xl font-extrabold">{t("sup.track")}</h2>
              <p className="text-xs text-muted">Enter the ticket number you received</p>
            </div>
          </div>

          <form onSubmit={doTrack} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={trackNo} onChange={(e) => setTrackNo(e.target.value.toUpperCase())}
                placeholder="ME-2026-1042" className={cn(inputCls, "pl-10 font-mono uppercase")}
              />
            </div>
            <Btn type="submit" loading={tracking}><Search className="h-4 w-4" /> {t("sup.trackBtn")}</Btn>
          </form>

          {trackError && <div className="mt-4"><Alert kind="error">{trackError}</Alert></div>}

          {tracking && <div className="mt-10 flex justify-center"><Spinner className="h-7 w-7" /></div>}

          {!tracking && !ticket && !trackError && (
            <div className="mt-10 rounded-3xl border border-dashed border-[var(--border)] p-8 text-center">
              <LifeBuoy className="mx-auto h-10 w-10 text-grape-400" />
              <p className="mt-3 text-sm font-bold">Your service timeline will appear here</p>
              <p className="mt-1 text-xs text-muted">Status updates, assigned engineer and every action on your ticket.</p>
            </div>
          )}

          {ticket && (
            <div className="mt-6 anim-rise">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-soft)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-black text-brand-600 dark:text-brand-300">{ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} label={t(`st.${ticket.status}`)} />
                </div>
                <h3 className="mt-2 font-display text-base font-extrabold">{ticket.subject}</h3>
                <p className="mt-1 text-xs text-muted line-clamp-3">{ticket.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <Mini label={t("common.name")} value={ticket.name} icon={<User className="h-3 w-3" />} />
                  <Mini label={t("common.city")} value={ticket.city || "—"} icon={<ClipboardList className="h-3 w-3" />} />
                  <Mini label={t("sup.priority")} value={ticket.priority} icon={<LifeBuoy className="h-3 w-3" />} />
                  <Mini label={t("sup.assigned")} value={ticket.assignedName || "Not assigned"} icon={<Wrench className="h-3 w-3" />} />
                </div>
                {ticket.machineName && <p className="mt-3 text-xs font-semibold text-muted">Machine: <span className="text-[var(--text)]">{ticket.machineName}</span></p>}
              </div>

              {/* progress */}
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{t("sup.status")}</p>
                <div className="mt-3 flex items-center gap-1">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className={cn("h-2 rounded-full transition-all duration-700", i <= stepIndex ? "grad-brand" : "bg-[var(--border)]")} />
                      <p className={cn("mt-1.5 text-center text-[9px] font-bold uppercase tracking-wide", i <= stepIndex ? "text-brand-600 dark:text-brand-300" : "text-muted")}>
                        {t(`st.${s}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* timeline */}
              <div className="mt-6">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted"><Clock className="h-3.5 w-3.5" /> {t("sup.timeline")}</p>
                <ol className="mt-3 space-y-4 border-l-2 border-dashed border-[var(--border)] pl-5">
                  {updates.map((u: any) => (
                    <li key={u.id} className="relative">
                      <span className={cn("absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full ring-4 ring-[var(--bg)]",
                        u.byAdmin ? "bg-brand-500" : "bg-grape-500")}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </span>
                      <div className="rounded-2xl surface border border-[var(--border)] p-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {u.status && <Badge tone={u.status === "resolved" || u.status === "closed" ? "green" : u.status === "waiting" ? "amber" : "grape"}>{t(`st.${u.status}`)}</Badge>}
                          <span className="text-[11px] font-bold text-muted">{formatDateTime(u.createdAt)}</span>
                          {u.authorName && <span className="text-[11px] font-bold text-brand-600 dark:text-brand-300">• {u.authorName}</span>}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed">{u.message}</p>
                      </div>
                    </li>
                  ))}
                  {updates.length === 0 && <li className="text-sm text-muted">No updates yet.</li>}
                </ol>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone = status === "resolved" || status === "closed" ? "green" : status === "waiting" ? "amber" : status === "in_progress" ? "brand" : "grape";
  return <Badge tone={tone as any}>{label}</Badge>;
}

const inputCls =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12 dark:bg-white/5";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

function Mini({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/60 p-2.5 ring-1 ring-[var(--border)] dark:bg-white/5">
      <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted">{icon} {label}</p>
      <p className="mt-0.5 truncate text-[11px] font-extrabold capitalize">{value}</p>
    </div>
  );
}
