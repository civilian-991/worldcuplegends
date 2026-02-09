import type { Metadata } from 'next';
import VenuesContent from './VenuesContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/venues';
  const title = isEn ? 'Venues - Maracanã & Nilton Santos | World Legends Cup' : 'Estádios - Maracanã e Nilton Santos | Copa das Lendas';
  const description = isEn
    ? 'Explore the iconic Maracanã and Nilton Santos stadiums hosting the World Legends Cup 2026 in Rio.'
    : 'Explore os icônicos estádios Maracanã e Nilton Santos, sedes da Copa das Lendas 2026 no Rio.';

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages: {
        en: `${siteUrl}/en${path}`,
        'pt-BR': `${siteUrl}/br${path}`,
        'x-default': `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${path}`,
      siteName: 'World Legends Cup',
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'World Legends Cup 2026' }],
      locale: isEn ? 'en_US' : 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.png`],
    },
  };
}

export default function VenuesPage() {
  return <VenuesContent />;
}
