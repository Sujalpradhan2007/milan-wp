import type { Metadata } from "next";
import LegalPage from "../legal/LegalPage";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <LegalPage
      title="Privacy Policy"
      breadcrumbLabel="Privacy Policy"
      updated={new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
      intro={`This policy explains how ${s.company.legalName || s.company.name} ("we", "us") collects, uses and protects information when you visit this website, submit an enquiry or use our support system.`}
      sections={[
        {
          heading: "Information we collect",
          body: [
            "Enquiry data: your name, phone number, email address, city, the machine or product you are interested in, the model, colour, capacity and price you selected, and any message you write to us.",
            "Support data: the ticket number generated for you, the machine you own, the problem description, priority and the full status timeline of your request.",
            "Usage data: pages you visit, machines and products you view, the language you choose, your device type and the source that brought you to the site. This is stored as aggregate analytics and is used only to improve the website.",
            "Newsletter data: if you subscribe, we store your email address so we can send offer and new-machine alerts.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "To reply to your enquiry, prepare a quotation, arrange a machine demonstration and process an order.",
            "To provide installation, warranty and after-sales service, including assigning an engineer to your ticket.",
            "To send you offers, festival deals and product updates only if you have subscribed or enquired with us.",
            "To understand which machines and materials customers look at most, so we can stock and build accordingly.",
          ],
        },
        {
          heading: "WhatsApp and phone communication",
          body: [
            "Clicking a WhatsApp button opens WhatsApp with a pre-filled message that contains the details you entered in the form. The message is sent by you, from your own account, to our business number.",
            "We may store a record of your enquiry and the conversation in our customer relationship system so that our team can serve you without asking you to repeat details.",
          ],
        },
        {
          heading: "Cookies and local storage",
          body: [
            "We use browser local storage to remember your selected language (English, हिन्दी or ଓଡ଼ିଆ) and your light/dark theme preference.",
            "An essential session cookie is used to keep our staff logged into the admin panel. We do not run third-party advertising trackers on this website.",
          ],
        },
        {
          heading: "Data sharing",
          body: [
            "We do not sell, rent or trade your personal information. Your details are shared only with our own sales and service staff, and with transporters or bank/finance partners when required to deliver a machine or process a loan you have asked us to help with.",
            "Certain pages of this site may be hosted on infrastructure providers who process data on our behalf under standard security terms.",
          ],
        },
        {
          heading: "Data retention and security",
          body: [
            "Enquiry and support records are retained for as long as needed to serve you and to meet statutory and tax requirements, after which they are deleted or anonymised.",
            "Access to customer data is restricted to authorised staff accounts with role-based permissions. Admin sessions expire automatically and passwords are stored only as salted hashes.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can ask us at any time to show you the data we hold about you, correct it, delete it, or stop contacting you. Unsubscribing from the newsletter removes you from marketing emails immediately.",
            `To exercise any of these rights, write to ${s.company.email} or call ${s.company.phone}.`,
          ],
        },
        {
          heading: "Children",
          body: ["This website is intended for business buyers and is not directed at children under 18. We do not knowingly collect personal data from children."],
        },
        {
          heading: "Changes to this policy",
          body: ["We may update this policy as our services or the law change. The 'last updated' date at the top of this page always shows the current version."],
        },
        {
          heading: "Contact",
          body: [
            `${s.company.legalName || s.company.name}, ${s.company.address} – ${s.company.pincode}`,
            `Phone / WhatsApp: ${s.company.phone} • Email: ${s.company.email} • GSTIN: ${s.company.gst}`,
          ],
        },
      ]}
    />
  );
}
