'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products, categories, type Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const t = useTranslations('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, setIsCartOpen } = useCart();

  const sortOptions = [
    { label: t('sort.featured'), value: 'featured' },
    { label: t('sort.priceLowHigh'), value: 'price-asc' },
    { label: t('sort.priceHighLow'), value: 'price-desc' },
    { label: t('sort.highestRated'), value: 'rating' },
    { label: t('sort.newest'), value: 'newest' },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1, product.sizes?.[2], product.colors?.[0]?.name);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('preTitle')}</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gradient-gold">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-20 z-30 py-4 px-6 glass border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-night-600 border border-gold-500/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-600 text-white/70 hover:bg-night-500 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-night-600 border border-gold-500/20 rounded-full text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-white/50 text-sm">
              {t('showingProducts', { count: filteredProducts.length })}
            </p>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onQuickAdd={() => handleQuickAdd(product)}
                  translations={{
                    quickAdd: t('quickAdd'),
                    featured: t('featured'),
                    sale: t('sale'),
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-white/50 text-xl">{t('noResults')}</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-gold-400 hover:text-gold-300 transition-colors"
              >
                {t('clearFilters')}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="py-24 px-6 bg-gradient-to-r from-gold-600/20 to-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center">
            <span className="text-6xl block mb-6">🏆</span>
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('signatureCollection.title')}
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              {t('signatureCollection.description')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSearchQuery('signature')}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
            >
              {t('signatureCollection.shopButton')}
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  product,
  index,
  onQuickAdd,
  translations,
}: {
  product: Product;
  index: number;
  onQuickAdd: () => void;
  translations: {
    quickAdd: string;
    featured: string;
    sale: string;
  };
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative overflow-hidden rounded-2xl glass">
          {/* Image */}
          <div className="relative h-64 bg-gradient-to-br from-gold-500/10 to-night-800 overflow-hidden">
            {/* Product Image */}
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform">
                  {product.category === 'Jerseys' ? '👕' :
                   product.category === 'T-Shirts' ? '👔' :
                   product.category === 'Outerwear' ? '🧥' :
                   product.category === 'Shorts' ? '🩳' :
                   product.category === 'Accessories' ? '🧢' :
                   product.category === 'Equipment' ? '⚽' :
                   product.category === 'Collectibles' ? '🏆' : '🛍️'}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 bg-gold-500 text-night-900 text-xs font-bold rounded-full">
                  {translations.featured}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {translations.sale}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickAdd();
                }}
                className="w-full py-3 bg-gold-500 text-night-900 font-bold text-sm rounded-full hover:bg-gold-400 transition-colors"
              >
                {translations.quickAdd}
              </button>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Category */}
            <p className="text-gold-400/70 text-xs uppercase tracking-wider mb-1">
              {product.category}
            </p>

            {/* Name */}
            <h3 className="text-white font-semibold mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.floor(product.rating) ? 'text-gold-400' : 'text-white/20'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-white/40 text-xs">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span
                className="text-xl font-bold text-gold-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-white/40 text-sm line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 1 && (
              <div className="flex gap-1 mt-3">
                {product.colors.map((color) => (
                  <div
                    key={color.name}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
