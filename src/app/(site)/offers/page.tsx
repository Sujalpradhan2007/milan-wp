import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import OfferCard from "@/components/site/OfferCard";
import OffersBrowser from "@/components/site/OffersBrowser";
import { CtaBand, FestivalStrip } from "@/components/site/HomeSections";
import { listFestivals, listOffers } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Offers & Festival Deals",
  description: "Running offers, festival discounts, coupon codes and freebies on paper plate, paper cup and agarbatti machines from Milan Enterprises.",
};

const map = (o: any) => ({
  id: o.id, slug: o.slug, title: o.title, t: o.t, machineName: o.machineName,
  coverImage: o.coverImage, bgImage: o.bgImage, mrp: o.mrp, companyPrice: o.companyPrice,
  offerPrice: o.offerPrice, discount: o.discount, includedItems: (o.includedItems as any[]) ?? [],
  festivalName: o.festivalName,
  startDate: o.startDate instanceof Date ? o.startDate.toISOString() : String(o.startDate),
  endDate: o.endDate instanceof Date ? o.endDate.toISOString() : String(o.endDate),
  couponCode: o.couponCode, views: o.views,
});

export default async function OffersPage() {
  const [settings, live, all, festivals] = await Promise.all([
    getSettings(), listOffers(true), listOffers(false, true), listFestivals(),
  ]);
  const expired = all.filter((o) => new Date(o.endDate).getTime() < Date.now());

  return (
    <>
      <PageHero
        title="Offers & Festival Deals"
        subtitle="Limited-period machine deals, festive discounts, free die sets, free installation and raw material combos. Every offer has a live countdown — book before it closes."
        image="/images/hero.jpg"
        breadcrumb={[{ label: "Offers", href: "/offers" }]}
        tone="pink"
      />

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <OffersBrowser live={live.map(map)} expired={expired.map(map)} />
        </div>
      </section>

      <FestivalStrip festivals={festivals.map((f) => ({
        id: f.id, key: f.key, name: f.name,
        festivalDate: f.festivalDate instanceof Date ? f.festivalDate.toISOString() : String(f.festivalDate),
        colorA: f.colorA, colorB: f.colorB, discount: f.discount, couponCode: f.couponCode, t: f.t, bannerUrl: f.bannerUrl,
      }))} />

      <CtaBand settings={settings as any} />
    </>
  );
}
