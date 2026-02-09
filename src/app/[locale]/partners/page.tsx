import type { Metadata } from 'next';
import PartnersContent from './PartnersContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/partners';
  const title = isEn ? 'Official Partners & Sponsors - World Legends Cup 2026' : 'Parceiros e Patrocinadores - Copa das Lendas 2026';
  const description = isEn
    ? 'Meet the official sponsors and partners of the World Legends Cup 2026 football tournament.'
    : 'Conheça os patrocinadores e parceiros oficiais da Copa das Lendas 2026.';

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

export default function PartnersPage() {
  return <PartnersContent />;
}
