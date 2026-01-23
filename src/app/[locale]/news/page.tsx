'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { getNews, type NewsArticle } from '@/lib/api';

const categories = ['All', 'History', 'Events', 'Interview', 'Tournament', 'Analysis', 'Exclusive', 'general'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getNews();
      setNews(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredNews = selectedCategory === 'All'
    ? news
    : news.filter((article) => article.category.toLowerCase() === selectedCategory.toLowerCase());

  const featuredArticle = filteredNews[0];
  const otherArticles = filteredNews.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Stories</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEWS & <span className="text-gradient-gold">FEATURES</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              The latest stories, exclusive interviews, and in-depth analysis
              from the world of legendary football.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-30 py-6 px-6 glass">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-night-900'
                    : 'bg-night-600 text-white/70 hover:bg-night-500 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {featuredArticle && (
            <>
              {/* Featured Article */}
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <Link href={`/news/${featuredArticle.id}`}>
                  <div className="relative overflow-hidden rounded-3xl glass group cursor-pointer">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="relative lg:w-2/3 h-64 lg:h-[500px] overflow-hidden">
                        {featuredArticle.image && (
                          <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-600/30 to-night-800 -z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-night-900/80 lg:from-transparent via-transparent to-night-900 lg:to-night-900" />

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-gold-500 text-night-900 text-sm font-bold rounded-full">
                            {featuredArticle.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:w-1/3 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="text-gold-400 text-sm">Featured Story</span>
                        </div>

                        <h2
                          className="text-2xl lg:text-4xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {featuredArticle.title.toUpperCase()}
                        </h2>

                        <p className="text-white/60 mb-6 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-white/40 text-sm mb-6">
                          <span>{featuredArticle.author}</span>
                          <span>•</span>
                          <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </div>

                        <span className="text-gold-400 font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                          Read Full Story
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            </>
          )}

          {/* Other Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/news/${article.id}`}>
                  <div className="group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden rounded-2xl mb-4">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 to-night-800 -z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-night-900 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-white/40 text-xs">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* No Results */}
          {filteredNews.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-white/50 text-xl">No articles found in this category.</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-4 text-gold-400 hover:text-gold-300 transition-colors"
              >
                View all articles
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-6xl mb-6 block">📰</span>
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              STAY IN THE LOOP
            </h2>
            <p className="text-white/60 mb-8">
              Get the latest news, exclusive interviews, and behind-the-scenes content
              delivered directly to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-night-600 border border-gold-500/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
              >
                Subscribe
              </motion.button>
            </div>

            <p className="text-white/30 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
