import type { Metadata } from 'next';
import { products } from '@/data/products';
import ProductDetailContent from './ProductDetailContent';

const siteUrl = 'https://wlc.world';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const isEn = locale === 'en';
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return {
      title: isEn ? 'Product Not Found - World Legends Cup' : 'Produto Não Encontrado - Copa das Lendas',
    };
  }

  const path = `/shop/${id}`;
  const title = `${product.name} | World Legends Cup Shop`;
  const description = product.description.slice(0, 155);

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
      images: product.images?.[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'World Legends Cup 2026' }],
      locale: isEn ? 'en_US' : 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images?.[0] ? [product.images[0]] : [`${siteUrl}/og-image.png`],
    },
  };
}

export default function ProductPage() {
  return <ProductDetailContent />;
}
