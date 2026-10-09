import type { Lang } from "./i18n";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function inr(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "₹0";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function compactInr(value: number): string {
  const n = Number(value ?? 0);
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + Math.round(n).toString();
}

export function slugify(input: string): string {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097F\u0B00-\u0B7F\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70) || "item";
}

export function formatDate(value: unknown, lang: Lang = "en"): string {
  if (!value) return "—";
  const d = new Date(value as string | Date);
  if (Number.isNaN(d.getTime())) return "—";
  const locale = lang === "hi" ? "hi-IN" : lang === "or" ? "or-IN" : "en-IN";
  try {
    return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
}

export function formatDateTime(value: unknown): string {
  if (!value) return "—";
  const d = new Date(value as string | Date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value: unknown): string {
  const d = new Date(value as string | Date).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const d1 = new Date(a as string).getTime();
  const d2 = new Date(b as string).getTime();
  return Math.round((d2 - d1) / 86400000);
}

export function digitsOnly(phone: string): string {
  return String(phone || "").replace(/[^\d]/g, "");
}

export function waLink(whatsappNumber: string, message: string): string {
  const num = digitsOnly(whatsappNumber);
  const full = num.startsWith("91") ? num : num.length === 10 ? `91${num}` : num;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}

export function fillTemplate(template: string, data: Record<string, unknown>): string {
  return String(template || "").replace(/\{(\w+)\}/g, (_, k) => {
    const v = data[k];
    return v === undefined || v === null ? "—" : String(v);
  });
}

export function discountPct(mrp: number, price: number): number {
  if (!mrp || mrp <= 0 || !price || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /(youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm|\.mov)/i.test(url);
}

export function youtubeEmbed(url: string): string | null {
  const m =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export function num(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : fallback;
}
