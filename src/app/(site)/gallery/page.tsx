import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import GalleryGrid from "@/components/site/GalleryGrid";
import { CtaBand } from "@/components/site/HomeSections";
import { listGallery } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gallery — Factory, Products, Customers & Team",
  description: "Photos of the Milan Enterprises manufacturing unit in Khalikot, machines, installations and happy customers across Odisha.",
};

export default async function GalleryPage() {
  const [settings, items] = await Promise.all([getSettings(), listGallery(true)]);
  const cats = ["factory", "products", "customers", "team"];

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Inside our Khalikot manufacturing unit — fabrication, assembly, run-testing, dispatch, installations and the factories running on Milan machines."
        image="/images/gallery-factory.jpg"
        breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
      >
        <div className="flex flex-wrap gap-3">
          {cats.map((c) => (
            <div key={c} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/65 capitalize">{c}</p>
              <p className="font-display text-xl font-black text-white">{items.filter((i) => i.category === c).length}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryGrid items={items.map((g) => ({ ...g, createdAt: String(g.createdAt) }))} />
        </div>
      </section>
      <CtaBand settings={settings as any} />
    </>
  );
}
