import SiteShell, { type ActiveFestival, type PublicSettings } from "@/components/site/SiteShell";
import { getActiveFestival } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, fest] = await Promise.all([getSettings(), getActiveFestival()]);
  const festival: ActiveFestival = fest
    ? {
        id: fest.id, key: fest.key, name: fest.name,
        festivalDate: fest.festivalDate instanceof Date ? fest.festivalDate.toISOString() : String(fest.festivalDate),
        colorA: fest.colorA, colorB: fest.colorB, bannerUrl: fest.bannerUrl,
        couponCode: fest.couponCode, discount: fest.discount, t: fest.t,
      }
    : null;

  return (
    <SiteShell settings={s as unknown as PublicSettings} festival={festival}>
      {children}
    </SiteShell>
  );
}
