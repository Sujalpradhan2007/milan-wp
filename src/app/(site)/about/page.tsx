import type { Metadata } from "next";
import Link from "next/link";
import { Award, BadgeCheck, Factory, Handshake, MapPin, Target, Users, Wrench } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import GalleryGrid from "@/components/site/GalleryGrid";
import { CtaBand, StatsBand, TrustMarquee, WhyChoose } from "@/components/site/HomeSections";
import { Counter, Reveal, SectionHeading, SmartImage } from "@/components/ui";
import { listGallery } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "About Us — Machine Manufacturer in Khalikot, Ganjam, Odisha",
  description: "Milan Enterprises Pvt. Ltd. manufactures paper plate, paper cup and agarbatti machines in Khalikot, Ganjam, Odisha with installation, spare parts and raw material supply.",
};

const TIMELINE = [
  { year: "2013", title: "A small fabrication shed", text: "Started with a welding set, one lathe and the idea that Odisha should not depend on other states for small machinery." },
  { year: "2016", title: "First paper plate machine", text: "Delivered our first hydraulic paper plate machine to a customer in Aska — it is still running today." },
  { year: "2019", title: "Double die & cup line", text: "Added the double die plate machine and began assembling automatic paper cup machines with PLC control." },
  { year: "2021", title: "Spare parts & raw material store", text: "Opened an in-house die bank, spare parts counter and raw material warehouse so customers never wait." },
  { year: "2023", title: "100+ districts", text: "Machines running in more than 100 districts with a dedicated service team and a ticket-based support system." },
  { year: "Today", title: "Milan Enterprises Pvt. Ltd.", text: "A registered private limited manufacturer serving entrepreneurs, self-help groups and factories across India." },
];

export default async function AboutPage() {
  const [settings, galleryItems] = await Promise.all([getSettings(), listGallery(true)]);
  const c = settings.company;

  return (
    <>
      <PageHero
        title="About Milan Enterprises"
        subtitle={c.aboutShort}
        image="/images/gallery-factory.jpg"
        breadcrumb={[{ label: "About Us", href: "/about" }]}
      />

      <TrustMarquee badges={c.trustBadges} />

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left">
            <SmartImage src="/images/gallery-factory.jpg" alt="Milan Enterprises manufacturing unit at Khalikot" ratio="4/3" wrapperClassName="rounded-[1.75rem] card-shadow border border-[var(--border)]" className="img-zoom" />
          </Reveal>
          <Reveal variant="right" delay={100}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] grad-text">
              <Factory className="h-3.5 w-3.5" /> Our Story
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Built in Khalikot, <span className="grad-text">running across India</span>
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted">{c.aboutLong}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: MapPin, k: "Head Office", v: `${c.city}, ${c.district}` },
                { icon: Users, k: "Team", v: "25+ engineers & staff" },
                { icon: Award, k: "GST Registered", v: c.gst },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl surface card-shadow border border-[var(--border)] p-4 transition hover:-translate-y-1">
                  <x.icon className="h-5 w-5 text-brand-500" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted">{x.k}</p>
                  <p className="text-sm font-extrabold">{x.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <StatsBand counters={settings.counters} labels={["Machines Delivered", "Happy Factories", "Districts Served", "Years of Experience", "Milestones we are proud of"]} />

      {/* timeline */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-soft)] to-[var(--bg)]" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading eyebrow="Journey" title={<>From one welding set to <span className="grad-text">1000+ machines</span></>} />
          <div className="relative">
            <span className="absolute left-4 top-0 h-full w-0.5 grad-brand sm:left-1/2 sm:-translate-x-1/2" aria-hidden />
            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.year} delay={i * 80} variant={i % 2 === 0 ? "left" : "right"}>
                  <div className={`relative flex flex-col gap-4 pl-12 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}>
                    <span className={`absolute top-2 grid h-8 w-8 place-items-center rounded-full grad-brand text-white shadow-lg ring-4 ring-[var(--bg)] ${i % 2 === 0 ? "left-0 sm:-right-4" : "left-0 sm:-left-4"}`}>
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <div className="rounded-[1.5rem] surface card-shadow border border-[var(--border)] p-5 transition hover:-translate-y-1">
                      <p className="font-display text-sm font-black grad-text">{t.year}</p>
                      <h3 className="mt-1 font-display text-base font-extrabold">{t.title}</h3>
                      <p className="mt-1.5 text-sm text-muted">{t.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What we stand for" title={<>Our <span className="grad-text">working principles</span></>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, t: "Build it to last", d: "Heavy frames, hardened dies and branded hydraulics — no cost-cutting where it matters." },
              { icon: Handshake, t: "Honest pricing", d: "One transparent price list. No inflated MRP games, no hidden charges after payment." },
              { icon: Wrench, t: "Service first", d: "A ticket system, a service team and spare parts on the shelf — because downtime costs you money." },
              { icon: Users, t: "Grow the buyer", d: "Training, project reports, bank loan paperwork and raw material supply so your unit actually profits." },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="group h-full rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-brand-300">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl grad-brand text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-extrabold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow="Our Work" title={<>Photos from the <span className="grad-text">floor</span></>} />
            <Reveal><Link href="/gallery" className="rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-brand-400 hover:text-brand-600">Full gallery</Link></Reveal>
          </div>
          <GalleryGrid items={galleryItems.slice(0, 6).map((g) => ({ ...g, createdAt: String(g.createdAt) }))} compact />
        </div>
      </section>

      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="grid gap-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-soft)] p-8 sm:grid-cols-3">
              {[
                { v: settings.counters.delivered, l: "Machines delivered" },
                { v: settings.counters.districts, l: "Districts served" },
                { v: settings.counters.years, l: "Years in business" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="font-display text-4xl font-black grad-text"><Counter to={s.v} suffix="+" /></p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand settings={settings as any} />
    </>
  );
}
