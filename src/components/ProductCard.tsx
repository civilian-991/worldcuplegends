'use client';

/**
 * ProductCard Component
 *
 * An enhanced product card component with integrated stock badge overlays
 * and urgency messaging. This component can be used as a standalone card
 * or as an enhancement guide for existing ProductCard implementations.
 *
 * INTEGRATION GUIDE:
 * ------------------
 * To add stock badges to your existing ProductCard (in shop/page.tsx):
 *
 * 1. Import the StockBadge component:
 *    import StockBadge from '@/components/StockBadge';
 *
 * 2. Add stock to your product type (if not already present):
 *    interface Product {
 *      // ... existing fields
 *      stock?: number;
 *    }
 *
 * 3. Add the StockBadge in the badges section of your card:
 *    <div className="absolute top-4 left-4 flex flex-col gap-2">
 *      {product.featured && (
 *        <span className="px-3 py-1 bg-gold-500 text-night-900 text-xs font-bold rounded-full">
 *          {translations.featured}
 *        </span>
 *      )}
 *      {product.originalPrice && (
 *        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
 *          {translations.sale}
 *        </span>
 *      )}
 *      // ADD THIS:
 *      {product.stock !== undefined && (
 *        <StockBadge
 *          stock={product.stock}
 *          size="sm"
 *          hideWhenInStock={true}
 *        />
 *      )}
 *    </div>
 *
 * 4. For product detail pages, use the StockAlert component:
 *    import StockAlert from '@/components/StockAlert';
 *
 *    <StockAlert
 *      stock={product.stock}
 *      productName={product.name}
 *      productId={product.id}
 *      viewersCount={Math.floor(Math.random() * 20) + 5}
 *      showBackInStockSignup={true}
 *    />
 */

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import StockBadge from './StockBadge';

interface ProductColor {
  name: string;
  hex: string;
}

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    images?: string[];
    rating: number;
    reviews: number;
    featured?: boolean;
    inStock?: boolean;
    colors?: ProductColor[];
    stock?: number; // Stock quantity for badge display
  };
  index?: number;
  onQuickAdd?: () => void;
  translations?: {
    quickAdd?: string;
    featured?: string;
    sale?: string;
    lowStock?: string;
    outOfStock?: string;
  };
  /** Show stock badge overlay */
  showStockBadge?: boolean;
  /** Show urgency message below the card */
  showUrgencyMessage?: boolean;
  /** Simulate high demand for certain products */
  sellingFast?: boolean;
}

// Category emoji map
const categoryEmoji: Record<string, string> = {
  'Jerseys': '👕',
  'T-Shirts': '👔',
  'Outerwear': '🧥',
  'Shorts': '🩳',
  'Accessories': '🧢',
  'Equipment': '⚽',
  'Collectibles': '🏆',
};

export default function ProductCard({
  product,
  index = 0,
  onQuickAdd,
  translations = {},
  showStockBadge = true,
  showUrgencyMessage = true,
  sellingFast = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    quickAdd = 'Quick Add',
    featured = 'Featured',
    sale = 'Sale',
  } = translations;

  // Determine stock status
  const stock = product.stock ?? (product.inStock === false ? 0 : 100);
  const isOutOfStock = stock === 0 || product.inStock === false;
  const isLowStock = stock > 0 && stock <= 15;
  const isCriticalStock = stock > 0 && stock <= 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/shop/${product.id}`}>
        <div className={`relative overflow-hidden rounded-2xl glass ${isOutOfStock ? 'opacity-75' : ''}`}>
          {/* Image Container */}
          <div className="relative h-64 bg-gradient-to-br from-gold-500/10 to-night-800 overflow-hidden">
            {/* Product Image */}
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-transform duration-300 ${
                  isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
                }`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-6xl transition-transform ${isOutOfStock ? 'opacity-30' : 'opacity-50 group-hover:scale-110'}`}>
                  {categoryEmoji[product.category] || '🛍️'}
                </span>
              </div>
            )}

            {/* Gradient Overlay for out of stock */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-night-900/60" />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.featured && (
                <span className="px-3 py-1 bg-gold-500 text-night-900 text-xs font-bold rounded-full">
                  {featured}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {sale}
                </span>
              )}
              {/* Stock Badge */}
              {showStockBadge && stock !== undefined && (
                <StockBadge
                  stock={stock}
                  size="sm"
                  hideWhenInStock={true}
                  sellingFast={sellingFast}
                  showIcon={true}
                />
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-3 bg-night-900/90 border border-white/20 rounded-full"
                >
                  <span className="text-white/80 font-bold uppercase tracking-wider text-sm">
                    Out of Stock
                  </span>
                </motion.div>
              </div>
            )}

            {/* Quick Add Button - Only show if in stock */}
            {!isOutOfStock && onQuickAdd && (
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
                  {quickAdd}
                </button>
              </motion.div>
            )}
          </div>

          {/* Card Info */}
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
                className={`text-xl font-bold ${isOutOfStock ? 'text-white/50' : 'text-gold-400'}`}
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

      {/* Urgency Message */}
      {showUrgencyMessage && isLowStock && !isOutOfStock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <span className={`text-xs ${isCriticalStock ? 'text-red-400' : 'text-gold-400'}`}>
            {isCriticalStock ? (
              <>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block mr-1"
                >
                  ●
                </motion.span>
                Almost gone! Only {stock} left
              </>
            ) : (
              <>Low stock - {stock} remaining</>
            )}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Export for easier integration
export type { ProductCardProps };
