'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { news } from '@/data/legends';

const featuredNews = news.slice(0, 4);

export default function NewsSection() {
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
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Latest</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white line-accent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEWS & STORIES
            </h2>
          </div>
          <Link
            href="/news"
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2 group"
          >
            All News
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
                  {/* Image Placeholder with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-600/30 to-night-800">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>

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
                      <span>{article.readTime} read</span>
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
