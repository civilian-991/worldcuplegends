import type { Metadata } from 'next';
import HomeContent from './HomeContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '';
  const title = isEn ? 'World Legends Cup 2026 - Football Legends Tournament' : 'Copa das Lendas 2026 - Torneio de Lendas do Futebol';
  const description = isEn
    ? 'Watch football legends compete in the World Legends Cup 2026 at iconic venues in Rio de Janeiro, Brazil.'
    : 'Assista lendas do futebol competirem na Copa das Lendas 2026 em locais icônicos no Rio de Janeiro, Brasil.';

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

export default function Home() {
  return <HomeContent />;
}
