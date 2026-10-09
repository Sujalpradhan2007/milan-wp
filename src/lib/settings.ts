import { db } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { sql } from "drizzle-orm";

export const DEFAULT_SETTINGS = {
  company: {
    name: "Milan Enterprises Pvt. Ltd.",
    shortName: "Milan Enterprises",
    legalName: "Milan Enterprises Private Limited",
    tagline: "Paper Plate • Paper Cup • Agarbatti Machines",
    logo: "",
    heroImage: "",
    heroTitle: "",
    aboutShort:
      "Milan Enterprises Pvt. Ltd. is a Khalikot (Ganjam, Odisha) based manufacturer of paper plate, paper cup and agarbatti machines with genuine spare parts and guaranteed raw material supply.",
    aboutLong:
      "Started in Khalikot, Ganjam — Milan Enterprises Pvt. Ltd. has grown into one of Eastern India's most trusted names in small & medium scale paper product machinery. We design, fabricate, test and install hydraulic paper plate machines, double die plate machines, automatic paper cup machines and automatic agarbatti machines. Every machine is built with heavy MS frames, hardened dies and branded hydraulics, then run-tested for 48 hours before dispatch. Along with machines we supply raw paper, paper rolls, paper sheets, PE coated stock, agarbatti raw material and every spare part — so your factory never stops.",
    phone: "+91 82497 98119",
    altPhone: "+91 82497 98119",
    email: "milanenterprises.khalikot@gmail.com",
    whatsapp: "+918249798119",
    address: "Khalikot, Ganjam, Odisha, India",
    city: "Khalikot",
    district: "Ganjam",
    state: "Odisha",
    pincode: "761023",
    gst: "21XXXXX1234X1ZQ",
    mapUrl: "https://www.google.com/maps?q=Khalikot,Ganjam,Odisha",
    mapEmbed:
      "https://www.google.com/maps?q=Khalikot,Ganjam,Odisha&output=embed",
    workingHours: "Mon – Sat: 9:00 AM – 8:00 PM",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    trustBadges: [
      "48-Hour Run Tested",
      "1 Year Warranty",
      "On-Site Installation",
      "Genuine Spare Parts",
      "Lifetime Technical Support",
      "Raw Material Supply",
    ],
    brand: { primary: "#ff5a10", secondary: "#7922fc", accent: "#e51d74" },
    footerNote: "" as string,
  },
  counters: {
    delivered: 1250,
    factories: 640,
    districts: 128,
    years: 12,
    deliverySuffix: "+",
  },
  festival: {
    autoMode: true,
    enabled: true,
    manualKey: "",
    daysBefore: 5,
    bannerUrl: "",
    bgImage: "",
    message: "",
  },
  features: {
    showOffers: true,
    showRoi: false,
    showGallery: true,
    showNewsletter: true,
    showFloatingWhatsapp: true,
    maintenanceMode: false,
  },
  seo: {
    title: "Milan Enterprises Pvt. Ltd. | Paper Plate, Paper Cup & Agarbatti Machine Manufacturer in Khalikot, Odisha",
    description:
      "Buy hydraulic paper plate machines, automatic paper cup machines and agarbatti machines from Milan Enterprises Pvt. Ltd., Khalikot, Ganjam, Odisha. Genuine spare parts, raw material supply, installation & lifetime support.",
    keywords:
      "paper plate machine odisha, paper cup machine khalikot, agarbatti machine ganjam, paper plate machine price, double die hydraulic machine, milan enterprises",
  },
  waTemplates: {
    machine:
      "Hello Milan Enterprises,\nI want to enquire about a machine.\n\nName: {name}\nPhone: {phone}\nMachine: {machine}\nModel: {model}\nColour: {color}\nCapacity: {capacity}\nPrice: {price}\nCity: {city}\n\nMessage: {message}",
    raw_material:
      "Hello Milan Enterprises,\nI need raw material.\n\nName: {name}\nPhone: {phone}\nItem: {item}\nCity: {city}\nMessage: {message}",
    offer:
      "Hello Milan Enterprises,\nI saw an offer on your website.\n\nName: {name}\nPhone: {phone}\nOffer: {item}\nCity: {city}\nMessage: {message}",
    service:
      "Hello Milan Enterprises,\nI need service support.\n\nName: {name}\nPhone: {phone}\nMachine: {machine}\nTicket: {ticket}\nCity: {city}\nMessage: {message}",
    general:
      "Hello Milan Enterprises,\n\nName: {name}\nPhone: {phone}\nCity: {city}\nMessage: {message}",
  },
};

export type SettingsShape = typeof DEFAULT_SETTINGS;

function deepMerge(base: any, patch: any): any {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return patch ?? base;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    out[key] =
      base && typeof base[key] === "object" && !Array.isArray(base[key])
        ? deepMerge(base[key], patch[key])
        : patch[key];
  }
  return out;
}

export async function getSettings(): Promise<SettingsShape> {
  try {
    const rows = await db.select().from(settingsTable);
    let merged: any = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    for (const row of rows) {
      if (row.value === null || row.value === undefined) continue;
      merged[row.key] = deepMerge(merged[row.key], row.value);
    }
    return merged as SettingsShape;
  } catch (err) {
    console.error("[settings] failed to read:", err);
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as SettingsShape;
  }
}

export async function getSetting<K extends keyof SettingsShape>(key: K): Promise<SettingsShape[K]> {
  const all = await getSettings();
  return all[key];
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const json = JSON.stringify(value ?? null);
  await db.execute(
    sql`insert into settings (key, value, updated_at) values (${key}, ${json}::jsonb, now())
        on conflict (key) do update set value = excluded.value, updated_at = now()`
  );
}
