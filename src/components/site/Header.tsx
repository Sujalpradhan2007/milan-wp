"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown, Globe, Headset, Home, Menu, Moon, Package, Phone, Sparkles,
  Sun, Tag, Images, Info, Wrench, X, Zap,
} from "lucide-react";
import { useApp, track } from "@/components/providers";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { PublicCompany } from "./SiteShell";

const NAV = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/machines", key: "nav.machines", icon: Zap },
  { href: "/raw-materials", key: "nav.rawMaterials", icon: Package },
  { href: "/offers", key: "nav.offers", icon: Tag },
  { href: "/gallery", key: "nav.gallery", icon: Images },
  { href: "/about", key: "nav.about", icon: Info },
  { href: "/contact", key: "nav.contact", icon: Phone },
  { href: "/support", key: "nav.support", icon: Headset },
];

export default function Header({ company }: { company: PublicCompany }) {
  const { t, lang, setLang, langs, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setLangOpen(false); }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const currentLang = useMemo(() => langs.find((l) => l.code === lang) ?? langs[0], [lang, langs]);

  return (
    <header className="sticky top-0 z-[100] w-full">
      {/* ticker strip */}
      <div className="relative overflow-hidden grad-brand text-white">
        <div className="flex whitespace-nowrap py-1.5 text-[11px] font-semibold sm:text-xs">
          <div className="flex shrink-0 items-center gap-10 pr-10 anim-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-10">
                <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {company.tagline}</span>
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:underline"><Phone className="h-3.5 w-3.5" /> {company.phone}</a>
                <span className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> {company.workingHours}</span>
                <span className="hidden items-center gap-1.5 sm:flex"><Zap className="h-3.5 w-3.5" /> 48-Hour Run Tested Machines</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("border-b border-[var(--border)] transition-all duration-500", scrolled ? "glass shadow-lg shadow-black/5" : "bg-[var(--bg)]/85 backdrop-blur-xl")}>
        <div className={cn("mx-auto flex max-w-7xl items-center gap-3 px-4 transition-all duration-500 sm:px-6", scrolled ? "py-2" : "py-3")}>
          {/* logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl grad-brand shadow-lg shadow-brand-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 sm:h-12 sm:w-12">
              {company.logo ? (
                <img src={company.logo} alt={`${company.name} logo`} className="h-full w-full object-cover" onError={(e) => ((e.currentTarget.style.display = "none"))} />
              ) : (
                <span className="font-display text-lg font-black text-white">ME</span>
              )}
              <span className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-extrabold leading-tight sm:text-lg">
                {company.name}
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                {company.city}, {company.district} • {company.state}
              </span>
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-3 py-2 text-[13px] font-bold transition-all duration-300",
                    active ? "text-brand-600 dark:text-brand-300" : "text-muted hover:text-[var(--text)]"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className={cn("h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5", active && "text-brand-500")} />
                    {t(item.key)}
                  </span>
                  <span className={cn("absolute inset-x-2.5 -bottom-0.5 h-[3px] rounded-full grad-brand transition-all duration-300",
                    active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-70 group-hover:scale-x-75")} />
                </Link>
              );
            })}
          </nav>

          {/* controls */}
          <div className="ml-auto flex items-center gap-1.5 xl:ml-3">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t("common.language")}
                className="flex items-center gap-1.5 rounded-full border border-[var(--border)] glass px-2.5 py-2 text-xs font-bold transition hover:border-brand-400 hover:text-brand-600"
              >
                <Globe className="h-4 w-4 text-brand-500" />
                <span className="hidden sm:inline">{currentLang.native}</span>
                <span className="sm:hidden">{currentLang.flag}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden rounded-2xl surface card-shadow border border-[var(--border)] anim-rise">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code as Lang); track("page_view", { source: "lang_switch" }); }}
                      className={cn("flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-brand-500/10",
                        lang === l.code && "text-brand-600 dark:text-brand-300")}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[var(--border)] glass transition hover:border-grape-400 hover:text-grape-600"
            >
              <Sun className={cn("absolute h-4 w-4 transition-all duration-500", theme === "dark" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100 text-amber-500")} />
              <Moon className={cn("absolute h-4 w-4 transition-all duration-500", theme === "dark" ? "translate-y-0 opacity-100 text-grape-400" : "-translate-y-6 opacity-0")} />
            </button>

            <Link
              href="/contact"
              className="hidden rounded-full grad-brand px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition hover:scale-105 sm:block"
            >
              {t("cta.quote")}
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] glass xl:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* mobile nav strip */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-[var(--border)] px-3 py-2 xl:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition",
                isActive(item.href) ? "grad-brand text-white" : "glass text-muted")}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      </div>

      {/* mobile drawer */}
      <div className={cn("fixed inset-0 z-[130] xl:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-[#0a0714]/70 backdrop-blur-sm transition-opacity duration-400", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto surface border-l border-[var(--border)] p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full")}>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-lg font-extrabold">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {[...NAV, { href: "/spare-parts", key: "nav.spareParts", icon: Wrench }, { href: "/faq", key: "nav.faq", icon: Info }].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ transitionDelay: `${i * 30}ms` }}
                  className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                    isActive(item.href) ? "grad-brand text-white" : "hover:bg-brand-500/10")}
                >
                  <Icon className="h-4 w-4" /> {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-3xl grad-brand p-5 text-white">
            <p className="text-sm font-bold">{t("common.talkExpert")}</p>
            <p className="mt-1 text-xs opacity-85">{company.phone}</p>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-xs font-extrabold text-brand-600">{t("cta.call")}</a>
          </div>
        </aside>
      </div>
    </header>
  );
}
