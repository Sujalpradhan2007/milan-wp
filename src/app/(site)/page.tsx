import Link from "next/link";
import {
  ArrowRight, Boxes, CircleDot, Cog, Flame, Footprints, Hammer, Layers,
  Package, PackageCheck, Soup, Sparkles, Wrench,
} from "lucide-react";
import Hero from "@/components/site/Hero";
import MachineCard from "@/components/site/MachineCard";
import ProductCard from "@/components/site/ProductCard";
import OfferCard from "@/components/site/OfferCard";
import GalleryGrid from "@/components/site/GalleryGrid";
import FaqAccordion from "@/components/site/FaqAccordion";
import { CtaBand, FestivalStrip, StatsBand, TrustMarquee, WhyChoose } from "@/components/site/HomeSections";
import { Reveal, SectionHeading } from "@/components/ui";
import { getActiveFestival, listFaqs, listGallery, listMachines, listOffers, listRawMaterials, listSpareParts, listFestivals } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { pick } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, any> = {
  "Paper Plate Machine": CircleDot,
  "Paper Cup Machine": Boxes,
  "Agarbatti Machine": Flame,
  "Slipper & Footwear Machine": Footprints,
  "Scrubber Machine": Sparkles,
  "Packing Machine": PackageCheck,
  "Food Processing Machine": Soup,
  "Wire & Metal Machine": Hammer,
  "Puja & Devotional Machine": Flame,
  "Combo Machine": Cog,
};

export default async function HomePage() {
  const [settings, machines, raw, offers, galleryItems, faqs, festivals, spares, festival] = await Promise.all([
    getSettings(),
    listMachines({ activeOnly: true }),
    listRawMaterials(true),
    listOffers(true),
    listGallery(true),
    listFaqs(true),
    listFestivals(),
    listSpareParts(true),
    getActiveFestival(),
  ]);

  const featured = machines.filter((m) => m.featured).slice(0, 4);
  const others = machines.filter((m) => !featured.includes(m)).slice(0, 2);
  const showcase = [...featured, ...others].slice(0, 6);
  const categories = Array.from(new Set(machines.map((m) => m.category)));

  return (
    <>
      <Hero
        company={settings.company}
        counters={settings.counters}
        machines={machines.slice(0, 4).map((m) => ({
          slug: m.slug, name: m.name, coverImage: m.coverImage,
          price: m.offerPrice || m.companyPrice, t: m.t,
        }))}
      />

      <TrustMarquee badges={[...settings.company.trustBadges, festival ? `${pick(festival.t, "en", "name")} offers live` : "Festival Offers Live"]} />

      {/* ---------------- featured machines ---------------- */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow="Our Machines"
              title={<>Manufactured for <span className="grad-text">24×7 production</span></>}
              subtitle="Every machine is fabricated, run-tested and dispatched from our own Khalikot works."
            />
            <Reveal delay={120}>
              <Link href="/machines" className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-brand-400 hover:text-brand-600">
                All Machines <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((m, i) => (
              <MachineCard
                key={m.id}
                delay={i * 70}
                machine={{
                  id: m.id, slug: m.slug, name: m.name, category: m.category, t: m.t,
                  coverImage: m.coverImage, mrp: m.mrp, companyPrice: m.companyPrice,
                  offerPrice: m.offerPrice, discount: m.discount, capacity: m.capacity,
                  productionPerHour: m.productionPerHour, power: m.power, warranty: m.warranty,
                  featured: m.featured, models: (m.models as any[]) ?? [], colors: (m.colors as any[]) ?? [],
                  specs: (m.specs as any[]) ?? [], views: m.views,
                }}
              />
            ))}
          </div>

          {machines.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-[var(--border)] p-12 text-center text-sm text-muted">
              Machines will appear here once the admin adds them.
            </div>
          )}
        </div>
      </section>

      {/* ---------------- categories ---------------- */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-grape-50 via-[var(--bg)] to-brand-50 dark:from-[#170f2c] dark:via-[var(--bg)] dark:to-[#22101f]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Categories" title={<>Choose your <span className="grad-text">business line</span></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const count = machines.filter((m) => m.category === c).length;
              const sample = machines.find((m) => m.category === c);
              const Icon = CATEGORY_ICONS[c.trim()] ?? Layers;
              return (
                <Reveal key={c} delay={i * 80}>
                  <Link href={`/machines?category=${encodeURIComponent(c)}`} className="group relative block overflow-hidden rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-brand-300">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full grad-brand opacity-15 blur-2xl transition group-hover:opacity-40" />
                    <div className="grid h-14 w-14 place-items-center rounded-2xl grad-brand text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-extrabold leading-tight">{c}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">{count} model{count === 1 ? "" : "s"}</p>
                    {sample && <p className="mt-3 line-clamp-2 text-xs text-muted">{pick(sample.t, "en", "tagline")}</p>}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-600 transition-all group-hover:gap-3 dark:text-brand-300">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <StatsBand
        counters={settings.counters}
        labels={["Machines Delivered", "Happy Factories", "Districts Served", "Years of Experience", "Numbers that built our reputation"]}
      />

      {/* ---------------- raw materials ---------------- */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow="Raw Materials"
              title={<>Material that keeps your <span className="grad-text">machine running</span></>}
              subtitle="Wholesale paper, PE coated rolls, jiggit powder, bamboo sticks and packing — dispatched from Khalikot within 24 hours."
            />
            <Reveal delay={100}>
              <Link href="/raw-materials" className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-grape-400 hover:text-grape-600">
                <Package className="h-4 w-4" /> All Materials <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {raw.slice(0, 4).map((r, i) => (
              <ProductCard key={r.id} delay={i * 70} item={{
                id: r.id, name: r.name, t: r.t, image: r.image, price: r.price, mrp: r.mrp,
                unit: r.unit, stock: r.stock, grade: r.grade, gsm: r.gsm, slug: r.slug,
              }} href={`/raw-materials#${r.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- offers ---------------- */}
      {settings.features.showOffers && offers.length > 0 && (
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading align="left" eyebrow="Running Offers" title={<>Festive prices, <span className="grad-text">real savings</span></>} subtitle="Limited-period deals with freebies, coupon codes and countdown timers." />
              <Reveal delay={100}>
                <Link href="/offers" className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-pink-400 hover:text-pink-600">
                  <Sparkles className="h-4 w-4" /> All Offers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offers.slice(0, 3).map((o, i) => (
                <OfferCard key={o.id} delay={i * 80} offer={{
                  id: o.id, slug: o.slug, title: o.title, t: o.t, machineName: o.machineName,
                  coverImage: o.coverImage, bgImage: o.bgImage, mrp: o.mrp, companyPrice: o.companyPrice,
                  offerPrice: o.offerPrice, discount: o.discount, includedItems: (o.includedItems as any[]) ?? [],
                  festivalName: o.festivalName,
                  startDate: o.startDate instanceof Date ? o.startDate.toISOString() : String(o.startDate),
                  endDate: o.endDate instanceof Date ? o.endDate.toISOString() : String(o.endDate),
                  couponCode: o.couponCode, views: o.views,
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      <WhyChoose />

      {/* ---------------- spare parts ---------------- */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-soft)] to-[var(--bg)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading align="left" eyebrow="Spare Parts" title={<>Genuine parts, <span className="grad-text">same-day dispatch</span></>} subtitle="Dies, seals, heaters, bearings, belts and pumps — everything a Milan machine will ever need." />
            <Reveal delay={100}>
              <Link href="/spare-parts" className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-brand-400 hover:text-brand-600">
                <Wrench className="h-4 w-4" /> Full Catalogue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {spares.slice(0, 4).map((s, i) => (
              <ProductCard key={s.id} delay={i * 70} kind="spare" item={{
                id: s.id, name: s.name, t: s.t, image: s.image, price: s.price, mrp: s.mrp,
                stock: s.stock, availability: s.availability, partCode: s.partCode, machineName: s.machineName,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- gallery ---------------- */}
      {settings.features.showGallery && (
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading align="left" eyebrow="Gallery" title={<>Inside our <span className="grad-text">Khalikot works</span></>} subtitle="Fabrication, assembly, dispatch and happy customers — click any photo to zoom." />
              <Reveal delay={100}>
                <Link href="/gallery" className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] glass px-5 py-3 text-sm font-extrabold transition hover:border-grape-400 hover:text-grape-600">
                  Full Gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-4">
              <GalleryGrid items={galleryItems.map((g) => ({ ...g, createdAt: String(g.createdAt) }))} compact />
            </div>
          </div>
        </section>
      )}

      <FestivalStrip festivals={festivals.map((f) => ({
        id: f.id, key: f.key, name: f.name,
        festivalDate: f.festivalDate instanceof Date ? f.festivalDate.toISOString() : String(f.festivalDate),
        colorA: f.colorA, colorB: f.colorB, discount: f.discount, couponCode: f.couponCode, t: f.t, bannerUrl: f.bannerUrl,
      }))} />

      {/* ---------------- faq ---------------- */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="FAQ" title={<>Questions buyers <span className="grad-text">always ask</span></>} subtitle="Available in English, हिन्दी and ଓଡ଼ିଆ — switch the language from the header." />
          <FaqAccordion items={faqs.map((f) => ({ id: f.id, category: f.category, t: f.t, sortOrder: f.sortOrder }))} limit={6} />
          <Reveal delay={120} className="mt-8 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 rounded-full grad-brand px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-500/25 transition hover:scale-105">
              Read all {faqs.length} questions <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand settings={settings as any} />
    </>
  );
}
