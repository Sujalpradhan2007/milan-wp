"use client";

import { useMemo, useState } from "react";
import { Boxes, Wrench } from "lucide-react";
import { useApp } from "@/components/providers";
import { EmptyState, Reveal } from "@/components/ui";
import ProductCard, { type ProductData } from "./ProductCard";
import { cn } from "@/lib/utils";

export default function SparePartsBrowser({ parts, machines }: { parts: ProductData[]; machines: string[] }) {
  const { lang } = useApp();
  const [machine, setMachine] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let rows = parts.filter((p) => (machine === "all" ? true : p.machineName === machine));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      rows = rows.filter((p) => `${p.name} ${p.partCode ?? ""} ${p.machineName ?? ""}`.toLowerCase().includes(s));
    }
    return rows;
  }, [parts, machine, q]);

  return (
    <div>
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 rounded-[1.6rem] surface card-shadow border border-[var(--border)] p-4 lg:flex-row lg:items-center">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {["all", ...machines].map((m) => (
              <button
                key={m}
                onClick={() => setMachine(m)}
                className={cn("shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all duration-300",
                  machine === m ? "grad-brand text-white shadow-lg shadow-brand-500/25 scale-105" : "glass text-muted hover:text-[var(--text)]")}
              >
                {m === "all" ? (lang === "hi" ? "सभी" : lang === "or" ? "ସମସ୍ତ" : "All parts") : m}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Wrench className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or part code…"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-soft)] py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <EmptyState
          title="No spare parts found"
          subtitle="Try another machine or search by part code. You can also WhatsApp us a photo of the part."
          icon={<Boxes className="h-7 w-7" />}
          action={<button onClick={() => { setMachine("all"); setQ(""); }} className="mt-2 rounded-full grad-brand px-5 py-2.5 text-xs font-extrabold text-white">Reset</button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => <ProductCard key={p.id} item={p} kind="spare" delay={(i % 4) * 70} />)}
        </div>
      )}
    </div>
  );
}
