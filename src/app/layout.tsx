import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = 'https://wlc.world';
const siteName = 'World Legends Cup';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "World Legends Cup 2026 | Legends Never Die",
  description: "The greatest footballers in history unite for one legendary tournament. Experience the magic of Pelé, Maradona, Zidane, Messi, and more.",
  keywords: ["World Cup", "Football", "Legends", "Soccer", "2026", "Tournament"],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "World Legends Cup 2026",
    description: "Legends Never Die - The ultimate celebration of football greatness",
    type: "website",
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en',
    alternateLocales: ['pt_BR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@worldlegendscup',
    images: '/og-image.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "World Legends Cup",
  url: "https://wlc.world",
  logo: "https://wlc.world/og-image.png",
};

const sportsEventJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "World Legends Cup 2026",
  description: "The ultimate football legends tournament bringing together the greatest players in history",
  startDate: "2026-06-01",
  endDate: "2026-07-15",
  location: {
    "@type": "Place",
    name: "Maracanã Stadium",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rio de Janeiro",
      addressCountry: "Brazil",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "World Legends Cup",
    url: "https://wlc.world",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="sports-event-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventJsonLd) }}
      />
      {children}
    </>
  );
}
