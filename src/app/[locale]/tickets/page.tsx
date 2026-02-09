import type { Metadata } from 'next';
import TicketsContent from './TicketsContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/tickets';
  const title = isEn ? 'Tickets - World Legends Cup 2026' : 'Ingressos - Copa das Lendas 2026';
  const description = isEn
    ? 'Buy tickets for the World Legends Cup 2026. Standard, Premium, and VIP packages available.'
    : 'Compre ingressos para a Copa das Lendas 2026. Pacotes Standard, Premium e VIP disponíveis.';

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

export default function TicketsPage() {
  return <TicketsContent />;
}
