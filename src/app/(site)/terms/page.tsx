import type { Metadata } from "next";
import LegalPage from "../legal/LegalPage";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <LegalPage
      title="Terms & Conditions"
      breadcrumbLabel="Terms & Conditions"
      updated={new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
      intro={`These terms apply to every quotation, order, installation and service engagement between ${s.company.legalName || s.company.name} and the buyer. Placing an order means you accept them.`}
      sections={[
        {
          heading: "Products and pricing",
          body: [
            "Prices shown on this website are indicative company prices in Indian Rupees and exclude GST, transport, insurance and any state taxes unless explicitly stated in the written quotation.",
            "Offers, festival discounts and coupon codes are valid only within the displayed start and end dates and cannot be combined unless we say so in writing.",
            "Because raw material and component prices change, a quoted price is normally held for 15 days from the date of the quotation unless confirmed otherwise.",
          ],
        },
        {
          heading: "Orders, advance and delivery",
          body: [
            "An order is confirmed only after we receive the agreed advance payment and issue a written order acknowledgement.",
            "Manufacturing lead time is typically 15–30 working days for plate and agarbatti machines and 45–60 working days for automatic cup machines, counted from the date of advance receipt and technical confirmation.",
            "Delivery timelines can shift due to component shortages, transport strikes or force majeure events. We will inform you as soon as we know.",
            "Risk in the machine passes to the buyer once it is handed over to the transporter, unless the quotation states 'delivered and installed'.",
          ],
        },
        {
          heading: "Installation, training and site readiness",
          body: [
            "The buyer must provide the required floor space, levelled foundation, electrical connection of the specified load, compressed air where applicable and safe unloading arrangements.",
            "Installation and operator training are included for machines delivered within Odisha. For other states, travel and stay of our engineer are chargeable at actuals unless the offer says otherwise.",
            "If our engineer is sent and the site is not ready, a repeat visit will be charged separately.",
          ],
        },
        {
          heading: "Warranty",
          body: [
            "Every machine carries a 12-month warranty from the date of installation or 14 months from dispatch, whichever is earlier, covering manufacturing defects in workmanship and material.",
            "The warranty does not cover consumables and wear parts such as dies, blades, seals, belts, bearings, heater bands, oil and electrical fuses, nor damage caused by wrong voltage, overloading, unauthorised repair, water ingress, fire, accident or use of non-recommended raw material.",
            "Warranty service is provided on-site within Odisha and by video guidance plus part replacement elsewhere. Travel for warranty visits outside Odisha may be chargeable.",
          ],
        },
        {
          heading: "Spare parts and after-sales service",
          body: [
            "Genuine spare parts are supplied at the prices listed at the time of dispatch. Parts are normally dispatched within one working day of payment confirmation.",
            "After the warranty period, service is chargeable on a per-visit plus parts basis, or through an annual maintenance contract where available.",
          ],
        },
        {
          heading: "Raw material supply",
          body: [
            "Raw material prices are revised regularly based on mill rates. Orders are dispatched after payment and the applicable price is the one confirmed at the time of order.",
            "GSM, coating and size must be confirmed by the buyer before dispatch. Material cut or slit to a customer-specific size is non-returnable.",
          ],
        },
        {
          heading: "Cancellation and refunds",
          body: [
            "If an order is cancelled before fabrication begins, the advance is refunded after deducting processing charges.",
            "Once fabrication of a custom machine or die has begun, cancellation attracts a deduction proportional to the work completed.",
            "Standard raw material and spare parts in unopened condition may be returned within 7 days of delivery with a restocking charge. Custom-cut material is not returnable.",
          ],
        },
        {
          heading: "Use of this website",
          body: [
            "You agree to use this website only for lawful business enquiries. Automated scraping, spam submissions, attempts to access the admin panel without authorisation, or uploading malicious content are prohibited.",
            "All text, photographs, machine designs, logos and layouts on this site are the property of the company and may not be copied or reused without written permission.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "Our total liability for any claim connected with a machine or material is limited to the amount actually paid by the buyer for that item. We are not liable for loss of profit, production downtime or indirect consequential losses.",
            "Production figures shown on this website (plates per hour, cups per minute, sticks per minute) are achieved under recommended conditions with correct material and a trained operator; actual output depends on your material, power supply, maintenance and operating skill.",
          ],
        },
        {
          heading: "Governing law and jurisdiction",
          body: [
            "These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts at Chatrapur / Ganjam, Odisha.",
            `Company: ${s.company.legalName || s.company.name} • GSTIN: ${s.company.gst} • Address: ${s.company.address} – ${s.company.pincode} • Contact: ${s.company.phone}, ${s.company.email}`,
          ],
        },
      ]}
    />
  );
}
