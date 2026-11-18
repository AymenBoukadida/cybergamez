import "@fontsource-variable/inter";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteHeader } from "./components/SiteHeader";
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
        {children}
      </body>
    </html>
  );
}
