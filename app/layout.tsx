import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { TimelineProvider } from "@/context/TimelineContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UX Data PO Kit",
  description:
    "Une application pour structurer une démarche produit centrée sur l’UX, les données et l’agilité.",
  openGraph: {
    title: "UX Data PO Kit",
    description:
      "Une application pour structurer une démarche produit centrée sur l’UX, les données et l’agilité.",
    url: "https://po-ux-ui-data.vercel.app",
    siteName: "UX Data PO Kit",
    images: [
      {
        url: "https://po-ux-ui-data.vercel.app/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "UX Data PO Kit - interface",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UX Data PO Kit",
    description:
      "Une application pour structurer une démarche produit centrée sur l’UX, les données et l’agilité.",
    images: ["https://po-ux-ui-data.vercel.app/og-cover.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-white-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-white-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TimelineProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
            <Toaster />
          </TimelineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
