"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ImageOff, Info, Loader2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */
export function Reveal({
  children, className, delay = 0, variant = "up", once = true,
}: {
  children: React.ReactNode; className?: string; delay?: number;
  variant?: "up" | "left" | "right" | "zoom"; once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(e.target);
          } else if (!once) setShown(false);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const variantClass = variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : variant === "zoom" ? "reveal-zoom" : "";
  return (
    <div
      ref={ref}
      className={cn("reveal", variantClass, shown && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
export function Counter({
  to, duration = 1900, prefix = "", suffix = "", decimals = 0, className,
}: { to: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const from = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setValue(to);
      };
      requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") { run(); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && run()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Image with graceful broken-image fallback                          */
/* ------------------------------------------------------------------ */
export function SmartImage({
  src, alt, className, wrapperClassName, ratio, priority = false, fallbackIcon,
}: {
  src?: string | null; alt: string; className?: string; wrapperClassName?: string;
  ratio?: string; priority?: boolean; fallbackIcon?: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => { setState("loading"); }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-[var(--bg-soft)]", wrapperClassName)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {state !== "error" && src ? (
        <>
          {state === "loading" && <div className="absolute inset-0 skeleton" aria-hidden />}
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setState("ok")}
            onError={() => setState("error")}
            className={cn("h-full w-full object-cover transition-opacity duration-500", state === "ok" ? "opacity-100" : "opacity-0", className)}
          />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center grad-brand opacity-90">
          <div className="flex flex-col items-center gap-2 px-4 text-center text-white/95">
            {fallbackIcon ?? <ImageOff className="h-7 w-7" strokeWidth={1.6} />}
            <span className="text-xs font-semibold tracking-wide line-clamp-2">{alt || "Image unavailable"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */
export function Modal({
  open, onClose, children, title, subtitle, size = "lg",
}: {
  open: boolean; onClose: () => void; children: React.ReactNode;
  title?: React.ReactNode; subtitle?: React.ReactNode; size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-3 sm:p-6">
      <div className="fixed inset-0 bg-[#0a0714]/70 backdrop-blur-sm anim-rise" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn("relative my-4 w-full anim-rise rounded-3xl surface card-shadow border border-[var(--border)]", widths[size])}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
            <div>
              {title && <h3 className="text-lg font-extrabold sm:text-xl">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow, title, subtitle, align = "center", light = false,
}: { eyebrow?: string; title: React.ReactNode; subtitle?: React.ReactNode; align?: "center" | "left"; light?: boolean }) {
  return (
    <Reveal className={cn("mb-10 sm:mb-14", align === "center" ? "text-center" : "text-left")}>
      {eyebrow && (
        <span className={cn("inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] glass",
          light ? "text-white/90" : "grad-text")}>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 anim-sparkle" /> {eyebrow}
        </span>
      )}
      <h2 className={cn("mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]", light && "text-white")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base", align === "center" && "text-center", light ? "text-white/75" : "text-muted")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons & badges                                                   */
/* ------------------------------------------------------------------ */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "dark" | "whatsapp";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Btn({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }: BtnProps) {
  const sizes = { sm: "px-3.5 py-2 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "grad-brand text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-grape-600/35",
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1fb457]",
    outline: "border border-[var(--border)] glass hover:border-brand-400 hover:text-brand-600",
    ghost: "hover:bg-black/5 dark:hover:bg-white/10",
    dark: "bg-[#16112b] text-white hover:bg-[#241a45] dark:bg-white dark:text-[#16112b]",
  };
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
        sizes[size], variants[variant], className
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "brand", className }: { children: React.ReactNode; tone?: "brand" | "grape" | "green" | "red" | "amber" | "grey"; className?: string }) {
  const tones = {
    brand: "bg-brand-500/12 text-brand-700 dark:text-brand-300 border-brand-500/25",
    grape: "bg-grape-500/12 text-grape-700 dark:text-grape-300 border-grape-500/25",
    green: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    red: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25",
    amber: "bg-amber-500/14 text-amber-700 dark:text-amber-300 border-amber-500/25",
    grey: "bg-black/5 text-muted border-black/10 dark:bg-white/10 dark:border-white/10",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold", tones[tone], className)}>{children}</span>;
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-brand-500", className)} />;
}

export function EmptyState({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl grad-brand text-white opacity-90">{icon ?? <Info className="h-7 w-7" />}</div>
      <h4 className="font-display text-lg font-bold">{title}</h4>
      {subtitle && <p className="max-w-md text-sm text-muted">{subtitle}</p>}
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toasts                                                             */
/* ------------------------------------------------------------------ */
type Toast = { id: number; kind: "success" | "error" | "info"; text: string; action?: { label: string; href: string } };
const ToastCtx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { ...t, id }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 5200);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-grape-500" />,
  };
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex w-[min(94vw,26rem)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-5 sm:translate-x-0">
        {items.map((i) => (
          <div key={i.id} className="pointer-events-auto flex items-start gap-3 rounded-2xl surface card-shadow border border-[var(--border)] p-4 anim-rise">
            {icons[i.kind]}
            <div className="flex-1 text-sm font-medium">{i.text}</div>
            {i.action && (
              <a href={i.action.href} className="text-xs font-bold text-brand-600 hover:underline">{i.action.label}</a>
            )}
            <button onClick={() => setItems((p) => p.filter((x) => x.id !== i.id))} aria-label="Dismiss" className="opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  return ctx?.push ?? ((_t: Omit<Toast, "id">) => { console.log(_t.text); });
}

/* ------------------------------------------------------------------ */
/*  Decorative animated background                                     */
/* ------------------------------------------------------------------ */
export function AuroraBlobs({ className, count = 3 }: { className?: string; count?: number }) {
  const palette = ["#ff7d36", "#7922fc", "#e51d74", "#22d3ee"];
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full blur-[90px] opacity-35 anim-drift"
          style={{
            width: `${260 + i * 90}px`, height: `${260 + i * 90}px`,
            background: `radial-gradient(circle, ${palette[i % palette.length]} 0%, transparent 70%)`,
            top: `${(i * 27 + 8) % 80}%`, left: `${(i * 37 + 5) % 85}%`,
            animationDelay: `${i * 3.5}s`, animationDuration: `${18 + i * 6}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Countdown                                                          */
/* ------------------------------------------------------------------ */
export function Countdown({ to, className }: { to: string | Date; className?: string }) {
  const target = new Date(to as any).getTime();
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };
  const [v, setV] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setV(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const items = [["Days", v.d], ["Hrs", v.h], ["Min", v.m], ["Sec", v.s]] as const;
  return (
    <div className={cn("flex gap-2", className)}>
      {items.map(([label, val]) => (
        <div key={label} className="min-w-[54px] rounded-2xl bg-white/15 px-3 py-2 text-center backdrop-blur-md ring-1 ring-white/25">
          <div className="font-display text-lg font-extrabold tabular-nums text-white sm:text-xl">{String(val).padStart(2, "0")}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Alert                                                              */
/* ------------------------------------------------------------------ */
export function Alert({ kind = "info", children, className }: { kind?: "info" | "error" | "success" | "warn"; children: React.ReactNode; className?: string }) {
  const map = {
    info: "border-grape-500/30 bg-grape-500/10 text-grape-800 dark:text-grape-200",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  };
  const icons = {
    info: <Info className="h-4 w-4" />, error: <XCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />, warn: <AlertTriangle className="h-4 w-4" />,
  };
  return (
    <div className={cn("flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm font-medium", map[kind], className)}>
      <span className="mt-0.5 shrink-0">{icons[kind]}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
