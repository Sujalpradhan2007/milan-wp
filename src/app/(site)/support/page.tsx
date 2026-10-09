import type { Metadata } from "next";
import { Clock, Headset, ShieldCheck, Truck, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SupportPanel from "@/components/site/SupportPanel";
import FaqAccordion from "@/components/site/FaqAccordion";
import { CtaBand } from "@/components/site/HomeSections";
import { Reveal, SectionHeading } from "@/components/ui";
import { listFaqs, listMachines } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Customer Support — Service Requests & Ticket Tracking",
  description: "Raise a service request, get a ticket number and track the status of your Milan Enterprises machine support ticket.",
};

const SLA = [
  { icon: Headset, t: "Response in 24 hours", d: "Every ticket is acknowledged by our service desk within one working day." },
  { icon: Wrench, t: "On-site within 48 hours", d: "Engineers reach your factory across Odisha within 48 hours for urgent priorities." },
  { icon: Truck, t: "Parts dispatched same day", d: "Dies, seals, heaters and bearings ship from the Khalikot store the same day." },
  { icon: ShieldCheck, t: "1 year warranty", d: "Comprehensive warranty on manufacturing defects, plus lifetime paid support." },
  { icon: Zap, t: "Video-call guidance", d: "Most small issues are fixed live over a WhatsApp video call with our engineer." },
  { icon: Clock, t: "AMC available", d: "Annual maintenance contracts with scheduled visits for high-volume factories." },
];

export default async function SupportPage() {
  const [settings, machines, faqs] = await Promise.all([getSettings(), listMachines({ activeOnly: true }), listFaqs(true)]);
  const serviceFaqs = faqs.filter((f) => f.category === "service");
  const rest = faqs.filter((f) => f.category !== "service").slice(0, 4);
  const items = [...serviceFaqs, ...rest].map((f) => ({ id: f.id, category: f.category, t: f.t, sortOrder: f.sortOrder }));

  return (
    <>
      <PageHero
        title="Customer Support"
        subtitle="Raise a service request, get a ticket number instantly and track every update — priority, assigned engineer and status timeline. For emergencies, WhatsApp us directly."
        breadcrumb={[{ label: "Support", href: "/support" }]}
        tone="brand"
      />

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SupportPanel machines={machines.map((m) => ({ id: m.id, name: m.name }))} company={settings.company} />
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Service Promise" title={<>How our support <span className="grad-text">actually works</span></>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SLA.map((s, i) => (
              <Reveal key={s.t} delay={i * 70}>
                <div className="group h-full rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-brand-300">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl grad-brand text-white shadow-lg transition-transform duration-500 group-hover:rotate-12">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-extrabold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="Service FAQ" title={<>Support questions <span className="grad-text">answered</span></>} />
          <FaqAccordion items={items} />
        </div>
      </section>

      <CtaBand settings={settings as any} />
    </>
  );
}
