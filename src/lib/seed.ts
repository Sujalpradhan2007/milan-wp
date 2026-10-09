import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  activities, enquiries, events, faqs, festivals, gallery, machines, newsletter,
  offers, rawMaterials, settings as settingsTable, spareParts, tickets, ticketUpdates, users,
} from "@/db/schema";
import { hashPassword } from "./auth";

function nextDate(candidates: string[]): Date {
  const now = Date.now();
  for (const c of candidates) {
    const d = new Date(c + "T09:00:00+05:30");
    if (d.getTime() > now - 86400000) return d;
  }
  const last = new Date(candidates[candidates.length - 1] + "T09:00:00+05:30");
  last.setFullYear(last.getFullYear() + 1);
  return last;
}

async function hasRows(table: any): Promise<boolean> {
  const r = await db.select({ c: sql<number>`count(*)::int` }).from(table);
  return Number(r[0]?.c ?? 0) > 0;
}

const ADMIN_ACCOUNTS = [
  { name: "Milan (Owner)", email: "admin@milanenterprises.in", password: "Milan@2024", role: "super_admin", phone: "+91 82497 98119" },
  { name: "Rakesh Sahoo", email: "sales@milanenterprises.in", password: "Sales@2024", role: "sales_manager", phone: "+91 82497 98119" },
  { name: "Priya Behera", email: "content@milanenterprises.in", password: "Content@2024", role: "content_manager", phone: "+91 82497 98119" },
];

/** Always make sure demo admin logins exist so the panel never gets locked out. */
export async function ensureAdminUsers() {
  for (const a of ADMIN_ACCOUNTS) {
    const rows = await db.select({ id: users.id }).from(users).where(eq(users.email, a.email)).limit(1);
    if (rows[0]) {
      await db.update(users).set({
        passwordHash: hashPassword(a.password),
        role: a.role,
        active: true,
        name: a.name,
      }).where(eq(users.id, rows[0].id));
    } else {
      await db.insert(users).values({
        name: a.name,
        email: a.email,
        passwordHash: hashPassword(a.password),
        role: a.role,
        phone: a.phone,
        active: true,
      });
    }
  }
}

export async function seedDatabase(): Promise<{ seeded: boolean; reason?: string }> {
  try {
    await ensureAdminUsers();
    if (await hasRows(machines)) return { seeded: false, reason: "already seeded" };

    /* ------------------------------- users ------------------------------- */
    /* users already ensured above */

    /* ------------------------------ settings ----------------------------- */
    const company = {
      logo: "/images/logo.png",
      heroImage: "/images/hero.jpg",
      heroTitle: "",
      footerNote: "Manufactured with pride in Khalikot, Ganjam, Odisha.",
    };
    await db.insert(settingsTable).values([
      { key: "company", value: company as any },
      { key: "counters", value: { delivered: 1250, factories: 640, districts: 128, years: 12 } as any },
      { key: "festival", value: { autoMode: true, enabled: true, manualKey: "", daysBefore: 5 } as any },
    ]);

    /* ------------------------------ machines ----------------------------- */
    const plateImg = "/images/machine-plate.jpg";
    const cupImg = "/images/machine-cup.jpg";
    const agarbattiImg = "/images/machine-agarbatti.jpg";
    const doubleImg = "/images/machine-double-die.jpg";
    const spareImg = "/images/spare-parts.jpg";

    const colourSet = (img: string) => [
      { id: "c1", name: "Signature Orange", hex: "#ff5a10", imageUrl: img },
      { id: "c2", name: "Royal Purple", hex: "#7922fc", imageUrl: img },
      { id: "c3", name: "Rani Pink", hex: "#e51d74", imageUrl: img },
      { id: "c4", name: "Industrial Graphite", hex: "#3f3f52", imageUrl: img },
    ];

    await db.insert(machines).values([
      {
        slug: "hydraulic-paper-plate-making-machine",
        name: "Hydraulic Paper Plate Making Machine",
        category: "Paper Plate Machine",
        coverImage: plateImg,
        mrp: 135000, companyPrice: 98000, offerPrice: 89000, discount: 26,
        capacity: "4 inch – 12 inch plates",
        productionPerHour: 3500,
        power: "2.2 kW (3 HP)",
        warranty: "1 Year Comprehensive",
        featured: true, active: true, sortOrder: 1, views: 428,
        t: {
          en: {
            name: "Hydraulic Paper Plate Making Machine",
            tagline: "Single die • 3500 plates/hour • 4\"–12\" size",
            short: "Our best-selling hydraulic paper plate machine with hardened dies, 60-tonne pressing force and a rugged MS frame built for continuous 16-hour shifts.",
            full: "The Milan Hydraulic Paper Plate Making Machine is engineered for small and medium entrepreneurs who want professional output without a professional price tag. A 60-tonne hydraulic power pack drives a hardened EN-8 die set that punches and forms plates from 80–150 GSM paper in a single stroke. The heavy mild-steel frame is stress-relieved and powder-coated so it never shakes, even at full speed.\n\nEvery machine is assembled in our Khalikot works, run for 48 hours under load, then dispatched with a starter die set, tool kit, operator training and one year warranty. We also handle on-site installation anywhere in Odisha and neighbouring states.\n\nBecause we manufacture the machine ourselves, spare parts and dies are always in stock — your factory never waits.",
            features: [
              "60-tonne hydraulic power pack with dual pump",
              "Hardened EN-8 die set (1 free die with machine)",
              "Auto lubrication lines on all moving parts",
              "PLC-grade limit switches & emergency stop",
              "Powder-coated stress-relieved MS frame",
              "48-hour run test before dispatch",
              "Free operator training at factory",
            ],
          },
          hi: {
            name: "हाइड्रोलिक पेपर प्लेट बनाने की मशीन",
            tagline: "सिंगल डाई • 3500 प्लेट/घंटा • 4\"–12\" साइज़",
            short: "सबसे ज़्यादा बिकने वाली हाइड्रोलिक पेपर प्लेट मशीन — हार्डंड डाई, 60 टन प्रेसिंग फोर्स और मज़बूत MS फ्रेम के साथ।",
            full: "मिलन हाइड्रोलिक पेपर प्लेट मशीन छोटे और मझोले उद्यमियों के लिए बनाई गई है। 60 टन का हाइड्रोलिक पावर पैक EN-8 हार्डंड डाई सेट को चलाता है जो 80–150 GSM कागज़ से एक ही स्ट्रोक में प्लेट बनाता है। भारी माइल्ड स्टील फ्रेम पाउडर कोटेड है, इसलिए पूरी स्पीड पर भी कंपन नहीं होता।\n\nहर मशीन खलिकोट वर्क्स में असेंबल होती है, 48 घंटे लोड पर चलाई जाती है और फिर स्टार्टर डाई सेट, टूल किट, ऑपरेटर ट्रेनिंग व एक साल की वारंटी के साथ भेजी जाती है।",
            features: ["60-टन हाइड्रोलिक पावर पैक", "हार्डंड EN-8 डाई सेट", "ऑटो लुब्रिकेशन", "इमरजेंसी स्टॉप बटन", "पाउडर कोटेड MS फ्रेम", "48 घंटे रन टेस्ट", "मुफ़्त ऑपरेटर ट्रेनिंग"],
          },
          or: {
            name: "ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍",
            tagline: "ସିଙ୍ଗଲ୍ ଡାଇ • 3500 ପ୍ଲେଟ୍/ଘଣ୍ଟା • 4\"–12\" ସାଇଜ୍",
            short: "ଆମ ସର୍ବାଧିକ ବିକ୍ରି ହେଉଥିବା ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ — ହାର୍ଡେଣ୍ଡ ଡାଇ, 60 ଟନ୍ ଚାପ ଓ ମଜଭୁତ MS ଫ୍ରେମ୍ ସହିତ।",
            full: "ମିଲାନ ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ ଛୋଟ ଓ ମଧ୍ୟମ ଉଦ୍ୟୋଗୀମାନଙ୍କ ପାଇଁ ତିଆରି। 60 ଟନ୍ ହାଇଡ୍ରୋଲିକ୍ ପାୱାର ପ୍ୟାକ୍ EN-8 ହାର୍ଡେଣ୍ଡ ଡାଇ ସେଟ୍ ଚଲାଏ ଯାହା 80–150 GSM କାଗଜରୁ ଗୋଟିଏ ଷ୍ଟ୍ରୋକ୍‌ରେ ପ୍ଲେଟ୍ ତିଆରି କରେ। ଭାରୀ ମାଇଲ୍ଡ ଷ୍ଟିଲ୍ ଫ୍ରେମ୍ ପାୱାର୍ କୋଟେଡ୍ ହୋଇଥିବାରୁ କମ୍ପନ ହୁଏ ନାହିଁ।\n\nପ୍ରତିଟି ମେସିନ୍ ଖଲିକୋଟ ୱାର୍କସରେ ପ୍ରସ୍ତୁତ ହୁଏ, 48 ଘଣ୍ଟା ଲୋଡ୍‌ରେ ଚାଲେ ଏବଂ ଡାଇ ସେଟ୍, ଟୁଲ୍ କିଟ୍, ତାଲିମ ଓ ଏକ ବର୍ଷ ୱାରେଣ୍ଟି ସହିତ ପଠାଯାଏ।",
            features: ["60-ଟନ୍ ହାଇଡ୍ରୋଲିକ୍ ପାୱାର ପ୍ୟାକ୍", "ହାର୍ଡେଣ୍ଡ EN-8 ଡାଇ ସେଟ୍", "ଅଟୋ ଲୁବ୍ରିକେସନ୍", "ଇମରଜେନ୍ସି ଷ୍ଟପ୍", "ପାୱାର୍ କୋଟେଡ୍ MS ଫ୍ରେମ୍", "48 ଘଣ୍ଟା ରନ୍ ଟେଷ୍ଟ୍", "ମାଗଣା ତାଲିମ"],
          },
        } as any,
        media: [
          { type: "image", url: plateImg, caption: "Front view — die station" },
          { type: "image", url: doubleImg, caption: "Hydraulic power pack" },
          { type: "image", url: spareImg, caption: "Hardened die set supplied" },
          { type: "video", url: "https://www.youtube.com/watch?v=6j0v2oYhQ4k", caption: "Working video" },
        ] as any,
        models: [
          { id: "m1", name: "ME-HP1 Manual Feed", code: "ME-HP1", capacity: "4\"–8\"", pph: 2800, price: 89000, active: true },
          { id: "m2", name: "ME-HP2 Semi Automatic", code: "ME-HP2", capacity: "5\"–10\"", pph: 3500, price: 98000, active: true },
          { id: "m3", name: "ME-HP3 Auto with Collector", code: "ME-HP3", capacity: "6\"–12\"", pph: 4200, price: 118000, active: true },
        ] as any,
        colors: colourSet(plateImg) as any,
        specs: [
          { group: "General", label: "Machine Type", value: "Hydraulic Single Die" },
          { group: "General", label: "Automation", value: "Semi Automatic / Automatic" },
          { group: "Output", label: "Production", value: "2800 – 4200 plates / hour" },
          { group: "Output", label: "Plate Size", value: "4 inch to 12 inch" },
          { group: "Technical", label: "Pressing Force", value: "60 Tonne" },
          { group: "Technical", label: "Power", value: "2.2 kW (3 HP), Single Phase" },
          { group: "Technical", label: "Paper GSM", value: "80 – 150 GSM" },
          { group: "Build", label: "Frame", value: "Heavy MS, Powder Coated" },
          { group: "Build", label: "Die Material", value: "EN-8 Hardened Steel" },
          { group: "Build", label: "Approx Weight", value: "650 kg" },
        ] as any,
      },
      {
        slug: "automatic-paper-cup-machine",
        name: "Automatic Paper Cup Machine",
        category: "Paper Cup Machine",
        coverImage: cupImg,
        mrp: 950000, companyPrice: 780000, offerPrice: 725000, discount: 18,
        capacity: "45 ml – 250 ml cups",
        productionPerHour: 4200,
        power: "7.5 kW (10 HP)",
        warranty: "1 Year + AMC available",
        featured: true, active: true, sortOrder: 2, views: 356,
        t: {
          en: {
            name: "Automatic Paper Cup Machine",
            tagline: "70 cups/minute • 45ml–250ml • PLC controlled",
            short: "High-speed automatic paper cup forming machine with ultrasonic/heat sealing, PLC control panel and quick-change cup size moulds.",
            full: "Milan's Automatic Paper Cup Machine converts PE-coated paper blanks into finished cups at up to 70 cups per minute. The line handles wall forming, bottom punching, bottom sealing, rim curling and finished cup ejection in one continuous cycle. A PLC control panel with HMI lets the operator change cup size recipes in minutes.\n\nQuick-change mould sets are available for 45 ml (tea cup), 90 ml, 150 ml (coffee), 200 ml and 250 ml. The machine runs on 7.5 kW three-phase power and needs 600 sq ft of floor space. We supply installation, commissioning, operator training, raw paper and every spare part.",
            features: ["Up to 70 cups per minute", "PLC + HMI touch control panel", "Quick-change size moulds (45ml–250ml)", "Servo-driven indexing", "Auto bottom punching & rim curling", "Heat / ultrasonic side wall sealing", "Safety guards with interlock"],
          },
          hi: {
            name: "ऑटोमैटिक पेपर कप मशीन",
            tagline: "70 कप/मिनट • 45ml–250ml • PLC कंट्रोल्ड",
            short: "हाई-स्पीड ऑटोमैटिक पेपर कप मशीन — अल्ट्रासोनिक सीलिंग, PLC पैनल और क्विक-चेज़ साइज़ मोल्ड के साथ।",
            full: "मिलन की ऑटोमैटिक पेपर कप मशीन PE-कोटेड पेपर से प्रति मिनट 70 कप तक बनाती है। वॉल फॉर्मिंग, बॉटम पंचिंग, सीलिंग और रिम कर्लिंग एक ही साइकिल में होती है। 45ml से 250ml तक के मोल्ड क्विक-चेज़ हैं।",
            features: ["70 कप प्रति मिनट", "PLC + HMI टच पैनल", "क्विक-चेज़ मोल्ड", "सर्वो ड्राइव", "ऑटो बॉटम पंचिंग", "अल्ट्रासोनिक सीलिंग", "सेफ्टी गार्ड"],
          },
          or: {
            name: "ଅଟୋମାଟିକ୍ ପେପର କପ୍ ମେସିନ୍",
            tagline: "70 କପ୍/ମିନିଟ୍ • 45ml–250ml • PLC ନିୟନ୍ତ୍ରିତ",
            short: "ଉଚ୍ଚ ଗତିର ଅଟୋମାଟିକ୍ ପେପର କପ୍ ମେସିନ୍ — ଅଲଟ୍ରାସୋନିକ୍ ସିଲିଂ, PLC ପ୍ୟାନେଲ୍ ଓ କ୍ୱିକ୍-ଚେଞ୍ଜ ମୋଲ୍ଡ ସହିତ।",
            full: "ମିଲାନର ଅଟୋମାଟିକ୍ ପେପର କପ୍ ମେସିନ୍ PE-କୋଟେଡ୍ କାଗଜରୁ ମିନିଟ୍ ପ୍ରତି 70 କପ୍ ପର୍ଯ୍ୟନ୍ତ ତିଆରି କରେ। ୱାଲ୍ ଫର୍ମିଂ, ବଟମ୍ ପଞ୍ଚିଂ, ସିଲିଂ ଓ ରିମ୍ କର୍ଲିଂ ଗୋଟିଏ ସାଇକେଲ୍‌ରେ ହୁଏ। 45ml ରୁ 250ml ମୋଲ୍ଡ କ୍ୱିକ୍-ଚେଞ୍ଜ।",
            features: ["ମିନିଟ୍ ପ୍ରତି 70 କପ୍", "PLC + HMI ଟଚ୍ ପ୍ୟାନେଲ୍", "କ୍ୱିକ୍-ଚେଞ୍ଜ ମୋଲ୍ଡ", "ସର୍ଭୋ ଡ୍ରାଇଭ୍", "ଅଟୋ ବଟମ୍ ପଞ୍ଚିଂ", "ଅଲଟ୍ରାସୋନିକ୍ ସିଲିଂ", "ସେଫ୍ଟି ଗାର୍ଡ"],
          },
        } as any,
        media: [
          { type: "image", url: cupImg, caption: "Full cup forming line" },
          { type: "image", url: "/images/gallery-factory.jpg", caption: "Assembly at Khalikot works" },
          { type: "video", url: "https://www.youtube.com/watch?v=9t7Y1oYd0Qg", caption: "Running video" },
        ] as any,
        models: [
          { id: "m1", name: "ME-PC50 (50 cups/min)", code: "ME-PC50", capacity: "45–150 ml", pph: 3000, price: 680000, active: true },
          { id: "m2", name: "ME-PC70 (70 cups/min)", code: "ME-PC70", capacity: "45–250 ml", pph: 4200, price: 780000, active: true },
          { id: "m3", name: "ME-PC90 High Speed", code: "ME-PC90", capacity: "50–300 ml", pph: 5400, price: 990000, active: true },
        ] as any,
        colors: colourSet(cupImg) as any,
        specs: [
          { group: "General", label: "Machine Type", value: "Automatic Cup Forming" },
          { group: "Output", label: "Speed", value: "50 – 90 cups / minute" },
          { group: "Output", label: "Cup Size", value: "45 ml to 250 ml" },
          { group: "Technical", label: "Power", value: "7.5 kW, 3-Phase 415V" },
          { group: "Technical", label: "Air", value: "6 CFM compressor required" },
          { group: "Technical", label: "Paper", value: "PE Coated 150–350 GSM" },
          { group: "Build", label: "Floor Space", value: "600 sq.ft." },
          { group: "Build", label: "Approx Weight", value: "2200 kg" },
        ] as any,
      },
      {
        slug: "automatic-agarbatti-making-machine",
        name: "Automatic Agarbatti Making Machine",
        category: "Agarbatti Machine",
        coverImage: agarbattiImg,
        mrp: 145000, companyPrice: 105000, offerPrice: 94500, discount: 27,
        capacity: "8 inch – 14 inch sticks",
        productionPerHour: 12000,
        power: "1.1 kW (1.5 HP)",
        warranty: "1 Year Comprehensive",
        featured: true, active: true, sortOrder: 3, views: 512,
        t: {
          en: {
            name: "Automatic Agarbatti Making Machine",
            tagline: "200+ sticks/minute • bamboo & round/flat/square",
            short: "Fully automatic agarbatti machine with auto stick feeding, adjustable thickness and a 200 kg/day output — ideal for home and small units.",
            full: "The Milan Automatic Agarbatti Making Machine produces 200+ sticks per minute with consistent masala coating and zero manual feeding. The hopper auto-feeds bamboo sticks, the roller unit extrudes the dough, and the output tray collects finished agarbatti. Thickness, length and speed are all adjustable from the control panel.\n\nIt works with round, square, flat and bamboo-less sticks and handles both wet masala and dry-dust coating. Very low power (1.1 kW single phase) makes it perfect for household businesses, self-help groups and small factories. Free training, one year warranty and lifetime spare part support included.",
            features: ["200+ sticks per minute (~180 kg/day)", "Automatic bamboo stick feeder", "Adjustable masala thickness", "Round / square / flat / bamboo-less", "Single phase 1.1 kW motor", "Stainless steel contact parts", "Ideal for SHGs & home units"],
          },
          hi: {
            name: "ऑटोमैटिक अगरबत्ती बनाने की मशीन",
            tagline: "200+ स्टिक/मिनट • बांस व राउंड/फ्लैट",
            short: "पूर्ण ऑटोमैटिक अगरबत्ती मशीन — ऑटो स्टिक फीडिंग, एडजस्टेबल मोटाई और 200 किलो/दिन उत्पादन।",
            full: "मिलन ऑटोमैटिक अगरबत्ती मशीन प्रति मिनट 200+ स्टिक बनाती है। होपर बांस की स्टिक ऑटो फीड करता है और रोलर यूनिट मसला लगाता है। राउंड, स्क्वेयर, फ्लैट और बिना बांस की स्टिक भी बनती है। कम बिजली (1.1 kW) की वजह से घर और स्वयं सहायता समूह के लिए बेहतरीन।",
            features: ["200+ स्टिक प्रति मिनट", "ऑटो बांस स्टिक फीडर", "एडजस्टेबल मोटाई", "राउंड/स्क्वेयर/फ्लैट", "1.1 kW सिंगल फेज", "स्टेनलेस स्टील पार्ट्स", "SHG व घर के लिए बेस्ट"],
          },
          or: {
            name: "ଅଟୋମାଟିକ୍ ଅଗରବତ୍ତି ମେସିନ୍",
            tagline: "200+ ଷ୍ଟିକ୍/ମିନିଟ୍ • ବାଉଁଶ ଓ ରାଉଣ୍ଡ/ଫ୍ଲାଟ୍",
            short: "ସମ୍ପୂର୍ଣ୍ଣ ଅଟୋମାଟିକ୍ ଅଗରବତ୍ତି ମେସିନ୍ — ଅଟୋ ଷ୍ଟିକ୍ ଫିଡିଂ, ଆଡଜଷ୍ଟେବଲ୍ ମୋଟେଇ ଓ 200 କେଜି/ଦିନ ଉତ୍ପାଦନ।",
            full: "ମିଲାନ ଅଟୋମାଟିକ୍ ଅଗରବତ୍ତି ମେସିନ୍ ମିନିଟ୍ ପ୍ରତି 200+ ଷ୍ଟିକ୍ ତିଆରି କରେ। ହପର୍ ବାଉଁଶ ଷ୍ଟିକ୍ ଅଟୋ ଫିଡ୍ କରେ ଓ ରୋଲର ୟୁନିଟ୍ ମସଲା ଲଗାଏ। ରାଉଣ୍ଡ, ସ୍କୋୟାର, ଫ୍ଲାଟ୍ ଓ ବିନା ବାଉଁଶ ଷ୍ଟିକ୍ ମଧ୍ୟ ହୁଏ। କମ୍ ବିଦ୍ୟୁତ୍ (1.1 kW) ଯୋଗୁଁ ଘର ଓ ଶକ୍ତି ସଂଘ ପାଇଁ ଉପଯୁକ୍ତ।",
            features: ["ମିନିଟ୍ ପ୍ରତି 200+ ଷ୍ଟିକ୍", "ଅଟୋ ବାଉଁଶ ଫିଡର୍", "ଆଡଜଷ୍ଟେବଲ୍ ମୋଟେଇ", "ରାଉଣ୍ଡ/ସ୍କୋୟାର/ଫ୍ଲାଟ୍", "1.1 kW ସିଙ୍ଗଲ୍ ଫେଜ୍", "ଷ୍ଟେନଲେସ ଷ୍ଟିଲ୍ ପାର୍ଟସ", "SHG ପାଇଁ ଉପଯୁକ୍ତ"],
          },
        } as any,
        media: [
          { type: "image", url: agarbattiImg, caption: "Machine with stick feeder" },
          { type: "image", url: "/images/raw-paper.jpg", caption: "Raw material supply" },
          { type: "video", url: "https://www.youtube.com/watch?v=Agarbatti-machine", caption: "Production video" },
        ] as any,
        models: [
          { id: "m1", name: "ME-AG1 Single Lane", code: "ME-AG1", capacity: "8\"–10\"", pph: 9000, price: 94500, active: true },
          { id: "m2", name: "ME-AG2 Double Lane", code: "ME-AG2", capacity: "8\"–14\"", pph: 15000, price: 132000, active: true },
        ] as any,
        colors: colourSet(agarbattiImg) as any,
        specs: [
          { group: "General", label: "Machine Type", value: "Fully Automatic" },
          { group: "Output", label: "Speed", value: "200 – 250 sticks / minute" },
          { group: "Output", label: "Daily Output", value: "150 – 200 kg" },
          { group: "Technical", label: "Power", value: "1.1 kW, Single Phase" },
          { group: "Technical", label: "Stick Length", value: "8 inch to 14 inch" },
          { group: "Build", label: "Contact Parts", value: "SS 304" },
          { group: "Build", label: "Approx Weight", value: "180 kg" },
        ] as any,
      },
      {
        slug: "double-die-hydraulic-paper-plate-machine",
        name: "Double Die Hydraulic Paper Plate Machine",
        category: "Paper Plate Machine",
        coverImage: doubleImg,
        mrp: 210000, companyPrice: 165000, offerPrice: 149000, discount: 21,
        capacity: "5 inch – 14 inch plates",
        productionPerHour: 6500,
        power: "3.7 kW (5 HP)",
        warranty: "1 Year Comprehensive",
        featured: true, active: true, sortOrder: 4, views: 289,
        t: {
          en: {
            name: "Double Die Hydraulic Paper Plate Machine",
            tagline: "Two dies • 6500 plates/hour • maximum profit per sq.ft.",
            short: "Twin-station hydraulic paper plate machine that doubles output with the same operator — the fastest payback machine in our range.",
            full: "The Double Die Hydraulic Paper Plate Machine runs two independent die stations from a single 100-tonne hydraulic power pack. One operator can feed both stations, giving you nearly double the output of a single-die machine at a fraction of the extra cost.\n\nIt supports 5\"–14\" plate dies, laminated and non-laminated paper up to 180 GSM, and comes with an auto plate counter, overload relief valve and interlocked safety guards. Ideal for manufacturers supplying caterers, temples, marriage halls and wholesale markets.",
            features: ["Two independent die stations", "100-tonne hydraulic power pack", "6000 – 7000 plates / hour", "Digital plate counter", "Auto overload relief valve", "Interlocked safety guards", "Die set for 2 sizes included"],
          },
          hi: {
            name: "डबल डाई हाइड्रोलिक पेपर प्लेट मशीन",
            tagline: "दो डाई • 6500 प्लेट/घंटा • सबसे तेज़ पेबैक",
            short: "ट्विन-स्टेशन हाइड्रोलिक पेपर प्लेट मशीन — एक ही ऑपरेटर में डबल आउटपुट।",
            full: "डबल डाई मशीन एक ही 100-टन हाइड्रोलिक पावर पैक से दो स्वतंत्र डाई स्टेशन चलाती है। एक ऑपरेटर दोनों स्टेशन फीड कर सकता है, जिससे सिंगल डाई मशीन से लगभग दोगुना उत्पादन मिलता है। 5\"–14\" तक के डाई, 180 GSM तक कागज़, डिजिटल काउंटर और सेफ्टी गार्ड शामिल हैं।",
            features: ["दो स्वतंत्र डाई स्टेशन", "100-टन हाइड्रोलिक पैक", "6000–7000 प्लेट/घंटा", "डिजिटल काउंटर", "ओवरलोड रिलीफ वाल्व", "सेफ्टी गार्ड", "2 साइज़ डाई सेट फ्री"],
          },
          or: {
            name: "ଡବଲ୍ ଡାଇ ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍",
            tagline: "ଦୁଇ ଡାଇ • 6500 ପ୍ଲେଟ୍/ଘଣ୍ଟା • ଦ୍ରୁତତମ ଫେରସ୍ତ",
            short: "ଟୁଇନ୍-ଷ୍ଟେସନ୍ ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ — ଜଣେ ଅପରେଟରଙ୍କରେ ଦୁଇଗୁଣ ଉତ୍ପାଦନ।",
            full: "ଡବଲ୍ ଡାଇ ମେସିନ୍ ଗୋଟିଏ 100-ଟନ୍ ହାଇଡ୍ରୋଲିକ୍ ପାୱାର ପ୍ୟାକ୍‌ରୁ ଦୁଇଟି ସ୍ୱାଧୀନ ଡାଇ ଷ୍ଟେସନ୍ ଚଲାଏ। ଜଣେ ଅପରେଟର ଦୁଇଟିଯାକ ଷ୍ଟେସନ୍ ଫିଡ୍ କରିପାରନ୍ତି, ଫଳରେ ସିଙ୍ଗଲ୍ ଡାଇ ତୁଳନାରେ ପ୍ରାୟ ଦୁଇଗୁଣ ଉତ୍ପାଦନ ମିଳେ। 5\"–14\" ଡାଇ, 180 GSM କାଗଜ, ଡିଜିଟାଲ୍ କାଉଣ୍ଟର ଓ ସେଫ୍ଟି ଗାର୍ଡ ଅନ୍ତର୍ଭୁକ୍ତ।",
            features: ["ଦୁଇ ସ୍ୱାଧୀନ ଡାଇ ଷ୍ଟେସନ୍", "100-ଟନ୍ ହାଇଡ୍ରୋଲିକ୍ ପ୍ୟାକ୍", "6000–7000 ପ୍ଲେଟ୍/ଘଣ୍ଟା", "ଡିଜିଟାଲ୍ କାଉଣ୍ଟର", "ଓଭରଲୋଡ୍ ରିଲିଫ୍ ଭାଲଭ୍", "ସେଫ୍ଟି ଗାର୍ଡ", "2 ସାଇଜ ଡାଇ ମାଗଣା"],
          },
        } as any,
        media: [
          { type: "image", url: doubleImg, caption: "Twin die station" },
          { type: "image", url: plateImg, caption: "Control panel" },
          { type: "video", url: "https://www.youtube.com/watch?v=double-die-plate", caption: "Double die running" },
        ] as any,
        models: [
          { id: "m1", name: "ME-DD2 Standard", code: "ME-DD2", capacity: "5\"–10\"", pph: 5800, price: 149000, active: true },
          { id: "m2", name: "ME-DD3 Pro", code: "ME-DD3", capacity: "6\"–14\"", pph: 6500, price: 165000, active: true },
          { id: "m3", name: "ME-DD4 Auto Collector", code: "ME-DD4", capacity: "6\"–14\"", pph: 7200, price: 198000, active: true },
        ] as any,
        colors: colourSet(doubleImg) as any,
        specs: [
          { group: "General", label: "Machine Type", value: "Hydraulic Double Die" },
          { group: "Output", label: "Production", value: "6000 – 7200 plates / hour" },
          { group: "Output", label: "Plate Size", value: "5 inch to 14 inch" },
          { group: "Technical", label: "Pressing Force", value: "100 Tonne" },
          { group: "Technical", label: "Power", value: "3.7 kW (5 HP)" },
          { group: "Technical", label: "Paper GSM", value: "80 – 180 GSM" },
          { group: "Build", label: "Approx Weight", value: "1150 kg" },
        ] as any,
      },
    ]);

    /* ---------------------------- raw materials --------------------------- */
    await db.insert(rawMaterials).values([
      {
        slug: "paper-plate-raw-paper", name: "Paper Plate Raw Paper", image: "/images/raw-paper.jpg",
        price: 72, mrp: 88, unit: "kg", stock: 4200, lowStockAt: 500, grade: "Virgin", gsm: "80–150 GSM", featured: true, sortOrder: 1, views: 180,
        t: {
          en: { name: "Paper Plate Raw Paper", short: "Virgin 80–150 GSM paper specially selected for plate machines.", full: "Food-grade virgin paper in sheet and roll form, moisture-controlled so plates come out clean without cracking. Direct from mill to your factory.", specs: [["GSM", "80 / 100 / 120 / 150"], ["Size", "Cut to die size"], ["Moisture", "6–8%"], ["Packing", "250 kg bale"]] },
          hi: { name: "पेपर प्लेट कच्चा कागज़", short: "प्लेट मशीन के लिए वर्जिन 80–150 GSM कागज़।", full: "फूड-ग्रेड वर्जिन कागज़, मॉइश्चर कंट्रोल्ड ताकि प्लेट बिना फटे बने। सीधे मिल से आपकी फैक्ट्री तक।", specs: [["GSM", "80 / 100 / 120 / 150"], ["साइज़", "डाई अनुसार कटा"], ["नमी", "6–8%"], ["पैकिंग", "250 किलो bale"]] },
          or: { name: "ପେପର ପ୍ଲେଟ୍ କଞ୍ଚା କାଗଜ", short: "ପ୍ଲେଟ୍ ମେସିନ୍ ପାଇଁ ଭର୍ଜିନ୍ 80–150 GSM କାଗଜ।", full: "ଫୁଡ୍-ଗ୍ରେଡ୍ ଭର୍ଜିନ୍ କାଗଜ, ମଏଶ୍ଚର୍ ନିୟନ୍ତ୍ରିତ ଯାହାଦ୍ୱାରା ପ୍ଲେଟ୍ ନ ଫାଟି ତିଆରି ହୁଏ। ସିଧା ମିଲ୍‌ରୁ ଆପଣଙ୍କ ଫ୍ୟାକ୍ଟରୀକୁ।", specs: [["GSM", "80 / 100 / 120 / 150"], ["ସାଇଜ୍", "ଡାଇ ଅନୁସାରେ କଟା"], ["ଆର୍ଦ୍ରତା", "6–8%"], ["ପ୍ୟାକିଂ", "250 କେଜି ବେଲ୍"]] },
        } as any,
        specs: [{ label: "GSM", value: "80 / 100 / 120 / 150" }, { label: "Moisture", value: "6–8%" }] as any,
      },
      {
        slug: "pe-coated-paper-roll", name: "PE Coated Paper Roll", image: "/images/raw-paper.jpg",
        price: 96, mrp: 118, unit: "kg", stock: 2600, lowStockAt: 400, grade: "PE Coated", gsm: "150–350 GSM", featured: true, sortOrder: 2, views: 143,
        t: {
          en: { name: "PE Coated Paper Roll", short: "Single & double PE coated rolls for paper cup machines.", full: "Mill-fresh PE coated paper rolls in 150–350 GSM, slit to your cup machine width. Bottom reels and wall reels both available.", specs: [["Coating", "Single / Double PE"], ["GSM", "150–350"], ["Width", "As per cup size"]] },
          hi: { name: "PE कोटेड पेपर रोल", short: "पेपर कप मशीन के लिए सिंगल व डबल PE कोटेड रोल।", full: "मिल-फ्रेश PE कोटेड पेपर रोल 150–350 GSM में, आपकी कप मशीन की चौड़ाई के अनुसार स्लिट।", specs: [["कोटिंग", "सिंगल / डबल PE"], ["GSM", "150–350"]] },
          or: { name: "PE କୋଟେଡ୍ ପେପର ରୋଲ୍", short: "ପେପର କପ୍ ମେସିନ୍ ପାଇଁ ସିଙ୍ଗଲ୍ ଓ ଡବଲ୍ PE କୋଟେଡ୍ ରୋଲ୍।", full: "ମିଲ୍-ଫ୍ରେସ୍ PE କୋଟେଡ୍ ପେପର ରୋଲ୍ 150–350 GSM ରେ, ଆପଣଙ୍କ କପ୍ ମେସିନ୍ ଓସାର ଅନୁସାରେ ସ୍ଲିଟ୍।", specs: [["କୋଟିଂ", "ସିଙ୍ଗଲ୍ / ଡବଲ୍ PE"], ["GSM", "150–350"]] },
        } as any,
        specs: [{ label: "Coating", value: "Single / Double PE" }, { label: "GSM", value: "150 – 350" }] as any,
      },
      {
        slug: "paper-sheet-cut-size", name: "Paper Sheet (Cut to Size)", image: "/images/raw-paper.jpg",
        price: 78, mrp: 92, unit: "kg", stock: 1800, lowStockAt: 300, grade: "Virgin", gsm: "100–150 GSM", sortOrder: 3, views: 96, active: true,
        t: {
          en: { name: "Paper Sheet (Cut to Size)", short: "Pre-cut sheets matched exactly to your die size — zero wastage.", full: "We cut sheets to your machine's die size so you save labour and wastage. Available for all plate machine models we sell.", specs: [["Cut", "Die-matched"], ["Bundle", "1000 sheets"]] },
          hi: { name: "पेपर शीट (कटे साइज़)", short: "आपकी डाई साइज़ के अनुसार पहले से कटी शीट — शून्य बर्बादी।", full: "हम शीट को आपकी मशीन की डाई साइज़ में काटकर देते हैं जिससे मेहनत और बर्बादी बचती है।", specs: [["कटाई", "डाई अनुसार"], ["बंडल", "1000 शीट"]] },
          or: { name: "ପେପର ସିଟ୍ (କଟା ସାଇଜ୍)", short: "ଆପଣଙ୍କ ଡାଇ ସାଇଜ୍ ଅନୁସାରେ କଟା ସିଟ୍ — ଶୂନ ନଷ୍ଟ।", full: "ଆମେ ସିଟ୍କୋ ଆପଣଙ୍କ ମେସିନ୍ ଡାଇ ସାଇଜ୍ ଅନୁସାରେ କାଟି ଦେଉ, ଫଳରେ ପରିଶ୍ରମ ଓ ନଷ୍ଟ କମେ।", specs: [["କଟା", "ଡାଇ ଅନୁସାରେ"], ["ବଣ୍ଡଲ", "1000 ସିଟ୍"]] },
        } as any,
        specs: [{ label: "Cut", value: "Die matched" }] as any,
      },
      {
        slug: "agarbatti-jiggit-powder", name: "Agarbatti Jiggit Powder", image: "/images/raw-paper.jpg",
        price: 42, mrp: 55, unit: "kg", stock: 900, lowStockAt: 200, sortOrder: 4, views: 74, active: true,
        t: {
          en: { name: "Agarbatti Jiggit Powder", short: "Premium binder powder for smooth, crack-free agarbatti.", full: "Clean, finely milled jiggit (makko) powder with uniform binding strength — gives a smooth finish and even burn.", specs: [["Mesh", "80–100"], ["Packing", "25 / 50 kg bag"]] },
          hi: { name: "अगरबत्ती जिगिट पाउडर", short: "चिकनी, बिना दरार वाली अगरबत्ती के लिए प्रीमियम बाइंडर।", full: "साफ़ और बारीका पिसा जिगिट (मक्को) पाउडर — समान बॉन्डिंग और अच्छी बर्निंग।", specs: [["मेश", "80–100"], ["पैकिंग", "25 / 50 किलो"]] },
          or: { name: "ଅଗରବତ୍ତି ଜିଗିଟ୍ ପାଉଡର", short: "ମସୃଣ, ବିନା ଫାଟ ଅଗରବତ୍ତି ପାଇଁ ପ୍ରିମିୟମ୍ ବାଇଣ୍ଡର।", full: "ସଫା ଓ ମହିଁ ପିଷା ଜିଗିଟ୍ (ମକ୍କୋ) ପାଉଡର — ସମାନ ବନ୍ଧନ ଓ ଭଲ ଦହନ।", specs: [["ମେସ୍", "80–100"], ["ପ୍ୟାକିଂ", "25 / 50 କେଜି"]] },
        } as any,
        specs: [{ label: "Mesh", value: "80 – 100" }] as any,
      },
      {
        slug: "bamboo-agarbatti-sticks", name: "Bamboo Agarbatti Sticks", image: "/images/raw-paper.jpg",
        price: 68, mrp: 82, unit: "kg", stock: 60, lowStockAt: 100, sortOrder: 5, views: 51, active: true,
        t: {
          en: { name: "Bamboo Agarbatti Sticks", short: "Straight, polished bamboo sticks 8\"–14\" for auto machines.", full: "Machine-grade polished bamboo sticks, uniform diameter, low breakage — perfect for automatic feeders.", specs: [["Length", "8\" / 10\" / 12\" / 14\""], ["Finish", "Polished round / square"]] },
          hi: { name: "बांस अगरबत्ती स्टिक", short: "ऑटो मशीन के लिए सीधी, पॉलिश बांस स्टिक 8\"–14\"।", full: "मशीन-ग्रेड पॉलिश बांस स्टिक, एक समान मोटाई और कम टूटन।", specs: [["लंबाई", "8 / 10 / 12 / 14 इंच"]] },
          or: { name: "ବାଉଁଶ ଅଗରବତ୍ତି ଷ୍ଟିକ୍", short: "ଅଟୋ ମେସିନ୍ ପାଇଁ ସିଧା, ପଲିସ୍ ବାଉଁଶ ଷ୍ଟିକ୍ 8\"–14\"।", full: "ମେସିନ୍-ଗ୍ରେଡ୍ ପଲିସ୍ ବାଉଁଶ ଷ୍ଟିକ୍, ସମାନ ମୋଟେଇ ଓ କମ୍ ଭଙ୍ଗା।", specs: [["ଲମ୍ବ", "8 / 10 / 12 / 14 ଇଞ୍ଚ"]] },
        } as any,
        specs: [{ label: "Length", value: '8" – 14"' }] as any,
      },
      {
        slug: "corrugated-packing-box", name: "Corrugated Packing Box", image: "/images/raw-paper.jpg",
        price: 14, mrp: 19, unit: "piece", stock: 3400, lowStockAt: 500, sortOrder: 6, views: 38, active: true,
        t: {
          en: { name: "Corrugated Packing Box", short: "Printed & plain boxes for plates, cups and agarbatti.", full: "3-ply and 5-ply corrugated boxes in all standard sizes, with optional brand printing.", specs: [["Ply", "3 / 5"], ["Printing", "1–4 colour optional"]] },
          hi: { name: "कॉरुगेटेड पैकिंग बॉक्स", short: "प्लेट, कप व अगरबत्ती के लिए प्रिंटेड व प्लेन बॉक्स।", full: "3-प्लाई और 5-प्लाई बॉक्स सभी साइज़ में, ब्रांड प्रिंटिंग विकल्प के साथ।", specs: [["प्लाई", "3 / 5"]] },
          or: { name: "କୋରୁଗେଟେଡ୍ ପ୍ୟାକିଂ ବକ୍ସ", short: "ପ୍ଲେଟ୍, କପ୍ ଓ ଅଗରବତ୍ତି ପାଇଁ ପ୍ରିଣ୍ଟେଡ୍ ଓ ପ୍ଲେନ୍ ବକ୍ସ।", full: "3-ପ୍ଲାଇ ଓ 5-ପ୍ଲାଇ ବକ୍ସ ସମସ୍ତ ସାଇଜ୍‌ରେ, ବ୍ରାଣ୍ଡ ପ୍ରିଣ୍ଟିଂ ସହ।", specs: [["ପ୍ଲାଇ", "3 / 5"]] },
        } as any,
        specs: [{ label: "Ply", value: "3 / 5 ply" }] as any,
      },
    ]);

    /* ----------------------------- spare parts ---------------------------- */
    const spares = [
      { name: "Hydraulic Cylinder Seal Kit", partCode: "ME-HCS-060", machine: "Hydraulic Paper Plate Making Machine", price: 1850, mrp: 2400, stock: 42, availability: "in_stock", desc: "Complete oil seal, O-ring & wiper kit for 60-tonne cylinder." },
      { name: 'Paper Plate Die 7"', partCode: "ME-DIE-07", machine: "Hydraulic Paper Plate Making Machine", price: 4200, mrp: 5500, stock: 18, availability: "in_stock", desc: "EN-8 hardened 7 inch die set (punch + cutter)." },
      { name: 'Paper Plate Die 10"', partCode: "ME-DIE-10", machine: "Double Die Hydraulic Paper Plate Machine", price: 5600, mrp: 7200, stock: 9, availability: "low_stock", desc: "EN-8 hardened 10 inch die set for double die machines." },
      { name: "Paper Cup Machine Heater Band", partCode: "ME-HB-220", machine: "Automatic Paper Cup Machine", price: 1250, mrp: 1650, stock: 60, availability: "in_stock", desc: "220V cast aluminium heater band for side-wall sealing." },
      { name: "Servo Drive Belt", partCode: "ME-BLT-8M", machine: "Automatic Paper Cup Machine", price: 640, mrp: 850, stock: 120, availability: "in_stock", desc: "HTD 8M timing belt, oil and heat resistant." },
      { name: "Agarbatti Nozzle & Roller Set", partCode: "ME-AGN-01", machine: "Automatic Agarbatti Making Machine", price: 2100, mrp: 2800, stock: 25, availability: "in_stock", desc: "SS nozzle, roller and bush set for uniform masala coating." },
      { name: "Oil Pump Assembly", partCode: "ME-PMP-05", machine: "Double Die Hydraulic Paper Plate Machine", price: 6800, mrp: 8900, stock: 0, availability: "on_order", desc: "Hydraulic gear pump assembly with coupling (5 HP)." },
      { name: "Bearing 6204 ZZ", partCode: "ME-BRG-6204", machine: "All Machines", price: 180, mrp: 260, stock: 4, availability: "low_stock", desc: "Genuine deep groove ball bearing for shafts." },
      { name: "Emergency Stop Switch", partCode: "ME-ESW-22", machine: "All Machines", price: 320, mrp: 450, stock: 80, availability: "in_stock", desc: "22mm mushroom head emergency stop, NC contact." },
      { name: "Hydraulic Oil ISO VG-68", partCode: "ME-OIL-20L", machine: "All Machines", price: 3450, mrp: 4200, stock: 30, availability: "in_stock", desc: "20 litre anti-wear hydraulic oil, machine grade." },
    ];
    await db.insert(spareParts).values(
      spares.map((s, i) => ({
        name: s.name,
        partCode: s.partCode,
        machineName: s.machine,
        image: "/images/spare-parts.jpg",
        price: s.price, mrp: s.mrp, stock: s.stock, availability: s.availability,
        material: "Industrial Grade", warranty: "6 Months",
        active: true, sortOrder: i + 1, views: 20 + i * 7,
        t: {
          en: { name: s.name, short: s.desc, full: s.desc + " Genuine Milan Enterprises part — stocked in Khalikot and dispatched same day across India.", specs: [["Compatible", s.machine], ["Condition", "Brand New"], ["Dispatch", "Same day"]] },
          hi: { name: s.name, short: s.desc, full: s.desc + " असली मिलन एंटरप्राइजेज पार्ट — खलिकोट में स्टॉक, पूरे भारत में उसी दिन डिस्पैच।", specs: [["उपयुक्त", s.machine], ["स्थिति", "बिल्कुल नया"]] },
          or: { name: s.name, short: s.desc, full: s.desc + " ଅସଲ ମିଲାନ ଏଣ୍ଟରପ୍ରାଇଜେସ୍ ପାର୍ଟସ — ଖଲିକୋଟରେ ଷ୍ଟକ୍, ସାରା ଭାରତରେ ସେହି ଦିନ ପଠାଯାଏ।", specs: [["ଉପଯୁକ୍ତ", s.machine], ["ସ୍ଥିତି", "ନୂଆ"]] },
        } as any,
      }))
    );

    /* ------------------------------- festivals ---------------------------- */
    const festDefs = [
      { key: "new_year", name: "New Year", dates: ["2026-01-01", "2027-01-01", "2028-01-01"], a: "#ff7d36", b: "#e51d74", or: "ନୂଆ ବର୍ଷ", hi: "नव वर्ष", off: { en: "New Year Startup Combo — up to 25% off on your first machine", hi: "नव वर्ष स्टार्टअप कॉम्बो — पहली मशीन पर 25% तक छूट", or: "ନୂଆ ବର୍ଷ ଷ୍ଟାର୍ଟଅପ୍ କମ୍ବୋ — ପ୍ରଥମ ମେସିନ୍‌ରେ 25% ପର୍ଯ୍ୟନ୍ତ ଛାଡ଼" } },
      { key: "shivaratri", name: "Maha Shivaratri", dates: ["2026-02-15", "2027-02-04", "2028-02-23"], a: "#7922fc", b: "#1e3a8a", or: "ମହା ଶିବରାତ୍ରି", hi: "महा शिवरात्रि", off: { en: "Shivaratri special on Agarbatti Machines — free raw material kit", hi: "शिवरात्रि विशेष — अगरबत्ती मशीन पर फ्री कच्चा माल किट", or: "ଶିବରାତ୍ରି ବିଶେଷ — ଅଗରବତ୍ତି ମେସିନ୍‌ରେ ମାଗଣା କଞ୍ଚାମାଲ କିଟ୍" } },
      { key: "holi", name: "Holi", dates: ["2026-03-03", "2027-03-22", "2028-03-11"], a: "#e51d74", b: "#ff9d00", or: "ହୋଲି", hi: "होली", off: { en: "Colourful Holi deals — flat 15% off on all spare parts", hi: "रंगीन होली ऑफर — सभी स्पेयर पार्ट्स पर 15% छूट", or: "ରଙ୍ଗୀନ ହୋଲି ଅଫର — ସମସ୍ତ ସ୍ପେୟାର ପାର୍ଟସରେ 15% ଛାଡ଼" } },
      { key: "raja", name: "Raja Festival", dates: ["2026-06-14", "2027-06-14", "2028-06-13"], a: "#ff5a10", b: "#059669", or: "ରଜ ପର୍ବ", hi: "रज पर्व", off: { en: "Raja Odisha Special — free installation on paper plate machines", hi: "रज ओडिशा विशेष — पेपर प्लेट मशीन पर मुफ्त इंस्टॉलेशन", or: "ରଜ ଓଡ଼ିଶା ସ୍ପେଶାଲ୍ — ପେପର ପ୍ଲେଟ୍ ମେସିନ୍‌ରେ ମାଗଣା ସ୍ଥାପନ" } },
      { key: "rathayatra", name: "Rath Yatra", dates: ["2026-07-15", "2027-07-05", "2028-07-23"], a: "#f59e0b", b: "#dc2626", or: "ରଥଯାତ୍ରା", hi: "रथ यात्रा", off: { en: "Jagannath Rath Yatra Offer — book a machine at ₹11,000 only", hi: "जगन्नाथ रथ यात्रा ऑफर — सिर्फ ₹11,000 में मशीन बुक करें", or: "ଜଗନ୍ନାଥ ରଥଯାତ୍ରା ଅଫର — ମାତ୍ର ₹11,000 ରେ ମେସିନ୍ ବୁକ୍ କରନ୍ତୁ" } },
      { key: "independence_day", name: "Independence Day", dates: ["2026-08-15", "2027-08-15", "2028-08-15"], a: "#0f766e", b: "#ff5a10", or: "ସ୍ୱାଧୀନତା ଦିବସ", hi: "स्वतंत्रता दिवस", off: { en: "Freedom Offer — 7.5% extra discount for first-time buyers", hi: "स्वतंत्रता ऑफर — पहली बार खरीदने वालों को 7.5% अतिरिक्त छूट", or: "ସ୍ୱାଧୀନତା ଅଫର — ପ୍ରଥମ ଥର କିଣୁଥିବା ଗ୍ରାହକଙ୍କୁ 7.5% ଅତିରିକ୍ତ ଛାଡ଼" } },
      { key: "ganesh_chaturthi", name: "Ganesh Chaturthi", dates: ["2026-09-14", "2027-09-04", "2028-09-22"], a: "#dc2626", b: "#f59e0b", or: "ଗଣେଶ ଚତୁର୍ଥୀ", hi: "गणेश चतुर्थी", off: { en: "Ganesh Chaturthi plate & cup machine mega savings", hi: "गणेश चतुर्थी प्लेट और कप मशीन पर बड़ी बचत", or: "ଗଣେଶ ଚତୁର୍ଥୀ ପ୍ଲେଟ୍ ଓ କପ୍ ମେସିନ୍‌ରେ ବଡ଼ ସଞ୍ଚୟ" } },
      { key: "nuakhai", name: "Nuakhai", dates: ["2026-09-16", "2027-09-05", "2028-09-23"], a: "#16a34a", b: "#ff7d36", or: "ନୂଆଖାଇ", hi: "नुआखाई", off: { en: "Nuakhai Odisha Offer — free die set worth ₹5,500", hi: "नुआखाई ऑफर — ₹5,500 का फ्री डाई सेट", or: "ନୂଆଖାଇ ଅଫର — ₹5,500 ମୂଲ୍ୟର ମାଗଣା ଡାଇ ସେଟ୍" } },
      { key: "dussehra", name: "Dasahara / Dussehra", dates: ["2026-10-20", "2027-10-09", "2028-10-27"], a: "#b91c1c", b: "#7922fc", or: "ଦଶହରା", hi: "दशहरा", off: { en: "Dasahara Dhamaka — up to ₹25,000 off on double die machines", hi: "दशहरा धमाका — डबल डाई मशीन पर ₹25,000 तक छूट", or: "ଦଶହରା ଧମାକା — ଡବଲ୍ ଡାଇ ମେସିନ୍‌ରେ ₹25,000 ପର୍ଯ୍ୟନ୍ତ ଛାଡ଼" } },
      { key: "durga_puja", name: "Durga Puja", dates: ["2026-10-17", "2027-10-06", "2028-10-24"], a: "#e51d74", b: "#7922fc", or: "ଦୁର୍ଗା ପୂଜା", hi: "दुर्गा पूजा", off: { en: "Durga Puja festive prices on every machine model", hi: "दुर्गा पूजा त्योहारी दाम हर मशीन मॉडल पर", or: "ଦୁର୍ଗା ପୂଜା ଉତ୍ସବ ଦାମ୍ ପ୍ରତିଟି ମେସିନ୍ ମଡେଲ୍‌ରେ" } },
      { key: "diwali", name: "Diwali", dates: ["2026-11-08", "2027-10-29", "2028-11-16"], a: "#f59e0b", b: "#7922fc", or: "ଦୀପାବଳି", hi: "दीवाली", off: { en: "Diwali Mega Offer — Lakshmi Puja special pricing + free gift kit", hi: "दीवाली मेगा ऑफर — लक्ष्मी पूजा स्पेशल प्राइस + फ्री गिफ्ट किट", or: "ଦୀପାବଳି ମେଗା ଅଫର — ଲକ୍ଷ୍ମୀ ପୂଜା ସ୍ପେଶାଲ୍ ଦାମ୍ + ମାଗଣା ଗିଫ୍ଟ କିଟ୍" } },
      { key: "christmas", name: "Christmas", dates: ["2026-12-25", "2027-12-25", "2028-12-25"], a: "#059669", b: "#dc2626", or: "ବଡ଼ଦିନ", hi: "क्रिसमस", off: { en: "Christmas Year-End Clearance on raw materials & spares", hi: "क्रिसमस ईयर-एंड क्लियरेंस — कच्चा माल और स्पेयर पर", or: "ବଡ଼ଦିନ ବର୍ଷ-ଶେଷ କ୍ଲିୟରାନ୍ସ — କଞ୍ଚାମାଲ ଓ ସ୍ପେୟାରରେ" } },
    ];
    await db.insert(festivals).values(
      festDefs.map((f, i) => ({
        key: f.key, name: f.name,
        festivalDate: nextDate(f.dates), daysBefore: 5,
        colorA: f.a, colorB: f.b,
        couponCode: f.key.toUpperCase().slice(0, 6) + "26",
        discount: 10 + (i % 4) * 5, enabled: true, sortOrder: i + 1,
        bannerUrl: "/images/hero.jpg", bgImage: "",
        t: {
          en: { name: f.name, offer: f.off.en, wish: `Happy ${f.name} from Milan Enterprises!` },
          hi: { name: f.hi, offer: f.off.hi, wish: `मिलन एंटरप्राइजेज की ओर से ${f.hi} की हार्दिक शुभकामनाएँ!` },
          or: { name: f.or, offer: f.off.or, wish: `ମିଲାନ ଏଣ୍ଟରପ୍ରାଇଜେସ୍ ତରଫରୁ ${f.or} ର ହାର୍ଦ୍ଦିକ ଶୁଭେଚ୍ଛା!` },
        } as any,
        offerText: f.off as any,
      }))
    );

    /* -------------------------------- offers ------------------------------ */
    const now = Date.now();
    const diwali = festDefs.find((f) => f.key === "diwali")!;
    await db.insert(offers).values([
      {
        slug: "diwali-mega-machine-offer", title: "Diwali Mega Machine Offer",
        machineName: "Hydraulic Paper Plate Making Machine", machineId: 1, festivalName: diwali.name, festivalId: 11,
        coverImage: plateImg, bgImage: "/images/hero.jpg",
        mrp: 135000, companyPrice: 98000, offerPrice: 84999, discount: 37,
        startDate: new Date(now - 3 * 86400000), endDate: new Date(now + 26 * 86400000),
        couponCode: "DIWALI26", active: true, sortOrder: 1, views: 210,
        t: {
          en: { title: "Diwali Mega Machine Offer", desc: "Start your own paper plate factory this festive season. Book the hydraulic plate machine at ₹84,999 with a free 7\" die set, free installation within Odisha and 500 kg starter raw paper.", included: ["Free 7\" die set", "Free installation in Odisha", "500 kg starter raw paper", "Operator training", "1 year warranty"] },
          hi: { title: "दीवाली मेगा मशीन ऑफर", desc: "इस त्योहारी सीज़न में अपनी पेपर प्लेट फैक्ट्री शुरू करें। हाइड्रोलिक प्लेट मशीन ₹84,999 में — फ्री 7\" डाई सेट, ओडिशा में फ्री इंस्टॉलेशन और 500 किलो स्टार्टर कच्चा कागज़।", included: ["फ्री 7\" डाई सेट", "ओडिशा में फ्री इंस्टॉलेशन", "500 किलो कच्चा कागज़", "ऑपरेटर ट्रेनिंग", "1 साल वारंटी"] },
          or: { title: "ଦୀପାବଳି ମେଗା ମେସିନ୍ ଅଫର", desc: "ଏହି ଉତ୍ସବ ଋତୁରେ ଆପଣଙ୍କ ନିଜର ପେପର ପ୍ଲେଟ୍ ଫ୍ୟାକ୍ଟରୀ ଆରମ୍ଭ କରନ୍ତୁ। ହାଇଡ୍ରୋଲିକ୍ ପ୍ଲେଟ୍ ମେସିନ୍ ₹84,999 ରେ — ମାଗଣା 7\" ଡାଇ ସେଟ୍, ଓଡ଼ିଶାରେ ମାଗଣା ସ୍ଥାପନ ଓ 500 କେଜି କଞ୍ଚା କାଗଜ।", included: ["ମାଗଣା 7\" ଡାଇ ସେଟ୍", "ଓଡ଼ିଶାରେ ମାଗଣା ସ୍ଥାପନ", "500 କେଜି କଞ୍ଚା କାଗଜ", "ଅପରେଟର ତାଲିମ", "1 ବର୍ଷ ୱାରେଣ୍ଟି"] },
        } as any,
        includedItems: [
          { name: 'Free 7" Die Set', photo: spareImg, qty: 1 },
          { name: "500 kg Raw Paper", photo: "/images/raw-paper.jpg", qty: 1 },
          { name: "Free Installation", photo: "/images/gallery-factory.jpg", qty: 1 },
        ] as any,
      },
      {
        slug: "startup-combo-plate-agarbatti", title: "Startup Combo — Plate + Agarbatti",
        machineName: "Combo Pack", coverImage: agarbattiImg, bgImage: "/images/gallery-factory.jpg",
        mrp: 240000, companyPrice: 203000, offerPrice: 174999, discount: 27,
        startDate: new Date(now - 10 * 86400000), endDate: new Date(now + 45 * 86400000),
        couponCode: "STARTUP174", active: true, sortOrder: 2, views: 168,
        t: {
          en: { title: "Startup Combo — Plate + Agarbatti", desc: "Two machines, one investment. Buy the hydraulic plate machine together with the automatic agarbatti machine and save ₹28,000 plus get a full raw material starter kit for both lines.", included: ["Hydraulic plate machine", "Automatic agarbatti machine", "Raw material starter kit", "Free delivery in Odisha", "Priority service for 2 years"] },
          hi: { title: "स्टार्टअप कॉम्बो — प्लेट + अगरबत्ती", desc: "दो मशीनें, एक निवेश। हाइड्रोलिक प्लेट मशीन और ऑटोमैटिक अगरबत्ती मशीन एक साथ लें और ₹28,000 बचाएं, साथ ही दोनों के लिए कच्चा माल स्टार्टर किट पाएं।", included: ["हाइड्रोलिक प्लेट मशीन", "ऑटोमैटिक अगरबत्ती मशीन", "कच्चा माल किट", "ओडिशा में फ्री डिलीवरी", "2 साल प्रायोरिटी सर्विस"] },
          or: { title: "ଷ୍ଟାର୍ଟଅପ୍ କମ୍ବୋ — ପ୍ଲେଟ୍ + ଅଗରବତ୍ତି", desc: "ଦୁଇଟି ମେସିନ୍, ଗୋଟିଏ ନିବେଶ। ହାଇଡ୍ରୋଲିକ୍ ପ୍ଲେଟ୍ ଓ ଅଟୋମାଟିକ୍ ଅଗରବତ୍ତି ମେସିନ୍ ଏକାଠି ନିଅନ୍ତୁ, ₹28,000 ସଞ୍ଚୟ କରନ୍ତୁ ଓ ଦୁଇଟିଯାକ ପାଇଁ କଞ୍ଚାମାଲ କିଟ୍ ପାଆନ୍ତୁ।", included: ["ହାଇଡ୍ରୋଲିକ୍ ପ୍ଲେଟ୍ ମେସିନ୍", "ଅଟୋମାଟିକ୍ ଅଗରବତ୍ତି ମେସିନ୍", "କଞ୍ଚାମାଲ କିଟ୍", "ଓଡ଼ିଶାରେ ମାଗଣା ଡେଲିଭରି", "2 ବର୍ଷ ପ୍ରାୟୋରିଟି ସର୍ଭିସ୍"] },
        } as any,
        includedItems: [
          { name: "Hydraulic Plate Machine", photo: plateImg, qty: 1 },
          { name: "Agarbatti Machine", photo: agarbattiImg, qty: 1 },
          { name: "Raw Material Kit", photo: "/images/raw-paper.jpg", qty: 1 },
        ] as any,
      },
      {
        slug: "monsoon-free-installation", title: "Monsoon Free Installation Offer",
        machineName: "All Machines", coverImage: "/images/gallery-factory.jpg", bgImage: "/images/hero.jpg",
        mrp: 0, companyPrice: 0, offerPrice: 0, discount: 12,
        startDate: new Date(now - 20 * 86400000), endDate: new Date(now + 60 * 86400000),
        couponCode: "MONSOON12", active: true, sortOrder: 3, views: 92,
        t: {
          en: { title: "Monsoon Free Installation Offer", desc: "For a limited period, installation, operator training and first service visit are completely free anywhere in Odisha — plus 12% off on all spare parts.", included: ["Free installation", "Free operator training", "Free first service visit", "12% off spare parts"] },
          hi: { title: "मानसून फ्री इंस्टॉलेशन ऑफर", desc: "सीमित समय के लिए ओडिशा में कहीं भी इंस्टॉलेशन, ऑपरेटर ट्रेनिंग और पहली सर्विस विज़िट पूरी तरह मुफ़्त — साथ ही सभी स्पेयर पार्ट्स पर 12% छूट।", included: ["फ्री इंस्टॉलेशन", "फ्री ट्रेनिंग", "फ्री पहली सर्विस", "स्पेयर पार्ट्स पर 12% छूट"] },
          or: { title: "ମୌସୁମି ମାଗଣା ସ୍ଥାପନ ଅଫର", desc: "ସୀମିତ ସମୟ ପାଇଁ ଓଡ଼ିଶାରେ ଯେକୌଣସି ସ୍ଥାନରେ ସ୍ଥାପନ, ତାଲିମ ଓ ପ୍ରଥମ ସର୍ଭିସ୍ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା — ସହିତ ସମସ୍ତ ସ୍ପେୟାର ପାର୍ଟସରେ 12% ଛାଡ଼।", included: ["ମାଗଣା ସ୍ଥାପନ", "ମାଗଣା ତାଲିମ", "ମାଗଣା ପ୍ରଥମ ସର୍ଭିସ୍", "ସ୍ପେୟାରରେ 12% ଛାଡ଼"] },
        } as any,
        includedItems: [{ name: "Free Installation", photo: "/images/gallery-factory.jpg", qty: 1 }] as any,
      },
      {
        slug: "expired-cup-machine-deal", title: "Paper Cup Machine Year-End Deal",
        machineName: "Automatic Paper Cup Machine", coverImage: cupImg,
        mrp: 950000, companyPrice: 780000, offerPrice: 699000, discount: 26,
        startDate: new Date(now - 120 * 86400000), endDate: new Date(now - 30 * 86400000),
        couponCode: "YE699", active: true, sortOrder: 4, views: 64,
        t: {
          en: { title: "Paper Cup Machine Year-End Deal", desc: "Our last year-end deal on the automatic paper cup machine — now closed. Watch this space for the next one.", included: ["Free mould set", "Free raw paper trial lot"] },
          hi: { title: "पेपर कप मशीन ईयर-एंड डील", desc: "ऑटोमैटिक पेपर कप मशीन पर पिछली ईयर-एंड डील — अब बंद। अगली डील के लिए जुड़े रहें।", included: ["फ्री मोल्ड सेट", "फ्री कच्चा कागज़ लॉट"] },
          or: { title: "ପେପର କପ୍ ମେସିନ୍ ବର୍ଷ-ଶେଷ ଡିଲ୍", desc: "ଅଟୋମାଟିକ୍ ପେପର କପ୍ ମେସିନ୍‌ରେ ଗତ ବର୍ଷ-ଶେଷ ଡିଲ୍ — ଏବେ ବନ୍ଦ। ପରବର୍ତ୍ତୀ ଡିଲ୍ ପାଇଁ ଅପେକ୍ଷା କରନ୍ତୁ।", included: ["ମାଗଣା ମୋଲ୍ଡ ସେଟ୍", "ମାଗଣା କଞ୍ଚା କାଗଜ ଲଟ୍"] },
        } as any,
        includedItems: [{ name: "Free Mould Set", photo: spareImg, qty: 1 }] as any,
      },
    ]);

    /* -------------------------------- gallery ----------------------------- */
    const gal = [
      { title: "Our Khalikot Manufacturing Unit", category: "factory", url: "/images/gallery-factory.jpg", desc: "Assembly line where every Milan machine is fabricated and run-tested." },
      { title: "Hydraulic Plate Machine Ready for Dispatch", category: "products", url: plateImg, desc: "ME-HP2 packed for a customer in Berhampur." },
      { title: "Double Die Machine Installation", category: "customers", url: doubleImg, desc: "On-site installation and operator training at a Cuttack factory." },
      { title: "Paper Cup Machine Running", category: "products", url: cupImg, desc: "ME-PC70 producing 70 cups per minute." },
      { title: "Agarbatti Unit Started by an SHG", category: "customers", url: agarbattiImg, desc: "A women's self-help group in Ganjam running two ME-AG1 machines." },
      { title: "Engineering Team", category: "team", url: "/images/gallery-factory.jpg", desc: "Our fabrication and service engineers at the works." },
      { title: "Raw Material Warehouse", category: "factory", url: "/images/raw-paper.jpg", desc: "Moisture-controlled paper stock ready for same-day dispatch." },
      { title: "Spare Parts Counter", category: "products", url: spareImg, desc: "Dies, seals, bearings and heaters always in stock." },
      { title: "Customer Factory Visit — Bhubaneswar", category: "customers", url: doubleImg, desc: "Annual service visit and performance audit." },
      { title: "Quality Inspection Bay", category: "team", url: "/images/gallery-factory.jpg", desc: "48-hour load testing before every dispatch." },
      { title: "Plate Machine Die Changing", category: "products", url: plateImg, desc: "Quick die change demonstration for buyers." },
      { title: "Dispatch of 3 Machines in One Day", category: "factory", url: "/images/hero.jpg", desc: "Peak festive season dispatch from Khalikot." },
    ];
    await db.insert(gallery).values(
      gal.map((g, i) => ({ ...g, sortOrder: i + 1, published: true, views: 30 + i * 5, t: { en: { title: g.title, description: g.desc } } as any }))
    );

    /* ---------------------------------- faq -------------------------------- */
    const faqDefs = [
      { c: "purchase", en: ["What is the price of a hydraulic paper plate machine?", "Our single die hydraulic machine starts at ₹89,000 and the double die model at ₹1,49,000. Final price depends on the model, die sizes and whether you take installation. Call or WhatsApp us for a same-day quotation."], hi: ["हाइड्रोलिक पेपर प्लेट मशीन की कीमत क्या है?", "सिंगल डाई मशीन ₹89,000 से और डबल डाई ₹1,49,000 से शुरू होती है। मॉडल, डाई साइज़ और इंस्टॉलेशन पर अंतिम कीमत निर्भर करती है।"], or: ["ହାଇଡ୍ରୋଲିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ ଦାମ୍ କେତେ?", "ସିଙ୍ଗଲ୍ ଡାଇ ମେସିନ୍ ₹89,000 ରୁ ଓ ଡବଲ୍ ଡାଇ ₹1,49,000 ରୁ ଆରମ୍ଭ। ମଡେଲ୍, ଡାଇ ସାଇଜ୍ ଓ ସ୍ଥାପନ ଉପରେ ନିର୍ଭର କରେ।"] },
      { c: "purchase", en: ["How much space and power do I need?", "A single die plate machine needs about 80 sq.ft. and 2.2 kW single-phase power. The automatic cup machine needs 600 sq.ft. and 7.5 kW three-phase power with a 6 CFM compressor."], hi: ["कितनी जगह और बिजली चाहिए?", "सिंगल डाई प्लेट मशीन के लिए लगभग 80 वर्ग फीट और 2.2 kW सिंगल फेज बिजली चाहिए। ऑटोमैटिक कप मशीन के लिए 600 वर्ग फीट और 7.5 kW थ्री फेज पावर चाहिए।"], or: ["କେତେ ଜାଗା ଓ ବିଦ୍ୟୁତ୍ ଦରକାର?", "ସିଙ୍ଗଲ୍ ଡାଇ ପ୍ଲେଟ୍ ମେସିନ୍ ପାଇଁ ପ୍ରାୟ 80 ବର୍ଗ ଫୁଟ ଓ 2.2 kW ସିଙ୍ଗଲ୍ ଫେଜ୍। ଅଟୋମାଟିକ୍ କପ୍ ମେସିନ୍ ପାଇଁ 600 ବର୍ଗ ଫୁଟ ଓ 7.5 kW ତିନି ଫେଜ୍ ଦରକାର।"] },
      { c: "service", en: ["Do you provide installation and training?", "Yes. Installation, commissioning and operator training are included for all machines within Odisha. For other states we charge only travel and stay; the training is always free."], hi: ["क्या इंस्टॉलेशन और ट्रेनिंग मिलती है?", "जी हां। ओडिशा के भीतर सभी मशीनों पर इंस्टॉलेशन, कमिशनिंग और ऑपरेटर ट्रेनिंग शामिल है। दूसरे राज्यों में सिर्फ़ आने-जाने और रहने का खर्च लगता है।"], or: ["ସ୍ଥାପନ ଓ ତାଲିମ ମିଳେ କି?", "ହଁ। ଓଡ଼ିଶା ଭିତରେ ସମସ୍ତ ମେସିନ୍‌ରେ ସ୍ଥାପନ, କମିଶନିଂ ଓ ତାଲିମ ଅନ୍ତର୍ଭୁକ୍ତ। ଅନ୍ୟ ରାଜ୍ୟରେ କେବଳ ଯାତାୟାତ ଖର୍ଚ୍ଚ ଲାଗେ।"] },
      { c: "service", en: ["What is the warranty and service support?", "Every machine carries a 1-year comprehensive warranty (excluding consumables). We provide lifetime technical support, on-site service within 48 hours in Odisha and genuine spare parts from our Khalikot store."], hi: ["वारंटी और सर्विस सपोर्ट क्या है?", "हर मशीन पर 1 साल की कॉम्प्रीहेंसिव वारंटी है (कंज़्यूमेबल छोड़कर)। ओडिशा में 48 घंटे के भीतर ऑन-साइट सर्विस और खलिकोट स्टोर से असली स्पेयर पार्ट्स मिलते हैं।"], or: ["ୱାରେଣ୍ଟି ଓ ସର୍ଭିସ୍ ସପୋର୍ଟ କଣ?", "ପ୍ରତି ମେସିନ୍‌ରେ 1 ବର୍ଷ ୱାରେଣ୍ଟି (ଖର୍ଚ୍ଚାନ୍ତ ଅଂଶ ବାଦ୍)। ଓଡ଼ିଶାରେ 48 ଘଣ୍ଟା ଭିତରେ ସର୍ଭିସ୍ ଓ ଖଲିକୋଟ ଷ୍ଟୋରରୁ ଅସଲ ସ୍ପେୟାର ପାର୍ଟସ୍।"] },
      { c: "raw", en: ["Will you supply raw material regularly?", "Yes, raw paper, PE coated rolls, jiggit powder, bamboo sticks and packing material are stocked at Khalikot and dispatched across Odisha within 24–48 hours at wholesale rates."], hi: ["क्या कच्चा माल नियमित मिलेगा?", "हां, कच्चा कागज़, PE कोटेड रोल, जिगिट पाउडर, बांस स्टिक और पैकिंग सामान खलिकोट में स्टॉक रहता है और 24–48 घंटे में थोक दर पर भेजा जाता है।"], or: ["କଞ୍ଚାମାଲ ନିୟମିତ ମିଳିବ କି?", "ହଁ, କଞ୍ଚା କାଗଜ, PE କୋଟେଡ୍ ରୋଲ୍, ଜିଗିଟ୍ ପାଉଡର, ବାଉଁଶ ଷ୍ଟିକ୍ ଖଲିକୋଟରେ ଷ୍ଟକ୍ ରହେ ଓ 24–48 ଘଣ୍ଟା ଭିତରେ ଥୋକ ଦରରେ ପଠାଯାଏ।"] },
      { c: "raw", en: ["How much profit can I make from paper plates?", "At 8 hours a day and 26 days a month, a single die machine makes roughly 7.2 lakh plates a month. With typical margins of ₹0.30–₹0.60 per plate, monthly gross profit ranges from ₹20,000 to ₹45,000. Use our ROI calculator on the machine page for exact numbers."], hi: ["पेपर प्लेट से कितना मुनाफ़ा हो सकता है?", "दिन में 8 घंटे और महीने में 26 दिन चलाने पर सिंगल डाई मशीन लगभग 7.2 लाख प्लेट बनाती है। ₹0.30–₹0.60 प्रति प्लेट मार्जिन से मासिक लाभ ₹20,000 से ₹45,000 तक हो सकता है।"], or: ["ପେପର ପ୍ଲେଟ୍‌ରୁ କେତେ ଲାଭ ହେବ?", "ଦିନକୁ 8 ଘଣ୍ଟା ଓ ମାସକୁ 26 ଦିନ ଚଲାଇଲେ ସିଙ୍ଗଲ୍ ଡାଇ ମେସିନ୍ ପ୍ରାୟ 7.2 ଲକ୍ଷ ପ୍ଲେଟ୍ ତିଆରି କରେ। ପ୍ରତି ପ୍ଲେଟ୍ ₹0.30–₹0.60 ମାର୍ଜିନରେ ମାସିକ ଲାଭ ₹20,000–₹45,000 ହୋଇପାରେ।"] },
      { c: "general", en: ["Can I visit the factory before buying?", "Absolutely. Buyers are always welcome at our Khalikot works — you can watch the machine running live, meet the engineers and take a trial production run with your own paper."], hi: ["क्या खरीदने से पहले फैक्ट्री देख सकता हूं?", "बिल्कुल। हमारी खलिकोट वर्क्स में आप कभी भी आ सकते हैं — मशीन चलते देखें, इंजीनियरों से मिलें और अपने कागज़ से ट्रायल प्रोडक्शन करें।"], or: ["କିଣିବା ପୂର୍ବରୁ ଫ୍ୟାକ୍ଟରୀ ଦେଖିପାରିବି କି?", "ନିଶ୍ଚୟ। ଖଲିକୋଟ ୱାର୍କସକୁ ଆସି ମେସିନ୍ ଚାଲୁଥିବା ଦେଖନ୍ତୁ, ଇଞ୍ଜିନିୟରଙ୍କୁ ଭେଟନ୍ତୁ ଓ ନିଜ କାଗଜରେ ଟ୍ରାୟାଲ୍ ଚଲାନ୍ତୁ।"] },
      { c: "general", en: ["Do you offer EMI or bank loan assistance?", "We provide a complete project report, machine quotation and GST invoice that banks accept for Mudra, PMEGP and Stand-Up India loans. Many of our customers have financed 60–75% of the machine cost."], hi: ["क्या EMI या बैंक लोन में मदद मिलती है?", "हम प्रोजेक्ट रिपोर्ट, कोटेशन और GST इनवॉइस देते हैं जो मुद्रा, PMEGP और स्टैंड-अप इंडिया लोन के लिए बैंक स्वीकार करते हैं। कई ग्राहकों ने 60–75% तक फाइनेंस कराया है।"], or: ["EMI କିମ୍ବା ବ୍ୟାଙ୍କ ଲୋନ୍ ସହାୟତା ମିଳେ କି?", "ଆମେ ପ୍ରୋଜେକ୍ଟ ରିପୋର୍ଟ, କୋଟେସନ୍ ଓ GST ଇନଭଏସ୍ ଦେଉ ଯାହା ମୁଦ୍ରା, PMEGP ଓ ଷ୍ଟାଣ୍ଡ-ଅପ୍ ଇଣ୍ଡିଆ ଲୋନ୍ ପାଇଁ ବ୍ୟାଙ୍କ ଗ୍ରହଣ କରନ୍ତି।"] },
      { c: "general", en: ["Do you ship outside Odisha?", "Yes, we ship all over India through trusted transporters. Machines are crated in plywood cases with foam padding, insured, and we guide unloading and installation over video call if we cannot travel."], hi: ["क्या ओडिशा के बाहर शिपिंग होती है?", "हां, हम पूरे भारत में भेजते हैं। मशीनें प्लाईवुड केस में पैक, बीमित और फोम पैडिंग के साथ जाती हैं।"], or: ["ଓଡ଼ିଶା ବାହାରକୁ ସିପିଂ ହୁଏ କି?", "ହଁ, ଆମେ ସାରା ଭାରତକୁ ପଠାଉ। ମେସିନ୍ ପ୍ଲାଏଉଡ୍ କେସ୍‌ରେ ପ୍ୟାକ୍, ବୀମା ସହିତ ଯାଏ।"] },
    ];
    await db.insert(faqs).values(
      faqDefs.map((f, i) => ({
        category: f.c, sortOrder: i + 1, active: true,
        t: {
          en: { q: f.en[0], a: f.en[1] },
          hi: { q: f.hi[0], a: f.hi[1] },
          or: { q: f.or[0], a: f.or[1] },
        } as any,
      }))
    );

    /* ------------------------------ demo CRM ------------------------------ */
    const names = ["Suresh Patel", "Bikash Nayak", "Ramesh Sahu", "Anita Das", "Md. Irfan", "Prakash Jena", "Laxmi SHG", "Dinesh Kumar", "Sanjay Behera", "Kiran Mishra", "Tapas Ranjan", "Sabita Pradhan"];
    const cities = ["Berhampur", "Bhubaneswar", "Cuttack", "Puri", "Khalikot", "Aska", "Chatrapur", "Balasore", "Rourkela", "Ranchi", "Kolkata", "Visakhapatnam"];
    const machineList = await db.select({ id: machines.id, name: machines.name }).from(machines);
    const enqRows = [];
    for (let i = 0; i < 46; i++) {
      const m = machineList[i % Math.max(1, machineList.length)];
      const created = new Date(now - Math.floor(Math.random() * 88) * 86400000 - Math.floor(Math.random() * 20) * 3600000);
      const status = ["new", "contacted", "quoted", "won", "lost"][i % 5];
      enqRows.push({
        type: i % 6 === 0 ? "raw_material" : i % 7 === 0 ? "offer" : "machine",
        name: names[i % names.length], phone: `+91 9${String(800000000 + i * 137911).slice(0, 9)}`,
        email: `customer${i + 1}@example.com`, city: cities[i % cities.length], state: "Odisha",
        message: `I am interested in ${m?.name ?? "a machine"}. Please share the best price and installation details.`,
        machineId: m?.id ?? null, machineName: m?.name ?? null,
        model: "ME-HP2", color: "Signature Orange", capacity: "5\"–10\"", price: 98000,
        status, assignedName: i % 2 === 0 ? "Rakesh Sahoo" : "Milan (Owner)",
        source: ["website", "whatsapp", "google"][i % 3],
        notes: [{ text: "Called the customer, shared quotation on WhatsApp.", by: "Rakesh Sahoo", at: created.toISOString() }] as any,
        createdAt: created, updatedAt: created,
      });
    }
    await db.insert(enquiries).values(enqRows as any);

    const tk = [];
    for (let i = 0; i < 9; i++) {
      const created = new Date(now - (i * 7 + 2) * 86400000);
      const m = machineList[i % Math.max(1, machineList.length)];
      tk.push({
        ticketNumber: `ME-2026-${String(1041 + i)}`,
        name: names[(i + 3) % names.length], phone: `+91 9${String(700000000 + i * 331117).slice(0, 9)}`,
        email: `service${i + 1}@example.com`, city: cities[(i + 2) % cities.length],
        machineId: m?.id ?? null, machineName: m?.name ?? null,
        subject: ["Oil leaking from cylinder", "Plate size uneven", "Machine making noise", "Die stuck", "Heater not working"][i % 5],
        description: "Customer reported the issue during production. Requested urgent engineer visit.",
        priority: ["low", "medium", "high", "urgent"][i % 4],
        status: ["open", "in_progress", "waiting", "resolved", "closed"][i % 5],
        assignedName: "Milan (Owner)", createdAt: created, updatedAt: created,
      });
    }
    const insertedTickets = await db.insert(tickets).values(tk as any).returning({ id: tickets.id });
    for (const t of insertedTickets.slice(0, 5)) {
      await db.insert(ticketUpdates).values([
        { ticketId: t.id, status: "open", message: "Ticket received and logged.", byAdmin: false, authorName: "Customer" },
        { ticketId: t.id, status: "in_progress", message: "Engineer assigned, spare parts arranged.", byAdmin: true, authorName: "Milan (Owner)" },
        { ticketId: t.id, status: "resolved", message: "Issue fixed on site. Machine running at full speed.", byAdmin: true, authorName: "Milan (Owner)" },
      ]);
    }

    await db.insert(newsletter).values([
      { email: "buyer1@example.com", name: "Suresh Patel" },
      { email: "buyer2@example.com", name: "Anita Das" },
      { email: "shg.ganjam@example.com", name: "Laxmi SHG" },
    ]);

    /* ---------------------------- demo analytics -------------------------- */
    const paths = ["/", "/machines", "/raw-materials", "/offers", "/gallery", "/contact", "/spare-parts", "/faq", "/support"];
    const evs: any[] = [];
    for (let d = 89; d >= 0; d--) {
      const day = new Date(now - d * 86400000);
      const weekend = [0, 6].includes(day.getDay());
      const base = weekend ? 12 : 26;
      const views = base + Math.floor(Math.random() * 22) + Math.floor((89 - d) / 6);
      for (let v = 0; v < views; v++) {
        evs.push({
          type: "page_view", path: paths[Math.floor(Math.random() * paths.length)],
          lang: ["en", "hi", "or"][Math.floor(Math.random() * 3)],
          device: Math.random() > 0.35 ? "mobile" : "desktop",
          source: ["google", "direct", "whatsapp", "facebook", "youtube"][Math.floor(Math.random() * 5)],
          createdAt: new Date(day.getTime() + Math.floor(Math.random() * 12) * 3600000),
        });
      }
      const mv = Math.floor(views * 0.5);
      for (let v = 0; v < mv; v++) {
        const m = machineList[Math.floor(Math.random() * machineList.length)];
        if (!m) break;
        evs.push({
          type: "machine_view", path: `/machines/${m.id}`, entityId: m.id, entityName: m.name,
          lang: ["en", "hi", "or"][Math.floor(Math.random() * 3)],
          device: Math.random() > 0.35 ? "mobile" : "desktop",
          source: "google", createdAt: new Date(day.getTime() + Math.floor(Math.random() * 12) * 3600000),
        });
      }
      const wa = Math.floor(views * 0.18);
      for (let v = 0; v < wa; v++) {
        evs.push({ type: "whatsapp_click", path: "/machines", device: "mobile", source: "whatsapp", createdAt: new Date(day.getTime() + 3600000 * v) });
      }
      const en = Math.floor(views * 0.08);
      for (let v = 0; v < en; v++) {
        evs.push({ type: "enquiry", path: "/contact", device: "mobile", source: "google", createdAt: new Date(day.getTime() + 7200000 * (v + 1)) });
      }
    }
    for (let i = 0; i < evs.length; i += 400) {
      await db.insert(events).values(evs.slice(i, i + 400));
    }

    await db.insert(activities).values([
      { actor: "system", action: "Initialised website content", entity: "system", entityName: "Milan Enterprises" },
      { actor: "Rakesh Sahoo", action: "Updated offer pricing", entity: "offers", entityName: "Diwali Mega Machine Offer" },
      { actor: "Priya Behera", action: "Uploaded gallery images", entity: "gallery", entityName: "12 photos" },
      { actor: "Milan (Owner)", action: "Added new machine model", entity: "machines", entityName: "ME-DD4 Auto Collector" },
      { actor: "system", action: "Low stock alert", entity: "raw_materials", entityName: "Bamboo Agarbatti Sticks" },
    ]);

    console.log("[seed] database seeded successfully");
    return { seeded: true };
  } catch (err) {
    console.error("[seed] failed:", err);
    return { seeded: false, reason: String(err) };
  }
}
