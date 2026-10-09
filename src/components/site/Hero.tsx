"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Phone, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { AuroraBlobs, Counter, Reveal, SmartImage } from "@/components/ui";
import type { PublicCompany } from "./SiteShell";
import { cn } from "@/lib/utils";

export type HeroMachine = { slug: string; name: string; coverImage: string | null; price: number; t: unknown };

export default function Hero({
  company, counters, machines,
}: {
  company: PublicCompany;
  counters: { delivered: number; factories: number; districts: number; years: number };
  machines: HeroMachine[];
}) {
  const { t, tr } = useApp();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (machines.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % machines.length), 4200);
    return () => clearInterval(id);
  }, [machines.length]);

  const active = machines[index];

  return (
    <section className="relative isolate overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-20">
        {company.heroImage ? (
          <img src={company.heroImage} alt="" aria-hidden className="h-full w-full object-cover anim-kenburns" />
        ) : (
          <div className="h-full w-full grad-brand opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0d2e]/92 via-[#2a1140]/85 to-[#0a0714]/95" />
        <div className="absolute inset-0 opacity-30 grid-bg" />
      </div>
      <AuroraBlobs className="-z-10" count={4} />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        {/* copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85 ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-300 anim-sparkle" /> {t("hero.badge")}
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[2.1rem] font-black leading-[1.08] text-white sm:text-5xl lg:text-[3.9rem]">
              {company.heroTitle ? (
                <span className="block">{company.heroTitle}</span>
              ) : (
                <>
                  <span className="block">{t("hero.headline1")}</span>
                  <span className="block grad-text bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#ffb03a,#ff5f9e 45%,#c39bff)" }}>
                    {t("hero.headline2")}
                  </span>
                </>
              )}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{t("hero.sub")}</p>
          </Reveal>

          <Reveal delay={230}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${company.name}, I want machine details.`)}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { entityName: "hero" })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#25D366]/30 transition hover:scale-105"
              >
                <MessageCircle className="h-4.5 w-4.5 transition-transform group-hover:rotate-12" /> {t("cta.whatsapp")}
              </a>
              <Link href="/machines" className="group inline-flex items-center gap-2 rounded-full grad-brand px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-brand-500/30 transition hover:scale-105">
                {t("cta.explore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/gallery" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20">
                <PlayCircle className="h-4 w-4" /> 360° machines
              </Link>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-white/70">
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 text-brand-300" /> {company.phone}
              </a>
              {company.trustBadges?.slice(0, 3).map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> {b}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { v: counters.delivered, l: t("stats.delivered"), s: "+" },
                { v: counters.factories, l: t("stats.factories"), s: "+" },
                { v: counters.districts, l: t("stats.districts"), s: "+" },
                { v: counters.years, l: t("stats.years"), s: "" },
              ].map((c) => (
                <div key={c.l} className="rounded-2xl border border-white/15 bg-white/8 p-3.5 text-center backdrop-blur-md transition hover:border-brand-300/40 hover:bg-white/12">
                  <div className="font-display text-xl font-black text-white sm:text-2xl">
                    <Counter to={c.v} suffix={c.s} />
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">{c.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* floating machine showcase */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <Reveal variant="zoom" delay={200} className="relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] grad-brand opacity-30 blur-2xl anim-float" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 backdrop-blur-xl">
                <SmartImage
                  key={active?.slug ?? "hero-machine"}
                  src={active?.coverImage}
                  alt={active ? tr(active.t, "name") || active.name : "Machine"}
                  ratio="4/3"
                  wrapperClassName="rounded-[1.5rem] anim-rise"
                />
                <div className="px-3 pb-1 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">{t("common.featured")}</p>
                  <p className="mt-1 line-clamp-1 font-display text-base font-extrabold text-white">
                    {active ? tr(active.t, "name") || active.name : company.shortName}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/65">{active ? tr(active.t, "tagline") : company.tagline}</p>
                </div>
                <div className="mt-2 flex gap-1.5 px-3 pb-3">
                  {machines.map((m, i) => (
                    <button
                      key={m.slug}
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${m.name}`}
                      className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", i === index ? "grad-brand" : "bg-white/25 hover:bg-white/45")}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute -left-6 top-8 hidden rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-xl anim-bob xl:block">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-white"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> 48-Hour Run Test</p>
              </div>
              <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-xl anim-float xl:block">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-white"><PlayCircle className="h-3.5 w-3.5 text-brand-300" /> Live Factory Demo</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* scroll cue */}
      <div className="relative flex justify-center pb-6">
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
          <span className="h-2 w-1 rounded-full bg-white/70 anim-bob" />
        </span>
      </div>
    </section>
  );
}
