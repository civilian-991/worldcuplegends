import type { Metadata } from 'next';
import FAQContent from './FAQContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = '/faq';
  const title = isEn ? 'FAQ - World Legends Cup 2026' : 'Perguntas Frequentes - Copa das Lendas 2026';
  const description = isEn
    ? 'Find answers to frequently asked questions about the World Legends Cup 2026 tickets, merchandise, and events.'
    : 'Encontre respostas para perguntas frequentes sobre ingressos, produtos e eventos da Copa das Lendas 2026.';

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

export default function FAQPage() {
  return <FAQContent />;
}
