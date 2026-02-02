import { Metadata } from 'next';

// Site URL for canonical and structured data
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wlc.world';

export const metadata: Metadata = {
  title: 'Legends | World Legends Cup 2026',
  description:
    'Meet the greatest footballers competing in the World Legends Cup 2026. Browse legends from all eras including Pelé, Maradona, Zidane, and more.',
  keywords: [
    'football legends',
    'soccer legends',
    'World Legends Cup',
    'WLC 2026',
    'Pelé',
    'Maradona',
    'Zidane',
    'Ronaldinho',
    'Beckham',
    'retired footballers',
    'legendary players',
    'football hall of fame',
    'greatest footballers',
    'classic football',
  ],
  openGraph: {
    title: 'Legends | World Legends Cup 2026',
    description:
      'Meet the greatest footballers competing in the World Legends Cup 2026. Browse legends from all eras including Pelé, Maradona, Zidane, and more.',
    type: 'website',
    url: `${SITE_URL}/legends`,
    images: [
      {
        url: '/banners/hero-legends.png',
        width: 1200,
        height: 630,
        alt: 'World Legends Cup 2026 - Football Legends',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legends | World Legends Cup 2026',
    description:
      'Meet the greatest footballers competing in the World Legends Cup 2026. Browse legends from all eras including Pelé, Maradona, Zidane, and more.',
    images: ['/banners/hero-legends.png'],
  },
  alternates: {
    canonical: `${SITE_URL}/legends`,
  },
};

// JSON-LD Structured Data for SEO
const sportsOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: 'World Legends Cup 2026',
  alternateName: 'WLC 2026',
  description:
    'The World Legends Cup brings together the greatest retired footballers from around the world to compete in an international tournament celebrating the legends of the beautiful game.',
  sport: 'Football',
  url: SITE_URL,
  foundingDate: '2026',
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/worldlegendscup',
    'https://instagram.com/worldlegendscup',
    'https://facebook.com/worldlegendscup',
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Football Legends',
  description:
    'A collection of the greatest footballers participating in the World Legends Cup 2026',
  url: `${SITE_URL}/legends`,
  numberOfItems: 50,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Pelé',
      description: 'Brazilian football legend, three-time World Cup winner',
      url: `${SITE_URL}/legends/1`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Diego Maradona',
      description: 'Argentine football legend, 1986 World Cup winner',
      url: `${SITE_URL}/legends/2`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Zinedine Zidane',
      description: 'French football legend, 1998 World Cup winner',
      url: `${SITE_URL}/legends/3`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Ronaldinho',
      description: 'Brazilian football legend, 2002 World Cup winner',
      url: `${SITE_URL}/legends/4`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'David Beckham',
      description: 'English football legend, renowned midfielder',
      url: `${SITE_URL}/legends/5`,
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Legends',
      item: `${SITE_URL}/legends`,
    },
  ],
};

// Combine all schemas into a single graph
const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [sportsOrganizationSchema, itemListSchema, breadcrumbSchema],
};

export default function LegendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdData),
        }}
      />
      {children}
    </>
  );
}
