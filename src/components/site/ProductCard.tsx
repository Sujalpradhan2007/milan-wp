"use client";

import { MessageCircle, Package, Ruler, ShoppingBag, Sparkles } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Badge, Btn, Reveal, SmartImage } from "@/components/ui";
import { useSite } from "./SiteShell";
import { cn, inr } from "@/lib/utils";

export type ProductData = {
  id: number; name: string; t: unknown; image?: string | null; price: number; mrp: number;
  unit?: string; stock?: number; availability?: string; grade?: string | null; gsm?: string | null;
  partCode?: string; machineName?: string | null; slug?: string; views?: number;
};

export default function ProductCard({
  item, kind = "raw", delay = 0, href,
}: { item: ProductData; kind?: "raw" | "spare"; delay?: number; href?: string }) {
  const { t, tr } = useApp();
  const { openEnquiry, whatsapp } = useSite();
  const name = tr(item.t, "name") || item.name;
  const short = tr(item.t, "short");
  const stock = item.stock ?? 0;
  const availability = item.availability || (stock > 20 ? "in_stock" : stock > 0 ? "low_stock" : "out_of_stock");
  const stockLabel = availability === "in_stock" ? t("common.inStock") : availability === "low_stock" ? t("common.lowStock") : availability === "on_order" ? t("common.onOrder") : t("common.outOfStock");
  const stockTone = availability === "in_stock" ? "green" : availability === "low_stock" || availability === "on_order" ? "amber" : "red";
  const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
  const type = kind === "raw" ? "raw_material" : "spare";
  const waMsg = `Hello Milan Enterprises,\nI want details/price for: ${name}\n${item.partCode ? `Part code: ${item.partCode}\n` : ""}Price: ${inr(item.price)}${item.unit ? ` / ${item.unit}` : ""}\nPlease share availability.`;

  return (
    <Reveal delay={delay} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] surface card-shadow border border-[var(--border)] transition-all duration-500 hover:-translate-y-2 hover:border-brand-300">
        <div className="relative overflow-hidden">
          {href ? (
            <a href={href} className="img-zoom block"><SmartImage src={item.image} alt={name} ratio="4/3" /></a>
          ) : (
            <div className="img-zoom"><SmartImage src={item.image} alt={name} ratio="4/3" /></div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0714]/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Badge tone={stockTone as any} className="bg-white/90 backdrop-blur">{stockLabel}</Badge>
            {discount > 0 && <span className="rounded-full grad-brand px-2.5 py-1 text-[10px] font-black text-white shadow">{discount}% OFF</span>}
          </div>
          {kind === "spare" && item.partCode && (
            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur">{item.partCode}</span>
          )}
          {item.unit && kind === "raw" && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-grape-700 backdrop-blur">per {item.unit}</span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-extrabold leading-snug">{name}</h3>
          {short && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{short}</p>}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.gsm && <Chip icon={<Ruler className="h-3 w-3" />}>{item.gsm}</Chip>}
            {item.grade && <Chip icon={<Sparkles className="h-3 w-3" />}>{item.grade}</Chip>}
            {item.machineName && <Chip icon={<Package className="h-3 w-3" />}>{item.machineName}</Chip>}
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              {item.mrp > item.price && <p className="text-[11px] font-semibold text-muted line-through">{inr(item.mrp)}</p>}
              <p className="font-display text-xl font-black grad-text">{inr(item.price)}</p>
            </div>
            {typeof item.stock === "number" && (
              <p className={cn("text-[11px] font-bold", stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                {stock > 0 ? `${stock.toLocaleString("en-IN")} in stock` : "Notify me"}
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Btn
              size="sm" className="flex-1"
              onClick={() => openEnquiry({ type: type as any, itemId: item.id, itemName: name, price: item.price, title: `${t("common.enquiry")}: ${name}` })}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> {t("common.enquiry")}
            </Btn>
            <Btn
              size="sm" variant="whatsapp" aria-label={t("cta.whatsapp")}
              onClick={() => { track("whatsapp_click", { entityId: item.id, entityName: name }); whatsapp(waMsg, type); }}
            >
              <MessageCircle className="h-4 w-4" />
            </Btn>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-soft)] px-2.5 py-1 text-[10px] font-bold text-muted ring-1 ring-[var(--border)]">
      {icon}{children}
    </span>
  );
}
