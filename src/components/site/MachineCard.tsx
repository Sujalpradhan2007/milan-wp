"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Gauge, MessageCircle, Palette, RotateCcw, Tag, Zap } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Badge, Btn, Reveal } from "@/components/ui";
import ColorImage, { ColorSwatch } from "./ColorImage";
import Orbit360 from "./Orbit360";
import { colorLabel, normaliseColors } from "@/lib/colors";
import { inr } from "@/lib/utils";
import { useSite } from "./SiteShell";

export type MachineCardData = {
  id: number; slug: string; name: string; category: string; t: unknown; coverImage: string | null;
  mrp: number; companyPrice: number; offerPrice: number; discount: number; capacity: string | null;
  productionPerHour: number; power: string | null; warranty: string | null; featured: boolean;
  models: any[]; colors: any[]; specs: any[]; views: number;
};

export default function MachineCard({ machine, delay = 0 }: { machine: MachineCardData; delay?: number }) {
  const { t, tr, trl, lang } = useApp();
  const { openEnquiry, whatsapp } = useSite();
  const [flipped, setFlipped] = useState(false);
  const palette = useMemo(() => normaliseColors(machine.colors), [machine.colors]);
  const [colourId, setColourId] = useState<string | null>(null);
  const colour = palette.find((c) => c.id === colourId) ?? null;

  const name = tr(machine.t, "name") || machine.name;
  const tagline = tr(machine.t, "tagline");
  const short = tr(machine.t, "short");
  const features = trl(machine.t, "features").slice(0, 4);
  const price = machine.offerPrice || machine.companyPrice || machine.mrp;
  const saving = machine.mrp && price && machine.mrp > price ? machine.mrp - price : 0;

  const waMessage = `Hello Milan Enterprises,\nI am interested in: ${name}\nModel: ${machine.models?.[0]?.name ?? "-"}\nPrice: ${inr(price)}\nPlease share full details.`;

  return (
    <Reveal delay={delay} className="h-full">
      <div className={`flip-scene h-full ${flipped ? "is-flipped" : ""}`}>
        <div className="flip-card h-full min-h-[440px]">
          {/* FRONT */}
          <div className="flip-face group flex h-full flex-col overflow-hidden rounded-[1.75rem] surface card-shadow border border-[var(--border)]">
            <div className="relative">
              <Link href={`/machines/${machine.slug}`} className="img-zoom block overflow-hidden">
                <ColorImage src={machine.coverImage} color={colour} alt={name} ratio="16/11" priority={delay === 0} />
              </Link>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0714]/70 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                {machine.featured && <Badge tone="amber" className="bg-white/90 backdrop-blur"><Zap className="h-3 w-3" /> {t("common.featured")}</Badge>}
                {machine.discount > 0 && (
                  <span className="rounded-full grad-brand px-2.5 py-1 text-[11px] font-black text-white shadow-lg">{machine.discount}% {t("common.discount")}</span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/25">
                  {machine.category}
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">{machine.views} views</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <Link href={`/machines/${machine.slug}`}>
                <h3 className="font-display text-lg font-extrabold leading-snug transition group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {name}
                </h3>
              </Link>
              {tagline && <p className="mt-1 text-xs font-semibold text-grape-600 dark:text-grape-300">{tagline}</p>}
              <p className="mt-2 line-clamp-2 text-sm text-muted">{short}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniStat icon={<Gauge className="h-3.5 w-3.5" />} label={t("common.pph")} value={machine.productionPerHour ? `${machine.productionPerHour.toLocaleString("en-IN")}` : "—"} />
                <MiniStat icon={<Tag className="h-3.5 w-3.5" />} label={t("common.capacity")} value={machine.capacity || "—"} />
              </div>

              {/* live colour picker — recolours the photo above */}
              {palette.length > 0 && (
                <div className="mt-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                    <Palette className="h-3 w-3 text-brand-500" /> {t("common.colours")}
                    <span className="rounded-full bg-brand-500/12 px-1.5 text-[9px] text-brand-700 dark:text-brand-300">{palette.length}</span>
                    {colour && <span className="ml-auto normal-case text-[10px] font-extrabold text-[var(--text)]">{colorLabel(colour, lang)}</span>}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {palette.map((c) => (
                      <ColorSwatch
                        key={c.id} color={c} size="sm"
                        label={colorLabel(c, lang)}
                        selected={colourId === c.id}
                        onClick={() => setColourId(colourId === c.id ? null : c.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  {machine.mrp > price && (
                    <p className="text-xs font-semibold text-muted line-through">{inr(machine.mrp)}</p>
                  )}
                  <p className="font-display text-2xl font-black grad-text">{inr(price)}</p>
                  {saving > 0 && <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{t("common.save")} {inr(saving)}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  aria-label="Open 360 view"
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-2 text-[10px] font-black uppercase tracking-wider transition hover:border-brand-400 hover:text-brand-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> 360°
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/machines/${machine.slug}`} className="flex-1">
                  <Btn size="sm" className="w-full">{t("common.details")} <ArrowRight className="h-3.5 w-3.5" /></Btn>
                </Link>
                <Btn
                  size="sm" variant="whatsapp"
                  onClick={() => { track("whatsapp_click", { entityId: machine.id, entityName: name }); whatsapp(waMessage, "machine"); }}
                  aria-label={t("cta.whatsapp")}
                >
                  <MessageCircle className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          </div>

          {/* BACK — 360° product video of this machine */}
          <div className="flip-face flip-back flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[#12081e] text-white">
            <div className="flex items-center justify-between gap-3 px-4 pt-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">360° live view</p>
                <h3 className="font-display text-base font-extrabold leading-tight">{name}</h3>
              </div>
              <button type="button" onClick={() => setFlipped(false)} aria-label="Flip back" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 transition hover:rotate-180 hover:bg-white/30">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-3 mt-2 flex-1 overflow-hidden rounded-2xl">
              <Orbit360 src={machine.coverImage} color={colour} alt={`${name} 360 view`} compact />
            </div>
            <ul className="mx-3 mt-2 space-y-1 text-[11px]">
              {(features.length ? features : [machine.power && `Power: ${machine.power}`, machine.warranty && `${t("common.warranty")}: ${machine.warranty}`].filter(Boolean) as string[]).slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 rounded-lg bg-white/10 px-2 py-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300" /> <span className="font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>
            <div className="p-3">
              <Btn
                className="w-full bg-white text-brand-700 hover:bg-white/90"
                onClick={() => openEnquiry({
                  type: "machine", machineId: machine.id, machineName: name, coverImage: machine.coverImage,
                  models: machine.models, colors: palette, color: colour ? colorLabel(colour, lang) : undefined, price,
                })}
              >
                {t("cta.quote")}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 transition hover:border-brand-300">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">{icon} {label}</p>
      <p className="mt-0.5 truncate text-xs font-extrabold">{value}</p>
    </div>
  );
}
