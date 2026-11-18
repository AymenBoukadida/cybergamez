import type { Metadata } from "next";
import { Hero } from "./components/Hero";
import { NewReleasesGrid } from "./components/NewReleasesGrid";
import { TrendingRail } from "./components/TrendingRail";
import { asset } from "./lib/base-path";

const title = "CyberGamez — Discover, play and download free games";
const description =
  "Browse trending and new games on CyberGamez, then explore the Subway Surfers demo with screenshots, a captioned trailer and a direct Android APK.";

export const metadata: Metadata = {
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "CyberGamez",
    locale: "en_US",
    title,
    description,
    url: "/",
    images: [
      {
        url: asset("/img/opt/og-home.jpg"),
        width: 1200,
        height: 630,
        alt: "CyberGamez homepage key art featuring Cyberpunk 2077",
      },
    ],
  },
  twitter: {
    title,
    description,
    images: [asset("/img/opt/og-home.jpg")],
  },
};

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <TrendingRail />
      <NewReleasesGrid />
    </main>
  );
}
