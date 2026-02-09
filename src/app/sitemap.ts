import { MetadataRoute } from 'next';

const BASE_URL = 'https://wlc.world';
const LOCALES = ['en', 'br'] as const;

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Define static page configurations
const pages: PageConfig[] = [
  // Homepage - highest priority
  { path: '', changeFrequency: 'weekly', priority: 1.0 },

  // Main pages - high priority
  { path: '/about', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/legends', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/teams', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/schedule', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/venues', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/news', changeFrequency: 'daily', priority: 0.9 },
  { path: '/shop', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/tickets', changeFrequency: 'weekly', priority: 0.9 },

  // Secondary pages - medium priority
  { path: '/partners', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/press', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'weekly', priority: 0.8 },

  // Informational pages
  { path: '/history', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/careers', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/shipping', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/returns', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/size-guide', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/newsletter', changeFrequency: 'monthly', priority: 0.4 },

  // Legal pages - low priority
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Default lastModified for static pages
  const currentDate = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // ---------------------------------------------------------------------------
  // Static pages: generate an entry per locale with hreflang alternates
  // ---------------------------------------------------------------------------
  for (const page of pages) {
    for (const locale of LOCALES) {
      const url =
        page.path === ''
          ? `${BASE_URL}/${locale}`
          : `${BASE_URL}/${locale}${page.path}`;

      sitemapEntries.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: page.path === '' ? `${BASE_URL}/en` : `${BASE_URL}/en${page.path}`,
            'pt-BR': page.path === '' ? `${BASE_URL}/br` : `${BASE_URL}/br${page.path}`,
          },
        },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Dynamic pages - Legends (/legends/[id])
  // ---------------------------------------------------------------------------
  // TODO: Fetch legend IDs from Supabase and generate entries for each
  // Example:
  //   const supabase = createBrowserClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   );
  //   const { data: legends } = await supabase
  //     .from('legends')
  //     .select('id, updated_at')
  //     .is('deleted_at', null);
  //
  //   if (legends) {
  //     for (const legend of legends) {
  //       for (const locale of LOCALES) {
  //         sitemapEntries.push({
  //           url: `${BASE_URL}/${locale}/legends/${legend.id}`,
  //           lastModified: new Date(legend.updated_at),  // use DB timestamp
  //           changeFrequency: 'monthly',
  //           priority: 0.7,
  //           alternates: {
  //             languages: {
  //               en: `${BASE_URL}/en/legends/${legend.id}`,
  //               'pt-BR': `${BASE_URL}/br/legends/${legend.id}`,
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }

  // ---------------------------------------------------------------------------
  // Dynamic pages - News (/news/[slug])
  // ---------------------------------------------------------------------------
  // TODO: Fetch news slugs from Supabase and generate entries for each
  // Example:
  //   const { data: news } = await supabase
  //     .from('news')
  //     .select('slug, updated_at')
  //     .is('deleted_at', null);
  //
  //   if (news) {
  //     for (const article of news) {
  //       for (const locale of LOCALES) {
  //         sitemapEntries.push({
  //           url: `${BASE_URL}/${locale}/news/${article.slug}`,
  //           lastModified: new Date(article.updated_at),  // use DB timestamp
  //           changeFrequency: 'weekly',
  //           priority: 0.6,
  //           alternates: {
  //             languages: {
  //               en: `${BASE_URL}/en/news/${article.slug}`,
  //               'pt-BR': `${BASE_URL}/br/news/${article.slug}`,
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }

  // ---------------------------------------------------------------------------
  // Dynamic pages - Products (/shop/[id])
  // ---------------------------------------------------------------------------
  // TODO: Fetch product IDs from Supabase and generate entries for each
  // Example:
  //   const { data: products } = await supabase
  //     .from('products')
  //     .select('id, updated_at')
  //     .is('deleted_at', null);
  //
  //   if (products) {
  //     for (const product of products) {
  //       for (const locale of LOCALES) {
  //         sitemapEntries.push({
  //           url: `${BASE_URL}/${locale}/shop/${product.id}`,
  //           lastModified: new Date(product.updated_at),  // use DB timestamp
  //           changeFrequency: 'weekly',
  //           priority: 0.7,
  //           alternates: {
  //             languages: {
  //               en: `${BASE_URL}/en/shop/${product.id}`,
  //               'pt-BR': `${BASE_URL}/br/shop/${product.id}`,
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }

  return sitemapEntries;
}
