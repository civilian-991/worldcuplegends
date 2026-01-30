'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { TrendingItemWithData, TrendDirection, formatViewCount } from '@/context/TrendingContext';

interface TrendingCardProps {
  item: TrendingItemWithData;
  index: number;
}

// Fire icon SVG component
function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 23C16.1421 23 19.5 19.6421 19.5 15.5C19.5 14.6345 19.3652 13.8032 19.1146 13.0246C18.7285 14.0939 17.7497 14.875 16.5 14.875C14.9812 14.875 13.75 13.6438 13.75 12.125C13.75 10.8753 14.5311 9.89651 15.6004 9.51038C14.8218 9.25981 13.9905 9.125 13.125 9.125C13.125 9.125 13.125 9.125 13.125 9.125C13.125 6.63972 14.5362 4.47697 16.6008 3.40955C15.1547 1.9131 13.179 1 11 1C6.02944 1 2 5.02944 2 10C2 17.1797 6.82031 23 12 23Z" />
    </svg>
  );
}

// Trend arrow component
function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === 'new') {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center justify-center px-1.5 py-0.5 bg-gradient-to-r from-gold-500 to-gold-400 text-night-900 text-[10px] font-bold rounded uppercase tracking-wider"
      >
        NEW
      </motion.span>
    );
  }

  if (direction === 'up') {
    return (
      <motion.span
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-emerald-400 flex items-center gap-0.5"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </motion.span>
    );
  }

  if (direction === 'down') {
    return (
      <motion.span
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-red-400 flex items-center gap-0.5"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.span>
    );
  }

  return (
    <span className="text-white/30 text-xs">-</span>
  );
}

// Rank badge component
function RankBadge({ rank, isHot }: { rank: number; isHot: boolean }) {
  const getBadgeStyles = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-night-900 shadow-[0_0_20px_rgba(245,197,66,0.5)]';
      case 2:
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-night-900';
      case 3:
        return 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white';
      default:
        return 'bg-night-500 text-white/70 border border-white/10';
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25, delay: rank * 0.05 }}
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${getBadgeStyles()}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {rank}
      </motion.div>
      {isHot && rank <= 3 && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <FireIcon className="w-4 h-4 text-orange-500" />
        </motion.div>
      )}
    </div>
  );
}

export default function TrendingCard({ item, index }: TrendingCardProps) {
  const isHot = item.viewsToday > item.viewsWeek / 7 * 1.5; // Views today 50% higher than average

  // Get the appropriate data based on type
  const getCardData = () => {
    if (item.type === 'legends') {
      const legend = item.data as typeof item.data & { name: string; country: string; position: string; image: string };
      return {
        href: `/legends/${item.id}`,
        image: legend.image,
        title: legend.name,
        subtitle: `${legend.country} - ${legend.position}`,
        stat: formatViewCount(item.views),
        statLabel: 'views',
      };
    } else if (item.type === 'products') {
      const product = item.data as typeof item.data & { name: string; category: string; images: string[]; price: number };
      const sales = (item as { sales?: number }).sales || 0;
      return {
        href: `/shop/${item.id}`,
        image: product.images[0],
        title: product.name,
        subtitle: product.category,
        stat: formatViewCount(sales),
        statLabel: 'sold',
        price: `$${product.price.toFixed(2)}`,
      };
    } else {
      const article = item.data as typeof item.data & { title: string; category: string; image: string; readTime: string };
      return {
        href: `/news/${item.id}`,
        image: article.image,
        title: article.title,
        subtitle: article.category,
        stat: formatViewCount(item.views),
        statLabel: 'reads',
        readTime: article.readTime,
      };
    }
  };

  const cardData = getCardData();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <Link href={cardData.href}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-night-600/50 hover:bg-night-500/50 border border-white/5 hover:border-gold-500/20 transition-all duration-300">
          {/* Rank Badge */}
          <RankBadge rank={item.currentRank} isHot={isHot} />

          {/* Thumbnail */}
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-night-700">
            {cardData.image ? (
              <img
                src={cardData.image}
                alt={cardData.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-night-800/50" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium truncate group-hover:text-gold-400 transition-colors">
              {cardData.title}
            </h4>
            <p className="text-white/50 text-xs truncate">{cardData.subtitle}</p>
          </div>

          {/* Stats & Trend */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <TrendArrow direction={item.direction} />
            <div className="flex items-center gap-1">
              <span className="text-gold-400 text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {cardData.stat}
              </span>
              <span className="text-white/40 text-[10px]">{cardData.statLabel}</span>
            </div>
            {cardData.price && (
              <span className="text-white/60 text-xs">{cardData.price}</span>
            )}
            {cardData.readTime && (
              <span className="text-white/40 text-[10px]">{cardData.readTime}</span>
            )}
          </div>

          {/* Quick Action Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              // Action depends on type
            }}
            className="w-8 h-8 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 flex items-center justify-center text-gold-400 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Quick view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}

// Compact variant for smaller displays
export function TrendingCardCompact({ item, index }: TrendingCardProps) {
  const getTitle = () => {
    if (item.type === 'legends') {
      return (item.data as { name: string }).name;
    } else if (item.type === 'products') {
      return (item.data as { name: string }).name;
    } else {
      return (item.data as { title: string }).title;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0"
    >
      <span
        className={`text-sm font-bold w-5 ${
          item.currentRank === 1
            ? 'text-gold-400'
            : item.currentRank === 2
              ? 'text-gray-400'
              : item.currentRank === 3
                ? 'text-amber-600'
                : 'text-white/40'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {item.currentRank}
      </span>
      <span className="text-white text-sm truncate flex-1">{getTitle()}</span>
      <TrendArrow direction={item.direction} />
    </motion.div>
  );
}
