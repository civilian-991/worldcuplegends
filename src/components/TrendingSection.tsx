'use client';

import { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  TrendingProvider,
  useTrending,
  TrendingCategory,
  TimePeriod,
  TrendingItemWithData,
} from '@/context/TrendingContext';
import TrendingCard from './TrendingCard';

// Tab configuration
const tabs: { id: TrendingCategory; labelKey: string; icon: ReactNode }[] = [
  {
    id: 'legends',
    labelKey: 'legends',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 'products',
    labelKey: 'products',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'news',
    labelKey: 'news',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
];

// Time period options
const periods: { id: TimePeriod; labelKey: string }[] = [
  { id: 'today', labelKey: 'today' },
  { id: 'week', labelKey: 'thisWeek' },
  { id: 'allTime', labelKey: 'allTime' },
];

// Fire icon for trending header
function TrendingIcon() {
  return (
    <motion.svg
      className="w-6 h-6 text-orange-500"
      viewBox="0 0 24 24"
      fill="currentColor"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <path d="M12 23C16.1421 23 19.5 19.6421 19.5 15.5C19.5 14.6345 19.3652 13.8032 19.1146 13.0246C18.7285 14.0939 17.7497 14.875 16.5 14.875C14.9812 14.875 13.75 13.6438 13.75 12.125C13.75 10.8753 14.5311 9.89651 15.6004 9.51038C14.8218 9.25981 13.9905 9.125 13.125 9.125C13.125 9.125 13.125 9.125 13.125 9.125C13.125 6.63972 14.5362 4.47697 16.6008 3.40955C15.1547 1.9131 13.179 1 11 1C6.02944 1 2 5.02944 2 10C2 17.1797 6.82031 23 12 23Z" />
    </motion.svg>
  );
}

function TrendingSectionContent() {
  const t = useTranslations('sections.trending');
  const { getTrending, isHydrated } = useTrending();
  const [activeTab, setActiveTab] = useState<TrendingCategory>('legends');
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('week');
  const [trendingItems, setTrendingItems] = useState<TrendingItemWithData[]>([]);

  useEffect(() => {
    if (isHydrated) {
      const items = getTrending(activeTab, activePeriod, 5);
      setTrendingItems(items);
    }
  }, [activeTab, activePeriod, isHydrated, getTrending]);

  const getLinkHref = () => {
    switch (activeTab) {
      case 'legends':
        return '/legends';
      case 'products':
        return '/shop';
      case 'news':
        return '/news';
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-800" />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-800" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <TrendingIcon />
            <div>
              <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">
                {t('preTitle')}
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white line-accent"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('title')}
              </h2>
            </div>
          </div>
          <Link
            href={getLinkHref()}
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2 group"
          >
            {t('viewAll')}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {'\u2192'}
            </motion.span>
          </Link>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-night-600/50 rounded-xl border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-night-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  <span style={{ fontFamily: 'var(--font-display)' }}>
                    {t(`tabs.${tab.labelKey}`)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 p-1 bg-night-600/30 rounded-lg border border-white/5">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setActivePeriod(period.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  activePeriod === period.id
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {t(`periods.${period.labelKey}`)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trending List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activePeriod}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {trendingItems.length > 0 ? (
                trendingItems.map((item, index) => (
                  <TrendingCard key={`${item.type}-${item.id}`} item={item} index={index} />
                ))
              ) : (
                <div className="text-center py-12 text-white/40">
                  <p>{t('noData')}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Summary Stats */}
          {trendingItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    {t('stats.topViews')}
                  </p>
                  <p className="text-gold-400 text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {trendingItems[0]?.views.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    {t('stats.totalViews')}
                  </p>
                  <p className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {trendingItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(245, 197, 66, 0)',
                    '0 0 0 8px rgba(245, 197, 66, 0.1)',
                    '0 0 0 0 rgba(245, 197, 66, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 text-gold-400"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/60">{t('stats.liveUpdates')}</span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Category Highlights - Three columns on larger screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {tabs.map((tab, tabIndex) => {
            const items = getTrending(tab.id, 'week', 3);
            const topItem = items[0];

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: tabIndex * 0.1 }}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold-500/10 border-gold-500/30'
                    : 'bg-night-600/30 border-white/5 hover:border-gold-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white/80">
                    {tab.icon}
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                      {t(`tabs.${tab.labelKey}`)}
                    </span>
                  </div>
                  <span className="text-gold-400 text-xs">#1</span>
                </div>

                {topItem && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-night-700 flex-shrink-0">
                      {tab.id === 'legends' && (
                        <Image
                          src={(topItem.data as { image: string }).image}
                          alt={(topItem.data as { name: string }).name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {tab.id === 'products' && (
                        <Image
                          src={(topItem.data as { images: string[] }).images[0]}
                          alt={(topItem.data as { name: string }).name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {tab.id === 'news' && (
                        <Image
                          src={(topItem.data as { image: string }).image}
                          alt={(topItem.data as { title: string }).title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {tab.id === 'news'
                          ? (topItem.data as { title: string }).title
                          : (topItem.data as { name: string }).name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {topItem.views.toLocaleString()} {t('views')}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab !== tab.id && (
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="absolute inset-0 rounded-xl"
                    aria-label={`View ${tab.labelKey} trending`}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Wrapper component with provider
export default function TrendingSection() {
  return (
    <TrendingProvider>
      <TrendingSectionContent />
    </TrendingProvider>
  );
}
