'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getLatestNews, type NewsArticle } from '@/lib/api';

// Calculate read time based on content length
function getReadTime(content: string, excerpt: string): string {
  const words = (content || excerpt || '').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export default function NewsSection() {
  const t = useTranslations('sections.news');
  const tCommon = useTranslations('common');
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLatestNews(4);
      if (!data || data.length === 0) {
        throw new Error('No news data received');
      }
      setFeaturedNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(tCommon('errorLoadingNews'));
    } finally {
      setIsLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (isLoading) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-800 to-night-700" />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-800 to-night-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">{t('preTitle')}</p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white line-accent"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('title')}
              </h2>
            </div>
          </motion.div>

          {/* Error State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-night-700/80 to-night-800/80 backdrop-blur-sm border border-red-500/20 shadow-xl max-w-md w-full text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {tCommon('error')}
              </h3>
              <p className="text-white/60 mb-6">{error}</p>

              {/* Retry Button */}
              <button
                onClick={fetchNews}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-night-900 font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-gold-500/20"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {tCommon('tryAgain')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-night-800 to-night-700" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">{t('preTitle')}</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white line-accent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/news"
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2 group"
          >
            {t('viewAll')}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* News Grid - Horizontal scroll on mobile */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {featuredNews.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group cursor-pointer flex-shrink-0 w-72 md:w-auto snap-start ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <Link href={`/news/${article.slug}`}>
                <div className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'h-full min-h-[500px]' : 'h-64'}`}>
                  {/* Article Image or Gradient Fallback */}
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br from-gold-600/30 to-night-800 ${article.image ? 'hidden' : ''}`} />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Category */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-white font-bold mb-3 group-hover:text-gold-400 transition-colors ${
                        index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'
                      }`}
                      style={{ fontFamily: index === 0 ? 'var(--font-display)' : 'inherit' }}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt - Only for featured */}
                    {index === 0 && (
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{getReadTime(article.content, article.excerpt)} {t('readTime')}</span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
