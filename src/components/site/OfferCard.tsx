"use client";

import { useState } from "react";
import { CalendarDays, Check, Gift, MessageCircle, Sparkles, Tag } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Badge, Btn, Countdown, Modal, Reveal, SmartImage } from "@/components/ui";
import { useSite } from "./SiteShell";
import { formatDate, inr } from "@/lib/utils";

export type OfferData = {
  id: number; slug: string; title: string; t: unknown; machineName: string | null; coverImage: string | null;
  bgImage: string | null; mrp: number; companyPrice: number; offerPrice: number; discount: number;
  includedItems: any[]; festivalName: string | null; startDate: string; endDate: string; couponCode: string | null; views: number;
};

export default function OfferCard({ offer, delay = 0 }: { offer: OfferData; delay?: number }) {
  const { t, tr, trl } = useApp();
  const { openEnquiry, whatsapp } = useSite();
  const [open, setOpen] = useState(false);

  const title = tr(offer.t, "title") || offer.title;
  const desc = tr(offer.t, "desc");
  const included = trl(offer.t, "included");
  const items = included.length ? included : (offer.includedItems || []).map((i: any) => i.name);
  const saving = offer.mrp && offer.offerPrice && offer.mrp > offer.offerPrice ? offer.mrp - offer.offerPrice : 0;
  const expired = new Date(offer.endDate).getTime() < Date.now();

  const waMsg = `Hello Milan Enterprises,\nI am interested in the offer: ${title}\n${offer.machineName ? `Machine: ${offer.machineName}\n` : ""}${offer.offerPrice ? `Offer price: ${inr(offer.offerPrice)}\n` : ""}Please share complete details.`;

  return (
    <>
      <Reveal delay={delay} className="h-full">
        <button
          onClick={() => { setOpen(true); track("offer_view", { entityId: offer.id, entityName: title }); }}
          className="group relative block h-full w-full overflow-hidden rounded-[1.75rem] border border-[var(--border)] text-left surface card-shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="relative h-44 overflow-hidden sm:h-52">
            <SmartImage src={offer.coverImage || offer.bgImage} alt={title} className="transition-transform duration-[1200ms] group-hover:scale-110" wrapperClassName="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12071f] via-[#2a0d45]/70 to-transparent" />
            <div className="absolute left-0 top-4 flex flex-col gap-1.5">
              {offer.discount > 0 && (
                <span className="rounded-r-full grad-brand px-3 py-1.5 text-xs font-black text-white shadow-lg">{offer.discount}% {t("common.discount")}</span>
              )}
              {offer.festivalName && (
                <span className="rounded-r-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-grape-700">
                  <Sparkles className="mr-1 inline h-3 w-3" />{offer.festivalName}
                </span>
              )}
            </div>
            {expired && (
              <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Expired</span>
            )}
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">{offer.machineName || t("nav.offers")}</p>
              <h3 className="mt-1 line-clamp-2 font-display text-lg font-extrabold leading-tight text-white sm:text-xl">{title}</h3>
            </div>
          </div>

          <div className="p-5">
            <p className="line-clamp-2 text-sm text-muted">{desc}</p>

            {offer.offerPrice > 0 && (
              <div className="mt-4 flex items-end gap-3">
                <div>
                  {offer.mrp > offer.offerPrice && <p className="text-xs font-semibold text-muted line-through">{inr(offer.mrp)}</p>}
                  <p className="font-display text-2xl font-black grad-text">{inr(offer.offerPrice)}</p>
                </div>
                {saving > 0 && <Badge tone="green" className="mb-1"><Tag className="h-3 w-3" /> {t("common.save")} {inr(saving)}</Badge>}
              </div>
            )}

            {items.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {items.slice(0, 3).map((it: string, i: number) => (
                  <li key={i} className="inline-flex items-center gap-1 rounded-full bg-grape-500/10 px-2.5 py-1 text-[11px] font-bold text-grape-700 dark:text-grape-300">
                    <Gift className="h-3 w-3" /> {it}
                  </li>
                ))}
                {items.length > 3 && <li className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-muted dark:bg-white/10">+{items.length - 3}</li>}
              </ul>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              {!expired ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Ends in</p>
                  <p className="text-xs font-extrabold text-brand-600 dark:text-brand-300">{offer.endDate ? `${Math.max(0, Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / 86400000))} ${t("common.daysLeft")}` : "—"}</p>
                </div>
              ) : (
                <p className="text-xs font-bold text-muted">Closed on {formatDate(offer.endDate)}</p>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full grad-brand px-4 py-2 text-xs font-extrabold text-white transition group-hover:scale-105">
                {t("common.details")} <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </button>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={title} subtitle={offer.machineName || undefined} size="lg">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl">
              <SmartImage src={offer.coverImage || offer.bgImage} alt={title} ratio="4/3" />
            </div>
            {!expired && (
              <div className="mt-4 rounded-3xl grad-brand p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">Offer ends in</p>
                <Countdown to={offer.endDate} className="mt-2" />
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <InfoBox label={t("common.mrp")} value={offer.mrp ? inr(offer.mrp) : "—"} strike />
              <InfoBox label={t("common.price")} value={offer.companyPrice ? inr(offer.companyPrice) : "—"} />
              <InfoBox label={t("common.offerPrice")} value={offer.offerPrice ? inr(offer.offerPrice) : "—"} accent />
              <InfoBox label={t("common.discount")} value={offer.discount ? `${offer.discount}%` : "—"} accent />
            </div>
            {offer.couponCode && (
              <p className="mt-3 rounded-2xl border border-dashed border-brand-400 bg-brand-500/8 p-3 text-center text-sm font-bold">
                Coupon: <span className="font-mono text-brand-700 dark:text-brand-300">{offer.couponCode}</span>
              </p>
            )}
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <CalendarDays className="h-4 w-4" /> {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-muted">About this offer</h4>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{desc}</p>

            {(offer.includedItems?.length > 0 || items.length > 0) && (
              <>
                <h4 className="mt-6 font-display text-sm font-extrabold uppercase tracking-wider text-muted">What&apos;s included</h4>
                <ul className="mt-3 space-y-2">
                  {(offer.includedItems?.length ? offer.includedItems : items.map((n: string) => ({ name: n, photo: null }))).map((it: any, i: number) => (
                    <li key={i} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-2 transition hover:border-brand-300">
                      {it.photo ? (
                        <SmartImage src={it.photo} alt={it.name} wrapperClassName="h-12 w-12 shrink-0 rounded-xl" ratio="1/1" />
                      ) : (
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl grad-brand text-white"><Gift className="h-5 w-5" /></span>
                      )}
                      <span className="flex-1 text-sm font-bold">{it.name}</span>
                      {it.qty && <Badge tone="grape">×{it.qty}</Badge>}
                      <Check className="h-4 w-4 text-emerald-500" />
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Btn
                onClick={() => {
                  openEnquiry({ type: "offer", title, itemId: offer.id, itemName: title, machineName: offer.machineName || undefined, price: offer.offerPrice || undefined });
                  setOpen(false);
                }}
              >
                {t("cta.quote")}
              </Btn>
              <Btn
                variant="whatsapp"
                onClick={() => { track("whatsapp_click", { entityId: offer.id, entityName: title }); whatsapp(waMsg, "offer"); }}
              >
                <MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}
              </Btn>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function InfoBox({ label, value, accent, strike }: { label: string; value: string; accent?: boolean; strike?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-0.5 font-display text-base font-black ${accent ? "grad-text" : strike ? "text-muted line-through" : ""}`}>{value}</p>
    </div>
  );
}
