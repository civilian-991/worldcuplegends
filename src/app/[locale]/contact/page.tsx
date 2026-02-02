import { Metadata } from 'next';
import ContactContent from './ContactContent';

const siteUrl = 'https://wlc.world';

export const metadata: Metadata = {
  title: 'Contact Us - World Legends Cup 2026',
  description: 'Get in touch with the World Legends Cup 2026 team. Contact us for tickets, media inquiries, partnership opportunities, or general questions about the tournament.',
  openGraph: {
    title: 'Contact Us - World Legends Cup 2026',
    description: 'Get in touch with the World Legends Cup 2026 team. Contact us for tickets, media inquiries, partnership opportunities, or general questions about the tournament.',
    url: `${siteUrl}/contact`,
    siteName: 'World Legends Cup',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contact Us - World Legends Cup 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - World Legends Cup 2026',
    description: 'Get in touch with the World Legends Cup 2026 team. Contact us for tickets, media inquiries, partnership opportunities, or general questions about the tournament.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
