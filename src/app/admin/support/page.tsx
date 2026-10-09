"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock, MessageSquarePlus, Phone, Send, Wrench } from "lucide-react";
import { useResource } from "@/components/admin/api";
import { api } from "@/components/admin/api";
import { Alert, Badge, Btn, EmptyState, Modal, Spinner, useToast } from "@/components/ui";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";

type Ticket = {
  id: number; ticketNumber: string; name: string; phone: string; email: string | null; city: string | null;
  machineName: string | null; subject: string; description: string; priority: string; status: string;
  assignedName: string | null; createdAt: string; updatedAt: string;
};
type Update = { id: number; ticketId: number; status: string | null; message: string; byAdmin: boolean; authorName: string | null; createdAt: string };

const STATUSES = [
  { value: "open", label: "Open", tone: "grape" },
  { value: "in_progress", label: "In Progress", tone: "brand" },
  { value: "waiting", label: "Waiting", tone: "amber" },
  { value: "resolved", label: "Resolved", tone: "green" },
  { value: "closed", label: "Closed", tone: "grey" },
];
const PRIORITIES = [
  { value: "low", label: "Low", tone: "grey" },
  { value: "medium", label: "Medium", tone: "grape" },
  { value: "high", label: "High", tone: "amber" },
  { value: "urgent", label: "Urgent", tone: "red" },
];

export default function AdminSupportPage() {
  const { rows, loading, error, reload, update } = useResource<Ticket>("tickets");
  const updatesRes = useResource<Update>("ticket_updates");
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Ticket | null>(null);
  const [msg, setMsg] = useState("");
  const [nextStatus, setNextStatus] = useState("in_progress");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    let data = rows;
    if (status !== "all") data = data.filter((t) => t.status === status);
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter((t) => `${t.ticketNumber} ${t.name} ${t.phone} ${t.subject} ${t.machineName ?? ""}`.toLowerCase().includes(s));
    }
    return data;
  }, [rows, q, status]);

  const ticketUpdates = useMemo(
    () => (updatesRes.rows || []).filter((u) => u.ticketId === open?.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [updatesRes.rows, open]
  );

  async function saveTicket(patch: Record<string, any>) {
    if (!open) return;
    setBusy(true);
    try {
      const updated = await update(open.id, patch);
      setOpen({ ...open, ...(updated ?? patch) } as Ticket);
      toast({ kind: "success", text: "Ticket updated" });
    } catch (err) { toast({ kind: "error", text: (err as Error).message }); } finally { setBusy(false); }
  }

  async function addUpdate() {
    if (!open || !msg.trim()) return;
    setBusy(true);
    try {
      await api("/api/admin/ticket_updates", {
        method: "POST",
        body: JSON.stringify({ ticketId: open.id, status: nextStatus, message: msg.trim(), byAdmin: true, authorName: "Support Desk" }),
      });
      await saveTicket({ status: nextStatus });
      await updatesRes.reload();
      setMsg("");
      toast({ kind: "success", text: "Update posted to the customer timeline" });
    } catch (err) { toast({ kind: "error", text: (err as Error).message }); } finally { setBusy(false); }
  }

  const counts = STATUSES.map((s) => ({ ...s, n: rows.filter((r) => r.status === s.value).length }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Support Tickets</h1>
          <p className="mt-1 text-sm text-muted">{rows.length} tickets • {counts[0].n + counts[1].n + counts[2].n} need attention</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticket / customer…"
            className="w-52 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-xs font-bold outline-none">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <Btn size="sm" variant="outline" onClick={() => { reload(); updatesRes.reload(); }}>Refresh</Btn>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        {counts.map((s) => (
          <button key={s.value} onClick={() => setStatus(status === s.value ? "all" : s.value)}
            className={cn("rounded-2xl surface border p-4 text-left transition hover:-translate-y-1", status === s.value ? "border-brand-400 card-shadow" : "border-[var(--border)]")}>
            <Badge tone={s.tone as any}>{s.label}</Badge>
            <p className="mt-2 font-display text-2xl font-black tabular-nums">{s.n}</p>
          </button>
        ))}
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      {loading ? (
        <div className="grid place-items-center gap-3 rounded-3xl surface border border-[var(--border)] p-16 text-muted"><Spinner className="h-7 w-7" /> Loading tickets…</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No tickets found" subtitle="Service requests raised from the website appear here instantly." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((t) => {
            const s = STATUSES.find((x) => x.value === t.status) ?? STATUSES[0];
            const p = PRIORITIES.find((x) => x.value === t.priority) ?? PRIORITIES[1];
            return (
              <button key={t.id} onClick={() => { setOpen(t); updatesRes.reload(); }}
                className="group rounded-[1.4rem] surface card-shadow border border-[var(--border)] p-5 text-left transition-all duration-400 hover:-translate-y-1 hover:border-brand-300">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-300">{t.ticketNumber}</span>
                  <Badge tone={s.tone as any}>{s.label}</Badge>
                  <Badge tone={p.tone as any}>{p.label} priority</Badge>
                  <span className="ml-auto text-[11px] text-muted">{timeAgo(t.createdAt)}</span>
                </div>
                <h3 className="mt-2 font-display text-base font-extrabold">{t.subject}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{t.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-muted">
                  <span>👤 {t.name}</span><span>📞 {t.phone}</span>
                  {t.city && <span>📍 {t.city}</span>}
                  {t.machineName && <span className="inline-flex items-center gap-1"><Wrench className="h-3 w-3" /> {t.machineName}</span>}
                  <span className="ml-auto text-brand-600 opacity-0 transition group-hover:opacity-100 dark:text-brand-300">Open →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} size="lg" title={open?.ticketNumber} subtitle={open ? `${open.subject} • opened ${formatDateTime(open.createdAt)}` : ""}>
        {open && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="mb-2 font-display text-xs font-black uppercase tracking-wider text-muted">Customer</p>
                <Row k="Name" v={open.name} /><Row k="Phone" v={open.phone} /><Row k="Email" v={open.email || "—"} />
                <Row k="City" v={open.city || "—"} /><Row k="Machine" v={open.machineName || "—"} />
                <div className="pt-2"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Problem</p><p className="mt-1 text-sm">{open.description}</p></div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="mb-2 font-display text-xs font-black uppercase tracking-wider text-muted">Manage</p>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Status</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button key={s.value} onClick={() => saveTicket({ status: s.value })} disabled={busy}
                      className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", open.status === s.value ? "grad-brand text-white" : "border border-[var(--border)] text-muted hover:border-brand-400")}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-muted">Priority</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button key={p.value} onClick={() => saveTicket({ priority: p.value })} disabled={busy}
                      className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", open.priority === p.value ? "bg-grape-600 text-white" : "border border-[var(--border)] text-muted hover:border-grape-400")}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-muted">Assigned engineer</label>
                <input defaultValue={open.assignedName || ""} onBlur={(e) => saveTicket({ assignedName: e.target.value || null })}
                  placeholder="Assign staff member"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white/60 px-3 py-2 text-xs font-semibold outline-none focus:border-brand-400 dark:bg-white/5" />
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${open.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-4 py-2 text-xs font-extrabold transition hover:border-brand-400">
                    <Phone className="h-3.5 w-3.5" /> Call customer
                  </a>
                  <a href={`https://wa.me/${open.phone.replace(/\D/g, "").replace(/^0*/, "")}?text=${encodeURIComponent(`Hello ${open.name}, regarding ticket ${open.ticketNumber} — ${open.subject}. Milan Enterprises support.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-extrabold text-white transition hover:scale-105">
                    <MessageSquarePlus className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="mb-3 flex items-center gap-2 font-display text-xs font-black uppercase tracking-wider text-muted"><Clock className="h-3.5 w-3.5" /> Timeline</p>
              <ol className="space-y-3 border-l-2 border-dashed border-[var(--border)] pl-4">
                {ticketUpdates.length === 0 && <li className="text-xs text-muted">No updates yet — post the first one below.</li>}
                {ticketUpdates.map((u) => (
                  <li key={u.id} className="relative">
                    <span className={cn("absolute -left-[23px] top-1 grid h-4 w-4 place-items-center rounded-full ring-4 ring-[var(--bg-soft)]", u.byAdmin ? "bg-brand-500" : "bg-grape-500")}>
                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                    </span>
                    <div className="rounded-xl surface border border-[var(--border)] p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {u.status && <Badge tone="grape">{STATUSES.find((s) => s.value === u.status)?.label ?? u.status}</Badge>}
                        <span className="text-[10px] font-bold text-muted">{formatDateTime(u.createdAt)} • {u.authorName || (u.byAdmin ? "Staff" : "Customer")}</span>
                      </div>
                      <p className="mt-1 text-xs">{u.message}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-white/60 p-3 dark:bg-white/5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Post an update (visible to the customer)</label>
                <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="e.g. Engineer Rakesh is visiting tomorrow 11 AM with the seal kit."
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-xs outline-none focus:border-brand-400" />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-2.5 py-2 text-xs font-bold outline-none">
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>Set status: {s.label}</option>)}
                  </select>
                  <Btn size="sm" onClick={addUpdate} loading={busy} disabled={!msg.trim()}><Send className="h-3.5 w-3.5" /> Post update</Btn>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3 border-b border-[var(--border)] py-1.5 text-xs last:border-0"><span className="text-muted">{k}</span><span className="text-right font-bold">{v}</span></div>;
}
