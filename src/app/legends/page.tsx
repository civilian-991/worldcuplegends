'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { legends, type Legend } from '@/data/legends';

const eras = ['All', '60s-70s', '70s', '80s', '90s-00s', '2000s', '2010s-20s'];
const positions = ['All', 'Forward', 'Striker', 'Attacking Midfielder', 'Defender', 'Sweeper'];

export default function LegendsPage() {
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filteredLegends = useMemo(() => {
    return legends.filter((legend) => {
      const matchesEra = selectedEra === 'All' || legend.era === selectedEra;
      const matchesPosition = selectedPosition === 'All' || legend.position === selectedPosition;
      const matchesSearch =
        legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesPosition && matchesSearch;
    });
  }, [selectedEra, selectedPosition, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">The Greats</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FOOTBALL <span className="text-gradient-gold">LEGENDS</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Explore the greatest footballers to ever grace the pitch. From Pelé to Messi,
              discover the icons who defined generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 z-30 py-6 px-6 glass">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Search legends..."
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

            {/* Era Filter */}
            <div className="flex flex-wrap gap-2">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedEra === era
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-600 text-white/70 hover:bg-night-500 hover:text-white'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>

            {/* Position Filter */}
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-4 py-3 bg-night-600 border border-gold-500/20 rounded-full text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos === 'All' ? 'All Positions' : pos}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Legends Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/50 text-sm mb-8"
          >
            Showing {filteredLegends.length} legends
          </motion.p>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredLegends.map((legend, index) => (
                <LegendCard
                  key={legend.id}
                  legend={legend}
                  index={index}
                  isHovered={hoveredCard === legend.id}
                  onHover={() => setHoveredCard(legend.id)}
                  onLeave={() => setHoveredCard(null)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredLegends.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-white/50 text-xl">No legends found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedEra('All');
                  setSelectedPosition('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-gold-400 hover:text-gold-300 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

function LegendCard({
  legend,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  legend: Legend;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const flags: Record<string, string> = {
    BR: '🇧🇷',
    AR: '🇦🇷',
    FR: '🇫🇷',
    DE: '🇩🇪',
    IT: '🇮🇹',
    NL: '🇳🇱',
    PT: '🇵🇹',
    ES: '🇪🇸',
    GB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl glass">
        {/* Card Header with Jersey Number */}
        <div className="relative h-48 bg-gradient-to-br from-gold-500/20 to-night-800 overflow-hidden">
          {/* Jersey Number Background */}
          <span
            className="absolute -right-4 -top-4 text-[140px] font-bold text-gold-500/10 leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legend.jerseyNumber}
          </span>

          {/* Country Flag */}
          <div className="absolute top-4 left-4">
            <span className="text-3xl">{flags[legend.countryCode] || '🏳️'}</span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                legend.rating >= 97
                  ? 'bg-gold-500/30 text-gold-400 border border-gold-500/50'
                  : legend.rating >= 95
                    ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                    : 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
              }`}
            >
              {legend.rating}
            </span>
          </div>

          {/* Position */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-night-900/80 rounded-full text-xs text-white/70">
              {legend.position}
            </span>
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent"
          />
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Name */}
          <h3
            className="text-white text-xl font-bold mb-1 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legend.name.toUpperCase()}
          </h3>
          <p className="text-white/50 text-sm mb-4">{legend.country}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                {legend.goals}
              </p>
              <p className="text-white/40 text-xs uppercase">Goals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {legend.assists}
              </p>
              <p className="text-white/40 text-xs uppercase">Assists</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {legend.appearances}
              </p>
              <p className="text-white/40 text-xs uppercase">Apps</p>
            </div>
          </div>

          {/* World Cups */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            {Array.from({ length: legend.worldCups }).map((_, i) => (
              <span key={i} className="text-gold-400">🏆</span>
            ))}
            {legend.worldCups === 0 && (
              <span className="text-white/30 text-sm">No World Cup titles</span>
            )}
            {legend.worldCups > 0 && (
              <span className="text-white/50 text-sm">World Cup{legend.worldCups > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Gradient Border on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-2xl border-2 border-gold-500/50 pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
