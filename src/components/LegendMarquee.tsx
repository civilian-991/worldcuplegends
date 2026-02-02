'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { type Legend } from '@/lib/api';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch legends');
  }
  return res.json();
};

export default function LegendMarquee() {
  const tCommon = useTranslations('common');
  const { data: legends = [], error, mutate } = useSWR<Legend[]>('/api/legends', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Get legend names, sorted by rating (highest first)
  const legendNames = legends
    .sort((a, b) => b.rating - a.rating)
    .map(legend => legend.name.toUpperCase());

  // Fallback names for loading state
  const loadingNames = ['LOADING...'];

  // Fallback names for error state
  const fallbackNames = [
    'WORLD LEGENDS CUP',
    '2026',
    'LEGENDS NEVER DIE',
    'BRAZIL',
  ];

  // Determine which names to display
  const displayNames = legendNames.length > 0
    ? legendNames
    : error
    ? fallbackNames
    : loadingNames;

  // Show error state with retry option
  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900/80 via-gold-500 to-red-900/80 py-3 overflow-hidden relative">
        <div className="flex items-center justify-center gap-4">
          <span className="text-night-900 text-sm font-semibold">
            {tCommon('errorLoadingLegends')}
          </span>
          <button
            onClick={() => mutate()}
            className="inline-flex items-center gap-1 px-3 py-1 bg-night-900/20 hover:bg-night-900/30 text-night-900 text-sm font-semibold rounded transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {tCommon('tryAgain')}
          </button>
        </div>
        {/* Fallback marquee below error message */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap mt-2"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 md:gap-8 md:px-8">
              {fallbackNames.map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="text-night-900/60 text-lg font-bold tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name} ★
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gold-500 py-3 overflow-hidden relative">
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: '-50%' }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 md:gap-8 md:px-8">
            {displayNames.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="text-night-900 text-lg font-bold tracking-wider"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {name} ★
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
