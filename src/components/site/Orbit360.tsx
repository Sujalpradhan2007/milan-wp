"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Pause, Play, Rotate3d } from "lucide-react";
import ColorImage from "./ColorImage";
import type { MachineColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

/**
 * Interactive 360° product turntable.
 * Auto-spins like a product video; drag left/right to rotate.
 * Recolours with the selected machine shade.
 */
export default function Orbit360({
  src,
  alt,
  color,
  compact = false,
}: {
  src?: string | null;
  alt: string;
  color?: MachineColor | null;
  compact?: boolean;
}) {
  const [angle, setAngle] = useState(0);
  const [playing, setPlaying] = useState(true);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || dragging.current) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setAngle((a) => (a + dt * 0.035) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    lastX.current = e.clientX;
    setPlaying(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setAngle((a) => (a + dx * 0.55 + 360) % 360);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  const tilt = Math.sin((angle * Math.PI) / 180) * 8;
  const scale = 0.92 + Math.cos((angle * Math.PI) / 180) * 0.08;

  return (
    <div
      ref={wrap}
      className={cn(
        "relative isolate overflow-hidden select-none",
        compact ? "h-full min-h-[180px] rounded-2xl" : "rounded-[1.75rem]",
      )}
      style={{
        background:
          "radial-gradient(ellipse at 50% 80%, rgba(255,107,26,0.28), transparent 55%), linear-gradient(180deg, #1a1028 0%, #0c0614 100%)",
      }}
    >
      <div className="orbit-ring pointer-events-none absolute left-1/2 top-[58%] h-[42%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/15" />
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[30%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/40 blur-md" />

      <div
        className={cn("relative z-10 grid place-items-center", compact ? "h-[170px] px-4 pt-6" : "aspect-[16/11] px-8 pt-8")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: dragging.current ? "grabbing" : "grab", touchAction: "pan-y" }}
      >
        <div
          className="w-[78%] max-w-md overflow-hidden rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
          style={{
            transform: `perspective(900px) rotateY(${angle}deg) rotateX(${6 + tilt * 0.15}deg) scale(${scale})`,
            transformStyle: "preserve-3d",
          }}
        >
          <ColorImage src={src} color={color} alt={alt} ratio="4/3" wrapperClassName="w-full" />
        </div>
      </div>

      <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
        <Rotate3d className="h-3.5 w-3.5 text-orange-300" /> 360° view
      </div>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
        aria-label={playing ? "Pause 360 spin" : "Play 360 spin"}
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>

      {!compact && (
        <p className="absolute bottom-3 left-0 right-0 z-20 text-center text-[11px] font-semibold text-white/70">
          Drag to rotate · auto-spin 360° product video
        </p>
      )}
    </div>
  );
}
