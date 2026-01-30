'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRecentlyViewed, formatTimeAgo, ViewedProduct, ViewedLegend } from '@/context/RecentlyViewedContext';
import { useCart } from '@/context/CartContext';
import { Skeleton } from '@/components/Skeleton';
import Flag from '@/components/Flag';

interface RecentlyViewedSidebarProps {
  type: 'product' | 'legend';
  currentItemId: number;
  maxItems?: number;
  title?: string;
  className?: string;
}

export default function RecentlyViewedSidebar({
  type,
  currentItemId,
  maxItems = 4,
  title = 'Based on Your History',
  className = '',
}: RecentlyViewedSidebarProps) {
  const { products, legends, isHydrated } = useRecentlyViewed();
  const { addToCart } = useCart();

  // Get relevant items based on type, excluding current item
  const items = useMemo(() => {
    if (type === 'product') {
      return products
        .filter(p => p.item.id !== currentItemId)
        .slice(0, maxItems);
    }
    return legends
      .filter(l => l.item.id !== currentItemId)
      .slice(0, maxItems);
  }, [type, currentItemId, products, legends, maxItems]);

  // Loading state
  if (!isHydrated) {
    return (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state - don't render if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`glass rounded-2xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3
          className="text-white font-bold text-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <AnimatePresence>
          {type === 'product'
            ? (items as ViewedProduct[]).map((item, index) => (
                <SidebarProductItem
                  key={item.item.id}
                  item={item}
                  index={index}
                  onAddToCart={() => addToCart(item.item)}
                />
              ))
            : (items as ViewedLegend[]).map((item, index) => (
                <SidebarLegendItem key={item.item.id} item={item} index={index} />
              ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <Link
        href={type === 'product' ? '/shop' : '/legends'}
        className="flex items-center justify-center gap-2 mt-6 py-3 w-full rounded-xl border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 transition-colors text-sm"
      >
        View All {type === 'product' ? 'Products' : 'Legends'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </motion.div>
  );
}

// Sidebar Product Item
function SidebarProductItem({
  item,
  index,
  onAddToCart,
}: {
  item: ViewedProduct;
  index: number;
  onAddToCart: () => void;
}) {
  const product = item.item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div className="flex gap-3 p-2 -mx-2 rounded-xl hover:bg-night-600/50 transition-colors">
        {/* Image */}
        <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-night-600">
            <Image
              src={product.images[0] || '/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/shop/${product.slug}`}>
            <h4 className="text-white text-sm font-medium line-clamp-1 group-hover:text-gold-400 transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-white/40 text-xs mt-0.5">{formatTimeAgo(item.viewedAt)}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gold-400 font-bold text-sm">${product.price}</span>
            <button
              onClick={onAddToCart}
              className="w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Add to cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Sidebar Legend Item
function SidebarLegendItem({
  item,
  index,
}: {
  item: ViewedLegend;
  index: number;
}) {
  const legend = item.item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/legends/${legend.id}`}>
        <div className="flex gap-3 p-2 -mx-2 rounded-xl hover:bg-night-600/50 transition-colors">
          {/* Image */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-night-600 flex-shrink-0">
            <Image
              src={legend.image || '/placeholder-legend.png'}
              alt={legend.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-1 right-1">
              <Flag countryCode={legend.countryCode} size="xs" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium line-clamp-1 group-hover:text-gold-400 transition-colors">
              {legend.name}
            </h4>
            <p className="text-white/40 text-xs mt-0.5">{formatTimeAgo(item.viewedAt)}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gold-400 font-bold">{legend.rating}</span>
                <span className="text-white/30">OVR</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gold-400 font-bold">{legend.goals}</span>
                <span className="text-white/30">Goals</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function RecentlyViewedCompact({
  type,
  currentItemId,
  maxItems = 3,
  className = '',
}: Omit<RecentlyViewedSidebarProps, 'title'>) {
  const { products, legends, isHydrated } = useRecentlyViewed();

  const items = useMemo(() => {
    if (type === 'product') {
      return products
        .filter(p => p.item.id !== currentItemId)
        .slice(0, maxItems);
    }
    return legends
      .filter(l => l.item.id !== currentItemId)
      .slice(0, maxItems);
  }, [type, currentItemId, products, legends, maxItems]);

  if (!isHydrated || items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Recently Viewed</p>
      <div className="flex gap-2">
        {type === 'product'
          ? (items as ViewedProduct[]).map((item) => (
              <Link key={item.item.id} href={`/shop/${item.item.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-lg overflow-hidden bg-night-600 relative"
                >
                  <Image
                    src={item.item.images[0] || '/placeholder-product.png'}
                    alt={item.item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </Link>
            ))
          : (items as ViewedLegend[]).map((item) => (
              <Link key={item.item.id} href={`/legends/${item.item.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-lg overflow-hidden bg-night-600 relative"
                >
                  <Image
                    src={item.item.image || '/placeholder-legend.png'}
                    alt={item.item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </Link>
            ))}
      </div>
    </div>
  );
}
