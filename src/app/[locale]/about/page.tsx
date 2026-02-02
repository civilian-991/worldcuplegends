import { Metadata } from 'next';
import AboutContent from './AboutContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'About - World Legends Cup 2026',
  description: 'Learn about the World Legends Cup 2026 - a historic football tournament bringing together the greatest legends of the game in Brazil. Discover our mission, values, and the people behind the event.',
  openGraph: {
    title: 'About - World Legends Cup 2026',
    description: 'Learn about the World Legends Cup 2026 - a historic football tournament bringing together the greatest legends of the game in Brazil. Discover our mission, values, and the people behind the event.',
    url: `${siteUrl}/about`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'About - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - World Legends Cup 2026',
    description: 'Learn about the World Legends Cup 2026 - a historic football tournament bringing together the greatest legends of the game in Brazil. Discover our mission, values, and the people behind the event.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
