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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsOrganization",
      "@id": `${siteUrl}/#organization`,
      "name": "World Legends Cup",
      "alternateName": "WLC 2026",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.png`,
        "width": 1200,
        "height": 630,
      },
      "description": "The ultimate football legends tournament bringing together the greatest players of all time.",
      "sport": "Football",
      "sameAs": [
        "https://twitter.com/worldlegendscup"
      ],
    },
    {
      "@type": "SportsEvent",
      "@id": `${siteUrl}/#event`,
      "name": "World Legends Cup 2026",
      "description": "The ultimate football legends tournament featuring the greatest players in history.",
      "startDate": "2026-06-01",
      "endDate": "2026-07-15",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "image": `${siteUrl}/og-image.png`,
      "location": {
        "@type": "StadiumOrArena",
        "name": "Maracanã Stadium",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Pres. Castelo Branco, Portão 3",
          "addressLocality": "Rio de Janeiro",
          "addressRegion": "RJ",
          "addressCountry": "BR",
        },
      },
      "organizer": {
        "@type": "SportsOrganization",
        "@id": `${siteUrl}/#organization`,
      },
      "offers": {
        "@type": "AggregateOffer",
        "url": `${siteUrl}/en/tickets`,
        "lowPrice": "150",
        "highPrice": "1500",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "World Legends Cup",
      "url": siteUrl,
      "publisher": {
        "@type": "SportsOrganization",
        "@id": `${siteUrl}/#organization`,
      },
      "inLanguage": ["en", "pt-BR"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="root-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
