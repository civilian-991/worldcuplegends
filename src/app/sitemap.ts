import { MetadataRoute } from 'next';

const BASE_URL = 'https://wlc.world';
const LOCALES = ['en', 'br'];

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Define page configurations
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

  // Secondary pages - medium priority
  { path: '/partners', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/press', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'weekly', priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each page in each locale
  for (const page of pages) {
    for (const locale of LOCALES) {
      const url = page.path === ''
        ? `${BASE_URL}/${locale}`
        : `${BASE_URL}/${locale}${page.path}`;

      sitemapEntries.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return sitemapEntries;
}
