'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { getNewsById, getNews, type NewsArticle } from '@/lib/api';

export default function NewsArticlePage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const articleData = await getNewsById(articleId);
      setArticle(articleData);

      if (articleData) {
        // Fetch related articles
        const allNews = await getNews();
        const related = allNews
          .filter(a => a.id !== articleData.id && a.category === articleData.category)
          .slice(0, 3);
        // If not enough in same category, fill with other articles
        if (related.length < 3) {
          const others = allNews
            .filter(a => a.id !== articleData.id && !related.some(r => r.id === a.id))
            .slice(0, 3 - related.length);
          related.push(...others);
        }
        setRelatedArticles(related);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [articleId]);

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

            <span className="inline-block px-4 py-2 bg-gold-500 text-night-900 text-sm font-bold rounded-full mb-6">
              {article.category}
            </span>

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
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/30 to-night-800 -z-10" />
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
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
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

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-white/50 mb-4">Share this article</p>
            <div className="flex gap-3">
              {['𝕏', '📘', '💼', '📧'].map((icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-night-600 flex items-center justify-center text-white/70 hover:text-gold-400 hover:bg-night-500 transition-colors"
                >
                  {icon}
                </motion.button>
              ))}
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
                <Link href={`/news/${related.id}`}>
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
