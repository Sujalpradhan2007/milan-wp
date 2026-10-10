import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSettings } from "@/lib/settings";

// Metadata comes from PostgreSQL, which is initialized when the deployed
// service starts. Do not query it while producing a deployment build.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: s.seo.title, template: `%s | ${s.company.name}` },
    description: s.seo.description,
    keywords: s.seo.keywords,
    applicationName: s.company.name,
    openGraph: {
      title: s.seo.title,
      description: s.seo.description,
      type: "website",
      locale: "en_IN",
      siteName: s.company.name,
      images: s.company.heroImage ? [{ url: s.company.heroImage }] : [],
    },
    twitter: { card: "summary_large_image", title: s.company.name, description: s.seo.description },
    robots: { index: true, follow: true },
    icons: { icon: s.company.logo || "/images/logo.png" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0714" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
