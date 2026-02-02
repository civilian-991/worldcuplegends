import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = 'https://wlc.world';
const siteName = 'World Legends Cup';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "World Legends Cup 2026 | Legends Never Die",
  description: "Football legends tournament in Brazil 2026. Watch Pelé, Maradona, Zidane, Messi and more compete at Maracanã Stadium.",
  keywords: ["World Cup", "Football", "Legends", "Soccer", "2026", "Tournament", "Brazil", "Maracanã"],
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
    description: "Football legends tournament in Brazil. Watch the greatest players compete at Maracanã.",
    type: "website",
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'World Legends Cup 2026 Trophy',
      },
    ],
    locale: 'en',
    alternateLocale: ['pt_BR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@worldlegendscup',
    title: "World Legends Cup 2026",
    description: "Football legends tournament in Brazil. Watch the greatest players compete.",
    images: [`${siteUrl}/og-image.png`],
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
