"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { EmptyState, Reveal, SmartImage, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  id: number; title: string; t: any; description: string | null;
  category: string; url: string; sortOrder: number; views: number; createdAt: string;
};

const CATS = [
  { key: "all", en: "All", hi: "सभी", or: "ସମସ୍ତ" },
  { key: "factory", en: "Factory", hi: "फैक्ट्री", or: "ଫ୍ୟାକ୍ଟରୀ" },
  { key: "products", en: "Products", hi: "उत्पाद", or: "ଉତ୍ପାଦ" },
  { key: "customers", en: "Customers", hi: "ग्राहक", or: "ଗ୍ରାହକ" },
  { key: "team", en: "Team", hi: "टीम", or: "ଟିମ୍" },
];

export default function GalleryGrid({ items, compact = false }: { items: GalleryItem[]; compact?: boolean }) {
  const { lang } = useApp();
  const [cat, setCat] = useState("all");
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const filtered = useMemo(() => (cat === "all" ? items : items.filter((i) => i.category === cat)), [items, cat]);
  const shown = compact ? filtered.slice(0, 8) : filtered;
  const current = lightbox !== null ? filtered[lightbox] : null;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox, filtered.length]);

  useEffect(() => { setZoom(1); }, [lightbox]);

  const label = (c: (typeof CATS)[number]) => (lang === "hi" ? c.hi : lang === "or" ? c.or : c.en);
  const title = (g: GalleryItem) => (g.t?.[lang]?.title as string) || g.title || "Gallery image";

  return (
    <div>
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => { setCat(c.key); setLightbox(null); setLoading(true); setTimeout(() => setLoading(false), 220); }}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all duration-300",
              cat === c.key ? "grad-brand text-white shadow-lg shadow-brand-500/25 scale-105" : "glass text-muted hover:text-[var(--text)] hover:border-brand-300"
            )}
          >
            {label(c)}
            <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/15">
              {c.key === "all" ? items.length : items.filter((i) => i.category === c.key).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-3xl skeleton" />)}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState title="No photos in this category yet" subtitle="Our team uploads new factory and customer photos regularly — check back soon." />
      ) : (
        <div className={cn("grid gap-4 sm:grid-cols-2", compact ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {shown.map((g, i) => (
            <Reveal key={g.id} delay={(i % 6) * 70} variant="zoom">
              <button
                onClick={() => { setLightbox(i); track("gallery_view", { entityId: g.id, entityName: title(g) }); }}
                className="group relative block h-full w-full overflow-hidden rounded-3xl border border-[var(--border)] surface card-shadow"
              >
                <SmartImage src={g.url} alt={title(g)} ratio={compact ? "4/3" : "4/3"} className="transition-transform duration-[1100ms] group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0714]/90 via-[#0a0714]/15 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur w-fit">{g.category}</p>
                  <h3 className="mt-2 font-display text-base font-extrabold leading-tight text-white">{title(g)}</h3>
                  {g.description && <p className="mt-1 line-clamp-2 text-xs text-white/70">{(g.t?.[lang]?.description as string) || g.description}</p>}
                </div>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100 group-hover:rotate-90">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {/* lightbox */}
      {current && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#07040f]/95 p-3 backdrop-blur-md anim-rise" onClick={() => setLightbox(null)}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0818]" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center overflow-hidden bg-black/60" style={{ maxHeight: "72vh" }}>
              <img
                src={current.url}
                alt={title(current)}
                className="max-h-[72vh] w-full object-contain transition-transform duration-500"
                style={{ transform: `scale(${zoom})` }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute right-3 top-3 flex gap-2">
                <IconBtn onClick={() => setZoom((z) => Math.min(3, z + 0.35))} label="Zoom in"><ZoomIn className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => setZoom((z) => Math.max(1, z - 0.35))} label="Zoom out"><ZoomOut className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => setLightbox(null)} label="Close"><X className="h-4 w-4" /></IconBtn>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 p-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">{current.category}</p>
                <h3 className="truncate font-display text-base font-extrabold text-white">{title(current)}</h3>
                {current.description && <p className="mt-0.5 line-clamp-1 text-xs text-white/60">{current.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <IconBtn onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))} label="Previous"><ChevronLeft className="h-4 w-4" /></IconBtn>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white tabular-nums">{(lightbox ?? 0) + 1} / {filtered.length}</span>
                <IconBtn onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % filtered.length))} label="Next"><ChevronRight className="h-4 w-4" /></IconBtn>
              </div>
            </div>
          </div>
          <span className="sr-only"><Spinner className="h-0 w-0" /></span>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-110 hover:bg-white/30">
      {children}
    </button>
  );
}
