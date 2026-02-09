import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import LegendDetailContent from './LegendDetailContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const isEn = locale === 'en';
  const path = `/legends/${id}`;

  // Fetch legend data server-side for metadata
  let legendName: string | null = null;
  let legendCountry: string | null = null;
  let legendImage: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('legends')
      .select('name, country, image')
      .eq('id', parseInt(id))
      .single();
    if (data) {
      legendName = data.name;
      legendCountry = data.country;
      legendImage = data.image;
    }
  } catch {
    // Fallback if DB query fails
  }

  if (!legendName) {
    return {
      title: isEn ? 'Legend Not Found - World Legends Cup' : 'Lenda Não Encontrada - Copa das Lendas',
    };
  }

  const title = isEn
    ? `${legendName} - Football Legend | World Legends Cup 2026`
    : `${legendName} - Lenda do Futebol | Copa das Lendas 2026`;
  const description = isEn
    ? `Discover ${legendName} from ${legendCountry}. Stats, career highlights, and more at the World Legends Cup 2026.`
    : `Conheça ${legendName} de ${legendCountry}. Estatísticas, destaques da carreira e mais na Copa das Lendas 2026.`;

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
      images: legendImage
        ? [{ url: legendImage, width: 800, height: 800, alt: legendName }]
        : [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'World Legends Cup 2026' }],
      locale: isEn ? 'en_US' : 'pt_BR',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: legendImage ? [legendImage] : [`${siteUrl}/og-image.png`],
    },
  };
}

export default function LegendDetailPage() {
  return <LegendDetailContent />;
}
