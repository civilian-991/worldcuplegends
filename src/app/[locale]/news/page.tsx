import { Metadata } from 'next';
import NewsContent from './NewsContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'News - World Legends Cup 2026',
  description: 'Stay updated with the latest news, exclusive interviews, and in-depth analysis from the World Legends Cup 2026. Get behind-the-scenes stories from football legends.',
  openGraph: {
    title: 'News - World Legends Cup 2026',
    description: 'Stay updated with the latest news, exclusive interviews, and in-depth analysis from the World Legends Cup 2026. Get behind-the-scenes stories from football legends.',
    url: `${siteUrl}/news`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'News - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News - World Legends Cup 2026',
    description: 'Stay updated with the latest news, exclusive interviews, and in-depth analysis from the World Legends Cup 2026. Get behind-the-scenes stories from football legends.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function NewsPage() {
  return <NewsContent />;
}
