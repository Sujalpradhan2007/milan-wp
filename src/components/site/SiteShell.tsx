"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, Sparkles, X } from "lucide-react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import EnquiryModal from "./EnquiryModal";
import { track, useApp } from "@/components/providers";
import { ToastProvider } from "@/components/ui";
import { pick } from "@/lib/i18n";
import { waLink } from "@/lib/utils";

export type PublicCompany = {
  name: string; shortName: string; legalName: string; tagline: string; logo: string; heroImage: string;
  heroTitle: string; aboutShort: string; aboutLong: string; phone: string; altPhone: string; email: string;
  whatsapp: string; address: string; city: string; district: string; state: string; pincode: string; gst: string;
  mapUrl: string; mapEmbed: string; workingHours: string; facebook: string; instagram: string; youtube: string;
  linkedin: string; trustBadges: string[]; brand: { primary: string; secondary: string; accent: string }; footerNote: string;
};

export type PublicSettings = {
  company: PublicCompany;
  counters: { delivered: number; factories: number; districts: number; years: number; deliverySuffix?: string };
  festival: { autoMode: boolean; enabled: boolean; manualKey: string; daysBefore: number; bannerUrl: string; bgImage: string; message: string };
  features: { showOffers: boolean; showRoi: boolean; showGallery: boolean; showNewsletter: boolean; showFloatingWhatsapp: boolean; maintenanceMode: boolean };
  seo: { title: string; description: string; keywords: string };
};

export type ActiveFestival = {
  id: number; key: string; name: string; festivalDate: string; colorA: string; colorB: string;
  bannerUrl: string | null; couponCode: string | null; discount: number; t: any;
} | null;

export type EnquiryOptions = {
  type?: "machine" | "raw_material" | "offer" | "service" | "general" | "spare";
  title?: string;
  machineId?: number | null;
  machineName?: string;
  itemId?: number | null;
  itemName?: string;
  model?: string;
  color?: string;
  capacity?: string;
  price?: number;
  models?: { id: string; name: string; code?: string; capacity?: string; pph?: number; price?: number }[];
  colors?: import("@/lib/colors").MachineColor[];
  coverImage?: string | null;
};

type Ctx = {
  settings: PublicSettings;
  festival: ActiveFestival;
  openEnquiry: (opts?: EnquiryOptions) => void;
  whatsapp: (message: string, ctxType?: string) => void;
};

const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteShell");
  return c;
};

function PageTracker() {
  const pathname = usePathname();
  const { lang } = useApp();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    track("page_view", { path: pathname, lang });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, lang]);
  return null;
}

function FestivalBar({ festival, settings }: { festival: ActiveFestival; settings: PublicSettings }) {
  const [hidden, setHidden] = useState(false);
  const { lang, t } = useApp();
  if (!festival || hidden || !settings.festival.enabled) return null;
  const name = pick(festival.t, lang, "name") || festival.name;
  const offer = pick(festival.t, lang, "offer") || settings.festival.message;
  const wish = pick(festival.t, lang, "wish");
  const days = Math.max(0, Math.ceil((new Date(festival.festivalDate).getTime() - Date.now()) / 86400000));
  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ backgroundImage: `linear-gradient(100deg, ${festival.colorA}, ${festival.colorB})` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[...Array(14)].map((_, i) => (
          <span key={i} className="absolute text-lg anim-sparkle" style={{ left: `${(i * 7.3) % 100}%`, top: `${(i * 13) % 100}%`, animationDelay: `${i * 0.25}s` }}>✦</span>
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-[12px] font-bold sm:text-sm">
        <Sparkles className="hidden h-4 w-4 sm:block" />
        <span>{wish || `${name} is here!`}</span>
        {offer && <span className="hidden font-semibold opacity-95 md:inline">• {offer}</span>}
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] uppercase tracking-wider">
          {days === 0 ? "Today 🎉" : `${days} ${t("common.daysLeft")}`}
        </span>
        {festival.couponCode && (
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono text-[11px]">{festival.couponCode}</span>
        )}
        <Link href="/offers" className="underline underline-offset-2 hover:no-underline">{t("nav.offers")} →</Link>
        <button onClick={() => setHidden(true)} aria-label="Hide festival bar" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function FloatingActions({ settings }: { settings: PublicSettings }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  if (!settings.features.showFloatingWhatsapp) return null;
  const msg = `Hello ${settings.company.name}, I visited your website and I want details about your machines.`;
  const url = waLink(settings.company.whatsapp, msg);
  return (
    <div className="fixed bottom-5 right-4 z-[110] flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      {open && (
        <div className="flex flex-col items-end gap-2 anim-rise">
          <a
            href={`tel:${settings.company.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-full surface card-shadow border border-[var(--border)] px-4 py-2.5 text-xs font-bold"
          >
            <Phone className="h-4 w-4 text-grape-500" /> {settings.company.phone}
          </a>
          <Link href="/support" className="flex items-center gap-2 rounded-full surface card-shadow border border-[var(--border)] px-4 py-2.5 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-brand-500" /> {t("nav.support")}
          </Link>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="More actions"
          className="grid h-12 w-12 place-items-center rounded-full surface card-shadow border border-[var(--border)] transition hover:scale-105"
        >
          <Phone className={cnRotate(open)} />
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { entityName: "floating", path: window.location.pathname })}
          aria-label={t("cta.whatsapp")}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-110"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] anim-float" style={{ animation: "me-pulse-ring 2.2s ease-out infinite" }} />
          <MessageCircle className="relative h-7 w-7" />
        </a>
      </div>
    </div>
  );
}

function cnRotate(open: boolean) {
  return `h-5 w-5 text-brand-500 transition-transform duration-300 ${open ? "rotate-[135deg]" : ""}`;
}

export default function SiteShell({
  settings, festival, children,
}: { settings: PublicSettings; festival: ActiveFestival; children: React.ReactNode }) {
  const [enquiry, setEnquiry] = useState<{ open: boolean; opts: EnquiryOptions }>({ open: false, opts: {} });
  const openEnquiry = useCallback((opts: EnquiryOptions = {}) => setEnquiry({ open: true, opts }), []);
  const whatsapp = useCallback(
    (message: string, ctxType = "general") => {
      track("whatsapp_click", { entityName: ctxType });
      window.open(waLink(settings.company.whatsapp, message), "_blank", "noopener,noreferrer");
    },
    [settings.company.whatsapp]
  );
  const value = useMemo<Ctx>(() => ({ settings, festival, openEnquiry, whatsapp }), [settings, festival, openEnquiry, whatsapp]);

  return (
    <SiteCtx.Provider value={value}>
      <ToastProvider>
        <PageTracker />
        <div className="flex min-h-screen flex-col">
          <FestivalBar festival={festival} settings={settings} />
          <Header company={settings.company} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </div>
        <FloatingActions settings={settings} />
        <EnquiryModal
          open={enquiry.open}
          opts={enquiry.opts}
          onClose={() => setEnquiry((p) => ({ ...p, open: false }))}
          company={settings.company}
        />
      </ToastProvider>
    </SiteCtx.Provider>
  );
}
