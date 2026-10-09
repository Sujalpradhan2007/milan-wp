import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import FaqAccordion from "@/components/site/FaqAccordion";
import { CtaBand } from "@/components/site/HomeSections";
import { Reveal } from "@/components/ui";
import { listFaqs } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "FAQ — Machine Prices, Service, Raw Material & Finance",
  description: "Answers to the most common questions about paper plate, paper cup and agarbatti machines, warranty, service and raw material supply.",
};

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getSettings(), listFaqs(true)]);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything buyers ask us before placing an order — prices, space, power, warranty, service, raw material and bank finance. Switch the header language to read in हिन्दी or ଓଡ଼ିଆ."
        breadcrumb={[{ label: "FAQ", href: "/faq" }]}
      />
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <FaqAccordion items={faqs.map((f) => ({ id: f.id, category: f.category, t: f.t, sortOrder: f.sortOrder }))} />
          <Reveal delay={120} className="mt-10">
            <div className="rounded-[1.75rem] grad-brand p-8 text-center text-white">
              <h3 className="font-display text-2xl font-extrabold">Still have a question?</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
                Our team answers machine, raw material, finance and service questions on WhatsApp — usually within an hour during working time.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a href={`https://wa.me/${settings.company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Milan Enterprises, I have a question about your machines.")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand-700 shadow-xl transition hover:scale-105">
                  Ask on WhatsApp
                </a>
                <a href="/contact" className="rounded-full border-2 border-white/60 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15">
                  Contact form
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand settings={settings as any} />
    </>
  );
}
