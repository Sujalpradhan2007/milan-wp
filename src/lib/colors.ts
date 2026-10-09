/**
 * Standard machine colour palette — 10 options available on EVERY machine.
 *
 * Milan Enterprises paints every machine body in one of these ten shades.
 * When a customer picks a colour the product photo is recoloured live:
 *   • if the admin has uploaded a real photo for that colour (`imageUrl`),
 *     that photo is shown;
 *   • otherwise the cover photo is tinted with a CSS blend overlay so the
 *     customer still sees the machine in the selected shade.
 */

export type MachineColor = {
  id: string;
  name: string;
  hi: string;
  or: string;
  hex: string;
  /** CSS blend mode used to recolour the photo when no colour photo exists. */
  blend: "color" | "hue" | "multiply" | "screen" | "soft-light";
  /** 0–1 strength of the tint overlay. */
  strength: number;
  /** Extra filter applied to the base image for this shade. */
  filter?: string;
  imageUrl?: string;
};

export const MACHINE_COLORS: MachineColor[] = [
  { id: "c01", name: "Milan Blue",     hi: "मिलन ब्लू",     or: "ମିଲାନ ନୀଳ",      hex: "#1769d6", blend: "color",      strength: 0.72 },
  { id: "c02", name: "Signature Orange", hi: "सिग्नेचर ऑरेंज", or: "ସିଗନେଚର ଅରେଞ୍ଜ", hex: "#ff5a10", blend: "color",      strength: 0.70 },
  { id: "c03", name: "Rani Pink",      hi: "रानी पिंक",      or: "ରାଣୀ ଗୋଲାପୀ",     hex: "#e51d74", blend: "color",      strength: 0.70 },
  { id: "c04", name: "Royal Purple",   hi: "रॉयल पर्पल",     or: "ରୟାଲ ବାଇଗଣୀ",     hex: "#7922fc", blend: "color",      strength: 0.68 },
  { id: "c05", name: "Factory Green",  hi: "फैक्ट्री ग्रीन",  or: "ଫ୍ୟାକ୍ଟରୀ ସବୁଜ",  hex: "#17913f", blend: "color",      strength: 0.70 },
  { id: "c06", name: "Pure White",     hi: "सफ़ेद",           or: "ଧଳା",             hex: "#f4f6fa", blend: "soft-light", strength: 0.85, filter: "saturate(0.12) brightness(1.22)" },
  { id: "c07", name: "Jet Black",      hi: "जेट ब्लैक",      or: "କଳା",             hex: "#1c1c22", blend: "multiply",   strength: 0.62, filter: "saturate(0.3) brightness(0.82)" },
  { id: "c08", name: "Safety Yellow",  hi: "सेफ्टी येलो",     or: "ସେଫ୍ଟି ହଳଦିଆ",    hex: "#f7c600", blend: "color",      strength: 0.72 },
  { id: "c09", name: "Industrial Grey", hi: "इंडस्ट्रियल ग्रे", or: "ଇଣ୍ଡଷ୍ଟ୍ରିଆଲ ଧୂସର", hex: "#6b7280", blend: "color",   strength: 0.78, filter: "saturate(0.35)" },
  { id: "c10", name: "Cherry Red",     hi: "चेरी रेड",       or: "ଚେରି ଲାଲ",        hex: "#d81f26", blend: "color",      strength: 0.70 },
];

export const COLOR_IDS = MACHINE_COLORS.map((c) => c.id);

/** Rows stored in the `colors` JSONB column of a machine. */
export function defaultColorRows(imageUrl = ""): MachineColor[] {
  return MACHINE_COLORS.map((c) => ({ ...c, imageUrl }));
}

/** Merge whatever the admin saved with the standard palette so all 10 always exist. */
export function normaliseColors(raw: unknown): MachineColor[] {
  const saved = Array.isArray(raw) ? (raw as Partial<MachineColor>[]) : [];
  const byId = new Map(saved.filter((c) => c && c.id).map((c) => [String(c.id), c]));
  const byName = new Map(saved.filter((c) => c && c.name).map((c) => [String(c.name).toLowerCase(), c]));

  const merged = MACHINE_COLORS.map((base) => {
    const hit = byId.get(base.id) ?? byName.get(base.name.toLowerCase());
    return {
      ...base,
      ...(hit?.hex ? { hex: String(hit.hex) } : {}),
      ...(hit?.name ? { name: String(hit.name) } : {}),
      imageUrl: hit?.imageUrl ? String(hit.imageUrl) : "",
    } as MachineColor;
  });

  // keep any extra custom colours the admin added beyond the standard ten
  const extras = saved
    .filter((c) => c && c.id && !MACHINE_COLORS.some((b) => b.id === c.id) && !MACHINE_COLORS.some((b) => b.name.toLowerCase() === String(c.name ?? "").toLowerCase()))
    .map((c) => ({
      id: String(c.id), name: String(c.name ?? "Custom"), hi: String(c.hi ?? c.name ?? ""), or: String(c.or ?? c.name ?? ""),
      hex: String(c.hex ?? "#888888"), blend: (c.blend as MachineColor["blend"]) ?? "color",
      strength: Number(c.strength ?? 0.7), filter: c.filter, imageUrl: String(c.imageUrl ?? ""),
    })) as MachineColor[];

  return [...merged, ...extras];
}

export function colorLabel(c: MachineColor, lang: "en" | "hi" | "or"): string {
  if (lang === "hi") return c.hi || c.name;
  if (lang === "or") return c.or || c.name;
  return c.name;
}
