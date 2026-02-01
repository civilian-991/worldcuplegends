'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { type Legend } from '@/lib/api';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LegendMarquee() {
  const { data: legends = [] } = useSWR<Legend[]>('/api/legends', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Get legend names, sorted by rating (highest first)
  const legendNames = legends
    .sort((a, b) => b.rating - a.rating)
    .map(legend => legend.name.toUpperCase());

  // Fallback names if no data yet
  const displayNames = legendNames.length > 0
    ? legendNames
    : ['LOADING...'];

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
