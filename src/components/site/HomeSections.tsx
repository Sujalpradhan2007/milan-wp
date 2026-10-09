"use client";

import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Cog, Handshake, Headset, MessageCircle,
  Package, ShieldCheck, Sparkles, Truck, Wrench, Zap,
} from "lucide-react";
import { useApp, track } from "@/components/providers";
import { AuroraBlobs, Btn, Counter, Reveal, SectionHeading } from "@/components/ui";
import type { PublicSettings } from "./SiteShell";
import { useSite } from "./SiteShell";
import { pick } from "@/lib/i18n";
import { cn, formatDate, inr } from "@/lib/utils";

/* ---------------------------- trust marquee ---------------------------- */
export function TrustMarquee({ badges }: { badges: string[] }) {
  const items = badges.length ? badges : ["Genuine Spare Parts", "Lifetime Support"];
  return (
    <div className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--bg-soft)] py-3.5">
      <div className="flex w-max gap-10 anim-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-10">
            {items.map((b) => (
              <span key={`${dup}-${b}`} className="flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-muted">
                <BadgeCheck className="h-4 w-4 text-brand-500" /> {b}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- stats -------------------------------- */
export function StatsBand({ counters, labels }: { counters: PublicSettings["counters"]; labels: string[] }) {
  const items = [
    { v: counters.delivered, s: "+", l: labels[0], icon: Cog, tone: "from-brand-500 to-amber-400" },
    { v: counters.factories, s: "+", l: labels[1], icon: Handshake, tone: "from-grape-600 to-pink-400" },
    { v: counters.districts, s: "+", l: labels[2], icon: Truck, tone: "from-emerald-500 to-teal-400" },
    { v: counters.years, s: "", l: labels[3], icon: ShieldCheck, tone: "from-pink-500 to-grape-500" },
  ];
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--bg-soft)] to-[var(--bg)]" />
      <AuroraBlobs className="-z-10 opacity-40" count={3} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Trust" title={labels[4]} subtitle="Every number below is a factory running because of a Milan machine." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.l} delay={i * 90} variant="zoom">
              <div className="group relative overflow-hidden rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 text-center transition-all duration-500 hover:-translate-y-2">
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${it.tone} opacity-20 blur-2xl transition group-hover:opacity-45`} />
                <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${it.tone} text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                  <it.icon className="h-7 w-7" />
                </div>
                <p className="mt-4 font-display text-4xl font-black grad-text">
                  <Counter to={it.v} suffix={it.s} />
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">{it.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- why choose ------------------------------ */
const WHY = [
  { icon: Cog, titleKey: "Own Manufacturing Unit", front: "Everything fabricated in-house at Khalikot — no trading, no middlemen.", back: "CNC-cut frames, hardened EN-8 dies, branded hydraulic packs and a 48-hour load test before dispatch." },
  { icon: Wrench, titleKey: "Installation & Training", front: "On-site installation and hands-on operator training included.", back: "Our engineers travel across Odisha and neighbouring states, run the machine with your paper and train your staff." },
  { icon: Package, titleKey: "Spare Parts Always Ready", front: "Dies, seals, heaters and bearings stocked at our Khalikot store.", back: "Same-day dispatch across India so a broken part never stops your production line." },
  { icon: Truck, titleKey: "Raw Material Supply", front: "Paper, PE coated rolls, jiggit powder and bamboo sticks at wholesale rates.", back: "One vendor for machine + material + spares means consistent quality and better margins for you." },
  { icon: Headset, titleKey: "Lifetime Support", front: "Video-call guidance, ticket system and 48-hour on-site response.", back: "Raise a ticket from the Support page and track the engineer's progress in real time." },
  { icon: ShieldCheck, titleKey: "Bank Loan Assistance", front: "Project report, quotation and GST invoice accepted by banks.", back: "Our customers regularly finance 60–75% through Mudra, PMEGP and Stand-Up India." },
];

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-soft)] to-[var(--bg)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Milan"
          title={<>Six reasons factories <span className="grad-text">choose us</span></>}
          subtitle="Hover or tap any card to flip it and read what actually happens behind the scene."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.titleKey} delay={i * 70} className="h-full">
              <div className="flip-scene h-full">
                <div className="flip-card min-h-[240px]">
                  <div className="flip-face flex h-full flex-col rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-6 transition-colors hover:border-brand-300">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl grad-brand text-white shadow-lg shadow-brand-500/25">
                      <w.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-extrabold">{w.titleKey}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{w.front}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-300">
                      <Sparkles className="h-3.5 w-3.5" /> Hover to know more
                    </span>
                  </div>
                  <div className="flip-face flip-back flex h-full flex-col justify-center rounded-[1.75rem] grad-brand p-6 text-white">
                    <w.icon className="h-8 w-8 opacity-80" />
                    <h3 className="mt-3 font-display text-lg font-extrabold">{w.titleKey}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{w.back}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- festival strip ---------------------------- */
export type FestivalRow = { id: number; key: string; name: string; festivalDate: string; colorA: string; colorB: string; discount: number; couponCode: string | null; t: any; bannerUrl: string | null };

export function FestivalStrip({ festivals }: { festivals: FestivalRow[] }) {
  const { lang, t } = useApp();
  const upcoming = festivals
    .filter((f) => new Date(f.festivalDate).getTime() > Date.now() - 86400000)
    .slice(0, 6);
  if (!upcoming.length) return null;
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1b0f30] via-[#33124a] to-[#12071f]" />
      <AuroraBlobs className="-z-10" count={3} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow="Festival Offers"
          title={<span className="text-white">Festive deals, <span style={{ backgroundImage: "linear-gradient(100deg,#ffb03a,#ff5f9e)" }} className="bg-clip-text text-transparent">automatically live</span></span>}
          subtitle={<span className="text-white/70">Our festival engine switches the banner, colours and offers on its own — {t("common.daysLeft")} countdown included.</span>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((f, i) => {
            const days = Math.max(0, Math.ceil((new Date(f.festivalDate).getTime() - Date.now()) / 86400000));
            const name = pick(f.t, lang, "name") || f.name;
            const offer = pick(f.t, lang, "offer");
            return (
              <Reveal key={f.id} delay={i * 70}>
                <Link href="/offers" className="group relative block overflow-hidden rounded-[1.5rem] border border-white/15 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/40"
                  style={{ backgroundImage: `linear-gradient(135deg, ${f.colorA}22, ${f.colorB}44)` }}>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125" style={{ background: f.colorA, opacity: 0.35 }} />
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-extrabold text-white">{name}</span>
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-black text-white tabular-nums">{days}d</span>
                  </div>
                  <p className="relative mt-1 text-[11px] font-bold uppercase tracking-wider text-white/60">{formatDate(f.festivalDate)}</p>
                  {offer && <p className="relative mt-3 line-clamp-2 text-sm text-white/85">{offer}</p>}
                  <div className="relative mt-4 flex items-center justify-between">
                    {f.discount > 0 && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white">Up to {f.discount}% off</span>}
                    {f.couponCode && <span className="font-mono text-[11px] font-bold text-white/70">{f.couponCode}</span>}
                  </div>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-white transition group-hover:gap-3">
                    {t("nav.offers")} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA band ------------------------------- */
export function CtaBand({ settings }: { settings: PublicSettings }) {
  const { t } = useApp();
  const { openEnquiry, whatsapp } = useSite();
  const c = settings.company;
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 grad-brand" />
      <div className="absolute inset-0 -z-10 opacity-25 grid-bg" />
      <AuroraBlobs className="-z-10" count={2} />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal variant="left">
          <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
            Ready to start your own paper factory?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            Tell us your budget, city and target production. Our engineers will recommend the exact machine, model and raw material plan — free of cost.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => openEnquiry({ type: "general", title: t("cta.quote") })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-brand-700 shadow-xl transition hover:scale-105"
            >
              <Zap className="h-4 w-4" /> {t("cta.quote")}
            </button>
            <button
              onClick={() => { track("whatsapp_click", { entityName: "cta-band" }); whatsapp(`Hello ${c.name}, I want to start a paper business. Please guide me.`, "cta"); }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
            </button>
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full px-2 py-3.5 text-sm font-extrabold text-white underline-offset-4 hover:underline">
              {c.phone}
            </a>
          </div>
        </Reveal>
        <Reveal variant="right" delay={120}>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.trustBadges?.slice(0, 6).map((b, i) => (
              <div key={b} className={cn("flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/12 p-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20", i % 2 === 1 && "sm:translate-y-3")}>
                <BadgeCheck className="h-5 w-5 shrink-0 text-white" /> {b}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- mini price row ---------------------------- */
export function PriceRow({ mrp, price, offer, size = "md" }: { mrp: number; price: number; offer?: number; size?: "sm" | "md" }) {
  const { t } = useApp();
  const final = offer || price || mrp;
  return (
    <div className={cn("flex items-end gap-2", size === "sm" && "gap-1.5")}>
      {mrp > final && <span className={cn("font-semibold text-muted line-through", size === "sm" ? "text-[11px]" : "text-xs")}>{inr(mrp)}</span>}
      <span className={cn("font-display font-black grad-text", size === "sm" ? "text-base" : "text-2xl")}>{inr(final)}</span>
      {mrp > final && <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">-{Math.round(((mrp - final) / mrp) * 100)}%</span>}
      {size === "md" && <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-muted">{t("common.price")}</span>}
    </div>
  );
}

export { Btn };
