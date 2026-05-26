import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoUMKM Intelligence v4.0",
  description:
    "Platform Intelijen UMKM Terdepan di Indonesia - AI-Powered Location Intelligence & Credit Risk Assessment untuk Bank, Pemerintah, dan Investor.",
  keywords: [
    "UMKM",
    "credit scoring",
    "location intelligence",
    "Indonesia",
    "AI",
    "machine learning",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
