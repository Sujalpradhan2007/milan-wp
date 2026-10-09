import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import { Reveal } from "@/components/ui";

export type LegalSection = { heading: string; body: string[] };

export default function LegalPage({
  title, updated, intro, sections, breadcrumbLabel,
}: { title: string; updated: string; intro: string; sections: LegalSection[]; breadcrumbLabel: string }) {
  return (
    <>
      <PageHero title={title} subtitle={intro} breadcrumb={[{ label: breadcrumbLabel, href: "" }]} tone="grape" />
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="mb-8 inline-flex rounded-full glass px-4 py-2 text-xs font-bold text-muted">Last updated: {updated}</p>
          </Reveal>

          <div className="mb-10 flex flex-wrap gap-2">
            {sections.map((s, i) => (
              <a key={s.heading} href={`#sec-${i}`} className="rounded-full border border-[var(--border)] glass px-3.5 py-2 text-[11px] font-bold text-muted transition hover:border-grape-400 hover:text-grape-600">
                {i + 1}. {s.heading}
              </a>
            ))}
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 40}>
                <article id={`sec-${i}`} className="scroll-mt-32 rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-6 sm:p-8">
                  <h2 className="flex items-start gap-3 font-display text-xl font-extrabold">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl grad-brand text-sm text-white">{i + 1}</span>
                    {s.heading}
                  </h2>
                  <div className="mt-4 space-y-3 pl-11 text-sm leading-7 text-muted">
                    {s.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 rounded-[1.75rem] grad-brand p-8 text-center text-white">
              <h3 className="font-display text-xl font-extrabold">Questions about this policy?</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">Write to us and we will respond in writing within 7 working days.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand-700 transition hover:scale-105">Contact Us</Link>
                <Link href="/" className="rounded-full border-2 border-white/60 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15">Back to Home</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
