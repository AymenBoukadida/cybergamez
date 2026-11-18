import "@fontsource-variable/inter";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BackToTop } from "./components/BackToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { ToastProvider } from "./components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberGamez",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-text font-sans antialiased">
        <ScrollProgress />
        <SiteHeader />
        <ToastProvider>{children}</ToastProvider>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
