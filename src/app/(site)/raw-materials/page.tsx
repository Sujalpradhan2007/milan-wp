import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import ProductCard from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/HomeSections";
import { Reveal, SectionHeading, EmptyState } from "@/components/ui";
import { listRawMaterials } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Raw Materials — Paper, PE Coated Rolls, Jiggit & Packing",
  description: "Wholesale raw material supply for paper plate, paper cup and agarbatti machines from Milan Enterprises, Khalikot, Odisha.",
};

export default async function RawMaterialsPage() {
  const [settings, items] = await Promise.all([getSettings(), listRawMaterials(true)]);
  const low = items.filter((i) => i.stock <= i.lowStockAt);

  return (
    <>
      <PageHero
        title="Raw Materials"
        subtitle="Machine-grade paper, PE coated rolls, pre-cut sheets, jiggit powder, bamboo sticks and packing material — stocked at Khalikot and dispatched within 24 hours anywhere in Odisha."
        image="/images/raw-paper.jpg"
        breadcrumb={[{ label: "Raw Materials", href: "/raw-materials" }]}
      >
        <div className="flex flex-wrap gap-3">
          <StatPill label="Items in catalogue" value={String(items.length)} />
          <StatPill label="Ready stock (kg/pcs)" value={items.reduce((s, i) => s + i.stock, 0).toLocaleString("en-IN")} />
          <StatPill label="Low stock alerts" value={String(low.length)} tone={low.length ? "warn" : "ok"} />
        </div>
      </PageHero>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {items.length === 0 ? (
            <EmptyState title="Raw material catalogue is being updated" subtitle="Please WhatsApp us for current rates — we update this page daily." />
          ) : (
            <>
              <SectionHeading align="left" eyebrow="Catalogue" title={<>Everything your machine <span className="grad-text">consumes</span></>} />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((r, i) => (
                  <div key={r.id} id={r.slug}>
                    <ProductCard delay={(i % 4) * 70} item={{
                      id: r.id, name: r.name, t: r.t, image: r.image, price: r.price, mrp: r.mrp,
                      unit: r.unit, stock: r.stock, grade: r.grade, gsm: r.gsm, slug: r.slug, views: r.views,
                    }} />
                  </div>
                ))}
              </div>
            </>
          )}

          <Reveal delay={120} className="mt-14">
            <div className="grid gap-5 rounded-[1.75rem] grad-brand p-8 text-white md:grid-cols-3">
              {[
                { t: "Wholesale Rates", d: "Direct mill purchase means lower landed cost for your factory." },
                { t: "24-Hour Dispatch", d: "Orders placed before 4 PM leave Khalikot the same evening." },
                { t: "Quality Guarantee", d: "Moisture-tested, GSM-verified paper — replaced if it fails." },
              ].map((x) => (
                <div key={x.t} className="rounded-3xl bg-white/12 p-5 backdrop-blur">
                  <h3 className="font-display text-base font-extrabold">{x.t}</h3>
                  <p className="mt-1.5 text-sm text-white/80">{x.d}</p>
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

function StatPill({ label, value, tone = "ok" }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/65">{label}</p>
      <p className={`font-display text-xl font-black ${tone === "warn" ? "text-amber-300" : "text-white"}`}>{value}</p>
    </div>
  );
}
