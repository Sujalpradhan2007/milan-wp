"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Palette, Ruler, Send, Zap } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Alert, Badge, Btn, Modal, SmartImage, useToast } from "@/components/ui";
import ColorImage, { ColorSwatch } from "./ColorImage";
import type { EnquiryOptions, PublicCompany } from "./SiteShell";
import { colorLabel, normaliseColors } from "@/lib/colors";
import { inr } from "@/lib/utils";

type Form = {
  name: string; phone: string; email: string; city: string; message: string;
  machineName: string; model: string; color: string; capacity: string; price: string;
};

const EMPTY: Form = { name: "", phone: "", email: "", city: "", message: "", machineName: "", model: "", color: "", capacity: "", price: "" };

export default function EnquiryModal({
  open, opts, onClose, company,
}: { open: boolean; opts: EnquiryOptions; onClose: () => void; company: PublicCompany }) {
  const { t, lang } = useApp();
  const toast = useToast();
  const [form, setForm] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ whatsappUrl: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(""); setDone(null);
    setForm((prev) => ({
      ...EMPTY,
      name: prev.name, phone: prev.phone, email: prev.email, city: prev.city,
      machineName: opts.machineName || "",
      model: opts.model || opts.models?.[0]?.name || "",
      color: opts.color || opts.colors?.[0]?.name || "",
      capacity: opts.capacity || opts.models?.[0]?.capacity || "",
      price: opts.price ? String(opts.price) : opts.models?.[0]?.price ? String(opts.models[0].price) : "",
    }));
  }, [open, opts]);

  const palette = useMemo(() => (opts.colors?.length ? normaliseColors(opts.colors) : []), [opts.colors]);
  const selectedColour = useMemo(
    () => palette.find((c) => colorLabel(c, lang) === form.color || c.name === form.color) || null,
    [palette, form.color, lang]
  );
  const selectedModel = useMemo(
    () => (opts.models || []).find((m) => m.name === form.model) || null,
    [opts.models, form.model]
  );

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError(t("common.name") + " — " + t("common.required"));
    if (form.phone.replace(/\D/g, "").length < 10) return setError(t("common.phone") + " — " + t("common.required"));
    setBusy(true);
    try {
      const payload = {
        type: opts.type || "general",
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() || undefined,
        city: form.city.trim() || undefined, message: form.message.trim() || undefined,
        machineId: opts.machineId ?? null, machineName: form.machineName || opts.machineName,
        model: form.model || undefined, color: form.color || undefined,
        capacity: form.capacity || selectedModel?.capacity || undefined,
        price: form.price ? Number(form.price) : undefined,
        itemId: opts.itemId ?? null, itemName: opts.itemName || undefined,
        source: "website-modal",
      };
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("common.error"));
      track("enquiry", { entityId: json.id, entityName: payload.machineName || payload.type });
      setDone({ whatsappUrl: json.whatsappUrl });
      toast({ kind: "success", text: t("common.success") });
    } catch (err) {
      setError((err as Error).message || t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  const isMachine = (opts.type || "general") === "machine" || Boolean(opts.machineName);
  const title = opts.title || (isMachine ? `${t("common.enquiry")}: ${opts.machineName || ""}` : `${t("common.enquiry")}`);

  return (
    <Modal open={open} onClose={onClose} title={title.trim()} subtitle={company.name} size="lg">
      {done ? (
        <div className="py-4 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/12 text-emerald-500 anim-rise">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-extrabold">{t("common.success")}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Your enquiry has been recorded. For an instant reply, send the same details to our team on WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={done.whatsappUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { entityName: "enquiry-modal" })}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
            </a>
            <Btn variant="outline" onClick={onClose}>{t("common.close")}</Btn>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          {error && <Alert kind="error">{error}</Alert>}

          {(opts.machineName || opts.itemName) && (
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3">
              {(opts.coverImage || selectedColour?.imageUrl) && (
                <ColorImage src={opts.coverImage} color={selectedColour} alt={opts.machineName || opts.itemName || "product"} ratio="1/1" wrapperClassName="h-16 w-16 shrink-0 rounded-xl" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold">{opts.machineName || opts.itemName}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {form.model && <Badge tone="grape"><Zap className="h-3 w-3" /> {form.model}</Badge>}
                  {form.color && (
                    <Badge tone="brand">
                      <Palette className="h-3 w-3" /> {form.color}
                      {selectedColour?.hex && <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: selectedColour.hex }} />}
                    </Badge>
                  )}
                  {form.price && <Badge tone="green">{inr(Number(form.price))}</Badge>}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`${t("common.name")} *`}><input required value={form.name} onChange={set("name")} className={inputCls} placeholder="Your full name" /></Field>
            <Field label={`${t("common.phone")} *`}><input required value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+91" inputMode="tel" /></Field>
            <Field label={t("common.email")}><input type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" /></Field>
            <Field label={t("common.city")}><input value={form.city} onChange={set("city")} className={inputCls} placeholder={company.city} /></Field>
          </div>

          {isMachine && (opts.models?.length || opts.colors?.length) ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {opts.models?.length ? (
                <Field label={t("common.models")}>
                  <select value={form.model} onChange={set("model")} className={inputCls}>
                    <option value="">— select model —</option>
                    {opts.models.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}{m.price ? ` • ${inr(m.price)}` : ""}</option>
                    ))}
                  </select>
                </Field>
              ) : null}
              {palette.length ? (
                <Field label={`${t("common.colours")} (${palette.length})`}>
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-2.5">
                    {palette.map((c) => (
                      <ColorSwatch
                        key={c.id} color={c} size="sm"
                        label={colorLabel(c, lang)}
                        selected={selectedColour?.id === c.id}
                        onClick={() => setForm((p) => ({ ...p, color: colorLabel(c, lang) }))}
                      />
                    ))}
                  </div>
                </Field>
              ) : null}
              <Field label={t("common.capacity")}>
                <input value={form.capacity} onChange={set("capacity")} className={inputCls} placeholder={selectedModel?.capacity || "e.g. 5–10 inch"} />
              </Field>
              <Field label={t("common.price")}>
                <div className="relative">
                  <Ruler className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input value={form.price} onChange={set("price")} className={`${inputCls} pl-9`} placeholder="0" inputMode="numeric" />
                </div>
              </Field>
            </div>
          ) : null}

          {selectedColour && (opts.coverImage || selectedColour.imageUrl) && (
            <div className="anim-rise overflow-hidden rounded-2xl border border-[var(--border)]">
              <ColorImage src={opts.coverImage} color={selectedColour} alt={`${form.color} machine`} ratio="21/9" />
            </div>
          )}

          <Field label={t("common.message")}>
            <textarea rows={4} value={form.message} onChange={set("message")} className={inputCls} placeholder="Tell us your requirement, budget and city…" />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">We reply within working hours. Your details are never shared.</p>
            <div className="flex gap-2">
              <Btn type="button" variant="outline" onClick={onClose}>{t("common.close")}</Btn>
              <Btn type="submit" loading={busy}><Send className="h-4 w-4" /> {busy ? t("common.sending") : t("common.submit")}</Btn>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

const inputCls =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm font-medium outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12 dark:bg-white/5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}
