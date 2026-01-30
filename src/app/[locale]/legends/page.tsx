'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { type Legend } from '@/lib/api';
import { Link } from '@/i18n/navigation';
import Flag from '@/components/Flag';

const eras = ['All Eras', '1980s-1990s', '1990s-2000s', '2000s', '2000s-2010s'];
const LEGENDS_PER_PAGE = 12;

// SWR fetcher function
const fetcher = async (url: string): Promise<Legend[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  if (data.length === 0) {
    console.warn('No legends returned from API');
  }
  return data;
};

export default function LegendsPage() {
  const t = useTranslations('legends');
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(LEGENDS_PER_PAGE);

  // Use SWR for data fetching with caching
  const { data: legends = [], error, isLoading } = useSWR<Legend[]>(
    '/api/legends',
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when tab regains focus
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  const filteredLegends = useMemo(() => {
    return legends.filter((legend) => {
      const matchesEra = selectedEra === 'All Eras' || legend.era === selectedEra;
      const matchesSearch =
        legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesSearch;
    });
  }, [legends, selectedEra, searchQuery]);

  // Sort legends by rating (highest first)
  const sortedLegends = useMemo(() => {
    return [...filteredLegends].sort((a, b) => b.rating - a.rating);
  }, [filteredLegends]);

  // Get visible legends based on current visibleCount
  const visibleLegends = useMemo(() => {
    return sortedLegends.slice(0, visibleCount);
  }, [sortedLegends, visibleCount]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(LEGENDS_PER_PAGE);
  }, [selectedEra, searchQuery]);

  // Check if there are more legends to load
  const hasMoreLegends = visibleCount < sortedLegends.length;

  // Handle load more click
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LEGENDS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-night-700">
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gold-400">{t('year')}</span>
            </h1>
            <p className="text-white/50 text-base">
              {t('pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 py-4 px-6 bg-night-700/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search legends"
                className="w-full px-4 py-2 bg-night-600 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Era Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  aria-pressed={selectedEra === era}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                    selectedEra === era
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-600 text-white/60 hover:bg-night-500 hover:text-white'
                  }`}
                >
                  {era === 'All Eras' ? t('allEras') : era}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State - Skeleton Grid */}
      {isLoading && (
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div
              role="status"
              aria-label="Loading legends"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legends Grid - F1 Style */}
      {!isLoading && (
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto" aria-live="polite">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleLegends.map((legend, index) => (
                  <LegendCard key={legend.id} legend={legend} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {!error && sortedLegends.length > 0 && hasMoreLegends && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-10 gap-3"
              >
                <p className="text-white/40 text-sm">
                  {t('showingCount', { count: visibleLegends.length, total: sortedLegends.length })}
                </p>
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded text-sm font-medium transition-all bg-night-600 text-white/60 hover:bg-gold-500 hover:text-night-900"
                >
                  {t('loadMore')}
                </button>
              </motion.div>
            )}

            {/* Showing all legends indicator */}
            {!error && sortedLegends.length > 0 && !hasMoreLegends && sortedLegends.length > LEGENDS_PER_PAGE && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-10"
              >
                <p className="text-white/40 text-sm">
                  {t('showingCount', { count: sortedLegends.length, total: sortedLegends.length })}
                </p>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-red-400 text-xl mb-4">
                  {error.message || 'Failed to load legends. Please try again later.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Retry
                </button>
              </motion.div>
            )}

            {/* No Results */}
            {!error && sortedLegends.length === 0 && legends.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-white/50 text-xl mb-2">No legends available</p>
                <p className="text-white/30 text-sm">Database connection may not be configured.</p>
              </motion.div>
            )}

            {/* No Filter Results */}
            {!error && sortedLegends.length === 0 && legends.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-white/50 text-xl">{t('noResults')}</p>
                <button
                  onClick={() => {
                    setSelectedEra('All Eras');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-gold-500 hover:text-gold-400 transition-colors"
                >
                  {t('clearFilters')}
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function LegendCard({ legend, index }: { legend: Legend; index: number }) {
  // Team colors based on country - more vibrant like F1
  const teamColors: Record<string, { bg: string; accent: string }> = {
    BR: { bg: 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)', accent: '#009c3b' }, // Brazil green
    AR: { bg: 'linear-gradient(135deg, #2d4a6f 0%, #1a2d42 100%)', accent: '#75aadb' }, // Argentina blue
    FR: { bg: 'linear-gradient(135deg, #1a2744 0%, #0d1522 100%)', accent: '#002654' }, // France blue
    DE: { bg: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', accent: '#cfcfcf' }, // Germany
    IT: { bg: 'linear-gradient(135deg, #1a3d5c 0%, #0d1f2e 100%)', accent: '#0066cc' }, // Italy blue
    NL: { bg: 'linear-gradient(135deg, #8b4513 0%, #5c2d0e 100%)', accent: '#ff6f00' }, // Netherlands orange
    PT: { bg: 'linear-gradient(135deg, #4a1a1a 0%, #2d0d0d 100%)', accent: '#c41e3a' }, // Portugal red
    ES: { bg: 'linear-gradient(135deg, #5c1a1a 0%, #3d0d0d 100%)', accent: '#c60b1e' }, // Spain red
    GB: { bg: 'linear-gradient(135deg, #1a2744 0%, #0d1522 100%)', accent: '#012169' }, // England blue
  };

  // Split name into first and last
  const nameParts = legend.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  const colors = teamColors[legend.countryCode] || { bg: 'linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 100%)', accent: '#d4af37' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      <Link href={`/legends/${legend.id}`}>
        <div
          className="relative h-[280px] rounded-lg overflow-hidden cursor-pointer group"
          style={{ background: colors.bg }}
        >
          {/* Content Container */}
          <div className="relative h-full flex">
            {/* Left Side - Text Content */}
            <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
              {/* Top - Name and Team */}
              <div>
                <p className="text-white/70 text-sm font-medium">{firstName}</p>
                <h3
                  className="text-white text-3xl font-black leading-tight group-hover:text-gold-400 transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {lastName}
                </h3>
                <p className="text-white/50 text-sm mt-1">{legend.team || legend.country}</p>
              </div>

              {/* Jersey Number */}
              <div className="mt-auto">
                <span
                  className="text-7xl font-black leading-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: colors.accent,
                    opacity: 0.9
                  }}
                >
                  {legend.jerseyNumber}
                </span>
              </div>

              {/* Flag at bottom */}
              <div className="mt-4">
                <Flag countryCode={legend.countryCode} size="lg" />
              </div>
            </div>

            {/* Right Side - Player Image */}
            <div className="relative w-[45%] h-full">
              {legend.image ? (
                <Image
                  src={legend.image}
                  alt={legend.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{
                    maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                  }}
                  priority={index < 4}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[100px] font-black text-white/5"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.jerseyNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton card component that mimics the LegendCard layout
function SkeletonCard() {
  return (
    <div
      className="relative h-[280px] rounded-lg overflow-hidden animate-pulse"
      style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
    >
      {/* Content Container */}
      <div className="relative h-full flex">
        {/* Left Side - Text Content Skeleton */}
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          {/* Top - Name and Team Skeleton */}
          <div>
            {/* First name placeholder */}
            <div className="h-4 w-16 bg-night-800/50 rounded mb-2" />
            {/* Last name placeholder */}
            <div className="h-8 w-32 bg-night-800/50 rounded mb-2" />
            {/* Team/Country placeholder */}
            <div className="h-4 w-24 bg-night-800/50 rounded mt-1" />
          </div>

          {/* Jersey Number Skeleton */}
          <div className="mt-auto">
            <div className="h-16 w-20 bg-night-800/30 rounded" />
          </div>

          {/* Flag Skeleton */}
          <div className="mt-4">
            <div className="h-6 w-9 bg-night-800/50 rounded" />
          </div>
        </div>

        {/* Right Side - Player Image Skeleton */}
        <div className="relative w-[45%] h-full">
          <div
            className="absolute inset-0 bg-night-800/30"
            style={{
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
            }}
          />
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
