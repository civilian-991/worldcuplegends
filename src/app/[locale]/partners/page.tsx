import { Metadata } from 'next';
import PartnersContent from './PartnersContent';

const siteUrl = 'https://worldcuplegends.vercel.app';

export const metadata: Metadata = {
  title: 'Official Partners - World Legends Cup 2026',
  description: 'Meet the official partners and sponsors of the World Legends Cup 2026. World-class brands supporting the celebration of football\'s greatest legends.',
  openGraph: {
    title: 'Official Partners - World Legends Cup 2026',
    description: 'Meet the official partners and sponsors of the World Legends Cup 2026. World-class brands supporting the celebration of football\'s greatest legends.',
    url: `${siteUrl}/partners`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Official Partners - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Partners - World Legends Cup 2026',
    description: 'Meet the official partners and sponsors of the World Legends Cup 2026. World-class brands supporting the celebration of football\'s greatest legends.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function PartnersPage() {
  return <PartnersContent />;
}
