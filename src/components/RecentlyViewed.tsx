'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRecentlyViewed, formatTimeAgo, ViewedProduct, ViewedLegend, ViewedArticle } from '@/context/RecentlyViewedContext';
import { useCart } from '@/context/CartContext';
import { Skeleton } from '@/components/Skeleton';
import Flag from '@/components/Flag';

type TabType = 'products' | 'legends' | 'articles';

interface RecentlyViewedProps {
  title?: string;
  showTabs?: boolean;
  defaultTab?: TabType;
  maxItems?: number;
  showClearButton?: boolean;
  className?: string;
}

export default function RecentlyViewed({
  title = 'Recently Viewed',
  showTabs = true,
  defaultTab = 'products',
  maxItems = 10,
  showClearButton = true,
  className = '',
}: RecentlyViewedProps) {
  const { products, legends, articles, clearHistory, isHydrated } = useRecentlyViewed();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [activeTab, products, legends, articles]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'products', label: 'Products', count: products.length },
    { key: 'legends', label: 'Legends', count: legends.length },
    { key: 'articles', label: 'Articles', count: articles.length },
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'products':
        return products.slice(0, maxItems);
      case 'legends':
        return legends.slice(0, maxItems);
      case 'articles':
        return articles.slice(0, maxItems);
      default:
        return [];
    }
  };

  const currentItems = getCurrentItems();
  const hasItems = products.length > 0 || legends.length > 0 || articles.length > 0;

  // Loading skeleton
  if (!isHydrated) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <Skeleton className="h-48 w-full rounded-t-2xl" />
                <div className="p-4 glass rounded-b-2xl">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!hasItems) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-night-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              No Recent Activity
            </h3>
            <p className="text-white/50 max-w-md mx-auto">
              Start exploring products, legends, and articles to build your viewing history.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500 text-night-900 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
            >
              Explore Shop
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white line-accent"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>

          <div className="flex items-center gap-4">
            {/* Tabs */}
            {showTabs && (
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-gold-500 text-night-900'
                        : 'bg-night-600 text-white/70 hover:bg-night-500 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-night-900/20'
                          : 'bg-gold-500/20 text-gold-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Clear History Button */}
            {showClearButton && currentItems.length > 0 && (
              <button
                onClick={() => clearHistory(activeTab)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear History
              </button>
            )}
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-night-600/90 backdrop-blur-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors shadow-lg"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-night-600/90 backdrop-blur-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors shadow-lg"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-night-700 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-night-700 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 -mx-6 px-6"
          >
            <AnimatePresence mode="popLayout">
              {currentItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full py-12 text-center text-white/50"
                >
                  No {activeTab} in your viewing history
                </motion.div>
              ) : (
                currentItems.map((item, index) => (
                  <motion.div
                    key={`${item.type}-${item.item.id}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-shrink-0 w-72 snap-start"
                  >
                    {item.type === 'product' && (
                      <ProductCard item={item as ViewedProduct} onAddToCart={() => addToCart((item as ViewedProduct).item)} />
                    )}
                    {item.type === 'legend' && (
                      <LegendCard item={item as ViewedLegend} />
                    )}
                    {item.type === 'article' && (
                      <ArticleCard item={item as ViewedArticle} />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ item, onAddToCart }: { item: ViewedProduct; onAddToCart: () => void }) {
  const product = item.item;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden group h-full"
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="relative h-48 bg-night-600 overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-crimson text-white text-xs font-bold rounded-full">
              SALE
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gold-400/70 text-xs mb-1">{formatTimeAgo(item.viewedAt)}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3
            className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-white/50 text-sm mb-3">{product.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold-400 font-bold text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="text-white/40 text-sm line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-night-900 hover:bg-gold-400 transition-colors"
            aria-label="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Legend Card Component
function LegendCard({ item }: { item: ViewedLegend }) {
  const legend = item.item;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden group h-full"
    >
      <Link href={`/legends/${legend.id}`}>
        <div className="relative h-48 bg-night-600 overflow-hidden">
          <Image
            src={legend.image || '/placeholder-legend.png'}
            alt={legend.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Flag countryCode={legend.countryCode} size="sm" />
            <span className="text-white/70 text-sm">{legend.country}</span>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 bg-gold-500/20 backdrop-blur-sm rounded-full">
            <span className="text-gold-400 font-bold text-sm">{legend.rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gold-400/70 text-xs mb-1">{formatTimeAgo(item.viewedAt)}</p>
        <Link href={`/legends/${legend.id}`}>
          <h3
            className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legend.name}
          </h3>
        </Link>
        <p className="text-white/50 text-sm mb-3">{legend.position}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gold-400 font-bold">{legend.goals}</span>
              <span className="text-white/40 ml-1">Goals</span>
            </div>
            <div>
              <span className="text-gold-400 font-bold">{legend.worldCups}</span>
              <span className="text-white/40 ml-1">WC</span>
            </div>
          </div>

          <Link
            href={`/legends/${legend.id}`}
            className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 transition-colors"
            aria-label="View profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Article Card Component
function ArticleCard({ item }: { item: ViewedArticle }) {
  const article = item.item;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden group h-full"
    >
      <Link href={`/news/${article.id}`}>
        <div className="relative h-40 bg-night-600 overflow-hidden">
          <Image
            src={article.image || '/placeholder-news.png'}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-gold-500/20 backdrop-blur-sm text-gold-400 text-xs rounded-full">
              {article.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gold-400/70 text-xs mb-1">{formatTimeAgo(item.viewedAt)}</p>
        <Link href={`/news/${article.id}`}>
          <h3
            className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {article.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">{article.readTime} read</span>
          <Link
            href={`/news/${article.id}`}
            className="text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
