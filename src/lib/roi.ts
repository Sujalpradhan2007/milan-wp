export type RoiInput = {
  productionPerHour: number;
  hoursPerDay: number;
  daysPerMonth: number;
  sellingPrice: number;
  rawMaterialCost: number;
  machinePrice: number;
  otherMonthlyCost?: number;
};

export type RoiResult = {
  ok: boolean;
  error?: string;
  monthlyProduction: number;
  dailyProduction: number;
  monthlyRevenue: number;
  monthlyMaterialCost: number;
  monthlyOtherCost: number;
  grossMonthlyProfit: number;
  netMonthlyProfit: number;
  annualProfit: number;
  firstYearProfit: number;
  paybackMonths: number | null;
  paybackDays: number | null;
  roiPercentFirstYear: number;
  profitMarginPercent: number;
  perPieceProfit: number;
};

export function calculateRoi(input: RoiInput): RoiResult {
  const n = (v: unknown) => {
    const x = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(x) ? x : NaN;
  };

  const pph = n(input.productionPerHour);
  const hours = n(input.hoursPerDay);
  const days = n(input.daysPerMonth);
  const sell = n(input.sellingPrice);
  const raw = n(input.rawMaterialCost);
  const machine = n(input.machinePrice);
  const other = Number.isFinite(n(input.otherMonthlyCost)) ? Math.max(0, n(input.otherMonthlyCost)) : 0;

  const bad = [pph, hours, days, sell, raw, machine].some((v) => !Number.isFinite(v) || v < 0);
  if (bad) {
    return {
      ok: false,
      error: "All values must be valid positive numbers.",
      monthlyProduction: 0, dailyProduction: 0, monthlyRevenue: 0, monthlyMaterialCost: 0,
      monthlyOtherCost: 0, grossMonthlyProfit: 0, netMonthlyProfit: 0, annualProfit: 0,
      firstYearProfit: 0, paybackMonths: null, paybackDays: null, roiPercentFirstYear: 0,
      profitMarginPercent: 0, perPieceProfit: 0,
    };
  }
  if (hours > 24 || days > 31) {
    return {
      ok: false,
      error: "Hours per day must be ≤ 24 and days per month must be ≤ 31.",
      monthlyProduction: 0, dailyProduction: 0, monthlyRevenue: 0, monthlyMaterialCost: 0,
      monthlyOtherCost: 0, grossMonthlyProfit: 0, netMonthlyProfit: 0, annualProfit: 0,
      firstYearProfit: 0, paybackMonths: null, paybackDays: null, roiPercentFirstYear: 0,
      profitMarginPercent: 0, perPieceProfit: 0,
    };
  }

  const dailyProduction = Math.round(pph * hours);
  const monthlyProduction = Math.round(dailyProduction * days);
  const monthlyRevenue = monthlyProduction * sell;
  const monthlyMaterialCost = monthlyProduction * raw;
  const grossMonthlyProfit = monthlyRevenue - monthlyMaterialCost;
  const netMonthlyProfit = grossMonthlyProfit - other;
  const annualProfit = netMonthlyProfit * 12;
  const firstYearProfit = annualProfit - machine;
  const paybackMonths = netMonthlyProfit > 0 ? Number((machine / netMonthlyProfit).toFixed(1)) : null;
  const paybackDays = netMonthlyProfit > 0 && days > 0 ? Math.round((machine / (netMonthlyProfit / days))) : null;
  const roiPercentFirstYear = machine > 0 ? Number(((firstYearProfit / machine) * 100).toFixed(1)) : 0;
  const profitMarginPercent = monthlyRevenue > 0 ? Number(((netMonthlyProfit / monthlyRevenue) * 100).toFixed(1)) : 0;
  const perPieceProfit = Number((sell - raw).toFixed(2));

  return {
    ok: true,
    monthlyProduction, dailyProduction, monthlyRevenue, monthlyMaterialCost,
    monthlyOtherCost: other, grossMonthlyProfit, netMonthlyProfit, annualProfit, firstYearProfit,
    paybackMonths, paybackDays, roiPercentFirstYear, profitMarginPercent, perPieceProfit,
  };
}
