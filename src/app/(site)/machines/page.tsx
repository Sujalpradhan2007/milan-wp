import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import MachinesBrowser from "@/components/site/MachinesBrowser";
import { CtaBand } from "@/components/site/HomeSections";
import { listMachines } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Machines — Paper Plate, Paper Cup & Agarbatti Machines",
    description: `Browse the complete range of ${s.company.name} machines with prices, models, colours, specifications and working videos.`,
  };
}

export default async function MachinesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const [settings, machines] = await Promise.all([getSettings(), listMachines({ activeOnly: true })]);

  return (
    <>
      <PageHero
        title="Our Machines"
        subtitle="Hydraulic paper plate machines, automatic paper cup machines, agarbatti machines and double die plate machines — built in Khalikot, run-tested for 48 hours and delivered across India."
        image={settings.company.heroImage}
        breadcrumb={[{ label: "Machines", href: "/machines" }]}
      />
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <MachinesBrowser
            initialCategory={sp.category}
            machines={machines.map((m) => ({
              id: m.id, slug: m.slug, name: m.name, category: m.category, t: m.t,
              coverImage: m.coverImage, mrp: m.mrp, companyPrice: m.companyPrice,
              offerPrice: m.offerPrice, discount: m.discount, capacity: m.capacity,
              productionPerHour: m.productionPerHour, power: m.power, warranty: m.warranty,
              featured: m.featured, models: (m.models as any[]) ?? [], colors: (m.colors as any[]) ?? [],
              specs: (m.specs as any[]) ?? [], views: m.views,
            }))}
          />
        </div>
      </section>
      <CtaBand settings={settings as any} />
    </>
  );
}
