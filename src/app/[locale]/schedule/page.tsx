import { Metadata } from 'next';
import ScheduleContent from './ScheduleContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'Match Schedule - World Legends Cup 2026',
  description: 'View the complete match schedule for the World Legends Cup 2026. Seven legendary matches across two iconic stadiums in Rio de Janeiro, Brazil.',
  openGraph: {
    title: 'Match Schedule - World Legends Cup 2026',
    description: 'View the complete match schedule for the World Legends Cup 2026. Seven legendary matches across two iconic stadiums in Rio de Janeiro, Brazil.',
    url: `${siteUrl}/schedule`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Match Schedule - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Match Schedule - World Legends Cup 2026',
    description: 'View the complete match schedule for the World Legends Cup 2026. Seven legendary matches across two iconic stadiums in Rio de Janeiro, Brazil.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function SchedulePage() {
  return <ScheduleContent />;
}
