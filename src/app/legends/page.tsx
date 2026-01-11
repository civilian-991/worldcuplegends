'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { legends, type Legend } from '@/data/legends';
import Link from 'next/link';

const eras = ['All Eras', '60s-70s', '70s', '80s', '90s-00s', '2000s', '2010s-20s'];

export default function LegendsPage() {
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLegends = useMemo(() => {
    return legends.filter((legend) => {
      const matchesEra = selectedEra === 'All Eras' || legend.era === selectedEra;
      const matchesSearch =
        legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesSearch;
    });
  }, [selectedEra, searchQuery]);

  // Sort legends by rating (highest first)
  const sortedLegends = useMemo(() => {
    return [...filteredLegends].sort((a, b) => b.rating - a.rating);
  }, [filteredLegends]);

  return (
    <div className="min-h-screen bg-night-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-night-800 to-night-900" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDS <span className="text-gold-400">2026</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Meet the greatest footballers competing in the World Legends Cup 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 py-4 px-6 bg-night-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search legends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-2.5 bg-night-800 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedEra === era
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-800 text-white/70 hover:bg-night-700 hover:text-white'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legends Grid - F1 Style */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {sortedLegends.map((legend, index) => (
                <LegendCard key={legend.id} legend={legend} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {sortedLegends.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-white/50 text-xl">No legends found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedEra('All Eras');
                  setSearchQuery('');
                }}
                className="mt-4 text-gold-500 hover:text-gold-400 transition-colors"
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

function LegendCard({ legend, index }: { legend: Legend; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Team colors based on country
  const teamColors: Record<string, string> = {
    BR: '#009c3b', // Brazil green
    AR: '#75aadb', // Argentina blue
    FR: '#002654', // France blue
    DE: '#000000', // Germany black
    IT: '#008c45', // Italy green
    NL: '#ff6f00', // Netherlands orange
    PT: '#006600', // Portugal green
    ES: '#c60b1e', // Spain red
    GB: '#012169', // England blue
  };

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

  // Split name into first and last
  const nameParts = legend.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  const teamColor = teamColors[legend.countryCode] || '#d4af37';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/legends/${legend.id}`}>
        <div className="relative bg-gradient-to-br from-night-800 to-night-700 rounded-2xl overflow-hidden cursor-pointer group">
          {/* Team Color Accent Bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 z-10"
            style={{ backgroundColor: teamColor }}
          />

          {/* Card Content */}
          <div className="relative">
            {/* Top Section - Info */}
            <div className="p-5 pb-0">
              {/* Ranking Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-5xl font-black text-white/10" style={{ fontFamily: 'var(--font-display)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    legend.rating >= 97
                      ? 'bg-gold-500/20 text-gold-400'
                      : legend.rating >= 95
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {legend.rating}
                </span>
              </div>

              {/* Name */}
              <div className="mb-1">
                <p className="text-white/60 text-sm font-medium">{firstName}</p>
                <h3
                  className="text-white text-2xl font-bold group-hover:text-gold-400 transition-colors leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {lastName.toUpperCase()}
                </h3>
              </div>

              {/* Team/Country */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/50 text-sm">{legend.team || legend.country}</span>
                <span className="text-lg">{flags[legend.countryCode] || '🏳️'}</span>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${teamColor}40 0%, transparent 60%)`
                }}
              />

              {/* Legend Image */}
              {legend.image ? (
                <img
                  src={legend.image}
                  alt={legend.name}
                  className="absolute bottom-0 right-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[120px] font-black text-white/5"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.jerseyNumber}
                  </span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-night-800 via-transparent to-transparent" />

              {/* Stats Bar at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                      {legend.goals}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Goals</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                      {legend.appearances}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Apps</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                      {legend.worldCups}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">WC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Border Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 rounded-2xl border border-gold-500/30 pointer-events-none"
          />
        </div>
      </Link>
    </motion.div>
  );
}
