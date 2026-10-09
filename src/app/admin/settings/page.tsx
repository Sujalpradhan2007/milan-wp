"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Check, Gauge, Megaphone, Palette, Save, Search, SlidersHorizontal } from "lucide-react";
import { api } from "@/components/admin/api";
import { FieldInput, type Field } from "@/components/admin/fields";
import { Alert, Btn, Reveal, Spinner, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

type Section = { key: string; label: string; icon: any; settingsKey: string; fields: Field[] };

const TEXT = (name: string, label: string, half = true, placeholder?: string): Field => ({ name, label, type: "text", half, placeholder });
const AREA = (name: string, label: string, rows = 4): Field => ({ name, label, type: "textarea", rows, full: true });
const TOGGLE = (name: string, label: string): Field => ({ name, label, type: "checkbox", half: true });

const SECTIONS: Section[] = [
  {
    key: "company", label: "Company", icon: Building2, settingsKey: "company",
    fields: [
      TEXT("name", "Company name"), TEXT("shortName", "Short name"),
      TEXT("legalName", "Legal / registered name"), TEXT("tagline", "Tagline"),
      { name: "logo", label: "Company logo", type: "image", full: true },
      TEXT("phone", "Phone"), TEXT("altPhone", "Alternate phone"),
      TEXT("email", "Email"), TEXT("whatsapp", "WhatsApp number (with country code)"),
      TEXT("address", "Address", false), TEXT("city", "City"),
      TEXT("district", "District"), TEXT("state", "State"),
      TEXT("pincode", "PIN code"), TEXT("gst", "GSTIN"),
      TEXT("workingHours", "Working hours", false),
      TEXT("mapUrl", "Google Map link", false),
      TEXT("mapEmbed", "Google Map embed URL", false),
      TEXT("facebook", "Facebook URL"), TEXT("instagram", "Instagram URL"),
      TEXT("youtube", "YouTube URL"), TEXT("linkedin", "LinkedIn URL"),
      AREA("aboutShort", "About — short (hero / footer)", 3),
      AREA("aboutLong", "About — long (About page)", 8),
      AREA("footerNote", "Footer note", 2),
    ],
  },
  {
    key: "hero", label: "Hero & Branding", icon: Palette, settingsKey: "company",
    fields: [
      { name: "heroImage", label: "Hero / cover background image", type: "image", full: true, hint: "Shown behind the homepage hero. 1920×1080 or larger works best." },
      TEXT("heroTitle", "Hero headline override (optional)", false, "Leave blank to use the language headline"),
      { name: "brand.primary", label: "Primary colour", type: "color", half: true },
      { name: "brand.secondary", label: "Secondary colour", type: "color", half: true },
      { name: "brand.accent", label: "Accent colour", type: "color", half: true },
      { name: "trustBadgesText", label: "Trust badges (one per line)", type: "textarea", rows: 6, full: true },
    ],
  },
  {
    key: "counters", label: "Statistics", icon: Gauge, settingsKey: "counters",
    fields: [
      { name: "delivered", label: "Machines delivered", type: "number", half: true },
      { name: "factories", label: "Happy factories", type: "number", half: true },
      { name: "districts", label: "Districts served", type: "number", half: true },
      { name: "years", label: "Years of experience", type: "number", half: true },
    ],
  },
  {
    key: "festival", label: "Festival Mode", icon: Megaphone, settingsKey: "festival",
    fields: [
      TOGGLE("enabled", "Festival system enabled"),
      TOGGLE("autoMode", "Automatic mode (detects the next festival)"),
      TEXT("manualKey", "Manual festival key", true, "e.g. diwali — used when automatic mode is off"),
      { name: "daysBefore", label: "Show banner … days before", type: "number", half: true },
      { name: "bannerUrl", label: "Festival banner image", type: "image", full: true },
      { name: "bgImage", label: "Site background override", type: "image", full: true },
      AREA("message", "Banner message override", 2),
    ],
  },
  {
    key: "features", label: "Features", icon: SlidersHorizontal, settingsKey: "features",
    fields: [
      TOGGLE("showOffers", "Show offers section"),
      TOGGLE("showRoi", "Show ROI calculator"),
      TOGGLE("showGallery", "Show gallery section"),
      TOGGLE("showNewsletter", "Show newsletter form"),
      TOGGLE("showFloatingWhatsapp", "Show floating WhatsApp button"),
      TOGGLE("maintenanceMode", "Maintenance mode"),
    ],
  },
  {
    key: "seo", label: "SEO", icon: Search, settingsKey: "seo",
    fields: [
      TEXT("title", "Meta title", false),
      AREA("description", "Meta description", 3),
      AREA("keywords", "Meta keywords", 2),
    ],
  },
];

const WA_FIELDS: Field[] = [
  { name: "machine", label: "Machine enquiry template", type: "textarea", rows: 8, full: true, hint: "Placeholders: {name} {phone} {machine} {model} {color} {capacity} {price} {city} {message}" },
  { name: "raw_material", label: "Raw material enquiry template", type: "textarea", rows: 5, full: true, hint: "Placeholders: {name} {phone} {item} {city} {message}" },
  { name: "offer", label: "Offer enquiry template", type: "textarea", rows: 5, full: true },
  { name: "service", label: "Service enquiry template", type: "textarea", rows: 6, full: true, hint: "Placeholders: {name} {phone} {machine} {ticket} {city} {message}" },
  { name: "general", label: "General enquiry template", type: "textarea", rows: 5, full: true },
];

export default function AdminSettingsPage() {
  const toast = useToast();
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState("company");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const json = await api<{ data: any }>("/api/settings");
        setData(json.data);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  const section = useMemo(() => SECTIONS.find((s) => s.key === tab)!, [tab]);
  const wa = data?.waTemplates ?? {};

  const valueOf = (f: Field) => {
    if (!data) return "";
    if (tab === "hero" && f.name === "trustBadgesText") return (data.company?.trustBadges ?? []).join("\n");
    if (f.name.includes(".")) {
      const [a, b] = f.name.split(".");
      return data[section.settingsKey]?.[a]?.[b] ?? "";
    }
    return data[section.settingsKey]?.[f.name] ?? "";
  };

  function setValue(name: string, v: any) {
    setData((prev: any) => {
      const next = { ...prev };
      const bucket = { ...(next[section.settingsKey] || {}) };
      if (name.includes(".")) {
        const [a, b] = name.split(".");
        bucket[a] = { ...(bucket[a] || {}), [b]: v };
      } else bucket[name] = v;
      next[section.settingsKey] = bucket;
      return next;
    });
  }

  async function save() {
    if (!data) return;
    setBusy(true);
    try {
      const payload: Record<string, any> = {};
      const bucket = { ...(data[section.settingsKey] || {}) };
      if (tab === "hero") {
        bucket.trustBadges = String(bucket.trustBadgesText ?? "").split("\n").map((s: string) => s.trim()).filter(Boolean);
        delete bucket.trustBadgesText;
      }
      payload[section.settingsKey] = bucket;
      const json = await api<{ data: any }>("/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      setData(json.data);
      toast({ kind: "success", text: `${section.label} settings saved` });
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message });
    } finally { setBusy(false); }
  }

  async function saveWa(key: string, value: string) {
    setBusy(true);
    try {
      const json = await api<{ data: any }>("/api/settings", { method: "PUT", body: JSON.stringify({ waTemplates: { ...wa, [key]: value } }) });
      setData(json.data);
      toast({ kind: "success", text: "WhatsApp template saved" });
    } catch (err) { toast({ kind: "error", text: (err as Error).message }); } finally { setBusy(false); }
  }

  if (error) return <Alert kind="error">{error}</Alert>;
  if (!data) return <div className="grid place-items-center gap-3 p-24 text-muted"><Spinner className="h-8 w-8" /> Loading settings…</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Company Settings</h1>
          <p className="mt-1 text-sm text-muted">Logo, hero image, contacts, counters, brand colours, festival engine, WhatsApp templates and SEO.</p>
        </div>
        {tab !== "whatsapp" && <Btn onClick={save} loading={busy}><Save className="h-4 w-4" /> Save {section.label}</Btn>}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {[...SECTIONS, { key: "whatsapp", label: "WhatsApp Templates", icon: Megaphone } as any].map((s) => (
          <button key={s.key} onClick={() => setTab(s.key)}
            className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold transition",
              tab === s.key ? "grad-brand text-white shadow-lg shadow-brand-500/25" : "glass text-muted hover:text-[var(--text)]")}>
            <s.icon className="h-3.5 w-3.5" /> {s.label}
          </button>
        ))}
      </div>

      {tab === "whatsapp" ? (
        <Reveal>
          <div className="space-y-4">
            <Alert kind="info">
              These templates build the WhatsApp message the customer sends you. Tokens inside {"{curly braces}"} are replaced with the
              form values — for machine enquiries that includes name, phone, machine, model, colour, capacity, price and city.
            </Alert>
            {WA_FIELDS.map((f) => (
              <div key={f.name} className="rounded-3xl surface card-shadow border border-[var(--border)] p-5">
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">{f.label}</label>
                <FieldInput field={f} value={wa[f.name] ?? ""} onChange={(v) => setData((p: any) => ({ ...p, waTemplates: { ...p.waTemplates, [f.name]: v } }))} />
                {f.hint && <p className="mt-1 text-[11px] text-muted">{f.hint}</p>}
                <div className="mt-3 flex justify-end">
                  <Btn size="sm" variant="outline" onClick={() => saveWa(f.name, wa[f.name] ?? "")} loading={busy}><Check className="h-3.5 w-3.5" /> Save template</Btn>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal>
          <div className="rounded-[1.5rem] surface card-shadow border border-[var(--border)] p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.name} className={cn(f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : "")}>
                  {f.type !== "checkbox" && <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">{f.label}</label>}
                  <FieldInput field={f} value={valueOf(f)} onChange={(v) => setValue(f.name, v)} />
                  {f.hint && <p className="mt-1 text-[11px] text-muted">{f.hint}</p>}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
              <p className="text-xs text-muted">Changes go live on the website immediately after saving.</p>
              <Btn onClick={save} loading={busy}><Save className="h-4 w-4" /> Save {section.label}</Btn>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
