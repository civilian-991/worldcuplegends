import type { Metadata } from 'next';
import GalleryContent from './GalleryContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/gallery';
  const title = isEn ? 'Gallery - World Legends Cup 2026' : 'Galeria - Copa das Lendas 2026';
  const description = isEn
    ? 'Browse photos and media from the World Legends Cup 2026. Follow us on Instagram for the latest updates.'
    : 'Veja fotos e mídias da Copa das Lendas 2026. Siga-nos no Instagram para as últimas atualizações.';

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

export default function GalleryPage() {
  return <GalleryContent />;
}
