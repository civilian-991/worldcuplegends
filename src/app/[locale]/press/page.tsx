import type { Metadata } from 'next';
import PressContent from './PressContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/press';
  const title = isEn ? 'Press Room & Media Resources - World Legends Cup 2026' : 'Sala de Imprensa - Copa das Lendas 2026';
  const description = isEn
    ? 'Access official press releases, media kits, and resources for the World Legends Cup 2026.'
    : 'Acesse comunicados de imprensa, kits de mídia e recursos da Copa das Lendas 2026.';

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

export default function PressPage() {
  return <PressContent />;
}
