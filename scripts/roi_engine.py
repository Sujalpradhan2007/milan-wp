#!/usr/bin/env python3
"""
Milan Enterprises Pvt. Ltd. — Machine ROI / Profit engine (standalone reference).

The production website is a Next.js + PostgreSQL application and the live ROI
calculator is served by `POST /api/roi` (implemented in `src/lib/roi.ts`).
This Python module is an exact, dependency-free port of the same formula so the
business can run the identical numbers from a script, a spreadsheet macro or a
small Flask/FastAPI service if they ever want the calculation outside Node.js.

Usage:
    python3 scripts/roi_engine.py
    python3 scripts/roi_engine.py --pph 3500 --hours 8 --days 26 \
        --sell 1.10 --raw 0.75 --machine 98000 --other 8000

Optional micro-service (requires Flask:  pip install flask):
    python3 scripts/roi_engine.py --serve --port 8000
    curl -X POST localhost:8000/roi -H 'Content-Type: application/json' \
         -d '{"productionPerHour":3500,"hoursPerDay":8,"daysPerMonth":26,
              "sellingPrice":1.1,"rawMaterialCost":0.75,"machinePrice":98000}'
"""

from __future__ import annotations

import argparse
import json
from typing import Any, Dict


def calculate_roi(
    production_per_hour: float,
    hours_per_day: float,
    days_per_month: float,
    selling_price: float,
    raw_material_cost: float,
    machine_price: float,
    other_monthly_cost: float = 0.0,
) -> Dict[str, Any]:
    """Return the full ROI breakdown, or an error payload if input is invalid."""
    values = [
        production_per_hour, hours_per_day, days_per_month,
        selling_price, raw_material_cost, machine_price,
    ]
    if any(v is None or v < 0 for v in values):
        return {"ok": False, "error": "All values must be valid positive numbers."}
    if hours_per_day > 24 or days_per_month > 31:
        return {"ok": False, "error": "Hours per day must be <= 24 and days per month must be <= 31."}

    daily_production = round(production_per_hour * hours_per_day)
    monthly_production = round(daily_production * days_per_month)
    monthly_revenue = monthly_production * selling_price
    monthly_material_cost = monthly_production * raw_material_cost
    gross_monthly_profit = monthly_revenue - monthly_material_cost
    net_monthly_profit = gross_monthly_profit - max(0.0, other_monthly_cost)
    annual_profit = net_monthly_profit * 12
    first_year_profit = annual_profit - machine_price
    payback_months = round(machine_price / net_monthly_profit, 1) if net_monthly_profit > 0 else None
    payback_days = round(machine_price / (net_monthly_profit / days_per_month)) if net_monthly_profit > 0 and days_per_month else None
    roi_first_year = round((first_year_profit / machine_price) * 100, 1) if machine_price > 0 else 0.0
    margin = round((net_monthly_profit / monthly_revenue) * 100, 1) if monthly_revenue > 0 else 0.0

    return {
        "ok": True,
        "dailyProduction": daily_production,
        "monthlyProduction": monthly_production,
        "monthlyRevenue": round(monthly_revenue, 2),
        "monthlyMaterialCost": round(monthly_material_cost, 2),
        "monthlyOtherCost": round(other_monthly_cost, 2),
        "grossMonthlyProfit": round(gross_monthly_profit, 2),
        "netMonthlyProfit": round(net_monthly_profit, 2),
        "annualProfit": round(annual_profit, 2),
        "firstYearProfit": round(first_year_profit, 2),
        "paybackMonths": payback_months,
        "paybackDays": payback_days,
        "roiPercentFirstYear": roi_first_year,
        "profitMarginPercent": margin,
        "perPieceProfit": round(selling_price - raw_material_cost, 2),
    }


def _print_report(r: Dict[str, Any]) -> None:
    if not r.get("ok"):
        print("ERROR:", r["error"])
        return
    money = lambda v: f"INR {v:,.2f}"
    print("-" * 52)
    print("MILAN ENTERPRISES — MACHINE ROI REPORT")
    print("-" * 52)
    print(f"Daily production        : {r['dailyProduction']:,} pieces")
    print(f"Monthly production      : {r['monthlyProduction']:,} pieces")
    print(f"Monthly revenue         : {money(r['monthlyRevenue'])}")
    print(f"Monthly material cost   : {money(r['monthlyMaterialCost'])}")
    print(f"Monthly other cost      : {money(r['monthlyOtherCost'])}")
    print(f"Gross monthly profit    : {money(r['grossMonthlyProfit'])}")
    print(f"Net monthly profit      : {money(r['netMonthlyProfit'])}")
    print(f"Annual profit           : {money(r['annualProfit'])}")
    print(f"First-year net profit   : {money(r['firstYearProfit'])}")
    print(f"Payback period          : {r['paybackMonths'] if r['paybackMonths'] is not None else 'not reachable'} months")
    print(f"First-year ROI          : {r['roiPercentFirstYear']} %")
    print(f"Profit margin           : {r['profitMarginPercent']} %")
    print(f"Per-piece profit        : INR {r['perPieceProfit']}")
    print("-" * 52)


def main() -> None:
    ap = argparse.ArgumentParser(description="Milan Enterprises machine ROI calculator")
    ap.add_argument("--pph", type=float, default=3500, help="production per hour")
    ap.add_argument("--hours", type=float, default=8, help="working hours per day")
    ap.add_argument("--days", type=float, default=26, help="working days per month")
    ap.add_argument("--sell", type=float, default=1.10, help="selling price per piece")
    ap.add_argument("--raw", type=float, default=0.75, help="raw material cost per piece")
    ap.add_argument("--machine", type=float, default=98000, help="machine price")
    ap.add_argument("--other", type=float, default=8000, help="other monthly cost")
    ap.add_argument("--json", action="store_true", help="print raw JSON")
    ap.add_argument("--serve", action="store_true", help="run a tiny Flask API on --port")
    ap.add_argument("--port", type=int, default=8000)
    args = ap.parse_args()

    if args.serve:
        try:
            from flask import Flask, jsonify, request
        except ImportError:
            raise SystemExit("Flask is not installed. Run: pip install flask")
        app = Flask("milan-roi")

        @app.post("/roi")
        def roi():
            b = request.get_json(silent=True) or {}
            return jsonify(calculate_roi(
                float(b.get("productionPerHour", 0)), float(b.get("hoursPerDay", 0)),
                float(b.get("daysPerMonth", 0)), float(b.get("sellingPrice", 0)),
                float(b.get("rawMaterialCost", 0)), float(b.get("machinePrice", 0)),
                float(b.get("otherMonthlyCost", 0) or 0),
            ))

        @app.get("/api/health")
        def health():
            return jsonify({"ok": True})

        app.run(host="0.0.0.0", port=args.port)
        return

    result = calculate_roi(args.pph, args.hours, args.days, args.sell, args.raw, args.machine, args.other)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        _print_report(result)


if __name__ == "__main__":
    main()
