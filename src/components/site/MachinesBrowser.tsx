"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useApp } from "@/components/providers";
import { EmptyState, Reveal } from "@/components/ui";
import MachineCard, { type MachineCardData } from "./MachineCard";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price_low" | "price_high" | "newest" | "popular";

export default function MachinesBrowser({ machines, initialCategory }: { machines: MachineCardData[]; initialCategory?: string }) {
  const { lang } = useApp();
  const [cat, setCat] = useState<string>(initialCategory && machines.some((m) => m.category === initialCategory) ? initialCategory : "all");
  const [sort, setSort] = useState<Sort>("featured");
  const [q, setQ] = useState("");

  const categories = useMemo(() => Array.from(new Set(machines.map((m) => m.category))), [machines]);

  const filtered = useMemo(() => {
    let rows = machines.filter((m) => (cat === "all" ? true : m.category === cat));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      rows = rows.filter((m) =>
        [m.name, m.category, JSON.stringify(m.t ?? {})].join(" ").toLowerCase().includes(s)
      );
    }
    const price = (m: MachineCardData) => m.offerPrice || m.companyPrice || m.mrp;
    switch (sort) {
      case "price_low": rows = [...rows].sort((a, b) => price(a) - price(b)); break;
      case "price_high": rows = [...rows].sort((a, b) => price(b) - price(a)); break;
      case "popular": rows = [...rows].sort((a, b) => b.views - a.views); break;
      case "newest": rows = [...rows].sort((a, b) => b.id - a.id); break;
      default: rows = [...rows].sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
    }
    return rows;
  }, [machines, cat, sort, q]);

  return (
    <div>
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-4 lg:flex-row lg:items-center">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn("shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all duration-300",
                  cat === c ? "grad-brand text-white shadow-lg shadow-brand-500/25 scale-105" : "glass text-muted hover:text-[var(--text)] hover:border-brand-300")}
              >
                {c === "all" ? (lang === "hi" ? "सभी" : lang === "or" ? "ସମସ୍ତ" : "All") : c}
                <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/15">
                  {c === "all" ? machines.length : machines.filter((m) => m.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-56">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter machines…"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-soft)] py-2.5 pl-9 pr-8 text-xs font-semibold outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
              />
              {q && <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-brand-600"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <select
              value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2.5 text-xs font-bold outline-none transition focus:border-brand-400"
            >
              <option value="featured">Featured</option>
              <option value="price_low">Price: Low → High</option>
              <option value="price_high">Price: High → Low</option>
              <option value="popular">Most viewed</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <EmptyState
          title="No machines match this filter"
          subtitle="Try another category or clear the search box. You can also WhatsApp us for a custom machine requirement."
          action={<button onClick={() => { setCat("all"); setQ(""); }} className="mt-2 rounded-full grad-brand px-5 py-2.5 text-xs font-extrabold text-white">Reset filters</button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => <MachineCard key={m.id} machine={m} delay={(i % 3) * 70} />)}
        </div>
      )}
    </div>
  );
}
