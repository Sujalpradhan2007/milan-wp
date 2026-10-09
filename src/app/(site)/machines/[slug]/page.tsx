import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MachineDetail from "@/components/site/MachineDetail";
import { getMachineBySlug, listMachines } from "@/lib/queries";
import { pick } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMachineBySlug(slug);
  if (!m) return { title: "Machine not found" };
  return {
    title: pick(m.t, "en", "name") || m.name,
    description: pick(m.t, "en", "short") || m.name,
    openGraph: { title: pick(m.t, "en", "name") || m.name, description: pick(m.t, "en", "short"), images: m.coverImage ? [{ url: m.coverImage }] : [] },
  };
}

export default async function MachinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const machine = await getMachineBySlug(slug, true);
  if (!machine || !machine.active) notFound();

  const all = await listMachines({ activeOnly: true });
  const related = all
    .filter((m) => m.id !== machine.id && (m.category === machine.category || m.featured))
    .slice(0, 3);

  const toCard = (m: typeof machine) => ({
    id: m.id, slug: m.slug, name: m.name, category: m.category, t: m.t,
    coverImage: m.coverImage, mrp: m.mrp, companyPrice: m.companyPrice,
    offerPrice: m.offerPrice, discount: m.discount, capacity: m.capacity,
    productionPerHour: m.productionPerHour, power: m.power, warranty: m.warranty,
    featured: m.featured, models: (m.models as any[]) ?? [], colors: (m.colors as any[]) ?? [],
    specs: (m.specs as any[]) ?? [], views: m.views,
    full: pick(m.t, "en", "full"), media: (m.media as any[]) ?? [],
  });

  return <MachineDetail machine={toCard(machine)} related={related.map(toCard)} />;
}
