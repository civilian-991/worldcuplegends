import { Metadata } from 'next';
import HomeContent from './HomeContent';

const siteUrl = 'https://worldcuplegends.vercel.app';

export const metadata: Metadata = {
  title: 'World Legends Cup 2026 - Football Legends Tournament in Brazil',
  description: 'Experience the ultimate football legends tournament in Brazil. Watch legendary players from around the world compete in the World Legends Cup 2026 at iconic venues including Maracana Stadium.',
  openGraph: {
    title: 'World Legends Cup 2026 - Football Legends Tournament in Brazil',
    description: 'Experience the ultimate football legends tournament in Brazil. Watch legendary players from around the world compete in the World Legends Cup 2026 at iconic venues including Maracana Stadium.',
    url: siteUrl,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Legends Cup 2026 - Football Legends Tournament in Brazil',
    description: 'Experience the ultimate football legends tournament in Brazil. Watch legendary players from around the world compete in the World Legends Cup 2026 at iconic venues including Maracana Stadium.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function Home() {
  return <HomeContent />;
}
