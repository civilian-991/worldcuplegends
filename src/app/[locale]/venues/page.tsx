import { Metadata } from 'next';
import VenuesContent from './VenuesContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'Venues - Maracana & Nilton Santos Stadiums',
  description: 'Discover the iconic venues hosting the World Legends Cup 2026. Experience football at the legendary Maracana Stadium and Nilton Santos Stadium in Rio de Janeiro, Brazil.',
  openGraph: {
    title: 'Venues - Maracana & Nilton Santos Stadiums',
    description: 'Discover the iconic venues hosting the World Legends Cup 2026. Experience football at the legendary Maracana Stadium and Nilton Santos Stadium in Rio de Janeiro, Brazil.',
    url: `${siteUrl}/venues`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'World Legends Cup 2026 Venues',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venues - Maracana & Nilton Santos Stadiums',
    description: 'Discover the iconic venues hosting the World Legends Cup 2026. Experience football at the legendary Maracana Stadium and Nilton Santos Stadium in Rio de Janeiro, Brazil.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function VenuesPage() {
  return <VenuesContent />;
}
