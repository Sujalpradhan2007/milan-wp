import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { machines } from "@/db/schema";
import { defaultColorRows, normaliseColors } from "./colors";
import { slugify } from "./utils";

const GENERIC = "/images/machine-generic.jpg";
const PLATE = "/images/machine-plate.jpg";
const DOUBLE = "/images/machine-double-die.jpg";
const CUP = "/images/machine-cup.jpg";
const AGAR = "/images/machine-agarbatti.jpg";
const SPARE = "/images/spare-parts.jpg";
const FACTORY = "/images/gallery-factory.jpg";
const HAWAI = "/images/machine-hawai.svg";
const NOODLES = "/images/machine-noodles.svg";
const NAIL = "/images/machine-nail.svg";
const KAPOOR = "/images/machine-kapoor.svg";
const COTTON = "/images/machine-cotton.svg";
const SCRUBBER = "/images/machine-scrubber.svg";
const PACKING = "/images/machine-packing.svg";
const SLEEPER = "/images/machine-sleeper.svg";

type Model = { id: string; name: string; code: string; capacity: string; pph: number; price: number; active: boolean };
type Spec = { group: string; label: string; value: string };

export type CatalogueItem = {
  slug: string;
  name: string;
  category: string;
  cover: string;
  extra?: string[];
  mrp: number;
  company: number;
  offer: number;
  capacity: string;
  pph: number;
  power: string;
  warranty: string;
  featured?: boolean;
  sortOrder: number;
  en: { name: string; tagline: string; short: string; full: string; features: string[] };
  hi: { name: string; tagline: string; short: string; full: string; features: string[] };
  or: { name: string; tagline: string; short: string; full: string; features: string[] };
  models: Model[];
  specs: Spec[];
};

const m = (i: number, name: string, code: string, capacity: string, pph: number, price: number): Model => ({
  id: `m${i}`, name, code, capacity, pph, price, active: true,
});

/* ------------------------------------------------------------------ */
/*  Full brochure catalogue                                            */
/* ------------------------------------------------------------------ */
export const CATALOGUE: CatalogueItem[] = [
  /* ------------------------- HAWAI / SLIPPER ------------------------ */
  {
    slug: "hawai-slipper-making-machine",
    name: "Hawai / Slipper Making Machine (Full Set)",
    category: "Slipper & Footwear Machine",
    cover: HAWAI, extra: [SLEEPER, FACTORY, SPARE],
    mrp: 165000, company: 135000, offer: 120000,
    capacity: "Bed size 24 / 26 inch", pph: 330, power: "2 HP, Single phase 220 V",
    warranty: "1 Year Comprehensive", featured: true, sortOrder: 11,
    en: {
      name: "Hawai / Slipper Making Machine (Full Set)",
      tagline: "Bed 24\"/26\" • 280–330 pairs/hour • complete 3-machine set",
      short: "Complete hawai chappal manufacturing set — sole cutting press, strap fitting machine and finishing/grinding unit, all running on a single phase 220 V supply.",
      full: "Our Hawai / Slipper Making Machine is supplied as a complete working set so a new unit can start production from day one. The set includes the sole cutting press with a 24\"/26\" bed, the strap-fitting and punching machine, and the finishing unit with buffing wheel.\n\nA 2 HP single-phase 220 V motor drives the press, which means you can run the whole line from a domestic connection — no three-phase sanction needed. Output is 280 to 330 pairs per hour depending on operator skill and sheet thickness.\n\nWe supply the machine with a starter die set, strap-fitting tools, operator training and one year warranty. EVA sheet, straps and dies are available from our raw material store.",
      features: [
        "Full set: cutting press + strap fitting + finishing unit",
        "Bed size 24 inch / 26 inch (choose at order)",
        "280 – 330 pairs per hour",
        "2 HP motor on single phase 220 V",
        "Works with EVA, rubber and PU sheets",
        "Starter die set included",
        "Sole, strap and buffing tools supplied",
      ],
    },
    hi: {
      name: "हवाई / स्लीपर बनाने की मशीन (फुल सेट)",
      tagline: "बेड 24\"/26\" • 280–330 जोड़ी/घंटा • पूरा 3-मशीन सेट",
      short: "पूरा हवाई चप्पल सेट — सोल कटिंग प्रेस, स्ट्रैप फिटिंग मशीन और फिनिशिंग यूनिट, सिंगल फेज 220 वोल्ट पर चलने वाला।",
      full: "हमारी हवाई / स्लीपर मशीन पूरे वर्किंग सेट के रूप में दी जाती है ताकि नई यूनिट पहले दिन से उत्पादन शुरू कर सके। सेट में 24\"/26\" बेड वाली सोल कटिंग प्रेस, स्ट्रैप फिटिंग और पंचिंग मशीन तथा बफिंग व्हील वाली फिनिशिंग यूनिट शामिल है।\n\n2 HP सिंगल फेज 220 वोल्ट मोटर प्रेस चलाती है, यानी आप पूरी लाइन घरेलू कनेक्शन पर चला सकते हैं। उत्पादन 280 से 330 जोड़ी प्रति घंटा है।\n\nमशीन के साथ स्टार्टर डाई सेट, स्ट्रैप टूल्स, ऑपरेटर ट्रेनिंग और एक साल की वारंटी दी जाती है।",
      features: ["फुल सेट: कटिंग प्रेस + स्ट्रैप फिटिंग + फिनिशिंग", "बेड साइज़ 24 / 26 इंच", "280–330 जोड़ी प्रति घंटा", "2 HP सिंगल फेज 220V", "EVA, रबर व PU शीट पर काम", "स्टार्टर डाई सेट शामिल", "मुफ़्त ऑपरेटर ट्रेनिंग"],
    },
    or: {
      name: "ହାୱାଇ / ସ୍ଲିପର ତିଆରି ମେସିନ୍ (ଫୁଲ ସେଟ୍)",
      tagline: "ବେଡ୍ 24\"/26\" • 280–330 ଯୋଡ଼ି/ଘଣ୍ଟା • ସମ୍ପୂର୍ଣ୍ଣ 3-ମେସିନ୍ ସେଟ୍",
      short: "ସମ୍ପୂର୍ଣ୍ଣ ହାୱାଇ ଚପଲ ସେଟ୍ — ସୋଲ କଟିଂ ପ୍ରେସ୍, ଷ୍ଟ୍ରାପ୍ ଫିଟିଂ ମେସିନ୍ ଓ ଫିନିସିଂ ୟୁନିଟ୍, ସିଙ୍ଗଲ୍ ଫେଜ୍ 220 ଭୋଲ୍ଟରେ ଚାଲେ।",
      full: "ଆମର ହାୱାଇ / ସ୍ଲିପର ମେସିନ୍ ସମ୍ପୂର୍ଣ୍ଣ ୱାର୍କିଂ ସେଟ୍ ଭାବରେ ଦିଆଯାଏ ଯାହା ଫଳରେ ନୂଆ ୟୁନିଟ୍ ପ୍ରଥମ ଦିନରୁ ଉତ୍ପାଦନ ଆରମ୍ଭ କରିପାରେ। ସେଟରେ 24\"/26\" ବେଡ୍ ସୋଲ କଟିଂ ପ୍ରେସ୍, ଷ୍ଟ୍ରାପ୍ ଫିଟିଂ ମେସିନ୍ ଓ ବଫିଂ ହୁଇଲ୍ ସହିତ ଫିନିସିଂ ୟୁନିଟ୍ ଅଛି।\n\n2 HP ସିଙ୍ଗଲ୍ ଫେଜ୍ 220 ଭୋଲ୍ଟ ମୋଟର ପ୍ରେସ୍ ଚଲାଏ, ତେଣୁ ଘରୋଇ ସଂଯୋଗରେ ମଧ୍ୟ ଚଲାଇ ହେବ। ଉତ୍ପାଦନ ଘଣ୍ଟା ପ୍ରତି 280 ରୁ 330 ଯୋଡ଼ି।",
      features: ["ଫୁଲ ସେଟ୍: କଟିଂ + ଷ୍ଟ୍ରାପ୍ + ଫିନିସିଂ", "ବେଡ୍ ସାଇଜ୍ 24 / 26 ଇଞ୍ଚ", "280–330 ଯୋଡ଼ି ପ୍ରତି ଘଣ୍ଟା", "2 HP ସିଙ୍ଗଲ୍ ଫେଜ୍ 220V", "EVA, ରବର ଓ PU ସିଟ୍", "ଷ୍ଟାର୍ଟର ଡାଇ ସେଟ୍", "ମାଗଣା ତାଲିମ"],
    },
    models: [
      m(1, "Sole Cutting Press 24\"", "ME-HW24", "24 inch bed", 300, 80000),
      m(2, "Sole Cutting Press 26\"", "ME-HW26", "26 inch bed", 330, 120000),
      m(3, "Strap Fitting Machine", "ME-HWSF", "All sizes", 330, 25000),
      m(4, "Full Set (all 3 machines)", "ME-HWSET", "24\"/26\"", 330, 215000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Hawai / Slipper Full Set" },
      { group: "General", label: "Bed Size", value: "24 inch / 26 inch" },
      { group: "Output", label: "Production", value: "280 – 330 pairs / hour" },
      { group: "Technical", label: "Motor", value: "2 HP" },
      { group: "Technical", label: "Supply", value: "Single phase, 220 Volt" },
      { group: "Build", label: "Material Used", value: "EVA / Rubber / PU sheet" },
    ],
  },

  /* ----------------------------- NOODLES ---------------------------- */
  {
    slug: "noodles-making-machine",
    name: "Noodles Making Machine",
    category: "Food Processing Machine",
    cover: NOODLES, extra: [FACTORY],
    mrp: 360000, company: 300000, offer: 285000,
    capacity: "100 kg / hour", pph: 100, power: "240 V supply",
    warranty: "1 Year Comprehensive", featured: true, sortOrder: 12,
    en: {
      name: "Noodles Making Machine",
      tagline: "2-Stage • 100 kg/hr • 400 kg machine weight",
      short: "Two-stage noodle making line producing 100 kg per hour — dough mixing, sheeting, rolling and cutting in one continuous flow.",
      full: "The Milan Noodles Making Machine is a 2-stage line designed for small and medium food units making instant noodles, plain noodles and vermicelli-style products.\n\nStage one mixes and kneads the dough to the right moisture; stage two sheets, rolls and cuts it into uniform strands. Capacity is 100 kg per hour, the machine weighs about 400 kg and runs on a 240 V supply.\n\nAvailable in three configurations — a basic dough extruder at ₹30,000, a mid-range sheeting and cutting unit at ₹80,000, and the complete automatic 2-stage line at ₹3,00,000. All food-contact parts are stainless steel. Installation, training and dies for different noodle widths are included.",
      features: [
        "2-stage mixing + sheeting + cutting line",
        "Capacity 100 kg per hour",
        "Stainless steel food-contact parts",
        "Adjustable noodle thickness and width",
        "Machine weight approx. 400 kg",
        "Runs on 240 V supply",
        "Three budget options from ₹30,000 to ₹3,00,000",
      ],
    },
    hi: {
      name: "नूडल्स बनाने की मशीन",
      tagline: "2-स्टेज • 100 किलो/घंटा • वज़न 400 किलो",
      short: "दो-स्टेज नूडल्स लाइन, 100 किलो प्रति घंटा — आटा मिक्सिंग, शीटिंग, रोलिंग और कटिंग एक साथ।",
      full: "मिलन नूडल्स मशीन 2-स्टेज लाइन है जो छोटी और मझोली फूड यूनिट के लिए बनाई गई है — इंस्टेंट नूडल्स, प्लेन नूडल्स और सेवई जैसे उत्पाद के लिए।\n\nपहला स्टेज आटा मिक्स और गूंथता है, दूसरा स्टेज शीट बनाकर एक समान नूडल्स काटता है। क्षमता 100 किलो प्रति घंटा, वज़न लगभग 400 किलो, 240 वोल्ट सप्लाई।\n\nतीन विकल्प — ₹30,000 का बेसिक डो एक्सट्रूडर, ₹80,000 की शीटिंग व कटिंग यूनिट और ₹3,00,000 की पूरी ऑटोमैटिक लाइन।",
      features: ["2-स्टेज मिक्सिंग + शीटिंग + कटिंग", "क्षमता 100 किलो प्रति घंटा", "स्टेनलेस स्टील फूड पार्ट्स", "एडजस्टेबल मोटाई व चौड़ाई", "वज़न लगभग 400 किलो", "240 वोल्ट सप्लाई", "₹30,000 से ₹3,00,000 तक तीन विकल्प"],
    },
    or: {
      name: "ନୁଡୁଲ୍ସ ତିଆରି ମେସିନ୍",
      tagline: "2-ଷ୍ଟେଜ୍ • 100 କେଜି/ଘଣ୍ଟା • ଓଜନ 400 କେଜି",
      short: "ଦୁଇ-ଷ୍ଟେଜ୍ ନୁଡୁଲ୍ସ ଲାଇନ୍, ଘଣ୍ଟାକୁ 100 କେଜି — ମଇଦା ମିଶ୍ରଣ, ସିଟିଂ, ରୋଲିଂ ଓ କଟିଂ ଏକାଠି।",
      full: "ମିଲାନ ନୁଡୁଲ୍ସ ମେସିନ୍ ଏକ 2-ଷ୍ଟେଜ୍ ଲାଇନ୍ ଯାହା ଛୋଟ ଓ ମଧ୍ୟମ ଖାଦ୍ୟ ୟୁନିଟ୍ ପାଇଁ ତିଆରି।\n\nପ୍ରଥମ ଷ୍ଟେଜ୍ ମଇଦା ମିଶାଏ ଓ ମକଚେ, ଦ୍ୱିତୀୟ ଷ୍ଟେଜ୍ ସିଟ୍ କରି ସମାନ ନୁଡୁଲ୍ସ କାଟେ। କ୍ଷମତା ଘଣ୍ଟାକୁ 100 କେଜି, ଓଜନ ପ୍ରାୟ 400 କେଜି, 240 ଭୋଲ୍ଟ ସପ୍ଲାଇ।\n\nତିନୋଟି ବିକଳ୍ପ — ₹30,000 ବେସିକ୍, ₹80,000 ମଧ୍ୟମ ଓ ₹3,00,000 ସମ୍ପୂର୍ଣ୍ଣ ଅଟୋମାଟିକ୍ ଲାଇନ୍।",
      features: ["2-ଷ୍ଟେଜ୍ ମିକ୍ସିଂ + ସିଟିଂ + କଟିଂ", "କ୍ଷମତା 100 କେଜି/ଘଣ୍ଟା", "ଷ୍ଟେନଲେସ ଷ୍ଟିଲ୍ ପାର୍ଟସ", "ଆଡଜଷ୍ଟେବଲ୍ ମୋଟେଇ", "ଓଜନ ପ୍ରାୟ 400 କେଜି", "240 ଭୋଲ୍ଟ", "ତିନୋଟି ବଜେଟ୍ ବିକଳ୍ପ"],
    },
    models: [
      m(1, "Basic Dough Extruder", "ME-ND30", "30–40 kg/hr", 40, 30000),
      m(2, "Sheeting & Cutting Unit", "ME-ND80", "60 kg/hr", 60, 80000),
      m(3, "Full Automatic 2-Stage Line", "ME-ND300", "100 kg/hr", 100, 300000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "2-Stage Noodle Line" },
      { group: "Output", label: "Capacity", value: "100 kg / hour" },
      { group: "Technical", label: "Voltage", value: "240 V" },
      { group: "Build", label: "Weight", value: "400 kg" },
      { group: "Build", label: "Contact Parts", value: "Stainless Steel" },
    ],
  },

  /* ---------------------------- WIRE NAIL --------------------------- */
  {
    slug: "wire-nail-making-machine",
    name: "Wire Nail Making Machine",
    category: "Wire & Metal Machine",
    cover: NAIL, extra: [SPARE, FACTORY],
    mrp: 395000, company: 320000, offer: 299000,
    capacity: 'Nail length 1" – 4"', pph: 21000, power: "3.0 HP / kW",
    warranty: "1 Year Comprehensive", featured: true, sortOrder: 13,
    en: {
      name: "Wire Nail Making Machine",
      tagline: "350 nails/minute • 1\"–4\" length • 1140 kg heavy body",
      short: "High-speed wire nail machine producing 350 nails per minute in lengths from 1 inch to 4 inch, with a 1140 kg rigid body for vibration-free running.",
      full: "The Wire Nail Making Machine cuts, heads and points nails in a single continuous stroke directly from wire coil. Nail length is adjustable from 1 inch to 4 inch by changing the gripper setting and dies — no separate machine needed for each size.\n\nAt 350 nails per minute it produces roughly 21,000 nails an hour, which is about 180–200 kg of nails in a shift depending on gauge. The 1140 kg cast and fabricated body keeps the machine steady at full speed and greatly extends die life.\n\nWe also supply the supporting equipment: wire drawing machine at ₹45,000 and the nail polishing drum at ₹85,000, so you can set up a complete nail plant. Power required is 3.0 HP/kW.",
      features: [
        "350 nails per minute (~21,000 per hour)",
        "Nail length adjustable 1 inch to 4 inch",
        "Cuts, heads and points in one stroke",
        "Heavy 1140 kg vibration-free body",
        "3.0 HP / kW power requirement",
        "Wire drawing machine & polishing drum available",
        "Hardened gripper dies with long life",
      ],
    },
    hi: {
      name: "वायर नेल (कील) बनाने की मशीन",
      tagline: "350 कील/मिनट • 1\"–4\" लंबाई • 1140 किलो भारी बॉडी",
      short: "हाई-स्पीड वायर नेल मशीन — 350 कील प्रति मिनट, 1 इंच से 4 इंच लंबाई, 1140 किलो मज़बूत बॉडी।",
      full: "वायर नेल मशीन सीधे वायर कॉइल से एक ही स्ट्रोक में कील काटती, सिर बनाती और नोक बनाती है। ग्रिपर सेटिंग और डाई बदलकर 1 इंच से 4 इंच तक लंबाई सेट की जा सकती है।\n\n350 कील प्रति मिनट यानी लगभग 21,000 कील प्रति घंटा — एक शिफ्ट में 180–200 किलो कील। 1140 किलो की भारी बॉडी पूरी स्पीड पर भी मशीन को स्थिर रखती है।\n\nसाथ में वायर ड्राइंग मशीन ₹45,000 और नेल पॉलिशिंग ड्रम ₹85,000 में उपलब्ध है, जिससे पूरा नेल प्लांट लगाया जा सकता है। 3.0 HP पावर चाहिए।",
      features: ["350 कील प्रति मिनट", "1 इंच से 4 इंच लंबाई", "एक स्ट्रोक में कटिंग, हेडिंग, पॉइंटिंग", "1140 किलो भारी बॉडी", "3.0 HP पावर", "वायर ड्राइंग व पॉलिशिंग ड्रम उपलब्ध", "हार्डंड ग्रिपर डाई"],
    },
    or: {
      name: "ୱାୟାର ନେଲ୍ (କଣ୍ଟା) ମେସିନ୍",
      tagline: "350 କଣ୍ଟା/ମିନିଟ୍ • 1\"–4\" ଲମ୍ବ • 1140 କେଜି ଭାରୀ ବଡି",
      short: "ଉଚ୍ଚ ଗତିର ୱାୟାର ନେଲ୍ ମେସିନ୍ — ମିନିଟ୍ ପ୍ରତି 350 କଣ୍ଟା, 1 ରୁ 4 ଇଞ୍ଚ ଲମ୍ବ, 1140 କେଜି ମଜଭୁତ ବଡି।",
      full: "ୱାୟାର ନେଲ୍ ମେସିନ୍ ସିଧା ତାର କଏଲରୁ ଗୋଟିଏ ଷ୍ଟ୍ରୋକରେ କଣ୍ଟା କାଟେ, ମୁଣ୍ଡ ତିଆରି କରେ ଏବଂ ଧାର କରେ। ଗ୍ରିପର ସେଟିଂ ଓ ଡାଇ ବଦଳାଇ 1 ରୁ 4 ଇଞ୍ଚ ଲମ୍ବ ସେଟ୍ କରାଯାଏ।\n\nମିନିଟ୍ ପ୍ରତି 350 କଣ୍ଟା ଅର୍ଥାତ୍ ଘଣ୍ଟାକୁ ପ୍ରାୟ 21,000 କଣ୍ଟା। 1140 କେଜି ଭାରୀ ବଡି ପୂରା ଗତିରେ ମଧ୍ୟ ମେସିନ୍‌କୁ ସ୍ଥିର ରଖେ।\n\nସହିତ ୱାୟାର ଡ୍ରଇଂ ମେସିନ୍ ₹45,000 ଓ ପଲିସିଂ ଡ୍ରମ୍ ₹85,000 ରେ ମିଳେ।",
      features: ["ମିନିଟ୍ ପ୍ରତି 350 କଣ୍ଟା", "1 ରୁ 4 ଇଞ୍ଚ ଲମ୍ବ", "ଗୋଟିଏ ଷ୍ଟ୍ରୋକରେ ସମ୍ପୂର୍ଣ୍ଣ", "1140 କେଜି ଭାରୀ ବଡି", "3.0 HP ପାୱାର", "ଡ୍ରଇଂ ଓ ପଲିସିଂ ୟୁନିଟ୍", "ହାର୍ଡେଣ୍ଡ ଡାଇ"],
    },
    models: [
      m(1, "Wire Drawing Machine", "ME-WD45", "Wire feed", 0, 45000),
      m(2, "Nail Polishing Drum", "ME-NP85", "Polishing", 0, 85000),
      m(3, "Wire Nail Machine (350/min)", "ME-WN320", '1"–4"', 21000, 320000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Automatic Wire Nail" },
      { group: "Output", label: "Speed", value: "350 nails / minute" },
      { group: "Output", label: "Nail Length", value: '1 inch – 4 inch' },
      { group: "Technical", label: "Power Required", value: "3.0 HP / kW" },
      { group: "Build", label: "Weight", value: "1140 kg" },
    ],
  },

  /* ------------------------- SLEEPER CUTTING ------------------------ */
  {
    slug: "sleeper-cutting-machine",
    name: "Sleeper Cutting Machine",
    category: "Slipper & Footwear Machine",
    cover: SLEEPER, extra: [HAWAI, SPARE],
    mrp: 38000, company: 28000, offer: 25000,
    capacity: "All standard slipper sizes", pph: 320, power: "1 HP, Single phase",
    warranty: "1 Year", sortOrder: 14,
    en: {
      name: "Sleeper Cutting Machine",
      tagline: "Compact sole cutting press • 300+ pairs/hour • low budget entry",
      short: "Low-cost manual/motorised sleeper sole cutting press — the cheapest way to start a chappal business from home.",
      full: "The Sleeper Cutting Machine is a compact press used to cut slipper soles from EVA, rubber or PU sheet using a shaped die. It is the lowest-investment entry point into the footwear business and pairs perfectly with our strap fitting unit.\n\nThe machine body is welded from heavy MS channel and the cutting plate is replaceable. One operator can comfortably cut 300+ pairs an hour. It runs on a 1 HP single-phase motor, or can be supplied in a fully manual lever version for areas with power problems.\n\nDies for all standard men's, ladies' and kids' sizes are available from our die bank.",
      features: [
        "Cuts EVA, rubber and PU slipper soles",
        "300+ pairs per hour with one operator",
        "Heavy welded MS channel body",
        "Replaceable cutting plate",
        "1 HP single phase — or manual lever version",
        "Dies for men's, ladies' and kids' sizes",
        "Lowest investment footwear machine",
      ],
    },
    hi: {
      name: "स्लीपर कटिंग मशीन",
      tagline: "कॉम्पैक्ट सोल कटिंग प्रेस • 300+ जोड़ी/घंटा • कम बजट",
      short: "कम लागत वाली स्लीपर सोल कटिंग प्रेस — घर से चप्पल का काम शुरू करने का सबसे सस्ता तरीका।",
      full: "स्लीपर कटिंग मशीन एक कॉम्पैक्ट प्रेस है जो EVA, रबर या PU शीट से डाई की मदद से चप्पल का सोल काटती है। फुटवियर बिज़नेस में सबसे कम निवेश वाली शुरुआत यही है।\n\nबॉडी भारी MS चैनल से वेल्डेड है और कटिंग प्लेट बदली जा सकती है। एक ऑपरेटर आराम से 300+ जोड़ी प्रति घंटा काट सकता है। 1 HP सिंगल फेज मोटर पर चलती है, या बिजली की दिक्कत वाले इलाकों के लिए पूरी मैनुअल लीवर मशीन भी मिलती है।",
      features: ["EVA, रबर व PU सोल कटिंग", "300+ जोड़ी प्रति घंटा", "भारी MS चैनल बॉडी", "बदलने योग्य कटिंग प्लेट", "1 HP सिंगल फेज या मैनुअल", "सभी साइज़ की डाई", "सबसे कम निवेश"],
    },
    or: {
      name: "ସ୍ଲିପର କଟିଂ ମେସିନ୍",
      tagline: "କମ୍ପାକ୍ଟ ସୋଲ କଟିଂ ପ୍ରେସ୍ • 300+ ଯୋଡ଼ି/ଘଣ୍ଟା • କମ୍ ବଜେଟ୍",
      short: "କମ୍ ଖର୍ଚ୍ଚର ସ୍ଲିପର ସୋଲ କଟିଂ ପ୍ରେସ୍ — ଘରୁ ଚପଲ ବ୍ୟବସାୟ ଆରମ୍ଭ କରିବାର ସସ୍ତା ଉପାୟ।",
      full: "ସ୍ଲିପର କଟିଂ ମେସିନ୍ ଏକ କମ୍ପାକ୍ଟ ପ୍ରେସ୍ ଯାହା EVA, ରବର କିମ୍ବା PU ସିଟରୁ ଡାଇ ସାହାଯ୍ୟରେ ଚପଲ ସୋଲ କାଟେ। ଫୁଟୱେର ବ୍ୟବସାୟରେ ଏହା ସର୍ବନିମ୍ନ ନିବେଶ।\n\nବଡି ଭାରୀ MS ଚ୍ୟାନେଲରୁ ୱେଲ୍ଡେଡ୍ ଏବଂ କଟିଂ ପ୍ଲେଟ୍ ବଦଳାଇ ହେବ। ଜଣେ ଅପରେଟର ଘଣ୍ଟାକୁ 300+ ଯୋଡ଼ି କାଟିପାରିବେ।",
      features: ["EVA, ରବର ଓ PU ସୋଲ କଟିଂ", "300+ ଯୋଡ଼ି ପ୍ରତି ଘଣ୍ଟା", "ଭାରୀ MS ଚ୍ୟାନେଲ ବଡି", "ବଦଳାଯୋଗ୍ୟ କଟିଂ ପ୍ଲେଟ୍", "1 HP ସିଙ୍ଗଲ୍ ଫେଜ୍", "ସବୁ ସାଇଜ ଡାଇ", "ସର୍ବନିମ୍ନ ନିବେଶ"],
    },
    models: [
      m(1, "Manual Lever Press", "ME-SC-M", "All sizes", 250, 18000),
      m(2, "Motorised Press 1 HP", "ME-SC-1", "All sizes", 320, 25000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Sole Cutting Press" },
      { group: "Output", label: "Production", value: "250 – 320 pairs / hour" },
      { group: "Technical", label: "Motor", value: "1 HP Single Phase" },
      { group: "Build", label: "Body", value: "Heavy MS Channel, welded" },
    ],
  },

  /* -------------------------- KAPOOR MACHINE ------------------------ */
  {
    slug: "kapoor-camphor-making-machine",
    name: "Kapoor (Camphor) Making Machine",
    category: "Puja & Devotional Machine",
    cover: KAPOOR, extra: [AGAR],
    mrp: 72000, company: 55000, offer: 48500,
    capacity: "12 – 20 kg / hour tablets", pph: 20, power: "1 HP, Single phase",
    warranty: "1 Year", sortOrder: 15,
    en: {
      name: "Kapoor (Camphor) Making Machine",
      tagline: "Tablet press for camphor • 12–20 kg/hour • single phase",
      short: "Camphor tablet pressing machine for puja camphor in round and square shapes, with changeable punch dies and adjustable tablet weight.",
      full: "The Kapoor Making Machine presses camphor powder into hard, clean-burning tablets. It is extremely popular with home-based and self-help group units because the investment is low, the raw material is easily available and demand is steady all year — rising sharply in the festival season.\n\nThe machine has a hopper, a rotary punch head and a collection tray. Punch dies are changeable so you can make round, square, slab and diamond tablets in different weights. Output is 12 to 20 kg per hour.\n\nIt runs on a 1 HP single-phase motor. We supply the machine with one die set, training, packing guidance and one year warranty. Camphor powder and packing material are available from our raw material store.",
      features: [
        "12 – 20 kg camphor tablets per hour",
        "Changeable punch dies (round / square / slab)",
        "Adjustable tablet weight and thickness",
        "1 HP single phase — household supply",
        "Stainless steel contact parts",
        "Ideal for home units and SHGs",
        "Raw camphor powder supply available",
      ],
    },
    hi: {
      name: "कपूर बनाने की मशीन",
      tagline: "कपूर टैबलेट प्रेस • 12–20 किलो/घंटा • सिंगल फेज",
      short: "पूजा कपूर के लिए टैबलेट प्रेसिंग मशीन — गोल व चौकोर आकार, बदलने योग्य डाई और एडजस्टेबल वज़न।",
      full: "कपूर मशीन कपूर पाउडर को दबाकर साफ जलने वाली कड़ी टिकिया बनाती है। कम निवेश, आसानी से मिलने वाला कच्चा माल और साल भर मांग — इसलिए यह घरेलू यूनिट और स्वयं सहायता समूह में बहुत लोकप्रिय है।\n\nमशीन में होपर, रोटरी पंच हेड और कलेक्शन ट्रे है। पंच डाई बदली जा सकती है, जिससे गोल, चौकोर, स्लैब और डायमंड टिकिया बनाई जा सकती है। उत्पादन 12 से 20 किलो प्रति घंटा।\n\n1 HP सिंगल फेज मोटर पर चलती है। एक डाई सेट, ट्रेनिंग और एक साल वारंटी के साथ।",
      features: ["12–20 किलो कपूर टिकिया प्रति घंटा", "बदलने योग्य पंच डाई", "एडजस्टेबल वज़न व मोटाई", "1 HP सिंगल फेज", "स्टेनलेस स्टील पार्ट्स", "घरेलू यूनिट व SHG के लिए", "कपूर पाउडर सप्लाई उपलब्ध"],
    },
    or: {
      name: "କର୍ପୂର (କପୂର) ତିଆରି ମେସିନ୍",
      tagline: "କପୂର ଟାବଲେଟ ପ୍ରେସ୍ • 12–20 କେଜି/ଘଣ୍ଟା • ସିଙ୍ଗଲ୍ ଫେଜ୍",
      short: "ପୂଜା କପୂର ପାଇଁ ଟାବଲେଟ ପ୍ରେସିଂ ମେସିନ୍ — ଗୋଲ ଓ ଚଉକୋଣ ଆକାର, ବଦଳାଯୋଗ୍ୟ ଡାଇ।",
      full: "କପୂର ମେସିନ୍ କପୂର ପାଉଡରକୁ ଚାପି ପରିଷ୍କାର ଜଳୁଥିବା ଟିକିଆ ତିଆରି କରେ। କମ୍ ନିବେଶ, ସହଜ କଞ୍ଚାମାଲ ଓ ବର୍ଷସାରା ଚାହିଦା ଥିବାରୁ ଘରୋଇ ୟୁନିଟ୍ ଓ ଶକ୍ତି ସଂଘରେ ବହୁତ ଲୋକପ୍ରିୟ।\n\nମେସିନରେ ହପର୍, ରୋଟାରୀ ପଞ୍ଚ ହେଡ୍ ଓ କଲେକ୍ସନ ଟ୍ରେ ଅଛି। ପଞ୍ଚ ଡାଇ ବଦଳାଇ ଗୋଲ, ଚଉକୋଣ ଓ ସ୍ଲାବ୍ ଟିକିଆ ହେବ। ଉତ୍ପାଦନ ଘଣ୍ଟାକୁ 12 ରୁ 20 କେଜି।",
      features: ["12–20 କେଜି କପୂର ଟିକିଆ/ଘଣ୍ଟା", "ବଦଳାଯୋଗ୍ୟ ପଞ୍ଚ ଡାଇ", "ଆଡଜଷ୍ଟେବଲ୍ ଓଜନ", "1 HP ସିଙ୍ଗଲ୍ ଫେଜ୍", "ଷ୍ଟେନଲେସ ଷ୍ଟିଲ୍ ପାର୍ଟସ", "ଘରୋଇ ୟୁନିଟ୍ ପାଇଁ", "କପୂର ପାଉଡର ସପ୍ଲାଇ"],
    },
    models: [
      m(1, "ME-KP1 Single Punch", "ME-KP1", "12 kg/hr", 12, 48500),
      m(2, "ME-KP2 Double Punch", "ME-KP2", "20 kg/hr", 20, 68000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Camphor Tablet Press" },
      { group: "Output", label: "Capacity", value: "12 – 20 kg / hour" },
      { group: "Technical", label: "Motor", value: "1 HP Single Phase" },
      { group: "Build", label: "Contact Parts", value: "Stainless Steel" },
    ],
  },

  /* ----------------------- ROUND COTTON MACHINE --------------------- */
  {
    slug: "round-cotton-wick-making-machine",
    name: "Round Cotton Wick (Batti) Making Machine",
    category: "Puja & Devotional Machine",
    cover: COTTON, extra: [AGAR],
    mrp: 58000, company: 44000, offer: 39500,
    capacity: "Round & long puja wicks", pph: 9000, power: "0.5 HP, Single phase",
    warranty: "1 Year", sortOrder: 16,
    en: {
      name: "Round Cotton Wick (Batti) Making Machine",
      tagline: "Puja cotton wicks • 150 pieces/minute • very low power",
      short: "Automatic round cotton wick machine for diya and puja batti — rolls uniform wicks from cotton sliver at 150 pieces per minute.",
      full: "The Round Cotton Machine makes the cotton wicks (batti) used in diyas, oil lamps and puja. Cotton sliver is fed into the roller head, which twists and cuts uniform round wicks automatically.\n\nOutput is about 150 pieces a minute — roughly 9,000 an hour. Wick length and thickness are adjustable so you can make small diya battis, long akhand jyot wicks and thick samai wicks on the same machine.\n\nPower consumption is tiny (0.5 HP single phase), making it ideal for home businesses, women's self-help groups and temple supply units. Cotton sliver raw material and packing pouches are available from our store.",
      features: [
        "150 wicks per minute (~9,000 per hour)",
        "Adjustable wick length and thickness",
        "Round, long and thick samai wicks",
        "Only 0.5 HP single phase power",
        "Automatic twisting and cutting",
        "Perfect for SHGs and home units",
        "Cotton sliver supply available",
      ],
    },
    hi: {
      name: "राउंड कॉटन (बत्ती) बनाने की मशीन",
      tagline: "पूजा कॉटन बत्ती • 150 पीस/मिनट • बहुत कम बिजली",
      short: "दीया और पूजा बत्ती के लिए ऑटोमैटिक राउंड कॉटन मशीन — कॉटन स्लाइवर से 150 पीस प्रति मिनट।",
      full: "राउंड कॉटन मशीन दीया, तेल के दीपक और पूजा में इस्तेमाल होने वाली कॉटन बत्ती बनाती है। कॉटन स्लाइवर रोलर हेड में डाला जाता है जो अपने आप एक समान गोल बत्ती बनाकर काटता है।\n\nउत्पादन लगभग 150 पीस प्रति मिनट यानी 9,000 प्रति घंटा। लंबाई और मोटाई एडजस्ट की जा सकती है, जिससे छोटी दीया बत्ती, लंबी अखंड ज्योत बत्ती और मोटी समई बत्ती एक ही मशीन पर बनती है।\n\nबिजली बहुत कम (0.5 HP सिंगल फेज) लगती है।",
      features: ["150 बत्ती प्रति मिनट", "एडजस्टेबल लंबाई व मोटाई", "गोल, लंबी व मोटी बत्ती", "सिर्फ 0.5 HP बिजली", "ऑटोमैटिक ट्विस्टिंग व कटिंग", "SHG व घरेलू यूनिट के लिए", "कॉटन स्लाइवर उपलब्ध"],
    },
    or: {
      name: "ରାଉଣ୍ଡ କଟନ୍ (ବତୀ) ତିଆରି ମେସିନ୍",
      tagline: "ପୂଜା କପା ବତୀ • 150 ପିସ୍/ମିନିଟ୍ • ଅତି କମ୍ ବିଦ୍ୟୁତ୍",
      short: "ଦୀପ ଓ ପୂଜା ବତୀ ପାଇଁ ଅଟୋମାଟିକ୍ ରାଉଣ୍ଡ କଟନ୍ ମେସିନ୍ — ମିନିଟ୍ ପ୍ରତି 150 ପିସ୍।",
      full: "ରାଉଣ୍ଡ କଟନ୍ ମେସିନ୍ ଦୀପ, ତେଲ ଦୀପ ଓ ପୂଜାରେ ବ୍ୟବହୃତ କପା ବତୀ ତିଆରି କରେ। କପା ସ୍ଲାଇଭର ରୋଲର ହେଡରେ ଦିଆଯାଏ ଯାହା ଆପେ ଆପେ ସମାନ ଗୋଲ ବତୀ ତିଆରି କରି କାଟେ।\n\nଉତ୍ପାଦନ ପ୍ରାୟ ମିନିଟ୍ ପ୍ରତି 150 ପିସ୍ ଅର୍ଥାତ୍ ଘଣ୍ଟାକୁ 9,000। ଲମ୍ବ ଓ ମୋଟେଇ ଆଡଜଷ୍ଟ କରାଯାଇପାରେ।\n\nବିଦ୍ୟୁତ୍ ଖର୍ଚ୍ଚ ବହୁତ କମ୍ (0.5 HP ସିଙ୍ଗଲ୍ ଫେଜ୍)।",
      features: ["ମିନିଟ୍ ପ୍ରତି 150 ବତୀ", "ଆଡଜଷ୍ଟେବଲ୍ ଲମ୍ବ ଓ ମୋଟେଇ", "ଗୋଲ, ଲମ୍ବା ଓ ମୋଟା ବତୀ", "ମାତ୍ର 0.5 HP", "ଅଟୋମାଟିକ୍ କଟିଂ", "SHG ପାଇଁ ଉପଯୁକ୍ତ", "କପା ସ୍ଲାଇଭର ମିଳେ"],
    },
    models: [
      m(1, "ME-RC1 Single Head", "ME-RC1", "9,000/hr", 9000, 39500),
      m(2, "ME-RC2 Double Head", "ME-RC2", "17,000/hr", 17000, 58000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Cotton Wick Rolling" },
      { group: "Output", label: "Speed", value: "150 pieces / minute" },
      { group: "Technical", label: "Motor", value: "0.5 HP Single Phase" },
      { group: "Build", label: "Weight", value: "Approx. 95 kg" },
    ],
  },

  /* --------------------- SCRUBBER MAKING 4 HEAD --------------------- */
  {
    slug: "scrubber-making-machine-4-head",
    name: "Scrubber Making Machine (4 Head)",
    category: "Scrubber Machine",
    cover: SCRUBBER, extra: [FACTORY],
    mrp: 168000, company: 132000, offer: 118000,
    capacity: "4 heads • 2000–2400 scrubbers/day", pph: 300, power: "1.5 HP, Single phase",
    warranty: "1 Year", featured: true, sortOrder: 17,
    en: {
      name: "Scrubber Making Machine (4 Head)",
      tagline: "4 spindles • 300 scrubbers/hour • steel & nylon scrubber",
      short: "Four-head scrubber making machine that knits stainless steel and nylon scrubbers automatically — one operator runs all four heads.",
      full: "The 4-Head Scrubber Making Machine knits cleaning scrubbers from stainless steel wire or nylon yarn. Four independent spindles run simultaneously from a single motor, so one operator can produce around 300 finished scrubbers an hour — roughly 2,000 to 2,400 pieces in a working day.\n\nScrubber size and density are adjustable, letting you make the small kitchen scrubber, the large utensil scrubber and the coloured nylon scrubber on the same machine. The knitting heads are precision-made so the mesh is tight and does not unravel.\n\nPair it with our Semi Packing Machine or Fully Automatic Scrubber Packing line for a complete scrubber plant. Stainless steel wire, nylon yarn and blister packing material are available from our raw material store.",
      features: [
        "4 independent knitting heads",
        "~300 scrubbers per hour (2000+ per day)",
        "Stainless steel and nylon scrubbers",
        "Adjustable size and mesh density",
        "Single operator for all 4 heads",
        "1.5 HP single phase motor",
        "Matches our packing machine range",
      ],
    },
    hi: {
      name: "स्क्रबर बनाने की मशीन (4 हेड)",
      tagline: "4 स्पिंडल • 300 स्क्रबर/घंटा • स्टील व नायलॉन",
      short: "चार-हेड स्क्रबर मशीन जो स्टेनलेस स्टील और नायलॉन स्क्रबर अपने आप बुनती है — एक ऑपरेटर चारों हेड चलाता है।",
      full: "4-हेड स्क्रबर मशीन स्टेनलेस स्टील वायर या नायलॉन धागे से सफाई स्क्रबर बुनती है। एक ही मोटर से चार स्वतंत्र स्पिंडल चलते हैं, इसलिए एक ऑपरेटर लगभग 300 स्क्रबर प्रति घंटा — यानी दिन में 2,000 से 2,400 पीस बना सकता है।\n\nस्क्रबर का साइज़ और घनत्व एडजस्ट होता है, जिससे छोटा किचन स्क्रबर, बड़ा बर्तन स्क्रबर और रंगीन नायलॉन स्क्रबर एक ही मशीन पर बनता है।\n\nहमारी सेमी पैकिंग या फुली ऑटोमैटिक पैकिंग मशीन के साथ पूरा स्क्रबर प्लांट बनाया जा सकता है।",
      features: ["4 स्वतंत्र बुनाई हेड", "~300 स्क्रबर प्रति घंटा", "स्टील व नायलॉन स्क्रबर", "एडजस्टेबल साइज़ व घनत्व", "एक ऑपरेटर, चार हेड", "1.5 HP सिंगल फेज", "पैकिंग मशीन के साथ मैच"],
    },
    or: {
      name: "ସ୍କ୍ରବର ତିଆରି ମେସିନ୍ (4 ହେଡ୍)",
      tagline: "4 ସ୍ପିଣ୍ଡଲ୍ • 300 ସ୍କ୍ରବର/ଘଣ୍ଟା • ଷ୍ଟିଲ୍ ଓ ନାଇଲନ୍",
      short: "ଚାରି-ହେଡ୍ ସ୍କ୍ରବର ମେସିନ୍ ଯାହା ଷ୍ଟେନଲେସ ଷ୍ଟିଲ୍ ଓ ନାଇଲନ୍ ସ୍କ୍ରବର ଆପେ ଆପେ ବୁଣେ।",
      full: "4-ହେଡ୍ ସ୍କ୍ରବର ମେସିନ୍ ଷ୍ଟେନଲେସ ଷ୍ଟିଲ୍ ତାର କିମ୍ବା ନାଇଲନ୍ ସୂତାରୁ ସଫା କରିବା ସ୍କ୍ରବର ବୁଣେ। ଗୋଟିଏ ମୋଟରରୁ ଚାରିଟି ସ୍ୱାଧୀନ ସ୍ପିଣ୍ଡଲ୍ ଚାଲେ, ତେଣୁ ଜଣେ ଅପରେଟର ଘଣ୍ଟାକୁ ପ୍ରାୟ 300 ସ୍କ୍ରବର — ଦିନକୁ 2,000 ରୁ 2,400 ପିସ୍ ତିଆରି କରିପାରିବେ।\n\nସ୍କ୍ରବର ସାଇଜ୍ ଓ ଘନତ୍ୱ ଆଡଜଷ୍ଟ ହୁଏ।",
      features: ["4 ସ୍ୱାଧୀନ ହେଡ୍", "~300 ସ୍କ୍ରବର/ଘଣ୍ଟା", "ଷ୍ଟିଲ୍ ଓ ନାଇଲନ୍", "ଆଡଜଷ୍ଟେବଲ୍ ସାଇଜ୍", "ଜଣେ ଅପରେଟର", "1.5 HP ସିଙ୍ଗଲ୍ ଫେଜ୍", "ପ୍ୟାକିଂ ମେସିନ୍ ସହ ମେଳ"],
    },
    models: [
      m(1, "4 Head Scrubber Machine", "ME-SB4", "300/hr", 300, 118000),
      m(2, "6 Head Scrubber Machine", "ME-SB6", "450/hr", 450, 165000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Scrubber Knitting, 4 Head" },
      { group: "Output", label: "Production", value: "300 scrubbers / hour" },
      { group: "Output", label: "Daily Output", value: "2000 – 2400 pieces" },
      { group: "Technical", label: "Motor", value: "1.5 HP Single Phase" },
      { group: "Build", label: "Material", value: "SS wire / Nylon yarn" },
    ],
  },

  /* --------------------- SCRUBBER MAKING 6 HEAD --------------------- */
  {
    slug: "scrubber-making-machine-6-head",
    name: "Scrubber Making Machine (6 Head)",
    category: "Scrubber Machine",
    cover: SCRUBBER, extra: [PACKING, FACTORY],
    mrp: 215000, company: 172000, offer: 158000,
    capacity: "6 heads • 3500+ scrubbers/day", pph: 450, power: "2 HP, Single phase",
    warranty: "1 Year", sortOrder: 18,
    en: {
      name: "Scrubber Making Machine (6 Head)",
      tagline: "6 spindles • 450 scrubbers/hour • production-scale model",
      short: "Six-head production model for established scrubber units — 50% more output than the 4-head machine from the same floor space.",
      full: "The 6-Head Scrubber Making Machine is the production-scale version of our scrubber line. Six knitting spindles run from one 2 HP drive, pushing output to about 450 scrubbers per hour — over 3,500 pieces in a working day.\n\nIt occupies only slightly more floor space than the 4-head model, so the output per square foot is significantly better. Each head can be stopped independently for wire changes without halting the whole machine.\n\nRecommended for units already supplying wholesale markets or running a packing line. Combine it with the Fully Automatic Scrubber Packing machine for an end-to-end plant.",
      features: [
        "6 independent knitting heads",
        "~450 scrubbers per hour (3500+ per day)",
        "Each head can stop independently",
        "2 HP single phase drive",
        "Better output per square foot",
        "Steel and nylon scrubbers",
        "Pairs with automatic packing line",
      ],
    },
    hi: {
      name: "स्क्रबर बनाने की मशीन (6 हेड)",
      tagline: "6 स्पिंडल • 450 स्क्रबर/घंटा • प्रोडक्शन मॉडल",
      short: "स्थापित स्क्रबर यूनिट के लिए छह-हेड प्रोडक्शन मॉडल — उसी जगह में 4-हेड से 50% ज़्यादा उत्पादन।",
      full: "6-हेड स्क्रबर मशीन हमारी स्क्रबर लाइन का प्रोडक्शन-स्केल वर्ज़न है। एक 2 HP ड्राइव से छह बुनाई स्पिंडल चलते हैं, जिससे उत्पादन लगभग 450 स्क्रबर प्रति घंटा — दिन में 3,500 से ज़्यादा पीस हो जाता है।\n\nजगह 4-हेड से थोड़ी ही ज़्यादा लगती है, इसलिए प्रति वर्ग फुट उत्पादन काफ़ी बेहतर है। वायर बदलने के लिए हर हेड अलग से बंद किया जा सकता है।",
      features: ["6 स्वतंत्र बुनाई हेड", "~450 स्क्रबर प्रति घंटा", "हर हेड अलग से बंद", "2 HP सिंगल फेज", "प्रति वर्ग फुट बेहतर उत्पादन", "स्टील व नायलॉन", "ऑटोमैटिक पैकिंग के साथ"],
    },
    or: {
      name: "ସ୍କ୍ରବର ତିଆରି ମେସିନ୍ (6 ହେଡ୍)",
      tagline: "6 ସ୍ପିଣ୍ଡଲ୍ • 450 ସ୍କ୍ରବର/ଘଣ୍ଟା • ପ୍ରୋଡକ୍ସନ ମଡେଲ୍",
      short: "ଛଅ-ହେଡ୍ ପ୍ରୋଡକ୍ସନ ମଡେଲ୍ — ସମାନ ଜାଗାରେ 4-ହେଡ୍ ଠାରୁ 50% ଅଧିକ ଉତ୍ପାଦନ।",
      full: "6-ହେଡ୍ ସ୍କ୍ରବର ମେସିନ୍ ଆମ ସ୍କ୍ରବର ଲାଇନର ପ୍ରୋଡକ୍ସନ ଭର୍ସନ। ଗୋଟିଏ 2 HP ଡ୍ରାଇଭରୁ ଛଅଟି ସ୍ପିଣ୍ଡଲ୍ ଚାଲେ, ଉତ୍ପାଦନ ଘଣ୍ଟାକୁ ପ୍ରାୟ 450 — ଦିନକୁ 3,500 ରୁ ଅଧିକ।\n\nପ୍ରତ୍ୟେକ ହେଡ୍ ଅଲଗା ଭାବେ ବନ୍ଦ କରାଯାଇପାରେ।",
      features: ["6 ସ୍ୱାଧୀନ ହେଡ୍", "~450 ସ୍କ୍ରବର/ଘଣ୍ଟା", "ପ୍ରତ୍ୟେକ ହେଡ୍ ଅଲଗା", "2 HP ସିଙ୍ଗଲ୍ ଫେଜ୍", "ଅଧିକ ଉତ୍ପାଦନ", "ଷ୍ଟିଲ୍ ଓ ନାଇଲନ୍", "ଅଟୋ ପ୍ୟାକିଂ ସହ"],
    },
    models: [
      m(1, "6 Head Standard", "ME-SB6", "450/hr", 450, 158000),
      m(2, "6 Head with Auto Collector", "ME-SB6A", "480/hr", 480, 186000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Scrubber Knitting, 6 Head" },
      { group: "Output", label: "Production", value: "450 scrubbers / hour" },
      { group: "Technical", label: "Motor", value: "2 HP Single Phase" },
      { group: "Build", label: "Weight", value: "Approx. 420 kg" },
    ],
  },

  /* ------------------ FULLY AUTOMATIC SCRUBBER PACKING -------------- */
  {
    slug: "fully-automatic-scrubber-packing-machine",
    name: "Fully Automatic Scrubber Packing Machine",
    category: "Packing Machine",
    cover: PACKING, extra: [SCRUBBER, FACTORY, SPARE],
    mrp: 395000, company: 315000, offer: 289000,
    capacity: "40 – 60 packs / minute", pph: 3000, power: "3 HP, Single/Three phase",
    warranty: "1 Year", featured: true, sortOrder: 19,
    en: {
      name: "Fully Automatic Scrubber Packing Machine",
      tagline: "Auto feeding + blister sealing • 40–60 packs/minute",
      short: "Complete automatic packing line for scrubbers — hopper feeding, counting, blister forming and heat sealing with printed film.",
      full: "The Fully Automatic Scrubber Packing Machine takes loose scrubbers from the hopper, counts them, places them into formed blister pockets and heat-seals the printed film — all without manual handling.\n\nSpeed is 40 to 60 packs per minute depending on pack count. Pack configurations such as 1-piece, 3-piece and 6-piece are set from the control panel, and the sealing temperature and dwell time are digitally controlled for a clean, leak-proof seal.\n\nThis machine turns a scrubber making unit into a branded consumer-product business — your own printed pouches on the shelf instead of loose pieces. We also supply the Semi Packing Machine for smaller units and the printed blister film itself.",
      features: [
        "Automatic hopper feeding and counting",
        "40 – 60 packs per minute",
        "Blister forming + heat sealing in one pass",
        "1 / 3 / 6 piece pack configurations",
        "Digital temperature and dwell control",
        "Works with printed branded film",
        "Semi-automatic model also available",
      ],
    },
    hi: {
      name: "फुली ऑटोमैटिक स्क्रबर पैकिंग मशीन",
      tagline: "ऑटो फीडिंग + ब्लिस्टर सीलिंग • 40–60 पैक/मिनट",
      short: "स्क्रबर के लिए पूरी ऑटोमैटिक पैकिंग लाइन — होपर फीडिंग, गिनती, ब्लिस्टर फॉर्मिंग और हीट सीलिंग।",
      full: "फुली ऑटोमैटिक स्क्रबर पैकिंग मशीन होपर से स्क्रबर उठाती है, गिनती करती है, ब्लिस्टर पॉकेट में रखती है और प्रिंटेड फिल्म को हीट सील कर देती है — बिना किसी हाथ के काम के।\n\nस्पीड 40 से 60 पैक प्रति मिनट। 1-पीस, 3-पीस और 6-पीस पैक कंट्रोल पैनल से सेट होते हैं। सीलिंग तापमान डिजिटल कंट्रोल में है।\n\nयह मशीन स्क्रबर यूनिट को ब्रांडेड कंज़्यूमर प्रोडक्ट बिज़नेस में बदल देती है।",
      features: ["ऑटो होपर फीडिंग व गिनती", "40–60 पैक प्रति मिनट", "ब्लिस्टर फॉर्मिंग + हीट सीलिंग", "1 / 3 / 6 पीस पैक", "डिजिटल तापमान कंट्रोल", "प्रिंटेड ब्रांडेड फिल्म", "सेमी-ऑटोमैटिक मॉडल भी"],
    },
    or: {
      name: "ଫୁଲି ଅଟୋମାଟିକ୍ ସ୍କ୍ରବର ପ୍ୟାକିଂ ମେସିନ୍",
      tagline: "ଅଟୋ ଫିଡିଂ + ବ୍ଲିଷ୍ଟର ସିଲିଂ • 40–60 ପ୍ୟାକ୍/ମିନିଟ୍",
      short: "ସ୍କ୍ରବର ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ଅଟୋମାଟିକ୍ ପ୍ୟାକିଂ ଲାଇନ୍ — ହପର ଫିଡିଂ, ଗଣନା, ବ୍ଲିଷ୍ଟର ଓ ହିଟ୍ ସିଲିଂ।",
      full: "ଏହି ମେସିନ୍ ହପରରୁ ସ୍କ୍ରବର ନେଇ ଗଣେ, ବ୍ଲିଷ୍ଟର ପକେଟରେ ରଖେ ଏବଂ ପ୍ରିଣ୍ଟେଡ୍ ଫିଲ୍ମକୁ ହିଟ୍ ସିଲ୍ କରେ — ହାତ ଲଗାଇବା ବିନା।\n\nଗତି ମିନିଟ୍ ପ୍ରତି 40 ରୁ 60 ପ୍ୟାକ୍। 1, 3 ଓ 6 ପିସ୍ ପ୍ୟାକ୍ କଣ୍ଟ୍ରୋଲ ପ୍ୟାନେଲରୁ ସେଟ୍ ହୁଏ।",
      features: ["ଅଟୋ ଫିଡିଂ ଓ ଗଣନା", "40–60 ପ୍ୟାକ୍/ମିନିଟ୍", "ବ୍ଲିଷ୍ଟର + ହିଟ୍ ସିଲିଂ", "1 / 3 / 6 ପିସ୍ ପ୍ୟାକ୍", "ଡିଜିଟାଲ୍ ତାପମାତ୍ରା", "ପ୍ରିଣ୍ଟେଡ୍ ଫିଲ୍ମ", "ସେମି ମଡେଲ୍ ମଧ୍ୟ"],
    },
    models: [
      m(1, "Semi Packing Machine", "ME-SP-S", "15 packs/min", 900, 95000),
      m(2, "Fully Automatic Packing", "ME-SP-F", "40–60 packs/min", 3000, 289000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Automatic Blister Packing" },
      { group: "Output", label: "Speed", value: "40 – 60 packs / minute" },
      { group: "Technical", label: "Power", value: "3 HP" },
      { group: "Technical", label: "Sealing", value: "Digital temperature controlled" },
      { group: "Build", label: "Pack Types", value: "1 / 3 / 6 piece" },
    ],
  },

  /* --------------------- MANUAL PACKING MACHINE --------------------- */
  {
    slug: "manual-packing-machine",
    name: "Manual Packing Machine",
    category: "Packing Machine",
    cover: PACKING, extra: [SPARE],
    mrp: 42000, company: 32000, offer: 28500,
    capacity: "8 – 12 packs / minute", pph: 600, power: "0.5 HP / manual lever",
    warranty: "1 Year", sortOrder: 20,
    en: {
      name: "Manual Packing Machine",
      tagline: "Hand-lever sealing • low cost • any pouch size",
      short: "Simple hand-operated packing and sealing machine for scrubbers, agarbatti, camphor and small consumer items.",
      full: "The Manual Packing Machine is the entry-level sealing solution for small units. The operator places the product in the pouch or blister tray, pulls the lever, and the heated sealing bar closes the pack cleanly.\n\nIt handles any pouch size up to the bar width and works with LDPE, BOPP and laminated printed film. Sealing temperature is adjustable with a simple dial, so the same machine can seal thin agarbatti pouches and thick scrubber blisters.\n\nBecause it is lever-driven there is almost no running cost and no technical skill required. Many of our customers start here and upgrade to the digital or fully automatic machine as their orders grow.",
      features: [
        "Hand lever operation — no skill needed",
        "8 – 12 packs per minute",
        "Adjustable sealing temperature dial",
        "LDPE / BOPP / laminated printed film",
        "Works for scrubber, agarbatti, camphor, spices",
        "Almost zero running cost",
        "Upgrade path to digital & automatic models",
      ],
    },
    hi: {
      name: "मैनुअल पैकिंग मशीन",
      tagline: "हैंड लीवर सीलिंग • कम लागत • किसी भी पाउच साइज़",
      short: "स्क्रबर, अगरबत्ती, कपूर और छोटे सामान के लिए आसान हाथ से चलने वाली पैकिंग व सीलिंग मशीन।",
      full: "मैनुअल पैकिंग मशीन छोटे यूनिट के लिए शुरुआती सीलिंग समाधान है। ऑपरेटर सामान पाउच या ब्लिस्टर ट्रे में रखता है, लीवर खींचता है और गर्म सीलिंग बार पैक को साफ़-सुथरा बंद कर देता है।\n\nबार की चौड़ाई तक कोई भी पाउच साइज़ चलता है और LDPE, BOPP व लैमिनेटेड प्रिंटेड फिल्म पर काम करती है। तापमान डायल से सेट होता है।\n\nलीवर से चलने की वजह से चलाने का खर्च लगभग शून्य है और कोई तकनीकी स्किल नहीं चाहिए।",
      features: ["हैंड लीवर, कोई स्किल नहीं", "8–12 पैक प्रति मिनट", "एडजस्टेबल तापमान डायल", "LDPE / BOPP / प्रिंटेड फिल्म", "स्क्रबर, अगरबत्ती, कपूर, मसाला", "लगभग शून्य खर्च", "आगे अपग्रेड का विकल्प"],
    },
    or: {
      name: "ମାନୁଆଲ ପ୍ୟାକିଂ ମେସିନ୍",
      tagline: "ହାତ ଲିଭର ସିଲିଂ • କମ୍ ଖର୍ଚ୍ଚ • ଯେକୌଣସି ପାଉଚ୍",
      short: "ସ୍କ୍ରବର, ଅଗରବତ୍ତି, କପୂର ଓ ଛୋଟ ସାମଗ୍ରୀ ପାଇଁ ସରଳ ହାତ ଚାଳିତ ପ୍ୟାକିଂ ମେସିନ୍।",
      full: "ମାନୁଆଲ ପ୍ୟାକିଂ ମେସିନ୍ ଛୋଟ ୟୁନିଟ୍ ପାଇଁ ପ୍ରଥମ ପର୍ଯ୍ୟାୟର ସିଲିଂ ସମାଧାନ। ଅପରେଟର ସାମଗ୍ରୀ ପାଉଚ୍‌ରେ ରଖି ଲିଭର ଟାଣନ୍ତି ଏବଂ ଗରମ ସିଲିଂ ବାର୍ ପ୍ୟାକ୍ ବନ୍ଦ କରିଦିଏ।\n\nLDPE, BOPP ଓ ଲାମିନେଟେଡ୍ ପ୍ରିଣ୍ଟେଡ୍ ଫିଲ୍ମରେ କାମ କରେ। ତାପମାତ୍ରା ଡାଏଲରୁ ସେଟ୍ ହୁଏ।",
      features: ["ହାତ ଲିଭର, ସ୍କିଲ୍ ଦରକାର ନାହିଁ", "8–12 ପ୍ୟାକ୍/ମିନିଟ୍", "ଆଡଜଷ୍ଟେବଲ୍ ତାପମାତ୍ରା", "LDPE / BOPP ଫିଲ୍ମ", "ସ୍କ୍ରବର, ଅଗରବତ୍ତି, କପୂର", "ପ୍ରାୟ ଶୂନ ଖର୍ଚ୍ଚ", "ଅପଗ୍ରେଡ୍ ବିକଳ୍ପ"],
    },
    models: [
      m(1, "Hand Sealer 12 inch", "ME-MP12", "8 packs/min", 480, 22000),
      m(2, "Pedestal Sealer 18 inch", "ME-MP18", "12 packs/min", 600, 28500),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Manual Lever Sealer" },
      { group: "Output", label: "Speed", value: "8 – 12 packs / minute" },
      { group: "Technical", label: "Sealing Bar", value: "12 inch / 18 inch" },
      { group: "Technical", label: "Film", value: "LDPE / BOPP / Laminated" },
    ],
  },

  /* ------------------ MANUAL DIGITAL PACKING MACHINE ---------------- */
  {
    slug: "manual-digital-packing-machine",
    name: "Manual Digital Packing Machine",
    category: "Packing Machine",
    cover: PACKING, extra: [SPARE],
    mrp: 92000, company: 72000, offer: 64500,
    capacity: "15 – 20 packs / minute", pph: 1000, power: "1 HP, Single phase",
    warranty: "1 Year", sortOrder: 21,
    en: {
      name: "Manual Digital Packing Machine",
      tagline: "Digital timer & temperature • blister tray • repeatable seals",
      short: "Digital-controlled semi-automatic packing press with blister tray — consistent, repeatable seals every single time.",
      full: "The Manual Digital Packing Machine adds a digital controller to the manual press. Sealing temperature, dwell time and cooling are all set on the digital panel, so every pack comes out identical regardless of who is operating the machine.\n\nThe heavy table-top frame holds a multi-cavity blister tray — typically 12 cavities — so one stroke seals twelve packs at once. That gives 15 to 20 packs per minute in practice, with far better pack appearance than a plain hand sealer.\n\nThis is the most popular choice for scrubber and camphor units that want branded retail packing but are not yet ready for the fully automatic line.",
      features: [
        "Digital temperature, dwell and cooling control",
        "Multi-cavity blister tray (12 cavities typical)",
        "15 – 20 packs per minute",
        "Identical seal quality every stroke",
        "Heavy table-top frame, low vibration",
        "Trays available for different product sizes",
        "Perfect step between manual and automatic",
      ],
    },
    hi: {
      name: "मैनुअल डिजिटल पैकिंग मशीन",
      tagline: "डिजिटल टाइमर व तापमान • ब्लिस्टर ट्रे • एक जैसी सीलिंग",
      short: "डिजिटल कंट्रोल वाली सेमी-ऑटोमैटिक पैकिंग प्रेस — हर बार एक जैसी, भरोसेमंद सीलिंग।",
      full: "मैनुअल डिजिटल पैकिंग मशीन में मैनुअल प्रेस के साथ डिजिटल कंट्रोलर जुड़ा है। सीलिंग तापमान, समय और कूलिंग डिजिटल पैनल पर सेट होते हैं, इसलिए कोई भी ऑपरेटर चलाए, हर पैक एक जैसा निकलता है।\n\nभारी टेबल-टॉप फ्रेम में मल्टी-कैविटी ब्लिस्टर ट्रे (आमतौर पर 12 कैविटी) लगती है, यानी एक स्ट्रोक में बारह पैक सील होते हैं। व्यवहार में 15 से 20 पैक प्रति मिनट मिलते हैं।\n\nस्क्रबर और कपूर यूनिट के लिए यह सबसे लोकप्रिय विकल्प है।",
      features: ["डिजिटल तापमान व समय कंट्रोल", "मल्टी-कैविटी ब्लिस्टर ट्रे", "15–20 पैक प्रति मिनट", "हर बार एक जैसी सीलिंग", "भारी टेबल-टॉप फ्रेम", "अलग-अलग साइज़ की ट्रे", "मैनुअल व ऑटोमैटिक के बीच"],
    },
    or: {
      name: "ମାନୁଆଲ ଡିଜିଟାଲ ପ୍ୟାକିଂ ମେସିନ୍",
      tagline: "ଡିଜିଟାଲ ଟାଇମର ଓ ତାପମାତ୍ରା • ବ୍ଲିଷ୍ଟର ଟ୍ରେ",
      short: "ଡିଜିଟାଲ ନିୟନ୍ତ୍ରିତ ସେମି-ଅଟୋମାଟିକ୍ ପ୍ୟାକିଂ ପ୍ରେସ୍ — ପ୍ରତିଥର ସମାନ ସିଲିଂ।",
      full: "ମାନୁଆଲ ଡିଜିଟାଲ ପ୍ୟାକିଂ ମେସିନରେ ଡିଜିଟାଲ କଣ୍ଟ୍ରୋଲର ଲାଗିଛି। ସିଲିଂ ତାପମାତ୍ରା, ସମୟ ଓ କୁଲିଂ ପ୍ୟାନେଲରୁ ସେଟ୍ ହୁଏ, ତେଣୁ ଯିଏ ଚଲାଉ ନା କାହିଁକି ପ୍ରତ୍ୟେକ ପ୍ୟାକ୍ ସମାନ ହୁଏ।\n\nଭାରୀ ଟେବୁଲ ଫ୍ରେମରେ ମଲ୍ଟି-କ୍ୟାଭିଟି ବ୍ଲିଷ୍ଟର ଟ୍ରେ (ସାଧାରଣତଃ 12) ଲାଗେ।",
      features: ["ଡିଜିଟାଲ ତାପମାତ୍ରା ନିୟନ୍ତ୍ରଣ", "ମଲ୍ଟି-କ୍ୟାଭିଟି ଟ୍ରେ", "15–20 ପ୍ୟାକ୍/ମିନିଟ୍", "ସମାନ ସିଲିଂ", "ଭାରୀ ଫ୍ରେମ୍", "ବିଭିନ୍ନ ସାଇଜ ଟ୍ରେ", "ଉପଯୁକ୍ତ ମଧ୍ୟବର୍ତ୍ତୀ ପସନ୍ଦ"],
    },
    models: [
      m(1, "12 Cavity Digital", "ME-MD12", "15 packs/min", 900, 64500),
      m(2, "16 Cavity Digital", "ME-MD16", "20 packs/min", 1200, 82000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Digital Semi-Automatic Press" },
      { group: "Output", label: "Speed", value: "15 – 20 packs / minute" },
      { group: "Technical", label: "Control", value: "Digital temperature + timer" },
      { group: "Build", label: "Tray", value: "12 / 16 cavity blister" },
    ],
  },

  /* ---------------------- FULLY PAPER PLATE ------------------------- */
  {
    slug: "fully-automatic-paper-plate-machine",
    name: "Fully Automatic Paper Plate Machine",
    category: "Paper Plate Machine",
    cover: PLATE, extra: [DOUBLE, FACTORY],
    mrp: 395000, company: 320000, offer: 289000,
    capacity: '4" – 14" plates, auto feed', pph: 9000, power: "5.5 kW (7.5 HP)",
    warranty: "1 Year Comprehensive", featured: true, sortOrder: 5,
    en: {
      name: "Fully Automatic Paper Plate Machine",
      tagline: "Auto paper feeding • 9000 plates/hour • no manual loading",
      short: "Fully automatic plate line with roll feeding, auto punching, forming and plate stacking — one operator supervises instead of feeding.",
      full: "The Fully Automatic Paper Plate Machine removes the biggest bottleneck in plate manufacturing — manual sheet feeding. Paper is loaded as a roll, the servo feeder indexes it automatically, and the machine punches, forms and stacks finished plates continuously.\n\nOutput reaches 9,000 plates per hour, more than double a semi-automatic machine, and labour drops to one supervising operator. Plate sizes from 4 inch to 14 inch are handled by changing the die, and the digital counter tracks production per shift.\n\nThe machine includes an auto plate collector, overload protection, emergency stops and interlocked guards. It is the right choice for units supplying caterers, marriage halls and wholesale markets in volume.",
      features: [
        "Automatic roll feeding — no manual sheets",
        "9,000 plates per hour",
        "Servo indexing with digital counter",
        "Auto plate stacking / collector",
        'Die change for 4" to 14" plates',
        "Overload protection + interlocked guards",
        "One supervising operator only",
      ],
    },
    hi: {
      name: "फुली ऑटोमैटिक पेपर प्लेट मशीन",
      tagline: "ऑटो पेपर फीडिंग • 9000 प्लेट/घंटा • बिना हाथ से लोडिंग",
      short: "रोल फीडिंग, ऑटो पंचिंग, फॉर्मिंग और प्लेट स्टैकिंग वाली पूरी ऑटोमैटिक लाइन — ऑपरेटर सिर्फ़ निगरानी करता है।",
      full: "फुली ऑटोमैटिक पेपर प्लेट मशीन प्लेट निर्माण की सबसे बड़ी रुकावट — हाथ से शीट डालना — खत्म कर देती है। कागज़ रोल में लगता है, सर्वो फीडर उसे अपने आप आगे बढ़ाता है और मशीन लगातार प्लेट पंच, फॉर्म और स्टैक करती रहती है।\n\nउत्पादन 9,000 प्लेट प्रति घंटा तक पहुंचता है — सेमी ऑटोमैटिक से दोगुने से भी ज़्यादा — और मज़दूरी घटकर सिर्फ़ एक निगरानी करने वाले ऑपरेटर तक रह जाती है। डाई बदलकर 4 इंच से 14 इंच तक प्लेट बनती है।",
      features: ["ऑटो रोल फीडिंग", "9,000 प्लेट प्रति घंटा", "सर्वो इंडेक्सिंग व डिजिटल काउंटर", "ऑटो प्लेट स्टैकिंग", "4 से 14 इंच डाई", "ओवरलोड प्रोटेक्शन व सेफ्टी गार्ड", "सिर्फ़ एक ऑपरेटर"],
    },
    or: {
      name: "ଫୁଲି ଅଟୋମାଟିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍",
      tagline: "ଅଟୋ ପେପର ଫିଡିଂ • 9000 ପ୍ଲେଟ୍/ଘଣ୍ଟା",
      short: "ରୋଲ୍ ଫିଡିଂ, ଅଟୋ ପଞ୍ଚିଂ, ଫର୍ମିଂ ଓ ଷ୍ଟାକିଂ ସହିତ ସମ୍ପୂର୍ଣ୍ଣ ଅଟୋମାଟିକ୍ ଲାଇନ୍।",
      full: "ଫୁଲି ଅଟୋମାଟିକ୍ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ ହାତରେ ସିଟ୍ ଦେବାର ସମସ୍ୟା ଦୂର କରେ। କାଗଜ ରୋଲ୍‌ରେ ଲାଗେ, ସର୍ଭୋ ଫିଡର ଆପେ ଆଗକୁ ବଢ଼ାଏ ଏବଂ ମେସିନ୍ ଲଗାତାର ପ୍ଲେଟ୍ ତିଆରି ଓ ଷ୍ଟାକ୍ କରେ।\n\nଉତ୍ପାଦନ ଘଣ୍ଟାକୁ 9,000 ପ୍ଲେଟ୍ ପର୍ଯ୍ୟନ୍ତ। ଡାଇ ବଦଳାଇ 4 ରୁ 14 ଇଞ୍ଚ ପ୍ଲେଟ୍ ହୁଏ।",
      features: ["ଅଟୋ ରୋଲ୍ ଫିଡିଂ", "9,000 ପ୍ଲେଟ୍/ଘଣ୍ଟା", "ସର୍ଭୋ ଇଣ୍ଡେକ୍ସିଂ", "ଅଟୋ ଷ୍ଟାକିଂ", "4–14 ଇଞ୍ଚ ଡାଇ", "ସେଫ୍ଟି ଗାର୍ଡ", "ଜଣେ ଅପରେଟର"],
    },
    models: [
      m(1, "ME-FA7 Standard", "ME-FA7", '4"–12"', 8000, 289000),
      m(2, "ME-FA9 High Speed", "ME-FA9", '4"–14"', 9000, 345000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Fully Automatic Plate Line" },
      { group: "Output", label: "Production", value: "8,000 – 9,000 plates / hour" },
      { group: "Output", label: "Plate Size", value: '4 inch – 14 inch' },
      { group: "Technical", label: "Power", value: "5.5 kW (7.5 HP)" },
      { group: "Technical", label: "Feeding", value: "Automatic roll + servo index" },
    ],
  },

  /* --------------------- SINGLE DIE PAPER PLATE --------------------- */
  {
    slug: "single-die-paper-plate-machine",
    name: "Single Die Paper Plate Machine",
    category: "Paper Plate Machine",
    cover: PLATE, extra: [SPARE],
    mrp: 118000, company: 92000, offer: 84500,
    capacity: '4" – 12" plates', pph: 3200, power: "2.2 kW (3 HP)",
    warranty: "1 Year Comprehensive", sortOrder: 6,
    en: {
      name: "Single Die Paper Plate Machine",
      tagline: "One die station • 3200 plates/hour • best starter machine",
      short: "Compact single die plate machine with a closed cabinet body — the most popular starter machine for a new paper plate unit.",
      full: "The Single Die Paper Plate Machine is our most sold starter machine. It has one die station inside a closed sheet-metal cabinet, which keeps the hydraulics clean and makes the machine safe for a household workshop.\n\nOne operator feeds pre-cut sheets and the machine presses finished plates at about 3,200 per hour. Plate sizes from 4 inch to 12 inch are covered by changing the die set, and we keep every die size in stock at Khalikot.\n\nThe machine needs only 80 square feet of floor space and a 2.2 kW single-phase connection, so it can be installed in a spare room. Installation, operator training, one die set and one year warranty are included.",
      features: [
        "Single die station in a closed cabinet",
        "3,200 plates per hour",
        'Die sizes 4" to 12" in stock',
        "Only 80 sq.ft. floor space needed",
        "2.2 kW single phase connection",
        "Safe closed body for home workshops",
        "One free die set + training included",
      ],
    },
    hi: {
      name: "सिंगल डाई पेपर प्लेट मशीन",
      tagline: "एक डाई स्टेशन • 3200 प्लेट/घंटा • सबसे अच्छी शुरुआती मशीन",
      short: "बंद कैबिनेट बॉडी वाली कॉम्पैक्ट सिंगल डाई प्लेट मशीन — नई पेपर प्लेट यूनिट के लिए सबसे लोकप्रिय।",
      full: "सिंगल डाई पेपर प्लेट मशीन हमारी सबसे ज़्यादा बिकने वाली शुरुआती मशीन है। बंद शीट-मेटल कैबिनेट के अंदर एक डाई स्टेशन होता है, जिससे हाइड्रोलिक्स साफ़ रहते हैं और मशीन घरेलू वर्कशॉप के लिए सुरक्षित रहती है।\n\nएक ऑपरेटर कटी हुई शीट डालता है और मशीन लगभग 3,200 प्लेट प्रति घंटा बनाती है। डाई बदलकर 4 इंच से 12 इंच तक प्लेट बनती है और हर साइज़ की डाई खलिकोट में स्टॉक रहती है।\n\nसिर्फ़ 80 वर्ग फुट जगह और 2.2 kW सिंगल फेज कनेक्शन चाहिए।",
      features: ["बंद कैबिनेट में एक डाई स्टेशन", "3,200 प्लेट प्रति घंटा", "4 से 12 इंच डाई स्टॉक में", "सिर्फ़ 80 वर्ग फुट जगह", "2.2 kW सिंगल फेज", "घरेलू वर्कशॉप के लिए सुरक्षित", "एक डाई सेट व ट्रेनिंग फ्री"],
    },
    or: {
      name: "ସିଙ୍ଗଲ୍ ଡାଇ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍",
      tagline: "ଗୋଟିଏ ଡାଇ ଷ୍ଟେସନ୍ • 3200 ପ୍ଲେଟ୍/ଘଣ୍ଟା",
      short: "ବନ୍ଦ କ୍ୟାବିନେଟ୍ ବଡି ସହିତ କମ୍ପାକ୍ଟ ସିଙ୍ଗଲ୍ ଡାଇ ମେସିନ୍ — ନୂଆ ୟୁନିଟ୍ ପାଇଁ ସର୍ବାଧିକ ଲୋକପ୍ରିୟ।",
      full: "ସିଙ୍ଗଲ୍ ଡାଇ ପେପର ପ୍ଲେଟ୍ ମେସିନ୍ ଆମର ସର୍ବାଧିକ ବିକ୍ରି ହେଉଥିବା ଷ୍ଟାର୍ଟର ମେସିନ୍। ବନ୍ଦ ସିଟ୍-ମେଟାଲ କ୍ୟାବିନେଟ୍ ଭିତରେ ଗୋଟିଏ ଡାଇ ଷ୍ଟେସନ୍ ଥାଏ।\n\nଜଣେ ଅପରେଟର ସିଟ୍ ଦିଅନ୍ତି ଏବଂ ମେସିନ୍ ଘଣ୍ଟାକୁ ପ୍ରାୟ 3,200 ପ୍ଲେଟ୍ ତିଆରି କରେ। ମାତ୍ର 80 ବର୍ଗ ଫୁଟ ଜାଗା ଦରକାର।",
      features: ["ବନ୍ଦ କ୍ୟାବିନେଟ୍ ଡାଇ ଷ୍ଟେସନ୍", "3,200 ପ୍ଲେଟ୍/ଘଣ୍ଟା", "4–12 ଇଞ୍ଚ ଡାଇ", "ମାତ୍ର 80 ବର୍ଗ ଫୁଟ", "2.2 kW ସିଙ୍ଗଲ୍ ଫେଜ୍", "ସୁରକ୍ଷିତ ବନ୍ଦ ବଡି", "ଡାଇ ସେଟ୍ ଓ ତାଲିମ ମାଗଣା"],
    },
    models: [
      m(1, "ME-SD1 Standard", "ME-SD1", '4"–10"', 3000, 84500),
      m(2, "ME-SD2 with Counter", "ME-SD2", '4"–12"', 3200, 92000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Single Die, Closed Cabinet" },
      { group: "Output", label: "Production", value: "3,000 – 3,200 plates / hour" },
      { group: "Output", label: "Plate Size", value: '4 inch – 12 inch' },
      { group: "Technical", label: "Power", value: "2.2 kW (3 HP) Single Phase" },
      { group: "Build", label: "Floor Space", value: "80 sq.ft." },
    ],
  },

  /* ------------- HYDRAULIC SLEEPER + PAPER PLATE COMBO -------------- */
  {
    slug: "hydraulic-sleeper-and-paper-plate-machine",
    name: "Hydraulic Machine — Sleeper & Paper Plate (2-in-1)",
    category: "Combo Machine",
    cover: DOUBLE, extra: [PLATE, SPARE],
    mrp: 155000, company: 125000, offer: 112000,
    capacity: "Plates + slipper soles on one machine", pph: 3000, power: "3 HP, Single phase",
    warranty: "1 Year Comprehensive", featured: true, sortOrder: 7,
    en: {
      name: "Hydraulic Machine — Sleeper & Paper Plate (2-in-1)",
      tagline: "Two businesses, one machine • just change the die",
      short: "Dual-purpose hydraulic press that makes paper plates and slipper soles on the same frame — simply swap the die set.",
      full: "This 2-in-1 hydraulic press is designed for entrepreneurs who want to run two businesses from one investment. With the plate die fitted it presses paper plates at around 3,000 per hour; with the sole die fitted it cuts slipper soles from EVA and rubber sheet.\n\nThe changeover takes about fifteen minutes and needs only a spanner — no technician visit required. That flexibility is valuable in seasonal markets: plates sell heavily during marriage and festival season, while slippers sell steadily through summer.\n\nThe frame is heavy stress-relieved MS, the power pack is branded, and both die types are supplied from our own die bank. Training covers both product lines.",
      features: [
        "Makes paper plates AND slipper soles",
        "Die changeover in ~15 minutes",
        "~3,000 plates per hour with plate die",
        "Cuts EVA, rubber and PU soles",
        "Heavy stress-relieved MS frame",
        "Branded hydraulic power pack",
        "Training for both product lines",
      ],
    },
    hi: {
      name: "हाइड्रोलिक मशीन — स्लीपर व पेपर प्लेट (2-इन-1)",
      tagline: "दो बिज़नेस, एक मशीन • सिर्फ़ डाई बदलें",
      short: "दोहरे काम की हाइड्रोलिक प्रेस जो एक ही फ्रेम पर पेपर प्लेट और चप्पल सोल बनाती है — बस डाई बदलनी है।",
      full: "यह 2-इन-1 हाइड्रोलिक प्रेस उन उद्यमियों के लिए है जो एक निवेश में दो बिज़नेस चलाना चाहते हैं। प्लेट डाई लगाने पर यह लगभग 3,000 प्लेट प्रति घंटा बनाती है; सोल डाई लगाने पर EVA और रबर शीट से चप्पल सोल काटती है।\n\nडाई बदलने में लगभग पंद्रह मिनट लगते हैं और सिर्फ़ एक स्पैनर चाहिए। यह लचीलापन सीज़नल बाज़ार में बहुत काम आता है — शादी और त्योहार में प्लेट, गर्मियों में चप्पल।\n\nफ्रेम भारी स्ट्रेस-रिलीव्ड MS है और दोनों तरह की डाई हमारे डाई बैंक से मिलती है।",
      features: ["पेपर प्लेट और चप्पल सोल दोनों", "~15 मिनट में डाई चेंज", "प्लेट डाई से ~3,000 प्लेट/घंटा", "EVA, रबर व PU सोल", "भारी MS फ्रेम", "ब्रांडेड हाइड्रोलिक पैक", "दोनों लाइन की ट्रेनिंग"],
    },
    or: {
      name: "ହାଇଡ୍ରୋଲିକ୍ ମେସିନ୍ — ସ୍ଲିପର ଓ ପେପର ପ୍ଲେଟ୍ (2-ଇନ୍-1)",
      tagline: "ଦୁଇ ବ୍ୟବସାୟ, ଗୋଟିଏ ମେସିନ୍ • କେବଳ ଡାଇ ବଦଳାନ୍ତୁ",
      short: "ଦ୍ୱିମୁଖୀ ହାଇଡ୍ରୋଲିକ୍ ପ୍ରେସ୍ ଯାହା ସମାନ ଫ୍ରେମରେ ପେପର ପ୍ଲେଟ୍ ଓ ଚପଲ ସୋଲ ତିଆରି କରେ।",
      full: "ଏହି 2-ଇନ୍-1 ହାଇଡ୍ରୋଲିକ୍ ପ୍ରେସ୍ ସେହି ଉଦ୍ୟୋଗୀଙ୍କ ପାଇଁ ଯେଉଁମାନେ ଗୋଟିଏ ନିବେଶରେ ଦୁଇଟି ବ୍ୟବସାୟ ଚଳାଇବାକୁ ଚାହାଁନ୍ତି। ପ୍ଲେଟ୍ ଡାଇ ଲଗାଇଲେ ଘଣ୍ଟାକୁ ପ୍ରାୟ 3,000 ପ୍ଲେଟ୍; ସୋଲ ଡାଇ ଲଗାଇଲେ EVA ଓ ରବର ସିଟରୁ ଚପଲ ସୋଲ।\n\nଡାଇ ବଦଳାଇବାକୁ ପ୍ରାୟ ପନ୍ଦର ମିନିଟ୍ ଲାଗେ।",
      features: ["ପ୍ଲେଟ୍ ଓ ଚପଲ ସୋଲ ଦୁଇଟି", "~15 ମିନିଟରେ ଡାଇ ଚେଞ୍ଜ", "~3,000 ପ୍ଲେଟ୍/ଘଣ୍ଟା", "EVA, ରବର ସୋଲ", "ଭାରୀ MS ଫ୍ରେମ୍", "ବ୍ରାଣ୍ଡେଡ୍ ପାୱାର ପ୍ୟାକ୍", "ଦୁଇ ଲାଇନର ତାଲିମ"],
    },
    models: [
      m(1, "ME-CB1 Standard 2-in-1", "ME-CB1", "Plate + Sole", 3000, 112000),
      m(2, "ME-CB2 with Both Die Sets", "ME-CB2", "Plate + Sole", 3000, 128000),
    ],
    specs: [
      { group: "General", label: "Machine Type", value: "Dual-Purpose Hydraulic Press" },
      { group: "Output", label: "Plate Production", value: "~3,000 plates / hour" },
      { group: "Output", label: "Sole Production", value: "~300 pairs / hour" },
      { group: "Technical", label: "Power", value: "3 HP Single Phase" },
      { group: "Build", label: "Changeover", value: "~15 minutes, spanner only" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Idempotent catalogue upgrade                                       */
/* ------------------------------------------------------------------ */

function buildRow(item: CatalogueItem) {
  const cover = item.cover;
  const media = [
    { type: "image", url: cover, caption: `${item.name} — front view` },
    { type: "video360", url: cover, caption: `${item.name} — 360° product video` },
    ...(item.extra ?? []).map((u, i) => ({ type: "image", url: u, caption: `${item.name} — view ${i + 2}` })),
  ];
  return {
    slug: slugify(item.slug),
    name: item.name,
    category: item.category,
    coverImage: cover,
    mrp: item.mrp,
    companyPrice: item.company,
    offerPrice: item.offer,
    discount: item.mrp > item.offer ? Math.round(((item.mrp - item.offer) / item.mrp) * 100) : 0,
    capacity: item.capacity,
    productionPerHour: item.pph,
    power: item.power,
    warranty: item.warranty,
    featured: Boolean(item.featured),
    active: true,
    sortOrder: item.sortOrder,
    views: 40 + Math.floor(Math.random() * 180),
    media: media as any,
    models: item.models as any,
    colors: defaultColorRows(cover) as any,
    specs: item.specs as any,
    t: {
      en: { ...item.en },
      hi: { ...item.hi },
      or: { ...item.or },
    } as any,
  };
}

/**
 * Inserts any brochure machine that is not yet in the database and guarantees
 * that EVERY machine carries the full 10-colour palette. Safe to run repeatedly.
 */
export async function upgradeCatalogue(): Promise<{ added: number; recoloured: number; photos: number }> {
  let added = 0;
  let recoloured = 0;
  let photos = 0;

  const existing = await db.select({
    id: machines.id, slug: machines.slug, colors: machines.colors, coverImage: machines.coverImage, media: machines.media,
  }).from(machines);
  const haveSlugs = new Set(existing.map((r) => r.slug));
  const bySlug = new Map(CATALOGUE.map((c) => [slugify(c.slug), c]));

  for (const item of CATALOGUE) {
    if (haveSlugs.has(slugify(item.slug))) continue;
    try {
      await db.insert(machines).values(buildRow(item));
      added += 1;
    } catch (err) {
      console.error(`[catalogue] could not add ${item.slug}:`, err);
    }
  }

  const all = await db.select({
    id: machines.id, slug: machines.slug, colors: machines.colors, coverImage: machines.coverImage, media: machines.media,
  }).from(machines);

  for (const row of all) {
    const patch: Record<string, unknown> = { updatedAt: sql`now()` };
    let changed = false;

    const current = Array.isArray(row.colors) ? (row.colors as any[]) : [];
    if (current.length < 10 || !current.every((c) => c && c.hex && c.id)) {
      patch.colors = normaliseColors(current).map((c) => ({ ...c, imageUrl: c.imageUrl || "" })) as any;
      recoloured += 1;
      changed = true;
    }

    const cat = bySlug.get(row.slug);
    if (cat && (row.coverImage === GENERIC || !row.coverImage || row.coverImage.endsWith("machine-generic.jpg"))) {
      patch.coverImage = cat.cover;
      const media = [
        { type: "image", url: cat.cover, caption: `${cat.name} — front view` },
        { type: "video360", url: cat.cover, caption: `${cat.name} — 360° product video` },
        ...(cat.extra ?? []).map((u, i) => ({ type: "image", url: u, caption: `${cat.name} — view ${i + 2}` })),
      ];
      patch.media = media as any;
      photos += 1;
      changed = true;
    } else {
      const media = Array.isArray(row.media) ? [...(row.media as any[])] : [];
      if (!media.some((m) => m && m.type === "video360")) {
        media.splice(1, 0, {
          type: "video360",
          url: row.coverImage || cat?.cover || "",
          caption: `${cat?.name || row.slug} — 360° product video`,
        });
        patch.media = media as any;
        changed = true;
        photos += 1;
      }
    }

    if (changed) await db.update(machines).set(patch).where(eq(machines.id, row.id));
  }

  if (added || recoloured || photos) console.log(`[catalogue] added ${added}, colours ${recoloured}, photos ${photos}`);
  return { added, recoloured, photos };
}
