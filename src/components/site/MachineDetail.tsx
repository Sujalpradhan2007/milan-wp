"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Check, ChevronRight, Cog, Gauge, Layers, MessageCircle, Phone,
  PlayCircle, Ruler, Share2, ShieldCheck, ShoppingBag, Sparkles, Truck, Wrench, Zap,
} from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Badge, Btn, Counter, Reveal, SectionHeading, SmartImage } from "@/components/ui";
import MachineCard, { type MachineCardData } from "./MachineCard";
import ColorImage, { ColorSwatch } from "./ColorImage";
import Orbit360 from "./Orbit360";
import { useSite } from "./SiteShell";
import { colorLabel, normaliseColors } from "@/lib/colors";
import { cn, inr, isVideoUrl, youtubeEmbed } from "@/lib/utils";

export default function MachineDetail({ machine, related }: { machine: MachineCardData & { full: string; power: string | null; warranty: string | null; views: number; media: any[]; specs: any[] }; related: MachineCardData[] }) {
  const { t, tr, trl, lang } = useApp();
  const { openEnquiry, whatsapp, settings } = useSite();
  const palette = useMemo(() => normaliseColors(machine.colors), [machine.colors]);

  const name = tr(machine.t, "name") || machine.name;
  const tagline = tr(machine.t, "tagline");
  const short = tr(machine.t, "short");
  const full = tr(machine.t, "full") || machine.full;
  const features = trl(machine.t, "features");

  const media = (machine.media ?? []).filter((m: any) => m && m.url);
  const photos = media.filter((m: any) => m.type !== "video");
  const videos = media.filter((m: any) => m.type === "video" || isVideoUrl(m.url));

  const galleryImgs = useMemo(() => {
    const list = [machine.coverImage, ...photos.map((p: any) => p.url)].filter(Boolean) as string[];
    return Array.from(new Set(list));
  }, [machine.coverImage, photos]);

  const [activeImg, setActiveImg] = useState(0);
  const [colourId, setColourId] = useState<string | null>(palette[0]?.id ?? null);
  const [modelId, setModelId] = useState<string | null>(machine.models?.[0]?.id ?? null);
  const [tab, setTab] = useState<"desc" | "specs" | "features" | "media">("desc");
  const [view360, setView360] = useState(true);

  const colour = palette.find((c) => c.id === colourId) ?? null;
  const model = machine.models?.find((m: any) => m.id === modelId) ?? null;

  const displayImage = galleryImgs[activeImg] || machine.coverImage;
  const price = model?.price || machine.offerPrice || machine.companyPrice || machine.mrp;
  const saving = machine.mrp > price ? machine.mrp - price : 0;

  const specGroups = useMemo(() => {
    const g: Record<string, any[]> = {};
    (machine.specs ?? []).forEach((s: any) => { (g[s.group || "General"] ||= []).push(s); });
    return Object.entries(g);
  }, [machine.specs]);

  const waMessage = `Hello ${settings.company.name},\n\nName: \nPhone: \nMachine: ${name}\nModel: ${model?.name ?? "-"}\nColour: ${colour ? colorLabel(colour, lang) : "-"}\nCapacity: ${model?.capacity ?? machine.capacity ?? "-"}\nPrice: ${inr(price)}\nCity: \n\nPlease share complete details.`;

  return (
    <>
      <section className="relative overflow-hidden py-8 sm:py-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--bg-soft)] via-[var(--bg)] to-grape-50 dark:via-[var(--bg)] dark:to-[#1a1030]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-muted">
            <Link href="/" className="hover:text-brand-600">{t("nav.home")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/machines" className="hover:text-brand-600">{t("nav.machines")}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-brand-700 dark:text-brand-300">{machine.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-[var(--text)]">{name}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* gallery */}
            <Reveal variant="left" className="lg:col-span-6">
              <div className="sticky top-28">
                <div className="group relative overflow-hidden rounded-[1.75rem] surface card-shadow border border-[var(--border)]">
                  {view360 ? (
                    <Orbit360 src={displayImage} color={colour} alt={`${name} 360° video`} />
                  ) : (
                    <ColorImage src={displayImage} color={colour} alt={`${name}${colour ? ` — ${colorLabel(colour, lang)}` : ""}`} ratio="4/3" priority />
                  )}
                  {!view360 && (
                    <>
                      <div className="absolute left-4 top-4 flex flex-col gap-2">
                        {machine.discount > 0 && <span className="rounded-full grad-brand px-3 py-1.5 text-xs font-black text-white shadow-lg">{machine.discount}% {t("common.discount")}</span>}
                        {machine.featured && <Badge tone="amber" className="bg-white/90"><Sparkles className="h-3 w-3" /> {t("common.featured")}</Badge>}
                      </div>
                      {colour && (
                        <div key={colour.id} className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur anim-rise">
                          <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white/70" style={{ background: colour.hex }} /> {colorLabel(colour, lang)}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setView360(true)}
                    className={cn("grid h-20 w-24 shrink-0 place-items-center rounded-2xl text-[10px] font-black uppercase tracking-wider text-white transition hover:scale-105",
                      view360 ? "grad-brand shadow-lg" : "bg-[#1a1028]")}
                  >
                    360°
                  </button>
                  {galleryImgs.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      onClick={() => { setView360(false); setActiveImg(i); }}
                      className={cn("relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105",
                        !view360 && activeImg === i ? "border-brand-500 shadow-lg" : "border-[var(--border)] opacity-70 hover:opacity-100")}
                    >
                      <ColorImage src={img} color={colour} alt={`${name} view ${i + 1}`} wrapperClassName="h-full w-full" ratio="" />
                    </button>
                  ))}
                  {videos.map((v: any, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTab("media")}
                      className="grid h-20 w-24 shrink-0 place-items-center rounded-2xl grad-brand text-white transition hover:scale-105"
                    >
                      <PlayCircle className="h-7 w-7" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* buy box */}
            <Reveal variant="right" delay={100} className="lg:col-span-6">
              <div className="rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="grape"><Cog className="h-3 w-3" /> {machine.category}</Badge>
                  {machine.warranty && <Badge tone="green"><ShieldCheck className="h-3 w-3" /> {machine.warranty}</Badge>}
                  {machine.power && <Badge tone="brand"><Zap className="h-3 w-3" /> {machine.power}</Badge>}
                </div>

                <h1 className="mt-3 font-display text-2xl font-black leading-tight sm:text-3xl">{name}</h1>
                {tagline && <p className="mt-2 text-sm font-bold text-grape-600 dark:text-grape-300">{tagline}</p>}
                <p className="mt-3 text-sm leading-relaxed text-muted">{short}</p>

                {/* price */}
                <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-soft)] p-5">
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("common.price")}</p>
                      <p className="font-display text-4xl font-black grad-text">{inr(price)}</p>
                    </div>
                    {machine.mrp > price && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("common.mrp")}</p>
                        <p className="text-lg font-bold text-muted line-through">{inr(machine.mrp)}</p>
                      </div>
                    )}
                    {saving > 0 && (
                      <span className="mb-1 rounded-full bg-emerald-500/12 px-3 py-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {t("common.save")} {inr(saving)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-muted">GST extra as applicable • Bank finance assistance available</p>
                </div>

                {/* models */}
                {machine.models?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{t("common.models")}</p>
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {machine.models.map((m: any) => (
                        <button
                          key={m.id}
                          onClick={() => setModelId(m.id)}
                          className={cn("rounded-2xl border p-3.5 text-left transition-all duration-300",
                            modelId === m.id ? "border-brand-500 bg-brand-500/8 shadow-lg shadow-brand-500/15 scale-[1.02]" : "border-[var(--border)] hover:border-grape-400")}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-extrabold">{m.name}</span>
                            {modelId === m.id && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
                          </div>
                          <p className="mt-0.5 text-[11px] font-semibold text-muted">{m.code} • {m.capacity}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-xs font-black text-brand-600 dark:text-brand-300">{inr(m.price)}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted"><Gauge className="h-3 w-3" /> {Number(m.pph || 0).toLocaleString("en-IN")}/hr</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* colours — 10 standard shades on every machine */}
                {palette.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                        {t("common.colours")} <span className="ml-1 rounded-full bg-brand-500/12 px-2 py-0.5 text-[10px] text-brand-700 dark:text-brand-300">{palette.length} options</span>
                      </p>
                      {colour && (
                        <span className="flex items-center gap-1.5 text-xs font-extrabold">
                          <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white/70 shadow" style={{ background: colour.hex }} />
                          {colorLabel(colour, lang)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {palette.map((c) => (
                        <ColorSwatch
                          key={c.id}
                          color={c}
                          selected={colourId === c.id}
                          label={colorLabel(c, lang)}
                          onClick={() => {
                            setColourId(c.id);
                            if (c.imageUrl) { const idx = galleryImgs.indexOf(c.imageUrl); if (idx >= 0) setActiveImg(idx); }
                          }}
                        />
                      ))}
                    </div>

                    <p className="mt-3 flex items-start gap-1.5 text-[11px] font-semibold text-muted">
                      <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                      Tap any shade — the machine photo above changes to that colour instantly. All 10 shades are
                      available on this machine at no extra cost.
                    </p>
                  </div>
                )}

                {/* quick specs */}
                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  <QuickSpec icon={<Gauge className="h-4 w-4" />} label={t("common.pph")} value={`${(model?.pph || machine.productionPerHour || 0).toLocaleString("en-IN")}`} />
                  <QuickSpec icon={<Ruler className="h-4 w-4" />} label={t("common.capacity")} value={model?.capacity || machine.capacity || "—"} />
                  <QuickSpec icon={<Zap className="h-4 w-4" />} label={t("common.power")} value={machine.power || "—"} />
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Btn size="lg" className="flex-1" onClick={() => openEnquiry({
                    type: "machine", title: `${t("common.enquiry")}: ${name}`, machineId: machine.id, machineName: name,
                    models: machine.models, colors: palette, coverImage: machine.coverImage,
                    model: model?.name, color: colour ? colorLabel(colour, lang) : undefined,
                    capacity: model?.capacity || machine.capacity || undefined, price,
                  })}>
                    <ShoppingBag className="h-4 w-4" /> {t("cta.quote")}
                  </Btn>
                  <Btn size="lg" variant="whatsapp" onClick={() => { track("whatsapp_click", { entityId: machine.id, entityName: name }); whatsapp(waMessage, "machine"); }}>
                    <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
                  </Btn>
                  <a href={`tel:${settings.company.phone.replace(/\s/g, "")}`}>
                    <Btn size="lg" variant="outline"><Phone className="h-4 w-4" /> {t("cta.call")}</Btn>
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) navigator.share({ title: name, text: short, url: window.location.href }).catch(() => {});
                      else { navigator.clipboard?.writeText(window.location.href); track("whatsapp_click", { entityName: "share-copy" }); }
                    }}
                    aria-label="Share"
                    className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[var(--border)] glass transition hover:border-grape-400 hover:text-grape-600"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)] pt-5 text-[11px] font-bold text-muted">
                  <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-emerald-500" /> Pan-India dispatch</span>
                  <span className="inline-flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5 text-brand-500" /> Installation + training</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-grape-500" /> 48-hour run tested</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* tabs */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[var(--border)] pb-px">
            {([
              ["desc", "Description"],
              ["specs", t("common.specs")],
              ["features", t("common.features")],
              ["media", `${t("common.photos")} & ${t("common.videos")}`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                className={cn("relative shrink-0 px-5 py-3 text-sm font-extrabold transition",
                  tab === key ? "text-brand-600 dark:text-brand-300" : "text-muted hover:text-[var(--text)]")}
              >
                {label}
                <span className={cn("absolute inset-x-2 bottom-0 h-[3px] rounded-t-full grad-brand transition-all duration-300", tab === key ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "desc" && (
              <Reveal className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="whitespace-pre-line text-sm leading-8 text-muted sm:text-base">{full}</p>
                </div>
                <aside className="space-y-3">
                  <div className="rounded-3xl grad-brand p-6 text-white">
                    <p className="font-display text-lg font-extrabold">Production capacity</p>
                    <p className="mt-2 font-display text-4xl font-black">
                      <Counter to={model?.pph || machine.productionPerHour || 0} />
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/75">pieces per hour</p>
                    <p className="mt-4 border-t border-white/25 pt-4 text-sm text-white/85">
                      ≈ {((model?.pph || machine.productionPerHour || 0) * 8).toLocaleString("en-IN")} pieces in an 8-hour shift
                    </p>
                  </div>
                  <div className="rounded-3xl surface card-shadow border border-[var(--border)] p-6">
                    <p className="font-display text-sm font-extrabold">What you get</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      {["Machine with starter die set", "Installation & commissioning", "Operator training", "1 year warranty", "Lifetime spare part support"].map((x) => (
                        <li key={x} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </Reveal>
            )}

            {tab === "specs" && (
              <Reveal className="grid gap-6 md:grid-cols-2">
                {specGroups.length === 0 && <p className="text-sm text-muted">Specifications will be updated soon.</p>}
                {specGroups.map(([group, rows]) => (
                  <div key={group} className="overflow-hidden rounded-3xl surface card-shadow border border-[var(--border)]">
                    <p className="grad-brand px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white">{group}</p>
                    <table className="w-full text-sm">
                      <tbody>
                        {rows.map((r: any, i: number) => (
                          <tr key={i} className={cn("border-t border-[var(--border)] transition hover:bg-brand-500/5", i % 2 === 1 && "bg-[var(--bg-soft)]")}>
                            <td className="px-5 py-3 font-semibold text-muted">{r.label}</td>
                            <td className="px-5 py-3 text-right font-bold">{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Reveal>
            )}

            {tab === "features" && (
              <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.length === 0 && <p className="text-sm text-muted">Features will be updated soon.</p>}
                {features.map((f, i) => (
                  <div key={i} className="group flex items-start gap-3 rounded-3xl surface card-shadow border border-[var(--border)] p-5 transition hover:-translate-y-1 hover:border-brand-300">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl grad-brand text-white transition group-hover:rotate-12">
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold leading-relaxed">{f}</p>
                  </div>
                ))}
              </Reveal>
            )}

            {tab === "media" && (
              <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((p: any, i: number) => (
                  <figure key={i} className="group overflow-hidden rounded-3xl surface card-shadow border border-[var(--border)]">
                    <div className="img-zoom overflow-hidden">
                      <SmartImage src={p.url} alt={p.caption || name} ratio="4/3" />
                    </div>
                    {p.caption && <figcaption className="p-3 text-xs font-semibold text-muted">{p.caption}</figcaption>}
                  </figure>
                ))}
                {videos.map((v: any, i: number) => {
                  const embed = youtubeEmbed(v.url);
                  return (
                    <div key={i} className="overflow-hidden rounded-3xl surface card-shadow border border-[var(--border)]">
                      {embed ? (
                        <iframe src={embed} title={v.caption || "Machine video"} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                      ) : (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="grid aspect-video place-items-center grad-brand text-white transition hover:opacity-90">
                          <PlayCircle className="h-14 w-14" />
                        </a>
                      )}
                      {v.caption && <p className="p-3 text-xs font-semibold text-muted">{v.caption}</p>}
                    </div>
                  );
                })}
                {photos.length === 0 && videos.length === 0 && <p className="text-sm text-muted">Media will be uploaded soon.</p>}
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading align="left" eyebrow="Related" title={<>{t("common.related")}</>} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => <MachineCard key={r.id} machine={r} delay={i * 70} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function QuickSpec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-3 transition hover:border-brand-300">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">{icon} {label}</p>
      <p className="mt-1 truncate font-display text-sm font-extrabold">{value}</p>
    </div>
  );
}
