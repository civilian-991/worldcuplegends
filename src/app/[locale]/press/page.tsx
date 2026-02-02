import { Metadata } from 'next';
import PressContent from './PressContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'Press Room - World Legends Cup 2026',
  description: 'Access official press releases, media resources, and accreditation information for journalists covering the World Legends Cup 2026.',
  openGraph: {
    title: 'Press Room - World Legends Cup 2026',
    description: 'Access official press releases, media resources, and accreditation information for journalists covering the World Legends Cup 2026.',
    url: `${siteUrl}/press`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Press Room - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Press Room - World Legends Cup 2026',
    description: 'Access official press releases, media resources, and accreditation information for journalists covering the World Legends Cup 2026.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function PressPage() {
  return <PressContent />;
}
