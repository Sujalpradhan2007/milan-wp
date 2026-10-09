import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import ProductCard from "@/components/site/ProductCard";
import SparePartsBrowser from "@/components/site/SparePartsBrowser";
import { CtaBand } from "@/components/site/HomeSections";
import { Reveal } from "@/components/ui";
import { listSpareParts, listMachines } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Spare Parts — Dies, Seals, Heaters, Bearings & Pumps",
  description: "Genuine spare parts for paper plate, paper cup and agarbatti machines. Same-day dispatch from Khalikot, Odisha.",
};

export default async function SparePartsPage() {
  const [settings, parts, machines] = await Promise.all([getSettings(), listSpareParts(true), listMachines({ activeOnly: true })]);

  return (
    <>
      <PageHero
        title="Spare Parts"
        subtitle="Dies, hydraulic seals, heater bands, bearings, belts, nozzles, oil pumps and controls — every genuine part a Milan machine will ever need, stocked at Khalikot and dispatched the same day."
        image="/images/spare-parts.jpg"
        breadcrumb={[{ label: "Spare Parts", href: "/spare-parts" }]}
        tone="brand"
      >
        <div className="flex flex-wrap gap-3">
          <Pill label="Parts listed" value={String(parts.length)} />
          <Pill label="In stock now" value={String(parts.filter((p) => p.availability === "in_stock").length)} />
          <Pill label="Machines covered" value={String(new Set(parts.map((p) => p.machineName)).size)} />
        </div>
      </PageHero>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SparePartsBrowser
            parts={parts.map((p) => ({
              id: p.id, name: p.name, t: p.t, image: p.image, price: p.price, mrp: p.mrp,
              stock: p.stock, availability: p.availability, partCode: p.partCode, machineName: p.machineName,
              views: p.views,
            }))}
            machines={machines.map((m) => m.name)}
          />

          <Reveal delay={120} className="mt-14">
            <div className="rounded-[1.75rem] surface card-shadow border border-[var(--border)] p-8">
              <h3 className="font-display text-xl font-extrabold">Can't find your part?</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Send us a photo of the part or its code on WhatsApp. If it is not in stock we fabricate or source it — most
                requests are shipped within 48 hours. We also keep a full die bank for every plate size from 4&quot; to 14&quot;.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand settings={settings as any} />
    </>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/65">{label}</p>
      <p className="font-display text-xl font-black text-white">{value}</p>
    </div>
  );
}
