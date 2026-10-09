"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Clock, Globe, Mail, MapPin, MessageCircle,
  Phone, Play, Send, Share2, ShieldCheck,
} from "lucide-react";
import { useApp, track } from "@/components/providers";
import { useToast, Reveal } from "@/components/ui";
import type { PublicSettings } from "./SiteShell";
import { cn } from "@/lib/utils";

export default function Footer({ settings }: { settings: PublicSettings }) {
  const { t, lang } = useApp();
  const toast = useToast();
  const c = settings.company;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const products = [
    { href: "/machines", key: "nav.machines" },
    { href: "/raw-materials", key: "nav.rawMaterials" },
    { href: "/spare-parts", key: "nav.spareParts" },
    { href: "/offers", key: "nav.offers" },
  ];
  const quick = [
    { href: "/", key: "nav.home" }, { href: "/about", key: "nav.about" },
    { href: "/gallery", key: "nav.gallery" }, { href: "/faq", key: "nav.faq" },
    { href: "/support", key: "nav.support" }, { href: "/contact", key: "nav.contact" },
  ];

  const socials = [
    { href: c.facebook, icon: Share2, label: "Facebook" },
    { href: c.instagram, icon: Globe, label: "Instagram" },
    { href: c.youtube, icon: Play, label: "YouTube" },
    { href: c.linkedin, icon: MessageCircle, label: "LinkedIn" },
  ].filter((s) => s.href);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast({ kind: "error", text: "Please enter a valid email address." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      track("newsletter", { entityName: email });
      toast({ kind: "success", text: json.already ? "You are already subscribed." : "Subscribed! Offers will reach your inbox." });
      setEmail("");
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message || "Could not subscribe." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#120c22] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-bg" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/25 blur-[110px] anim-float" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-grape-600/25 blur-[120px] anim-drift" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* brand */}
          <Reveal className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl grad-brand">
                {c.logo ? <img src={c.logo} alt={c.name} className="h-full w-full object-cover" /> : <span className="font-display text-lg font-black">ME</span>}
              </span>
              <div>
                <p className="font-display text-lg font-extrabold leading-tight">{c.name}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{c.city}, {c.district} • {c.state}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{c.aboutShort}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {c.trustBadges?.slice(0, 4).map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/15">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> {b}
                </span>
              ))}
            </div>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 transition hover:scale-110 hover:bg-white/20">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>

          {/* links */}
          <Reveal delay={80} className="lg:col-span-2">
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white/85">{t("footer.quick")}</h4>
            <ul className="mt-4 space-y-2.5">
              {quick.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-1.5 text-sm text-white/65 transition hover:text-brand-300">
                    <span className="h-1 w-1 rounded-full bg-brand-400 transition-all group-hover:w-3" /> {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-2">
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white/85">{t("footer.products")}</h4>
            <ul className="mt-4 space-y-2.5">
              {products.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-1.5 text-sm text-white/65 transition hover:text-grape-300">
                    <span className="h-1 w-1 rounded-full bg-grape-400 transition-all group-hover:w-3" /> {t(l.key)}
                  </Link>
                </li>
              ))}
              <li><Link href="/privacy-policy" className="text-sm text-white/55 hover:text-white">{t("nav.privacy")}</Link></li>
              <li><Link href="/terms" className="text-sm text-white/55 hover:text-white">{t("nav.terms")}</Link></li>
            </ul>
          </Reveal>

          {/* contact + newsletter */}
          <Reveal delay={200} className="lg:col-span-4">
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-white/85">{t("footer.reach")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><span>{c.address} – {c.pincode}</span></li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-brand-400" /><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-white">{c.phone}</a></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-brand-400" /><a href={`mailto:${c.email}`} className="break-all hover:text-white">{c.email}</a></li>
              <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 shrink-0 text-brand-400" /><span>{c.workingHours}</span></li>
            </ul>
            <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-grape-300 hover:underline">
              View on Google Maps <ArrowRight className="h-3.5 w-3.5" />
            </a>

            {settings.features.showNewsletter && (
              <form onSubmit={subscribe} className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">{t("footer.newsletter")}</p>
                <div className="mt-2 flex gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder={t("common.email")}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/45"
                  />
                  <button type="submit" disabled={busy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl grad-brand px-4 py-2 text-xs font-extrabold text-white transition hover:scale-105 disabled:opacity-60">
                    {busy ? <Send className="h-3.5 w-3.5 animate-pulse" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {t("footer.subscribe")}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {c.legalName || c.name}. {t("footer.rights")}</p>
          <p className="flex items-center gap-2">
            <span>GST: {c.gst}</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/admin" className={cn("font-semibold text-white/70 transition hover:text-brand-300")}>{t("nav.admin")}</Link>
          </p>
        </div>
        {c.footerNote && <p className="mt-3 text-center text-[11px] text-white/40">{c.footerNote}</p>}
      </div>
      <span className="sr-only">{lang}</span>
    </footer>
  );
}
