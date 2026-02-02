import { Metadata } from 'next';
import LegendsContent from './LegendsContent';

const siteUrl = 'https://worldcuplegends.vercel.app';

export const metadata: Metadata = {
  title: 'Football Legends - World Legends Cup 2026',
  description: 'Meet the greatest football legends competing in the World Legends Cup 2026. Explore legendary players from Brazil, Argentina, France, Germany, Italy, and more.',
  openGraph: {
    title: 'Football Legends - World Legends Cup 2026',
    description: 'Meet the greatest football legends competing in the World Legends Cup 2026. Explore legendary players from Brazil, Argentina, France, Germany, Italy, and more.',
    url: `${siteUrl}/legends`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Football Legends - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Legends - World Legends Cup 2026',
    description: 'Meet the greatest football legends competing in the World Legends Cup 2026. Explore legendary players from Brazil, Argentina, France, Germany, Italy, and more.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function LegendsPage() {
  return <LegendsContent />;
}
