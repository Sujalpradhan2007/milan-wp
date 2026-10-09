"use client";

import { useMemo, useState } from "react";

/* ------------------------------ line chart ------------------------------ */
export function LineChart({
  data, keys, height = 220, labels,
}: { data: Record<string, any>[]; keys: { key: string; label: string; color: string }[]; height?: number; labels?: (row: any) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 720;
  const h = height;
  const pad = { l: 38, r: 12, t: 14, b: 26 };

  const { max, pts } = useMemo(() => {
    const values = data.flatMap((d) => keys.map((k) => Number(d[k.key] ?? 0)));
    const max = Math.max(1, ...values);
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const pts = keys.map((k) => ({
      ...k,
      d: data.map((row, i) => {
        const x = pad.l + (data.length === 1 ? iw / 2 : (i * iw) / (data.length - 1));
        const y = pad.t + ih - (Number(row[k.key] ?? 0) / max) * ih;
        return { x, y, row, i };
      }),
    }));
    return { max, pts };
  }, [data, keys, h]);

  if (!data.length) return <Empty height={height} />;
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
        <defs>
          {keys.map((k) => (
            <linearGradient key={k.key} id={`lg-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={k.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={k.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <g key={p}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih * p} y2={pad.t + ih * p} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 4" />
            <text x={pad.l - 6} y={pad.t + ih * p + 3.5} textAnchor="end" fontSize="9" fill="currentColor" fillOpacity={0.45}>
              {Math.round(max * (1 - p))}
            </text>
          </g>
        ))}
        {pts.map((series) => (
          <g key={series.key}>
            <path
              d={`${series.d.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")} L${series.d[series.d.length - 1]?.x},${pad.t + ih} L${series.d[0]?.x},${pad.t + ih} Z`}
              fill={`url(#lg-${series.key})`}
            />
            <path
              d={series.d.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
              fill="none" stroke={series.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 2400, animation: "me-drawline 1.6s ease-out forwards" }}
            />
            {series.d.map((p) => (
              <circle key={p.i} cx={p.x} cy={p.y} r={hover === p.i ? 4.5 : 0} fill={series.color} stroke="#fff" strokeWidth={1.5} className="transition-all" />
            ))}
          </g>
        ))}
        {data.map((row, i) => {
          const x = pad.l + (data.length === 1 ? iw / 2 : (i * iw) / (data.length - 1));
          const show = data.length <= 16 || i % Math.ceil(data.length / 10) === 0 || hover === i;
          return (
            <g key={i}>
              <rect x={x - iw / (data.length * 2)} y={pad.t} width={iw / data.length} height={ih} fill="transparent"
                onMouseEnter={() => setHover(i)} />
              {show && (
                <text x={x} y={h - 8} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity={0.45}>
                  {labels ? labels(row) : String(row.day ?? "").slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-xl border border-[var(--border)] surface px-3 py-2 text-[11px] font-bold shadow-lg">
          <span className="mr-2 text-muted">{labels ? labels(data[hover]) : String(data[hover].day ?? "").slice(5)}</span>
          {keys.map((k) => (
            <span key={k.key} className="mr-2 inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: k.color }} />{k.label}: {Number(data[hover][k.key] ?? 0).toLocaleString("en-IN")}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {keys.map((k) => (
          <span key={k.key} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: k.color }} /> {k.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- bar chart ------------------------------ */
export function BarChart({
  data, height = 220, color = "#ff5a10", valueKey = "count", labelKey = "name", horizontal = false,
}: { data: { [k: string]: any }[]; height?: number; color?: string; valueKey?: string; labelKey?: string; horizontal?: boolean }) {
  if (!data.length) return <Empty height={height} />;
  const max = Math.max(1, ...data.map((d) => Number(d[valueKey] ?? 0)));
  if (horizontal) {
    return (
      <div className="space-y-3" style={{ minHeight: height }}>
        {data.map((d, i) => (
          <div key={String(d[labelKey]) + i}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
              <span className="truncate pr-2">{String(d[labelKey] ?? "—")}</span>
              <span className="tabular-nums text-muted">{Number(d[valueKey] ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(Number(d[valueKey] ?? 0) / max) * 100}%`, backgroundImage: `linear-gradient(90deg, ${color}, #7922fc)` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={String(d[labelKey]) + i} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[10px] font-black tabular-nums text-muted opacity-0 transition group-hover:opacity-100">{Number(d[valueKey] ?? 0).toLocaleString("en-IN")}</span>
          <div className="w-full rounded-t-lg transition-all duration-700 group-hover:opacity-90"
            style={{ height: `${Math.max(3, (Number(d[valueKey] ?? 0) / max) * (height - 46))}px`, backgroundImage: `linear-gradient(180deg, ${color}, #7922fc)` }} />
          <span className="w-full truncate text-center text-[9px] font-bold text-muted">{String(d[labelKey] ?? "")}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ donut chart ----------------------------- */
export function Donut({ data, height = 200, size = 150 }: { data: { key: string; count: number }[]; height?: number; size?: number }) {
  const total = data.reduce((s, d) => s + Number(d.count || 0), 0);
  const colors = ["#ff5a10", "#7922fc", "#e51d74", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
  if (!total) return <Empty height={height} />;
  let acc = 0;
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-wrap items-center justify-center gap-6" style={{ minHeight: height }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {data.map((d, i) => {
          const frac = Number(d.count || 0) / total;
          const dash = `${frac * c} ${c}`;
          const off = -acc * c;
          acc += frac;
          return (
            <circle key={d.key + i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors[i % colors.length]}
              strokeWidth={18} strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 900ms ease" }} />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r={r - 14} fill="none" stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={d.key + i} className="flex items-center gap-2 text-xs font-bold">
            <span className="h-3 w-3 rounded-full" style={{ background: colors[i % colors.length] }} />
            <span className="capitalize">{d.key}</span>
            <span className="text-muted">{Number(d.count).toLocaleString("en-IN")} ({Math.round((Number(d.count) / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({ height }: { height: number }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--border)] text-xs font-semibold text-muted" style={{ height }}>
      No data for this period yet
    </div>
  );
}
