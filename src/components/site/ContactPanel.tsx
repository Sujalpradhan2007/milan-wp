"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Alert, Btn, Reveal, useToast } from "@/components/ui";
import { useSite, type PublicCompany } from "./SiteShell";

const TYPES = [
  { value: "machine", en: "Machine enquiry", hi: "मशीन पूछताछ", or: "ମେସିନ୍ ପଚରା" },
  { value: "raw_material", en: "Raw material", hi: "कच्चा माल", or: "କଞ୍ଚାମାଲ" },
  { value: "offer", en: "Offer / discount", hi: "ऑफ़र", or: "ଅଫର" },
  { value: "service", en: "Service / repair", hi: "सर्विस", or: "ସର୍ଭିସ୍" },
  { value: "general", en: "General", hi: "सामान्य", or: "ସାଧାରଣ" },
];

export default function ContactPanel({ company, machines }: { company: PublicCompany; machines: { id: number; name: string }[] }) {
  const { t, lang } = useApp();
  const toast = useToast();
  const { whatsapp } = useSite();
  const [form, setForm] = useState({ type: "machine", name: "", phone: "", email: "", city: "", machineId: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ url: string } | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setDone(null); setBusy(true);
    try {
      const machine = machines.find((m) => m.id === Number(form.machineId));
      const res = await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type, name: form.name, phone: form.phone, email: form.email, city: form.city,
          message: form.message, machineId: machine?.id ?? null, machineName: machine?.name,
          source: "contact-page",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("common.error"));
      track("enquiry", { entityName: form.type });
      setDone({ url: json.whatsappUrl });
      toast({ kind: "success", text: t("common.success") });
      setForm((p) => ({ ...p, name: "", phone: "", email: "", city: "", message: "" }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* info */}
      <Reveal variant="left" className="lg:col-span-2">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Call / WhatsApp", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
            { icon: MessageCircle, label: "WhatsApp", value: company.whatsapp, href: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}` },
            { icon: Mail, label: t("common.email"), value: company.email, href: `mailto:${company.email}` },
            { icon: MapPin, label: "Factory Address", value: `${company.address} – ${company.pincode}`, href: company.mapUrl },
            { icon: Clock, label: t("footer.workHours"), value: company.workingHours },
          ].map((row, i) => (
            <div key={row.label} className="group flex items-start gap-4 rounded-[1.5rem] surface card-shadow border border-[var(--border)] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-brand-300" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl grad-brand text-white shadow-lg transition-transform duration-500 group-hover:rotate-12">
                <row.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{row.label}</p>
                {row.href ? (
                  <a href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block break-words font-display text-sm font-extrabold transition group-hover:text-brand-600 dark:group-hover:text-brand-300">{row.value}</a>
                ) : (
                  <p className="font-display text-sm font-extrabold">{row.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="overflow-hidden rounded-[1.5rem] surface card-shadow border border-[var(--border)]">
            {company.mapEmbed ? (
              <iframe
                src={company.mapEmbed} title="Milan Enterprises location" loading="lazy"
                className="h-64 w-full grayscale-[35%] transition duration-700 hover:grayscale-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="grid h-64 place-items-center text-sm text-muted">Map location not configured</div>
            )}
          </div>
        </div>
      </Reveal>

      {/* form */}
      <Reveal variant="right" delay={100} className="lg:col-span-3">
        <div className="rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Send an enquiry</h2>
          <p className="mt-1 text-sm text-muted">Fill this form and we will call you back within working hours. Or send it straight to WhatsApp.</p>

          {done && (
            <div className="mt-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center anim-rise">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-2 font-display text-base font-extrabold">{t("common.success")}</p>
              <a href={done.url} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { entityName: "contact-success" })}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:scale-105">
                <MessageCircle className="h-4 w-4" /> Also send on WhatsApp
              </a>
            </div>
          )}

          {error && <div className="mt-5"><Alert kind="error">{error}</Alert></div>}

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Enquiry type">
                <select value={form.type} onChange={set("type")} className={inputCls}>
                  {TYPES.map((x) => <option key={x.value} value={x.value}>{lang === "hi" ? x.hi : lang === "or" ? x.or : x.en}</option>)}
                </select>
              </F>
              <F label="Machine (optional)">
                <select value={form.machineId} onChange={set("machineId")} className={inputCls}>
                  <option value="">— any / not sure —</option>
                  {machines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </F>
              <F label={`${t("common.name")} *`}><input required value={form.name} onChange={set("name")} className={inputCls} /></F>
              <F label={`${t("common.phone")} *`}><input required value={form.phone} onChange={set("phone")} className={inputCls} inputMode="tel" /></F>
              <F label={t("common.email")}><input type="email" value={form.email} onChange={set("email")} className={inputCls} /></F>
              <F label={t("common.city")}><input value={form.city} onChange={set("city")} className={inputCls} placeholder={company.city} /></F>
            </div>
            <F label={`${t("common.message")} *`}>
              <textarea required rows={5} value={form.message} onChange={set("message")} className={inputCls} placeholder="Tell us your budget, target production and city…" />
            </F>
            <div className="flex flex-wrap gap-2">
              <Btn type="submit" size="lg" loading={busy}><Send className="h-4 w-4" /> {busy ? t("common.sending") : t("common.submit")}</Btn>
              <Btn type="button" size="lg" variant="whatsapp"
                onClick={() => { track("whatsapp_click", { entityName: "contact" }); whatsapp(`Hello ${company.name},\nName: ${form.name || "-"}\nPhone: ${form.phone || "-"}\nCity: ${form.city || "-"}\nType: ${form.type}\nMessage: ${form.message || "-"}`, "contact"); }}>
                <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
              </Btn>
            </div>
          </form>
        </div>
      </Reveal>
    </div>
  );
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
