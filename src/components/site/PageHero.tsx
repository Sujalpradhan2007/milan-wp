"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { AuroraBlobs, Reveal } from "@/components/ui";
import { useApp } from "@/components/providers";

export default function PageHero({
  title, subtitle, image, breadcrumb, children, tone = "grape",
}: {
  title: string; subtitle?: string; image?: string | null;
  breadcrumb?: { label: string; href: string }[]; children?: React.ReactNode;
  tone?: "grape" | "brand" | "pink";
}) {
  const { t } = useApp();
  const tones = {
    grape: "from-[#1b0f30] via-[#2b1146] to-[#12071f]",
    brand: "from-[#3a1206] via-[#5a1a10] to-[#1a0714]",
    pink: "from-[#3a0a24] via-[#5c1140] to-[#170820]",
  };
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20">
        {image ? (
          <img src={image} alt="" aria-hidden className="h-full w-full object-cover opacity-40 anim-kenburns" />
        ) : null}
        <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]}`} />
        <div className="absolute inset-0 opacity-25 grid-bg" />
      </div>
      <AuroraBlobs className="-z-10" count={3} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-white/60">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" /> {t("nav.home")}</Link>
            {(breadcrumb ?? []).map((b) => (
              <span key={b.href} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <Link href={b.href} className="hover:text-white">{b.label}</Link>
              </span>
            ))}
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{title}</span>
          </nav>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-5xl">
            <span className="grad-text bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#ffb03a,#ff5f9e 45%,#c39bff)" }}>{title}</span>
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={140}>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">{subtitle}</p>
          </Reveal>
        )}
        {children && <Reveal delay={200} className="mt-8">{children}</Reveal>}
      </div>
    </section>
  );
}
