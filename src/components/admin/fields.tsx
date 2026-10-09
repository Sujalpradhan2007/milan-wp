"use client";

import { useRef, useState } from "react";
import {
  ArrowDown, ArrowUp, Film, Globe, Image as ImageIcon, Link2, Palette, Plus,
  RefreshCw, Trash2, Upload, X,
} from "lucide-react";
import { uploadFiles } from "./api";
import { LANGS, type Lang } from "@/lib/i18n";
import { defaultColorRows, normaliseColors } from "@/lib/colors";
import { cn, inr } from "@/lib/utils";

export type Option = { value: string; label: string };
export type SubField = {
  key: string; label: string; type: "text" | "number" | "image" | "checkbox" | "select" | "textarea";
  options?: Option[]; placeholder?: string; width?: string;
};
export type FieldType =
  | "text" | "textarea" | "number" | "price" | "select" | "checkbox" | "image"
  | "media" | "i18n" | "repeat" | "date" | "color" | "slug" | "colors";

export type Field = {
  name: string; label: string; type: FieldType;
  required?: boolean; half?: boolean; third?: boolean; full?: boolean;
  options?: Option[]; placeholder?: string; hint?: string; rows?: number;
  min?: number; max?: number; step?: number;
  i18nFields?: { key: string; label: string; type: "text" | "textarea"; rows?: number }[];
  repeatFields?: SubField[]; repeatLabel?: string; repeatTitleKey?: string;
};

const input =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3.5 py-2.5 text-sm font-medium outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:bg-white/5";

export function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case "textarea":
      return <textarea rows={field.rows ?? 4} value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={input} />;
    case "number":
    case "price":
      return (
        <div className="relative">
          {field.type === "price" && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">₹</span>}
          <input type="number" value={value ?? ""} min={field.min} max={field.max} step={field.step ?? 1}
            placeholder={field.placeholder} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className={cn(input, field.type === "price" && "pl-7")} />
          {field.type === "price" && value ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted">{inr(Number(value))}</span> : null}
        </div>
      );
    case "select":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={input}>
          <option value="">— select —</option>
          {(field.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "checkbox":
      return (
        <button type="button" onClick={() => onChange(!value)}
          className={cn("flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition",
            value ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-[var(--border)] bg-[var(--bg-soft)] text-muted")}>
          <span>{field.label}</span>
          <span className={cn("relative h-6 w-11 rounded-full transition", value ? "bg-emerald-500" : "bg-black/15 dark:bg-white/20")}>
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", value ? "left-[22px]" : "left-0.5")} />
          </span>
        </button>
      );
    case "date":
      return <input type="date" value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} className={input} />;
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={value || "#ff5a10"} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-[var(--border)] bg-transparent p-1" />
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={input} placeholder="#ff5a10" />
        </div>
      );
    case "image":
      return <ImageUpload value={value} onChange={onChange} />;
    case "media":
      return <MediaUpload value={value ?? []} onChange={onChange} />;
    case "i18n":
      return <I18nEditor fields={field.i18nFields ?? []} value={value ?? {}} onChange={onChange} />;
    case "repeat":
      return <ListEditor fields={field.repeatFields ?? []} value={value ?? []} onChange={onChange} label={field.repeatLabel ?? "Row"} titleKey={field.repeatTitleKey} />;
    case "colors":
      return <PaletteEditor value={value ?? []} onChange={onChange} />;
    default:
      return <input value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={input} />;
  }
}

/* ------------------------------ image upload ----------------------------- */
export function ImageUpload({ value, onChange, label }: { value?: string | null; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handle(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true); setErr("");
    try {
      const urls = await uploadFiles([files[0]]);
      if (urls[0]) onChange(urls[0]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]">
          {value ? (
            <>
              <img src={value} alt="preview" className="h-full w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.25")} />
              <button type="button" onClick={() => onChange("")} aria-label="Remove image"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white transition hover:bg-rose-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="grid h-full w-full place-items-center text-muted"><ImageIcon className="h-6 w-6" /></div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files)} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => ref.current?.click()} disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl grad-brand px-3.5 py-2 text-xs font-extrabold text-white transition hover:scale-105 disabled:opacity-60">
              <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading…" : label || "Upload image"}
            </button>
            <div className="relative flex-1 min-w-[140px]">
              <Link2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="…or paste a URL" className={cn(input, "py-2 pl-8 text-xs")} />
            </div>
          </div>
          {err && <p className="text-[11px] font-bold text-rose-500">{err}</p>}
          <p className="text-[11px] text-muted">JPG / PNG / WEBP up to 12 MB. Stored permanently in the database.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ media upload ----------------------------- */
type Media = { type: "image" | "video"; url: string; caption?: string };

export function MediaUpload({ value, onChange }: { value: Media[]; onChange: (v: Media[]) => void }) {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const vidRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  async function handle(files: FileList | null, type: "image" | "video") {
    if (!files || !files.length) return;
    setBusy(true); setErr("");
    try {
      const urls = await uploadFiles(Array.from(files));
      onChange([...value, ...urls.map((u) => ({ type, url: u, caption: "" }))]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (imgRef.current) imgRef.current.value = "";
      if (vidRef.current) vidRef.current.value = "";
    }
  }

  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handle(e.target.files, "image")} />
        <input ref={vidRef} type="file" accept="video/*" multiple className="hidden" onChange={(e) => handle(e.target.files, "video")} />
        <button type="button" onClick={() => imgRef.current?.click()} disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl grad-brand px-3.5 py-2 text-xs font-extrabold text-white transition hover:scale-105 disabled:opacity-60">
          <ImageIcon className="h-3.5 w-3.5" /> {busy ? "Uploading…" : "Add photos"}
        </button>
        <button type="button" onClick={() => vidRef.current?.click()} disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] glass px-3.5 py-2 text-xs font-extrabold transition hover:border-grape-400">
          <Film className="h-3.5 w-3.5" /> Add video file
        </button>
        <div className="flex min-w-[220px] flex-1 gap-2">
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube / video link" className={cn(input, "py-2 text-xs")} />
          <button type="button" onClick={() => { if (videoUrl.trim()) { onChange([...value, { type: "video", url: videoUrl.trim(), caption: "" }]); setVideoUrl(""); } }}
            className="rounded-xl border border-[var(--border)] glass px-3 text-xs font-extrabold transition hover:border-grape-400">Add</button>
        </div>
      </div>
      {err && <p className="text-[11px] font-bold text-rose-500">{err}</p>}

      {value.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-muted">No media yet — add photos and working videos.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {value.map((m, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-2">
              <div className="grid h-14 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-black/5">
                {m.type === "video" ? <Film className="h-5 w-5 text-grape-500" /> : <img src={m.url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <input value={m.caption ?? ""} placeholder="caption" onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
                  className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-xs font-semibold outline-none hover:border-[var(--border)] focus:border-brand-400" />
                <p className="truncate px-1 text-[10px] text-muted">{m.url}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"><ArrowDown className="h-3.5 w-3.5" /></button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Delete media"
                className="shrink-0 rounded-lg p-2 text-rose-500 transition hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------- palette editor ----------------------------- */
/**
 * Every machine carries the same 10 standard shades. The admin can optionally
 * upload a real photo for any shade; where no photo exists the website tints
 * the cover photo automatically so the customer still sees that colour.
 */
export function PaletteEditor({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) {
  const rows = normaliseColors(value);
  const withPhoto = rows.filter((r) => r.imageUrl).length;

  const update = (id: string, patch: Record<string, any>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5">
        <Palette className="h-4 w-4 text-brand-500" />
        <span className="text-xs font-extrabold">{rows.length} standard colours</span>
        <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          {withPhoto} with real photo
        </span>
        <button
          type="button"
          onClick={() => onChange(defaultColorRows(""))}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-extrabold transition hover:border-brand-400 hover:text-brand-600"
        >
          <RefreshCw className="h-3 w-3" /> Reset to 10 standard shades
        </button>
      </div>

      <p className="border-b border-[var(--border)] bg-brand-500/6 px-3 py-2 text-[11px] text-muted">
        Every machine automatically offers all 10 shades to the customer. Upload a photo only if you
        have a real picture of that colour — otherwise the cover photo is recoloured live on the website.
      </p>

      <div className="grid gap-2 p-3 sm:grid-cols-2">
        {rows.map((c) => (
          <div key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 shrink-0 rounded-full ring-1 ring-black/15" style={{ background: c.hex }} />
              <input
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-xs font-extrabold outline-none hover:border-[var(--border)] focus:border-brand-400"
              />
              <input
                type="color" value={c.hex} onChange={(e) => update(c.id, { hex: e.target.value })}
                aria-label={`${c.name} colour code`}
                className="h-7 w-9 shrink-0 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-0.5"
              />
            </div>
            <div className="mt-2">
              <ImageUpload value={c.imageUrl} onChange={(v) => update(c.id, { imageUrl: v })} label="Colour photo" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ i18n editor ------------------------------ */
export function I18nEditor({
  fields, value, onChange,
}: { fields: { key: string; label: string; type: "text" | "textarea"; rows?: number }[]; value: Record<string, any>; onChange: (v: any) => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const current = (value?.[lang] ?? {}) as Record<string, any>;
  const set = (key: string, v: any) => onChange({ ...value, [lang]: { ...current, [key]: v } });

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <Globe className="h-4 w-4 text-brand-500" />
        {LANGS.map((l) => (
          <button key={l.code} type="button" onClick={() => setLang(l.code)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition", lang === l.code ? "grad-brand text-white" : "text-muted hover:text-[var(--text)]")}>
            {l.native}
          </button>
        ))}
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted">
          {fields.filter((f) => String(current[f.key] ?? "").trim()).length}/{fields.length} filled
        </span>
      </div>
      <div className="space-y-3 p-3">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea rows={f.rows ?? 4} value={current[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={input} />
            ) : (
              <input value={current[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={input} />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ list editor ------------------------------ */
export function ListEditor({
  fields, value, onChange, label, titleKey,
}: { fields: SubField[]; value: any[]; onChange: (v: any[]) => void; label: string; titleKey?: string }) {
  const add = () => {
    const row: Record<string, any> = { id: `r${Date.now()}${Math.floor(Math.random() * 99)}` };
    fields.forEach((f) => { row[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : ""; });
    onChange([...value, row]);
  };
  const upd = (i: number, key: string, v: any) => onChange(value.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...value]; const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-muted">No {label.toLowerCase()} added yet.</p>
      )}
      {value.map((row, i) => (
        <div key={row.id ?? i} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="truncate text-xs font-extrabold">
              #{i + 1} {titleKey ? String(row[titleKey] ?? "") : label}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Delete row" className="rounded-md p-1 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={cn("block", f.width === "full" && "sm:col-span-2")}>
                <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-muted">{f.label}</span>
                {f.type === "image" ? (
                  <ImageUpload value={row[f.key]} onChange={(v) => upd(i, f.key, v)} label="Upload" />
                ) : f.type === "checkbox" ? (
                  <button type="button" onClick={() => upd(i, f.key, !row[f.key])}
                    className={cn("w-full rounded-lg border px-3 py-1.5 text-xs font-bold", row[f.key] ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700" : "border-[var(--border)] text-muted")}>
                    {row[f.key] ? "Yes" : "No"} — {f.label}
                  </button>
                ) : f.type === "select" ? (
                  <select value={row[f.key] ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} className={cn(input, "py-1.5 text-xs")}>
                    <option value="">—</option>
                    {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea rows={2} value={row[f.key] ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} className={cn(input, "py-1.5 text-xs")} />
                ) : (
                  <input type={f.type === "number" ? "number" : "text"} value={row[f.key] ?? ""} placeholder={f.placeholder}
                    onChange={(e) => upd(i, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} className={cn(input, "py-1.5 text-xs")} />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-brand-400 px-4 py-2 text-xs font-extrabold text-brand-600 transition hover:bg-brand-500/8 dark:text-brand-300">
        <Plus className="h-3.5 w-3.5" /> Add {label}
      </button>
    </div>
  );
}
