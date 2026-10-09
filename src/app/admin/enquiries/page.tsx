"use client";

import { useMemo, useState } from "react";
import { Download, MessageCircle, Phone, Search, Send, StickyNote, UserPlus } from "lucide-react";
import { useResource, api } from "@/components/admin/api";
import { Alert, Badge, Btn, EmptyState, Modal, Spinner, useToast } from "@/components/ui";
import { cn, formatDate, formatDateTime, inr, timeAgo } from "@/lib/utils";

type Enquiry = {
  id: number; type: string; name: string; phone: string; email: string | null; city: string | null;
  state: string | null; message: string | null; machineName: string | null; model: string | null;
  color: string | null; capacity: string | null; price: number | null; itemName: string | null;
  status: string; assignedName: string | null; notes: any[]; createdAt: string; source: string | null;
};

const STATUSES = [
  { value: "new", label: "New", tone: "grape" },
  { value: "contacted", label: "Contacted", tone: "brand" },
  { value: "quoted", label: "Quoted", tone: "amber" },
  { value: "won", label: "Won", tone: "green" },
  { value: "lost", label: "Lost", tone: "red" },
];
const TYPES = ["machine", "raw_material", "offer", "service", "spare", "general"];

export default function AdminEnquiriesPage() {
  const { rows, loading, error, reload, update } = useResource<Enquiry>("enquiries");
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState<Enquiry | null>(null);
  const [note, setNote] = useState("");
  const [assign, setAssign] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    let data = rows;
    if (status !== "all") data = data.filter((r) => r.status === status);
    if (type !== "all") data = data.filter((r) => r.type === type);
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter((r) => `${r.name} ${r.phone} ${r.city ?? ""} ${r.machineName ?? ""} ${r.email ?? ""}`.toLowerCase().includes(s));
    }
    return data;
  }, [rows, q, status, type]);

  async function save(patch: Record<string, any>) {
    if (!open) return;
    setBusy(true);
    try {
      const updated = await update(open.id, patch);
      setOpen({ ...open, ...(updated ?? patch) } as Enquiry);
      toast({ kind: "success", text: "Enquiry updated" });
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message });
    } finally { setBusy(false); }
  }

  async function addNote() {
    if (!open || !note.trim()) return;
    const notes = [...(open.notes || []), { text: note.trim(), by: "Admin", at: new Date().toISOString() }];
    setNote("");
    await save({ notes });
  }

  function waLink(phone: string, text: string) {
    const num = phone.replace(/\D/g, "");
    return `https://wa.me/${num.startsWith("91") ? num : `91${num}`}?text=${encodeURIComponent(text)}`;
  }

  const counts = STATUSES.map((s) => ({ ...s, n: rows.filter((r) => r.status === s.value).length }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">{rows.length} total • {counts.find((c) => c.value === "new")?.n ?? 0} new • {counts.find((c) => c.value === "won")?.n ?? 0} won</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/enquiries/export" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-4 py-2.5 text-xs font-extrabold transition hover:border-brand-400">
            <Download className="h-4 w-4" /> Export CSV
          </a>
          <Btn size="sm" variant="outline" onClick={reload}>Refresh</Btn>
        </div>
      </div>

      {/* status pills */}
      <div className="grid gap-3 sm:grid-cols-5">
        {counts.map((s) => (
          <button key={s.value} onClick={() => setStatus(status === s.value ? "all" : s.value)}
            className={cn("rounded-2xl surface border p-4 text-left transition hover:-translate-y-1",
              status === s.value ? "border-brand-400 card-shadow" : "border-[var(--border)]")}>
            <Badge tone={s.tone as any}>{s.label}</Badge>
            <p className="mt-2 font-display text-2xl font-black tabular-nums">{s.n}</p>
          </button>
        ))}
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl surface border border-[var(--border)] p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, city, machine…"
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-soft)] py-2.5 pl-9 pr-4 text-xs font-semibold outline-none focus:border-brand-400" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-xs font-bold outline-none">
          <option value="all">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid place-items-center gap-3 rounded-3xl surface border border-[var(--border)] p-16 text-muted"><Spinner className="h-7 w-7" /> Loading enquiries…</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No enquiries match" subtitle="Change the filters or wait for new leads from the website." />
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] surface card-shadow border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)] text-left text-[11px] font-extrabold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Customer</th><th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">City</th><th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">When</th><th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => {
                  const s = STATUSES.find((x) => x.value === e.status) ?? STATUSES[0];
                  return (
                    <tr key={e.id} className={cn("border-b border-[var(--border)] transition hover:bg-brand-500/4", i % 2 === 1 && "bg-[var(--bg-soft)]/40")}>
                      <td className="px-4 py-3">
                        <p className="font-bold">{e.name}</p>
                        <p className="text-[11px] text-muted">{e.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="line-clamp-1 max-w-[220px] font-semibold">{e.machineName || e.itemName || "General"}</p>
                        <p className="text-[11px] capitalize text-muted">{e.type.replace("_", " ")}{e.model ? ` • ${e.model}` : ""}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">{e.city || "—"}</td>
                      <td className="px-4 py-3 text-xs font-bold tabular-nums">{e.price ? inr(e.price) : "—"}</td>
                      <td className="px-4 py-3"><Badge tone={s.tone as any}>{s.label}</Badge></td>
                      <td className="px-4 py-3 text-xs">{e.assignedName || <span className="text-muted">Unassigned</span>}</td>
                      <td className="px-4 py-3 text-[11px] text-muted">{timeAgo(e.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <a href={waLink(e.phone, `Hello ${e.name}, this is Milan Enterprises regarding your enquiry about ${e.machineName || e.itemName || "our machines"}.`)}
                            target="_blank" rel="noopener noreferrer" aria-label="WhatsApp customer"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/12 text-[#1fa855] transition hover:bg-[#25D366]/25"><MessageCircle className="h-3.5 w-3.5" /></a>
                          <a href={`tel:${e.phone.replace(/\D/g, "")}`} aria-label="Call customer"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] transition hover:border-brand-400 hover:text-brand-600"><Phone className="h-3.5 w-3.5" /></a>
                          <Btn size="sm" variant="outline" onClick={() => { setOpen(e); setAssign(e.assignedName || ""); }}>Open</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} size="lg" title={open ? `${open.name} — ${open.phone}` : ""} subtitle={open ? `${open.type.replace("_", " ")} enquiry • ${formatDateTime(open.createdAt)}` : ""}>
        {open && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <InfoBlock title="Customer">
                <Row k="Name" v={open.name} /><Row k="Phone" v={open.phone} /><Row k="Email" v={open.email || "—"} />
                <Row k="City" v={`${open.city || "—"}${open.state ? `, ${open.state}` : ""}`} /><Row k="Source" v={open.source || "website"} />
              </InfoBlock>
              <InfoBlock title="Requirement">
                <Row k="Machine / item" v={open.machineName || open.itemName || "—"} />
                <Row k="Model" v={open.model || "—"} /><Row k="Colour" v={open.color || "—"} />
                <Row k="Capacity" v={open.capacity || "—"} /><Row k="Price" v={open.price ? inr(open.price) : "—"} />
                <div className="pt-2"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Message</p><p className="mt-1 text-sm">{open.message || "—"}</p></div>
              </InfoBlock>
            </div>

            <div className="space-y-3">
              <InfoBlock title="Pipeline">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Status</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button key={s.value} onClick={() => save({ status: s.value })} disabled={busy}
                      className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition",
                        open.status === s.value ? "grad-brand text-white" : "border border-[var(--border)] text-muted hover:border-brand-400")}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-muted">Assign to</label>
                <div className="mt-1.5 flex gap-2">
                  <input value={assign} onChange={(e) => setAssign(e.target.value)} placeholder="Staff name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-xs font-semibold outline-none focus:border-brand-400" />
                  <Btn size="sm" variant="outline" onClick={() => save({ assignedName: assign || null })}><UserPlus className="h-3.5 w-3.5" /></Btn>
                </div>
              </InfoBlock>

              <InfoBlock title="Notes & follow-ups">
                <div className="space-y-2">
                  {(open.notes || []).length === 0 && <p className="text-xs text-muted">No notes yet.</p>}
                  {(open.notes || []).map((n: any, i: number) => (
                    <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-2.5">
                      <p className="text-xs">{n.text}</p>
                      <p className="mt-1 text-[10px] font-bold text-muted">{n.by} • {formatDate(n.at)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note…"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-xs outline-none focus:border-brand-400" />
                  <Btn size="sm" onClick={addNote} disabled={!note.trim() || busy}><Send className="h-3.5 w-3.5" /></Btn>
                </div>
              </InfoBlock>

              <div className="flex flex-wrap gap-2">
                <a href={waLink(open.phone, `Hello ${open.name},\n\nThank you for your enquiry about ${open.machineName || open.itemName || "our machines"}.\n${open.model ? `Model: ${open.model}\n` : ""}${open.price ? `Price: ${inr(open.price)}\n` : ""}\n— Milan Enterprises, Khalikot`)}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-extrabold text-white transition hover:scale-105">
                  <MessageCircle className="h-3.5 w-3.5" /> Send WhatsApp reply
                </a>
                <a href={`tel:${open.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-4 py-2.5 text-xs font-extrabold transition hover:border-brand-400">
                  <Phone className="h-3.5 w-3.5" /> Call now
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <span className="hidden"><StickyNote /></span>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
      <p className="mb-2 font-display text-xs font-black uppercase tracking-wider text-muted">{title}</p>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3 border-b border-[var(--border)] py-1.5 text-xs last:border-0"><span className="text-muted">{k}</span><span className="text-right font-bold">{v}</span></div>;
}
