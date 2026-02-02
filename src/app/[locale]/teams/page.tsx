import { Metadata } from 'next';
import TeamsContent from './TeamsContent';

const siteUrl = 'https://worldcuplegends.vercel.app';

export const metadata: Metadata = {
  title: 'Teams - World Legends Cup 2026',
  description: 'Explore the legendary national teams competing in the World Legends Cup 2026. Eight nations featuring the greatest football legends will battle for glory in Brazil.',
  openGraph: {
    title: 'Teams - World Legends Cup 2026',
    description: 'Explore the legendary national teams competing in the World Legends Cup 2026. Eight nations featuring the greatest football legends will battle for glory in Brazil.',
    url: `${siteUrl}/teams`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Teams - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teams - World Legends Cup 2026',
    description: 'Explore the legendary national teams competing in the World Legends Cup 2026. Eight nations featuring the greatest football legends will battle for glory in Brazil.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function TeamsPage() {
  return <TeamsContent />;
}
