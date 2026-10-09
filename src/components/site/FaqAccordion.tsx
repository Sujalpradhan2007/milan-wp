"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useApp } from "@/components/providers";
import { Reveal } from "@/components/ui";
import { cn } from "@/lib/utils";

export type FaqItem = { id: number; category: string; t: any; sortOrder: number };

export default function FaqAccordion({ items, limit }: { items: FaqItem[]; limit?: number }) {
  const { tr, lang } = useApp();
  const [open, setOpen] = useState<number | null>(items[0]?.id ?? null);
  const cats = Array.from(new Set(items.map((i) => i.category)));
  const [cat, setCat] = useState<string>("all");
  const shown = (cat === "all" ? items : items.filter((i) => i.category === cat)).slice(0, limit);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-muted">
        FAQs will appear here soon.
      </div>
    );
  }

  return (
    <div>
      {cats.length > 1 && (
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {["all", ...cats].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn("shrink-0 rounded-full px-4 py-2 text-xs font-extrabold capitalize transition",
                cat === c ? "grad-brand text-white shadow-lg shadow-brand-500/25" : "glass text-muted hover:text-[var(--text)]")}
            >
              {c === "all" ? (lang === "hi" ? "सभी" : lang === "or" ? "ସମସ୍ତ" : "All") : c.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {shown.map((f, i) => {
          const q = tr(f.t, "q");
          const a = tr(f.t, "a");
          const isOpen = open === f.id;
          return (
            <Reveal key={f.id} delay={i * 45}>
              <div className={cn("overflow-hidden rounded-3xl border transition-all duration-500",
                isOpen ? "border-brand-400/60 surface card-shadow" : "border-[var(--border)] glass hover:border-grape-400/50")}>
                <button onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center gap-4 p-5 text-left">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-all duration-500",
                    isOpen ? "grad-brand text-white rotate-6" : "bg-grape-500/10 text-grape-600 dark:text-grape-300")}>
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span className="flex-1 font-display text-sm font-extrabold leading-snug sm:text-base">{q}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform duration-500", isOpen && "rotate-180 text-brand-500")} />
                </button>
                <div className={cn("grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line border-t border-[var(--border)] px-5 py-4 pl-[4.75rem] text-sm leading-relaxed text-muted">{a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
