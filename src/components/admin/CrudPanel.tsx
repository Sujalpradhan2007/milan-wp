"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useResource } from "./api";
import { Badge, Btn, EmptyState, Modal, SmartImage, Spinner, useToast } from "@/components/ui";
import { FieldInput, type Field } from "./fields";
import { cn, formatDate, inr } from "@/lib/utils";

export type Column = {
  key: string; label: string;
  type?: "text" | "image" | "price" | "bool" | "badge" | "date" | "number" | "translate";
  badgeMap?: Record<string, { label: string; tone: any }>;
  langField?: string;
  width?: string;
};

export default function CrudPanel<T extends { id: number }>({
  resource, title, subtitle, fields, columns, defaults = {}, transform, rowActions, searchKeys, quickFilters,
}: {
  resource: string; title: string; subtitle?: string; fields: Field[]; columns: Column[];
  defaults?: Record<string, any>;
  transform?: (values: Record<string, any>) => Record<string, any>;
  rowActions?: (row: T, helpers: { edit: (r: T) => void; refresh: () => void }) => React.ReactNode;
  searchKeys?: string[];
  quickFilters?: { key: string; label: string; options: { value: string; label: string }[] }[];
}) {
  const { rows, loading, error, reload, create, update, remove } = useResource<T>(resource);
  const toast = useToast();
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<T | null>(null);

  const filtered = useMemo(() => {
    let data = rows;
    if (q.trim() && searchKeys?.length) {
      const s = q.toLowerCase();
      data = data.filter((r: any) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(s)));
    }
    for (const [key, val] of Object.entries(filters)) {
      if (!val || val === "all") continue;
      data = data.filter((r: any) => String(r[key]) === val);
    }
    return data;
  }, [rows, q, filters, searchKeys]);

  function openCreate() {
    setEditing(null);
    const init: Record<string, any> = { ...defaults };
    fields.forEach((f) => { if (init[f.name] === undefined) init[f.name] = f.type === "checkbox" ? false : f.type === "repeat" || f.type === "media" || f.type === "i18n" ? (f.type === "i18n" ? { en: {}, hi: {}, or: {} } : []) : ""; });
    setValues(init);
    setOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    const init: Record<string, any> = { ...defaults, ...(row as any) };
    fields.forEach((f) => { if (init[f.name] === undefined || init[f.name] === null) init[f.name] = f.type === "checkbox" ? false : f.type === "repeat" || f.type === "media" ? [] : f.type === "i18n" ? { en: {}, hi: {}, or: {} } : ""; });
    setValues(init);
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    try {
      const payload = transform ? transform(values) : values;
      if (editing) {
        await update(editing.id, payload);
        toast({ kind: "success", text: `${title} updated` });
      } else {
        await create(payload);
        toast({ kind: "success", text: `${title} created` });
      }
      setOpen(false);
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function toggleBool(row: any, key: string) {
    try {
      await update(row.id, { [key]: !row[key] });
      toast({ kind: "success", text: `${key} set to ${!row[key] ? "yes" : "no"}` });
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message });
    }
  }

  async function doDelete() {
    if (!confirm) return;
    try {
      await remove(confirm.id);
      toast({ kind: "success", text: `${title} deleted` });
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message });
    } finally {
      setConfirm(null);
    }
  }

  function cell(row: any, col: Column) {
    const v = row[col.key];
    switch (col.type) {
      case "image":
        return <SmartImage src={v} alt={row.name || row.title || "image"} wrapperClassName="h-11 w-14 rounded-lg border border-[var(--border)]" ratio="4/3" />;
      case "price":
        return <span className="font-bold tabular-nums">{v ? inr(Number(v)) : "—"}</span>;
      case "number":
        return <span className="tabular-nums">{Number(v ?? 0).toLocaleString("en-IN")}</span>;
      case "date":
        return <span className="text-xs text-muted">{formatDate(v)}</span>;
      case "bool":
        return (
          <button type="button" onClick={() => toggleBool(row, col.key)}
            className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition",
              v ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-black/6 text-muted dark:bg-white/10")}>
            <span className={cn("h-2 w-2 rounded-full", v ? "bg-emerald-500" : "bg-current opacity-50")} /> {v ? "Yes" : "No"}
          </button>
        );
      case "badge": {
        const m = col.badgeMap?.[String(v)] ?? { label: String(v ?? "—"), tone: "grey" };
        return <Badge tone={m.tone}>{m.label}</Badge>;
      }
      case "translate": {
        const t = row.t as any;
        const text = t?.en?.[col.langField ?? "name"] || v;
        return <span className="line-clamp-2 max-w-[280px] text-xs text-muted">{text || "—"}</span>;
      }
      default:
        return <span className="line-clamp-1 max-w-[240px] font-semibold">{v === null || v === undefined || v === "" ? "—" : String(v)}</span>;
    }
  }

  return (
    <div>
      {/* toolbar */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-soft)] py-2.5 pl-9 pr-4 text-xs font-semibold outline-none transition focus:border-brand-400 lg:w-56" />
          </div>
          {quickFilters?.map((f) => (
            <select key={f.key} value={filters[f.key] ?? "all"} onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-xs font-bold outline-none">
              <option value="all">{f.label}: All</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          <Btn variant="outline" size="sm" onClick={reload} aria-label="Refresh"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></Btn>
          <Btn size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Add New</Btn>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4" /> {error}
          <button onClick={reload} className="ml-auto rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold">Retry</button>
        </div>
      )}

      {/* table */}
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] surface card-shadow">
        {loading ? (
          <div className="grid place-items-center gap-3 p-16 text-sm text-muted">
            <Spinner className="h-7 w-7" /> Loading {title.toLowerCase()}…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState title={`No ${title.toLowerCase()} found`} subtitle={q || Object.values(filters).some(Boolean) ? "Try clearing the search or filters." : "Click “Add New” to create the first entry."} action={!q ? <Btn size="sm" className="mt-2" onClick={openCreate}><Plus className="h-4 w-4" /> Add New</Btn> : undefined} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)] text-left">
                  {columns.map((c) => (
                    <th key={c.key} className={cn("whitespace-nowrap px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-muted", c.width)}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wider text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row: any, i) => (
                  <tr key={row.id} className={cn("border-b border-[var(--border)] transition hover:bg-brand-500/4", i % 2 === 1 && "bg-[var(--bg-soft)]/50")}>
                    {columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle">{cell(row, c)}</td>)}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {rowActions?.(row, { edit: openEdit, refresh: reload })}
                        <button onClick={() => openEdit(row)} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] transition hover:border-brand-400 hover:text-brand-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setConfirm(row)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] text-rose-500 transition hover:border-rose-400 hover:bg-rose-500/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-xs font-bold text-muted">
            <span>Showing {filtered.length} of {rows.length}</span>
            <span className="capitalize">{resource.replace(/_/g, " ")}</span>
          </div>
        )}
      </div>

      {/* editor */}
      <Modal
        open={open} onClose={() => setOpen(false)} size="xl"
        title={editing ? `Edit ${title}` : `Add ${title}`}
        subtitle={editing ? `#${editing.id}` : undefined}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const span = f.full || f.type === "i18n" || f.type === "repeat" || f.type === "media" || f.type === "textarea"
              ? "sm:col-span-2" : f.half ? "" : "sm:col-span-1";
            return (
              <div key={f.name} className={cn(span)}>
                {f.type !== "checkbox" && (
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    {f.label} {f.required && <span className="text-rose-500">*</span>}
                  </label>
                )}
                <FieldInput field={f} value={values[f.name]} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />
                {f.hint && <p className="mt-1 text-[11px] text-muted">{f.hint}</p>}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-5">
          <Btn variant="ghost" onClick={() => setOpen(false)}><X className="h-4 w-4" /> Cancel</Btn>
          <Btn onClick={save} loading={busy}><Check className="h-4 w-4" /> {editing ? "Save changes" : "Create"}</Btn>
        </div>
      </Modal>

      {/* delete confirm */}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} size="sm" title="Delete this item?">
        <p className="text-sm text-muted">
          This permanently removes <span className="font-bold text-[var(--text)]">{(confirm as any)?.name || (confirm as any)?.title || (confirm as any)?.partCode || `#${confirm?.id}`}</span>. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn className="bg-rose-600 shadow-rose-600/25" onClick={doDelete}><Trash2 className="h-4 w-4" /> Delete</Btn>
        </div>
      </Modal>
    </div>
  );
}
