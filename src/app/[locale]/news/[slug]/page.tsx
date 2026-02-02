'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { getNewsBySlug, getNews, type NewsArticle } from '@/lib/api';

/**
 * Sanitizes HTML content to prevent XSS attacks by escaping HTML entities
 * before replacing newlines with <br /> tags.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br />');
}

export default function NewsArticlePage() {
  const params = useParams();
  const locale = useLocale();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const articleData = await getNewsBySlug(slug, locale);
      setArticle(articleData);

      if (articleData) {
        // Fetch related articles in same locale
        const allNews = await getNews(locale);
        const related = allNews
          .filter(a => a.slug !== articleData.slug && a.category === articleData.category)
          .slice(0, 3);
        // If not enough in same category, fill with other articles
        if (related.length < 3) {
          const others = allNews
            .filter(a => a.slug !== articleData.slug && !related.some(r => r.slug === a.slug))
            .slice(0, 3 - related.length);
          related.push(...others);
        }
        setRelatedArticles(related);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [slug, locale]);

  // Calculate read time based on content length
  const getReadTime = (content: string, excerpt: string) => {
    const words = (content || excerpt || '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <Link href="/news" className="text-gold-400 hover:text-gold-300">
            &larr; Back to News
          </Link>
        </div>
      </div>
    );
  }

  const readTime = getReadTime(article.content, article.excerpt);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute inset-0 bg-gradient-to-br from-gold-600/10 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-6 transition-colors"
            >
              <span>←</span>
              <span>Back to News</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-4 py-2 bg-gold-500 text-night-900 text-sm font-bold rounded-full">
                {article.category}
              </span>
              {article.tags && article.tags.length > 0 && article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-night-600 text-white/70 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {article.title.toUpperCase()}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <span className="text-gold-400 text-sm">✍️</span>
                </div>
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{readTime} read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image Placeholder */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-night-700 to-night-800"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/10 to-transparent -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {article.content ? (
              <div
                className="text-white/70 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
              />
            ) : (
              <>
                <p className="text-white/70 leading-relaxed mb-6">
                  This story is part of our coverage of the World Legends Cup 2026, bringing together
                  the greatest football players from across the decades to compete in a tournament
                  that celebrates the beautiful game&apos;s rich history.
                </p>

                <blockquote className="border-l-4 border-gold-500 pl-6 my-8 italic">
                  <p className="text-xl text-white/80">
                    &ldquo;Football is the beautiful game because it brings people together from all
                    walks of life, united by passion and love for the sport.&rdquo;
                  </p>
                </blockquote>

                <p className="text-white/70 leading-relaxed">
                  Stay tuned for more updates as we bring you exclusive coverage, interviews, and
                  behind-the-scenes content from the most anticipated football event of the decade.
                </p>
              </>
            )}
          </motion.div>

          {/* Source Attribution */}
          {article.sourceUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-night-700/50 rounded-2xl border border-gold-500/20"
            >
              <p className="text-white/50 text-sm mb-2">Originally published by</p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
              >
                <span>📰</span>
                <span>{article.sourceName || 'External Source'}</span>
                <span className="text-white/40">↗</span>
              </a>
              <p className="text-white/40 text-xs mt-2 break-all">{article.sourceUrl}</p>
            </motion.div>
          )}

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-white/50 mb-4">Share this article</p>
            <div className="flex gap-3">
              {/* X (Twitter) */}
              <motion.a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-night-600 flex items-center justify-center text-white/70 hover:text-white hover:bg-black transition-colors"
                aria-label="Share on X"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
              {/* Facebook */}
              <motion.a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-night-600 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#1877F2] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
              {/* LinkedIn */}
              <motion.a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-night-600 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#0A66C2] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
              {/* Email */}
              <motion.a
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-night-600 flex items-center justify-center text-white/70 hover:text-white hover:bg-gold-500 transition-colors"
                aria-label="Share via Email"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              RELATED STORIES
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related, index) => (
              <motion.article
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/news/${related.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                      {related.image && (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 to-night-800 -z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-night-900 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full">
                          {related.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors mb-2">
                      {related.title}
                    </h3>
                    <p className="text-white/50 text-sm">{getReadTime(related.content, related.excerpt)} read</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
