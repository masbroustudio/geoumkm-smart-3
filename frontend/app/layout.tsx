import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/i18n-context";

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
  openGraph: {
    title: "GeoUMKM Intelligence v4.0",
    description:
      "Platform Intelijen UMKM Terdepan di Indonesia - AI-Powered Location Intelligence & Credit Risk Assessment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoUMKM Intelligence v4.0",
    description:
      "Platform Intelijen UMKM Terdepan di Indonesia - AI-Powered Location Intelligence & Credit Risk Assessment.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GeoUMKM" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                  var locale = localStorage.getItem('locale');
                  if (locale === 'en') {
                    document.documentElement.lang = 'en';
                  }
                } catch(e) {}
              })();
              if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider><LanguageProvider>{children}</LanguageProvider></ThemeProvider>
      </body>
    </html>
  );
}
