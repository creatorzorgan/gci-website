import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Cinzel } from "next/font/google";
import "./globals.css";

// Type after Kiran's mockup: Roman capitals for headlines, a condensed sans for labels and
// buttons, the same family at normal width for reading. All three are open-licence.
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap", weight: ["400", "500", "600"] });
const barlow = Barlow({ subsets: ["latin"], variable: "--font-barlow", display: "swap", weight: ["400", "500", "600"] });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GCI | Institutional Briefing Portal",
  description:
    "Global Confederation of Industries (GCI). Apex public-private execution platform, Republic of India. Institutional briefing portal; restricted access.",
  // Confidential briefing: keep it out of search indexes and caches.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A101E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
