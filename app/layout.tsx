import "@fontsource-variable/inter";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BackToTop } from "./components/BackToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { ToastProvider } from "./components/Toast";
import { asset } from "./lib/base-path";
import "./globals.css";

const description =
  "Live Steam releases, Epic free-game giveaways and gaming headlines, plus a playable Subway Surfers demo with a captioned trailer and Android APK.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "CyberGamez — Live game releases, free games and news",
    template: "%s | CyberGamez",
  },
  description,
  applicationName: "CyberGamez",
  icons: { icon: asset("/favicon.png") },
  openGraph: {
    type: "website",
    siteName: "CyberGamez",
    locale: "en_US",
    description,
  },
  twitter: {
    card: "summary_large_image",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-text font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <ToastProvider>{children}</ToastProvider>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
