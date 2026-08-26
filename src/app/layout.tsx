import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "@/src/css/main.css";
import { siteConfig } from "@/src/config/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-family-body" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-family-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-family-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-family-mono" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ["Bharat Safe Yatra", "SIH 2026", "Ladakh tourism", "Andaman tourism", "Lakshadweep ePermit", "Delhi heritage", "Chandigarh tourism", "J&K tourism", "Puducherry", "Tourist Helpline 1363", "National Emergency 112"],
  authors: [{ name: "Bharat Safe Yatra SIH 2026 Team" }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
};

import { Navbar } from "@/src/app/components/Navbar";
import { Footer } from "@/src/app/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${jakarta.variable} ${playfair.variable} ${mono.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bg-canvas, #FAF7F2)", color: "var(--color-text-primary, #2D1B14)" }}>
        <div id="root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
