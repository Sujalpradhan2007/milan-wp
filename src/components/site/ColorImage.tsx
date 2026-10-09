"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import type { MachineColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

/**
 * Product image that can be recoloured live.
 *
 * If the selected colour has its own uploaded photo we simply show that photo.
 * Otherwise the base photo is recoloured with a CSS blend overlay so the
 * customer immediately sees the machine in the chosen shade.
 */
export default function ColorImage({
  src, alt, color, ratio = "4/3", className, wrapperClassName, priority,
}: {
  src?: string | null;
  alt: string;
  color?: MachineColor | null;
  ratio?: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
}) {
  const useOwnPhoto = Boolean(color?.imageUrl);
  const finalSrc = useOwnPhoto ? color!.imageUrl! : src;
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => { setState("loading"); }, [finalSrc]);

  const tint = color && !useOwnPhoto;

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-[var(--bg-soft)]", wrapperClassName)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {finalSrc && state !== "error" ? (
        <>
          {state === "loading" && <div className="absolute inset-0 skeleton" aria-hidden />}
          <img
            key={finalSrc}
            src={finalSrc}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setState("ok")}
            onError={() => setState("error")}
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              state === "ok" ? "opacity-100" : "opacity-0",
              className
            )}
            style={tint && color?.filter ? { filter: color.filter } : undefined}
          />
          {tint && state === "ok" && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-all duration-700"
              style={{
                backgroundColor: color!.hex,
                mixBlendMode: color!.blend,
                opacity: color!.strength,
              }}
            />
          )}
          {tint && state === "ok" && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color!.hex}22, transparent 55%)`,
              }}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center grad-brand opacity-90">
          <div className="flex flex-col items-center gap-2 px-4 text-center text-white/95">
            <ImageOff className="h-7 w-7" strokeWidth={1.6} />
            <span className="line-clamp-2 text-xs font-semibold tracking-wide">{alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Round colour swatch button used in the colour picker. */
export function ColorSwatch({
  color, selected, onClick, label, size = "md",
}: { color: MachineColor; selected: boolean; onClick: () => void; label: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        "group relative grid shrink-0 place-items-center rounded-full transition-all duration-300",
        dim,
        selected ? "scale-110 ring-2 ring-brand-500 ring-offset-2 ring-offset-[var(--surface-solid)]" : "hover:scale-110"
      )}
    >
      <span
        className="h-full w-full rounded-full shadow-inner ring-1 ring-black/15"
        style={{ background: `linear-gradient(140deg, ${color.hex}, ${color.hex}cc 60%, rgba(0,0,0,0.25))` }}
      />
      {selected && (
        <span className="absolute inset-0 grid place-items-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 drop-shadow" fill="none" stroke={isLight(color.hex) ? "#16112b" : "#ffffff"} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </button>
  );
}

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}
