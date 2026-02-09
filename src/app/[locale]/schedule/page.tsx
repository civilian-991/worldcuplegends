import type { Metadata } from 'next';
import ScheduleContent from './ScheduleContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/schedule';
  const title = isEn ? 'Match Schedule & Fixtures - World Legends Cup 2026' : 'Calendário de Jogos - Copa das Lendas 2026';
  const description = isEn
    ? 'View the complete match schedule for the World Legends Cup 2026 across Maracanã and Nilton Santos stadiums.'
    : 'Veja o calendário completo de jogos da Copa das Lendas 2026 no Maracanã e Nilton Santos.';

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

export default function SchedulePage() {
  return <ScheduleContent />;
}
