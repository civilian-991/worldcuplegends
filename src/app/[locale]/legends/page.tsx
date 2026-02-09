import type { Metadata } from 'next';
import LegendsContent from './LegendsContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/legends';
  const title = isEn ? 'Football Legends Roster - World Legends Cup 2026' : 'Elenco de Lendas - Copa das Lendas 2026';
  const description = isEn
    ? 'Meet the greatest football legends competing in the World Legends Cup 2026 tournament in Brazil.'
    : 'Conheça as maiores lendas do futebol que competem na Copa das Lendas 2026 no Brasil.';

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

export default function LegendsPage() {
  return <LegendsContent />;
}
