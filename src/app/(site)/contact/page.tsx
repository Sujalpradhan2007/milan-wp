import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import ContactPanel from "@/components/site/ContactPanel";
import { listMachines } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact Us — Milan Enterprises, Khalikot",
  description: "Call, WhatsApp or send an enquiry to Milan Enterprises Pvt. Ltd., Khalikot, Ganjam, Odisha for machine prices, quotations and service.",
};

export default async function ContactPage() {
  const [settings, machines] = await Promise.all([getSettings(), listMachines({ activeOnly: true })]);
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle={`Talk to our team for machine selection, price, bank loan paperwork, raw material rates or service. Factory visits are always welcome at ${settings.company.address}.`}
        breadcrumb={[{ label: "Contact", href: "/contact" }]}
        tone="brand"
      />
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ContactPanel company={settings.company} machines={machines.map((m) => ({ id: m.id, name: m.name }))} />
        </div>
      </section>
    </>
  );
}
