import type { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/privacy';
  const title = isEn ? 'Privacy Policy - World Legends Cup 2026' : 'Política de Privacidade - Copa das Lendas 2026';
  const description = isEn
    ? 'Read the World Legends Cup 2026 privacy policy on how we collect, use, and protect your data.'
    : 'Leia a política de privacidade da Copa das Lendas 2026 sobre como coletamos, usamos e protegemos seus dados.';

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

export default function PrivacyPage() {
  return <PrivacyContent />;
}
