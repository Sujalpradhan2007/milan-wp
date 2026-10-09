"use client";

import { useState } from "react";
import { Archive, Sparkles } from "lucide-react";
import OfferCard, { type OfferData } from "./OfferCard";
import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function OffersBrowser({ live, expired }: { live: OfferData[]; expired: OfferData[] }) {
  const [tab, setTab] = useState<"live" | "expired">("live");
  const rows = tab === "live" ? live : expired;

  return (
    <div>
      <div className="mb-8 inline-flex rounded-full glass p-1.5">
        {([["live", `Live Offers (${live.length})`, Sparkles], ["expired", `Past Offers (${expired.length})`, Archive]] as const).map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all duration-300",
              tab === k ? "grad-brand text-white shadow-lg" : "text-muted hover:text-[var(--text)]")}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={tab === "live" ? "No live offers right now" : "No past offers"}
          subtitle="Festive offers go live automatically a few days before every festival. Subscribe in the footer to get an alert."
        />
      ) : (
        <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", tab === "expired" && "opacity-80")}>
          {rows.map((o, i) => <OfferCard key={o.id} offer={o} delay={(i % 3) * 80} />)}
        </div>
      )}
    </div>
  );
}
