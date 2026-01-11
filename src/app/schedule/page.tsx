'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { matches, type Match } from '@/data/legends';

const stages = ['All', 'Group A', 'Group B', 'Group C', 'Group D', 'Semi-Final', 'Final'];

export default function SchedulePage() {
  const [selectedStage, setSelectedStage] = useState('All');

  const filteredMatches = selectedStage === 'All'
    ? matches
    : matches.filter((match) => match.stage === selectedStage);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Tournament</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MATCH <span className="text-gradient-gold">SCHEDULE</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Every fixture, every venue, every moment. Follow the complete tournament
              schedule and never miss a legendary match.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stage Filter */}
      <section className="sticky top-20 z-30 py-6 px-6 glass">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedStage === stage
                    ? 'bg-gold-500 text-night-900'
                    : 'bg-night-600 text-white/70 hover:bg-night-500 hover:text-white'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Bracket Visual */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Finals Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 block">🏆</span>
              <h2
                className="text-4xl font-bold text-gold-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                THE FINAL
              </h2>
              <p className="text-white/50 mt-2">July 19, 2026 • MetLife Stadium, New Jersey</p>
            </div>

            <div className="max-w-lg mx-auto glass rounded-2xl p-8 text-center glow-gold">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <span className="text-5xl block mb-2">🏆</span>
                  <p className="text-white/50">Winner SF1</p>
                </div>
                <div className="px-6">
                  <span
                    className="text-3xl font-bold text-white/30"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    VS
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-5xl block mb-2">🏆</span>
                  <p className="text-white/50">Winner SF2</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gold-500/20">
                <p className="text-gold-400 text-sm">19:00 Local Time</p>
              </div>
            </div>
          </motion.div>

          {/* Match List */}
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Venue Info */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HOST VENUES
            </h2>
            <p className="text-white/50">Legendary stadiums across three nations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'MetLife Stadium', city: 'New Jersey', country: '🇺🇸', capacity: '82,500' },
              { name: 'SoFi Stadium', city: 'Los Angeles', country: '🇺🇸', capacity: '70,240' },
              { name: 'Rose Bowl', city: 'Pasadena', country: '🇺🇸', capacity: '88,438' },
              { name: 'Estadio Azteca', city: 'Mexico City', country: '🇲🇽', capacity: '87,523' },
            ].map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <span className="text-4xl block mb-4">{venue.country}</span>
                <h3 className="text-white font-semibold text-lg mb-1">{venue.name}</h3>
                <p className="text-white/50 text-sm mb-2">{venue.city}</p>
                <p className="text-gold-400 text-sm">Capacity: {venue.capacity}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const isFinal = match.stage === 'Final';
  const isSemiFinal = match.stage === 'Semi-Final';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl glass group cursor-pointer card-hover ${
        isFinal ? 'border-2 border-gold-500/50' : ''
      }`}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Stage & Date */}
          <div className="md:w-40 flex-shrink-0">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                isFinal
                  ? 'bg-gold-500/20 text-gold-400'
                  : isSemiFinal
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-night-500 text-white/70'
              }`}
            >
              {match.stage}
            </span>
            <p className="text-white/50 text-sm">{formatDate(match.date)}</p>
            <p className="text-gold-400 text-sm font-semibold">{match.time}</p>
          </div>

          {/* Teams */}
          <div className="flex-1 flex items-center justify-center gap-6 md:gap-12">
            {/* Home Team */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="text-right">
                <p className="text-white font-semibold text-lg md:text-xl">{match.homeTeam}</p>
                {match.homeScore !== undefined && (
                  <p
                    className="text-3xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {match.homeScore}
                  </p>
                )}
              </div>
              <span className="text-4xl md:text-5xl">{match.homeFlag}</span>
            </div>

            {/* VS / Score */}
            <div className="flex flex-col items-center">
              {match.isLive && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-semibold uppercase">Live</span>
                </div>
              )}
              <span
                className="text-white/30 text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VS
              </span>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex items-center gap-4">
              <span className="text-4xl md:text-5xl">{match.awayFlag}</span>
              <div>
                <p className="text-white font-semibold text-lg md:text-xl">{match.awayTeam}</p>
                {match.awayScore !== undefined && (
                  <p
                    className="text-3xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {match.awayScore}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="md:w-64 flex-shrink-0 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-white/40 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{match.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
