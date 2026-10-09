"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeIndianRupee, Calculator, CalendarClock, Coins, Factory, RefreshCw, TrendingUp, Wallet, Zap } from "lucide-react";
import { useApp, track } from "@/components/providers";
import { Alert, AuroraBlobs, Btn, Counter, Reveal, SectionHeading, useToast } from "@/components/ui";
import { calculateRoi, type RoiResult } from "@/lib/roi";
import { inr } from "@/lib/utils";

type Fields = {
  productionPerHour: number; hoursPerDay: number; daysPerMonth: number;
  sellingPrice: number; rawMaterialCost: number; machinePrice: number; otherMonthlyCost: number;
};

const DEFAULTS: Fields = {
  productionPerHour: 3500, hoursPerDay: 8, daysPerMonth: 26,
  sellingPrice: 1.1, rawMaterialCost: 0.75, machinePrice: 98000, otherMonthlyCost: 8000,
};

const LIMITS: Record<keyof Fields, [number, number, number]> = {
  productionPerHour: [100, 12000, 100],
  hoursPerDay: [1, 24, 1],
  daysPerMonth: [1, 31, 1],
  sellingPrice: [0.1, 20, 0.05],
  rawMaterialCost: [0.05, 15, 0.05],
  machinePrice: [10000, 2000000, 1000],
  otherMonthlyCost: [0, 200000, 500],
};

export default function RoiCalculator({ defaultMachine }: { defaultMachine?: { name: string; pph: number; price: number } }) {
  const { t } = useApp();
  const toast = useToast();
  const [f, setF] = useState<Fields>(
    defaultMachine
      ? { ...DEFAULTS, productionPerHour: defaultMachine.pph || DEFAULTS.productionPerHour, machinePrice: defaultMachine.price || DEFAULTS.machinePrice }
      : DEFAULTS
  );
  const [result, setResult] = useState<RoiResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [serverChecked, setServerChecked] = useState(false);

  const live = useMemo(() => calculateRoi(f), [f]);

  const run = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/roi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const json = (await res.json()) as RoiResult;
      if (!res.ok || !json.ok) throw new Error(json.error || t("roi.invalid"));
      setResult(json);
      setServerChecked(true);
      track("roi_calc", { entityName: `profit ${Math.round(json.netMonthlyProfit)}` });
    } catch (err) {
      toast({ kind: "error", text: (err as Error).message || t("roi.invalid") });
    } finally {
      setBusy(false);
    }
  }, [f, t, toast]);

  useEffect(() => {
    if (defaultMachine) {
      setF((p) => ({ ...p, productionPerHour: defaultMachine.pph || p.productionPerHour, machinePrice: defaultMachine.price || p.machinePrice }));
    }
  }, [defaultMachine]);

  const r = result ?? live;
  const paybackPct = r.paybackMonths ? Math.min(100, (r.paybackMonths / 24) * 100) : 100;

  const cards = [
    { icon: Factory, label: t("roi.monthlyProd"), value: `${r.monthlyProduction.toLocaleString("en-IN")} ${t("roi.pieces")}`, tone: "from-brand-500 to-brand-400" },
    { icon: Wallet, label: t("roi.monthlyRev"), value: inr(r.monthlyRevenue), tone: "from-grape-600 to-grape-400" },
    { icon: Coins, label: t("roi.materialCost"), value: inr(r.monthlyMaterialCost), tone: "from-slate-600 to-slate-400" },
    { icon: TrendingUp, label: t("roi.grossProfit"), value: inr(r.grossMonthlyProfit), tone: "from-emerald-600 to-emerald-400" },
    { icon: BadgeIndianRupee, label: t("roi.annualProfit"), value: inr(r.annualProfit), tone: "from-pink-600 to-pink-400" },
    { icon: CalendarClock, label: t("roi.payback"), value: r.paybackMonths ? `${r.paybackMonths} ${t("roi.months")}` : "—", tone: "from-amber-600 to-amber-400" },
  ];

  return (
    <section id="roi" className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1b0f30] via-[#2b1146] to-[#0d0820]" />
      <AuroraBlobs className="-z-10" count={4} />
      <div className="absolute inset-0 -z-10 opacity-25 grid-bg" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow={t("cta.roi")}
          title={<span className="text-white">{t("roi.title")}</span>}
          subtitle={<span className="text-white/70">{t("roi.sub")}</span>}
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* inputs */}
          <Reveal variant="left" className="lg:col-span-5">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
              <p className="flex items-center gap-2 font-display text-base font-extrabold text-white">
                <Calculator className="h-5 w-5 text-brand-300" /> {defaultMachine ? defaultMachine.name : t("roi.title")}
              </p>
              <div className="mt-5 space-y-5">
                <Slider label={`${t("common.pph")}`} value={f.productionPerHour} field="productionPerHour" onChange={setF} unit="/hr" />
                <Slider label={t("roi.hoursDay")} value={f.hoursPerDay} field="hoursPerDay" onChange={setF} unit="hrs" />
                <Slider label={t("roi.daysMonth")} value={f.daysPerMonth} field="daysPerMonth" onChange={setF} unit="days" />
                <Slider label={t("roi.sellPrice")} value={f.sellingPrice} field="sellingPrice" onChange={setF} unit="₹" step={0.05} />
                <Slider label={t("roi.rawCost")} value={f.rawMaterialCost} field="rawMaterialCost" onChange={setF} unit="₹" step={0.05} />
                <Slider label={t("roi.machinePrice")} value={f.machinePrice} field="machinePrice" onChange={setF} unit="₹" step={1000} />
                <Slider label={t("roi.otherCost")} value={f.otherMonthlyCost} field="otherMonthlyCost" onChange={setF} unit="₹" step={500} />
              </div>
              <div className="mt-6 flex gap-2">
                <Btn className="flex-1" loading={busy} onClick={run}><Zap className="h-4 w-4" /> {t("roi.calculate")}</Btn>
                <Btn variant="outline" className="border-white/25 bg-white/10 text-white hover:text-white" onClick={() => { setF(DEFAULTS); setResult(null); setServerChecked(false); }}>
                  <RefreshCw className="h-4 w-4" />
                </Btn>
              </div>
              {r.netMonthlyProfit <= 0 && (
                <div className="mt-4">
                  <Alert kind="warn">
                    <span className="text-amber-100">With these numbers the monthly profit is negative — increase selling price or reduce material cost.</span>
                  </Alert>
                </div>
              )}
            </div>
          </Reveal>

          {/* results */}
          <Reveal variant="right" delay={120} className="lg:col-span-7">
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {cards.map((c, i) => (
                <div key={c.label} className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/30" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.tone} opacity-30 blur-2xl transition group-hover:opacity-60`} />
                  <div className={`inline-grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${c.tone} text-white shadow-lg`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-white/60">{c.label}</p>
                  <p className="mt-1 font-display text-xl font-black text-white sm:text-2xl">{c.value}</p>
                </div>
              ))}

              <div className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-xl sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">{t("roi.firstYear")}</p>
                    <p className="font-display text-3xl font-black text-white">
                      <Counter to={Math.round(r.firstYearProfit)} prefix="₹" />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">First year ROI</p>
                    <p className="font-display text-3xl font-black text-emerald-300">{r.roiPercentFirstYear}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-white/60">
                    <span>{t("roi.payback")}</span>
                    <span>{r.paybackMonths ? `${r.paybackMonths} ${t("roi.months")}` : "—"}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full grad-brand transition-all duration-1000" style={{ width: `${100 - paybackPct}%` }} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/55">
                  Per piece profit: <span className="font-bold text-white">₹{r.perPieceProfit}</span> • Margin:{" "}
                  <span className="font-bold text-white">{r.profitMarginPercent}%</span> • Daily output:{" "}
                  <span className="font-bold text-white">{r.dailyProduction.toLocaleString("en-IN")}</span>
                  {serverChecked && <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">server verified</span>}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, field, onChange, unit, step = 1,
}: {
  label: string; value: number; field: keyof Fields;
  onChange: (fn: (p: Fields) => Fields) => void; unit?: string; step?: number;
}) {
  const [min, max] = LIMITS[field];
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-white/80">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={(e) => onChange((p) => ({ ...p, [field]: Number(e.target.value) }))}
            className="w-24 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-brand-300"
          />
          <span className="w-8 text-[10px] font-bold text-white/50">{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange((p) => ({ ...p, [field]: Number(e.target.value) }))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-500"
      />
    </div>
  );
}
