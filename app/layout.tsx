import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const description =
  "Debt Angel — a modern, transparent debt resolution program for qualifying unsecured debt. See every account and compare a structured plan against your current path in real dollars, before you decide. Not bankruptcy, and not a foreclosure or repossession program.";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — ${site.mottoShort}`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "debt resolution",
    "debt relief",
    "debt settlement alternative",
    "credit recovery",
    "Debt Angel",
    "debt free",
  ],
  openGraph: {
    title: `${site.name} — ${site.motto}`,
    description,
    type: "website",
  },
  // PRE-LAUNCH: keep the site out of search results while content/claims are
  // still placeholders. Reviewers with the link can still view everything —
  // noindex only affects search engines. AT LAUNCH: set index/follow back to true.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  );
}
