import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Providers from "./providers";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import PushPermissionManager from "@/components/pwa/PushPermissionManager";
import IosInstallPrompt from "@/components/pwa/IosInstallPrompt";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ScriptureAI | Biblical Research Platform",
  description:
    "AI-powered biblical research for Christians, pastors, and scholars.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScriptureAI",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    // iOS Safari (16.4+) only recognizes the "apple-" prefixed tag; Next's
    // appleWebApp.capable option only emits the unprefixed variant.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        <ServiceWorkerRegister />
        <Providers>
          {children}
          <PushPermissionManager />
          <IosInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
