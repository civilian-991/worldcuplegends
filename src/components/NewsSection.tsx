'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { news } from '@/data/legends';

const featuredNews = news.slice(0, 4);

export default function NewsSection() {
  const t = useTranslations('sections.news');

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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNews.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <Link href={`/news/${article.id}`}>
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
                    <div className="flex items-center gap-4 text-white/40 text-sm">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.readTime} {t('readTime')}</span>
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
