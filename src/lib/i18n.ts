export type Lang = "en" | "hi" | "or";

export const LANGS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "हि" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "ଓ" },
];

type Entry = { en: string; hi: string; or: string };

export const DICT: Record<string, Entry> = {
  "nav.home": { en: "Home", hi: "होम", or: "ହୋମ୍" },
  "nav.machines": { en: "Machines", hi: "मशीनें", or: "ମେସିନ୍" },
  "nav.rawMaterials": { en: "Raw Materials", hi: "कच्चा माल", or: "କଞ୍ଚାମାଲ" },
  "nav.offers": { en: "Offers", hi: "ऑफ़र", or: "ଅଫର" },
  "nav.gallery": { en: "Gallery", hi: "गैलरी", or: "ଗ୍ୟାଲେରୀ" },
  "nav.about": { en: "About Us", hi: "हमारे बारे में", or: "ଆମ ବିଷୟରେ" },
  "nav.contact": { en: "Contact", hi: "संपर्क", or: "ଯୋଗାଯୋଗ" },
  "nav.support": { en: "Support", hi: "सहायता", or: "ସହାୟତା" },
  "nav.faq": { en: "FAQ", hi: "सवाल-जवाब", or: "ପ୍ରଶ୍ନୋତ୍ତର" },
  "nav.spareParts": { en: "Spare Parts", hi: "स्पेयर पार्ट्स", or: "ସ୍ପେୟାର ପାର୍ଟସ" },
  "nav.privacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", or: "ଗୋପନୀୟତା ନୀତି" },
  "nav.terms": { en: "Terms & Conditions", hi: "नियम व शर्तें", or: "ନିୟମ ଓ ସର୍ତ୍ତ" },
  "nav.admin": { en: "Admin Panel", hi: "एडमिन पैनल", or: "ଆଡମିନ୍ ପ୍ୟାନେଲ୍" },

  "hero.badge": { en: "ISO-grade manufacturing • Khalikot, Ganjam, Odisha", hi: "आईएसओ-ग्रेड विनिर्माण • खलिकोट, गंजाम, ओडिशा", or: "ISO-ଗ୍ରେଡ୍ ଉତ୍ପାଦନ • ଖଲିକୋଟ, ଗଞ୍ଜାମ, ଓଡ଼ିଶା" },
  "hero.headline1": { en: "Build Your Paper Business With", hi: "अपना पेपर व्यवसाय शुरू करें", or: "ଆପଣଙ୍କ କାଗଜ ବ୍ୟବସାୟ ଆରମ୍ଭ କରନ୍ତୁ" },
  "hero.headline2": { en: "Heavy-Duty Indian Machines", hi: "भारोसा और मज़बूत मशीनों के साथ", or: "ଶକ୍ତିଶାଳୀ ଭାରତୀୟ ମେସିନ୍ ସହିତ" },
  "hero.sub": {
    en: "Milan Enterprises designs, manufactures and installs paper plate, paper cup and agarbatti machines across Odisha and 120+ districts of India — with lifetime technical support, genuine spare parts and guaranteed raw material supply.",
    hi: "मिलन एंटरप्राइजेज ओडिशा और भारत के 120+ जिलों में पेपर प्लेट, पेपर कप और अगरबत्ती मशीनों का डिज़ाइन, निर्माण और इंस्टॉलेशन करता है — आजीवन तकनीकी सहायता, असली स्पेयर पार्ट्स और गारंटीड कच्चा माल के साथ।",
    or: "ମିଲାନ ଏଣ୍ଟରପ୍ରାଇଜେସ୍ ଓଡ଼ିଶା ଏବଂ ଭାରତର 120+ ଜିଲ୍ଲାରେ ପେପର ପ୍ଲେଟ୍, ପେପର କପ୍ ଓ ଅଗରବତ୍ତି ମେସିନ୍ ତିଆରି, ସ୍ଥାପନ ଓ ସେବା ଯୋଗାଏ — ଆଜୀବନ ତାନ୍ତ୍ରିକ ସହାୟତା, ଅସଲ ସ୍ପେୟାର ପାର୍ଟସ୍ ଓ କଞ୍ଚାମାଲ ସହିତ।",
  },
  "cta.whatsapp": { en: "WhatsApp Enquiry", hi: "व्हाट्सएप enquiry", or: "ୱାଟ୍ସଆପ୍ ପଚାରିବା" },
  "cta.explore": { en: "Explore Machines", hi: "मशीनें देखें", or: "ମେସିନ୍ ଦେଖନ୍ତୁ" },
  "cta.call": { en: "Call Now", hi: "अभी कॉल करें", or: "ଏବେ କଲ୍ କରନ୍ତୁ" },
  "cta.quote": { en: "Get Best Price", hi: "सर्वोत्तम मूल्य पाएं", or: "ସର୍ବୋତ୍ତମ ଦାମ୍ ପାଆନ୍ତୁ" },
  "cta.brochure": { en: "Download Details", hi: "विवरण डाउनलोड करें", or: "ବିବରଣୀ ଡାଉନଲୋଡ୍" },
  "cta.bookDemo": { en: "Book Factory Demo", hi: "फैक्ट्री डेमो बुक करें", or: "ଫ୍ୟାକ୍ଟରୀ ଡେମୋ ବୁକ୍ କରନ୍ତୁ" },
  "cta.roi": { en: "Calculate Profit", hi: "मुनाफ़ा कैलकुलेट करें", or: "ଲାଭ ହିସାବ କରନ୍ତୁ" },

  "stats.title": { en: "Numbers That Built Our Reputation", hi: "आंकड़े जो हमारी पहचान हैं", or: "ଆମ ଖ୍ୟାତିର ସଂଖ୍ୟା" },
  "stats.delivered": { en: "Machines Delivered", hi: "मशीनें डिलीवर", or: "ମେସିନ୍ ଡେଲିଭରି" },
  "stats.factories": { en: "Happy Factories", hi: "खुश फैक्ट्रियां", or: "ସୁଖୀ ଫ୍ୟାକ୍ଟରୀ" },
  "stats.districts": { en: "Districts Served", hi: "जिलों में सेवा", or: "ଜିଲ୍ଲାରେ ସେବା" },
  "stats.years": { en: "Years of Experience", hi: "वर्षों का अनुभव", or: "ବର୍ଷର ଅଭିଜ୍ଞତା" },

  "common.enquiry": { en: "Enquiry", hi: "पूछताछ", or: "ପଚରା" },
  "common.details": { en: "View Details", hi: "विवरण देखें", or: "ବିବରଣୀ ଦେଖନ୍ତୁ" },
  "common.price": { en: "Company Price", hi: "कंपनी मूल्य", or: "କମ୍ପାନୀ ମୂଲ୍ୟ" },
  "common.mrp": { en: "MRP", hi: "एमआरपी", or: "MRP" },
  "common.offerPrice": { en: "Offer Price", hi: "ऑफर मूल्य", or: "ଅଫର ମୂଲ୍ୟ" },
  "common.discount": { en: "Off", hi: "छूट", or: "ଛାଡ଼" },
  "common.specs": { en: "Specifications", hi: "विशेषताएँ", or: "ବିଶେଷତ୍ୱ" },
  "common.features": { en: "Key Features", hi: "मुख्य विशेषताएं", or: "ମୁଖ୍ୟ ବିଶେଷତ୍ୱ" },
  "common.models": { en: "Available Models", hi: "उपलब्ध मॉडल", or: "ଉପଲବ୍ଧ ମଡେଲ୍" },
  "common.colours": { en: "Machine Colours", hi: "मशीन के रंग", or: "ମେସିନ୍ ରଙ୍ଗ" },
  "common.capacity": { en: "Capacity", hi: "क्षमता", or: "କ୍ଷମତା" },
  "common.pph": { en: "Production / Hour", hi: "उत्पादन / घंटा", or: "ଉତ୍ପାଦନ / ଘଣ୍ଟା" },
  "common.readMore": { en: "Read More", hi: "और पढ़ें", or: "ଅଧିକ ପଢ଼ନ୍ତୁ" },
  "common.close": { en: "Close", hi: "बंद करें", or: "ବନ୍ଦ କରନ୍ତୁ" },
  "common.submit": { en: "Submit", hi: "जमा करें", or: "ଦାଖଲ କରନ୍ତୁ" },
  "common.sending": { en: "Sending…", hi: "भेजा जा रहा है…", or: "ପଠାଯାଉଛି…" },
  "common.name": { en: "Your Name", hi: "आपका नाम", or: "ଆପଣଙ୍କ ନାମ" },
  "common.phone": { en: "Phone Number", hi: "फ़ोन नंबर", or: "ଫୋନ୍ ନମ୍ବର" },
  "common.email": { en: "Email", hi: "ईमेल", or: "ଇମେଲ୍" },
  "common.city": { en: "City / District", hi: "शहर / जिला", or: "ସହର / ଜିଲ୍ଲା" },
  "common.message": { en: "Message", hi: "संदेश", or: "ସନ୍ଦେଶ" },
  "common.language": { en: "Language", hi: "भाषा", or: "ଭାଷା" },
  "common.loading": { en: "Loading…", hi: "लोड हो रहा है…", or: "ଲୋଡ୍ ହେଉଛି…" },
  "common.noData": { en: "Nothing to show yet", hi: "अभी कुछ नहीं है", or: "ଏବେ କିଛି ନାହିଁ" },
  "common.error": { en: "Something went wrong", hi: "कुछ गलत हो गया", or: "କିଛି ଭୁଲ୍ ହେଲା" },
  "common.retry": { en: "Retry", hi: "फिर कोशिश करें", or: "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ" },
  "common.inStock": { en: "In Stock", hi: "स्टॉक में", or: "ଷ୍ଟକରେ ଅଛି" },
  "common.lowStock": { en: "Low Stock", hi: "कम स्टॉक", or: "କମ୍ ଷ୍ଟକ୍" },
  "common.outOfStock": { en: "Out of Stock", hi: "स्टॉक खत्म", or: "ଷ୍ଟକ୍ ନାହିଁ" },
  "common.onOrder": { en: "On Order", hi: "ऑर्डर पर", or: "ଅର୍ଡରରେ" },
  "common.featured": { en: "Featured", hi: "फ़ीचर्ड", or: "ବିଶେଷ" },
  "common.new": { en: "New", hi: "नया", or: "ନୂଆ" },
  "common.all": { en: "All", hi: "सभी", or: "ସମସ୍ତ" },
  "common.success": { en: "Success! Our team will contact you shortly.", hi: "सफल! हमारी टीम जल्द ही आपसे संपर्क करेगी।", or: "ସଫଳ! ଆମ ଟିମ୍ ଶୀଘ୍ର ଯୋଗାଯୋଗ କରିବେ।" },
  "common.required": { en: "Please fill all required fields", hi: "कृपया सभी आवश्यक फ़ील्ड भरें", or: "ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକ ଘର ପୂରଣ କରନ୍ତୁ" },
  "common.warranty": { en: "Warranty", hi: "वारंटी", or: "ୱାରେଣ୍ଟି" },
  "common.power": { en: "Power", hi: "पावर", or: "ପାୱାର" },
  "common.unit": { en: "Unit", hi: "इकाई", or: "ଏକକ" },
  "common.stock": { en: "Stock", hi: "स्टॉक", or: "ଷ୍ଟକ୍" },
  "common.category": { en: "Category", hi: "श्रेणी", or: "ଶ୍ରେଣୀ" },
  "common.backHome": { en: "Back to Home", hi: "होम पर वापस", or: "ହୋମ୍କୁ ଫେରନ୍ତୁ" },
  "common.viewAll": { en: "View All", hi: "सभी देखें", or: "ସବୁ ଦେଖନ୍ତୁ" },
  "common.talkExpert": { en: "Talk to an Expert", hi: "विशेषज्ञ से बात करें", or: "ବିଶେଷଜ୍ଞଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ" },
  "common.related": { en: "You may also like", hi: "आपको यह भी पसंद आ सकता है", or: "ଆପଣ ଏହା ମଧ୍ୟ ପସନ୍ଦ କରିପାରନ୍ତି" },
  "common.daysLeft": { en: "days left", hi: "दिन बाकी", or: "ଦିନ ବାକି" },
  "common.save": { en: "You Save", hi: "आपकी बचत", or: "ଆପଣଙ୍କ ସଞ୍ଚୟ" },
  "common.videos": { en: "Working Videos", hi: "वर्किंग वीडियो", or: "କାର୍ଯ୍ୟ ଭିଡିଓ" },
  "common.photos": { en: "Photos", hi: "फोटो", or: "ଫଟୋ" },

  "roi.title": { en: "Machine ROI & Profit Calculator", hi: "मशीन ROI और मुनाफ़ा कैलकुलेटर", or: "ମେସିନ୍ ROI ଓ ଲାଭ କ୍ୟାଲ୍କୁଲେଟର" },
  "roi.sub": {
    en: "Enter your plan and see exactly how fast the machine pays for itself.",
    hi: "अपनी योजना दर्ज करें और देखें कि मशीन कितनी जल्दी अपनी कीमत वसूल करती है।",
    or: "ଆପଣଙ୍କ ଯୋଜନା ଦିଅନ୍ତୁ ଏବଂ ଦେଖନ୍ତୁ ମେସିନ୍ କେତେ ଶୀଘ୍ର ଦାମ୍ ଫେରାଇବ।",
  },
  "roi.hoursDay": { en: "Working hours / day", hi: "कार्य घंटे / दिन", or: "କାର୍ଯ୍ୟ ଘଣ୍ଟା / ଦିନ" },
  "roi.daysMonth": { en: "Working days / month", hi: "कार्य दिन / माह", or: "କାର୍ଯ୍ୟ ଦିନ / ମାସ" },
  "roi.sellPrice": { en: "Selling price per piece (₹)", hi: "प्रति पीस बिक्री मूल्य (₹)", or: "ପ୍ରତି ପିସ୍ ବିକ୍ରୟ ମୂଲ୍ୟ (₹)" },
  "roi.rawCost": { en: "Raw material cost per piece (₹)", hi: "प्रति पीस कच्चा माल लागत (₹)", or: "ପ୍ରତି ପିସ୍ କଞ୍ଚାମାଲ ଖର୍ଚ୍ଚ (₹)" },
  "roi.machinePrice": { en: "Machine price (₹)", hi: "मशीन मूल्य (₹)", or: "ମେସିନ୍ ମୂଲ୍ୟ (₹)" },
  "roi.otherCost": { en: "Other monthly cost (₹)", hi: "अन्य मासिक लागत (₹)", or: "ଅନ୍ୟ ମାସିକ ଖର୍ଚ୍ଚ (₹)" },
  "roi.calculate": { en: "Calculate Profit", hi: "मुनाफ़ा निकालें", or: "ଲାଭ ହିସାବ କରନ୍ତୁ" },
  "roi.monthlyProd": { en: "Monthly Production", hi: "मासिक उत्पादन", or: "ମାସିକ ଉତ୍ପାଦନ" },
  "roi.monthlyRev": { en: "Monthly Revenue", hi: "मासिक आय", or: "ମାସିକ ଆୟ" },
  "roi.materialCost": { en: "Material Cost", hi: "कच्चा माल लागत", or: "କଞ୍ଚାମାଲ ଖର୍ଚ୍ଚ" },
  "roi.grossProfit": { en: "Gross Monthly Profit", hi: "मासिक सकल लाभ", or: "ମାସିକ ସ୍ଥୂଳ ଲାଭ" },
  "roi.annualProfit": { en: "Annual Profit", hi: "वार्षिक लाभ", or: "ବାର୍ଷିକ ଲାଭ" },
  "roi.payback": { en: "Payback Period", hi: "पेबैक अवधि", or: "ଫେରସ୍ତ ସମୟ" },
  "roi.firstYear": { en: "First Year Net Profit", hi: "पहले वर्ष का शुद्ध लाभ", or: "ପ୍ରଥମ ବର୍ଷର ଶୁଦ୍ଧ ଲାଭ" },
  "roi.pieces": { en: "pieces", hi: "पीस", or: "ପିସ୍" },
  "roi.months": { en: "months", hi: "महीने", or: "ମାସ" },
  "roi.invalid": { en: "Enter valid positive numbers", hi: "मान्य सकारात्मक संख्या दर्ज करें", or: "ବୈଧ ସକାରାତ୍ମକ ସଂଖ୍ୟା ଦିଅନ୍ତୁ" },

  "sup.title": { en: "Customer Support & Service", hi: "ग्राहक सहायता और सेवा", or: "ଗ୍ରାହକ ସହାୟତା ଓ ସେବା" },
  "sup.raise": { en: "Raise a Service Request", hi: "सेवा अनुरोध भेजें", or: "ସେବା ଅନୁରୋଧ ପଠାନ୍ତୁ" },
  "sup.track": { en: "Track Your Ticket", hi: "अपना टिकट ट्रैक करें", or: "ଆପଣଙ୍କ ଟିକେଟ୍ ଟ୍ରାକ୍ କରନ୍ତୁ" },
  "sup.ticketNo": { en: "Ticket Number", hi: "टिकट नंबर", or: "ଟିକେଟ୍ ନମ୍ବର" },
  "sup.subject": { en: "Subject", hi: "विषय", or: "ବିଷୟ" },
  "sup.desc": { en: "Describe the problem", hi: "समस्या का विवरण दें", or: "ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ" },
  "sup.priority": { en: "Priority", hi: "प्राथमिकता", or: "ପ୍ରାଧାନ୍ୟ" },
  "sup.status": { en: "Status", hi: "स्थिति", or: "ସ୍ଥିତି" },
  "sup.assigned": { en: "Assigned Engineer", hi: "नियुक्त इंजीनियर", or: "ନିଯୁକ୍ତ ଇଞ୍ଜିନିୟର" },
  "sup.timeline": { en: "Ticket Timeline", hi: "टिकट टाइमलाइन", or: "ଟିକେଟ୍ ଟାଇମଲାଇନ୍" },
  "sup.created": { en: "Created", hi: "बनाया गया", or: "ସୃଷ୍ଟି" },
  "sup.trackBtn": { en: "Track Ticket", hi: "टिकट ट्रैक करें", or: "ଟିକେଟ୍ ଟ୍ରାକ୍ କରନ୍ତୁ" },
  "sup.notFound": { en: "No ticket found with that number", hi: "इस नंबर से कोई टिकट नहीं मिला", or: "ଏହି ନମ୍ବରରେ କୌଣସି ଟିକେଟ୍ ମିଳିଲା ନାହିଁ" },
  "sup.saved": { en: "Ticket created. Save this number:", hi: "टिकट बन गया। यह नंबर सुरक्षित रखें:", or: "ଟିକେଟ୍ ସୃଷ୍ଟି ହେଲା। ଏହି ନମ୍ବର ସାଇତନ୍ତୁ:" },

  "st.new": { en: "Open", hi: "खुला", or: "ଖୋଲା" },
  "st.in_progress": { en: "In Progress", hi: "प्रगति पर", or: "ଚାଲୁଅଛି" },
  "st.waiting": { en: "Waiting", hi: "प्रतीक्षारत", or: "ଅପେକ୍ଷା" },
  "st.resolved": { en: "Resolved", hi: "हल हो गया", or: "ସମାଧାନ" },
  "st.closed": { en: "Closed", hi: "बंद", or: "ବନ୍ଦ" },
  "st.open": { en: "Open", hi: "खुला", or: "ଖୋଲା" },

  "footer.rights": { en: "All rights reserved.", hi: "सर्वाधिकार सुरक्षित।", or: "ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।" },
  "footer.quick": { en: "Quick Links", hi: "त्वरित लिंक", or: "ଦ୍ରୁତ ଲିଙ୍କ୍" },
  "footer.products": { en: "Products", hi: "उत्पाद", or: "ଉତ୍ପାଦ" },
  "footer.reach": { en: "Reach Us", hi: "हमसे संपर्क करें", or: "ଆମ ପାଖରେ ପହଞ୍ଚନ୍ତୁ" },
  "footer.newsletter": { en: "Get offers & new machine alerts", hi: "ऑफ़र और नई मशीन अलर्ट पाएं", or: "ଅଫର ଓ ନୂଆ ମେସିନ୍ ଅଲର୍ଟ ପାଆନ୍ତୁ" },
  "footer.subscribe": { en: "Subscribe", hi: "सब्सक्राइब", or: "ସବ୍ସକ୍ରାଇବ୍" },
  "footer.workHours": { en: "Working Hours", hi: "कार्य समय", or: "କାର୍ଯ୍ୟ ସମୟ" },
};

export function t(lang: Lang, key: string): string {
  const row = DICT[key];
  if (!row) return key;
  return row[lang] || row.en || key;
}

/** Pick a translated field from a jsonb `t` column, falling back to English then any language. */
export function pick(obj: unknown, lang: Lang, field: string): string {
  if (!obj || typeof obj !== "object") return "";
  const data = obj as Record<string, Record<string, unknown>>;
  const fromLang = data[lang] as Record<string, unknown> | undefined;
  const fromEn = data.en as Record<string, unknown> | undefined;
  const anyLang = Object.values(data)[0] as Record<string, unknown> | undefined;
  const v = fromLang?.[field] ?? fromEn?.[field] ?? anyLang?.[field] ?? "";
  return typeof v === "string" ? v : "";
}

export function pickList(obj: unknown, lang: Lang, field: string): string[] {
  if (!obj || typeof obj !== "object") return [];
  const data = obj as Record<string, Record<string, unknown>>;
  const raw = (data[lang]?.[field] ?? data.en?.[field] ?? Object.values(data)[0]?.[field]) as unknown;
  if (Array.isArray(raw)) return raw.map((r) => String(r)).filter(Boolean);
  if (typeof raw === "string") return raw.split("\n").map((r) => r.trim()).filter(Boolean);
  return [];
}
