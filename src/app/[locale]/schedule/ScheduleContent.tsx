'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Flag from '@/components/Flag';
import FlippingFlag from '@/components/FlippingFlag';

// Placeholder matches - teams TBA
const matches = [
  { id: 1, matchNumber: 1, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
  { id: 2, matchNumber: 2, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
  { id: 3, matchNumber: 3, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
  { id: 4, matchNumber: 4, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
  { id: 5, matchNumber: 5, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
  { id: 6, matchNumber: 6, venue: 'Estádio Nilton Santos', date: 'TBA', time: 'TBA' },
];

function ScheduleFinalFlags() {
  const excludeRef = useRef<Record<string, string>>({});
  return (
    <div className="flex items-center justify-center gap-6 md:gap-12 mb-8">
      <div className="text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-night-700 border-2 border-white/10 flex items-center justify-center mb-3">
          <FlippingFlag size="lg" excludeRef={excludeRef} pairId="home" />
        </div>
        <p className="text-white/50 text-sm">TBA</p>
      </div>

      <div className="flex flex-col items-center">
        <span
          className="text-3xl md:text-4xl font-bold text-gold-400"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          VS
        </span>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-night-700 border-2 border-white/10 flex items-center justify-center mb-3">
          <FlippingFlag size="lg" excludeRef={excludeRef} pairId="away" />
        </div>
        <p className="text-white/50 text-sm">TBA</p>
      </div>
    </div>
  );
}

function ScheduleMatchRow({ matchNumber, index }: { matchNumber: number; index: number }) {
  const excludeRef = useRef<Record<string, string>>({});
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-xl glass group cursor-pointer card-hover overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-green-600" />

      <div className="p-6 md:p-8 pl-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="md:w-24 flex-shrink-0">
            <span
              className="text-4xl font-bold text-green-400/50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              #{matchNumber}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6 md:gap-12">
            <div className="flex-1 flex items-center justify-end gap-3">
              <p className="text-white/50 font-medium">TBA</p>
              <div className="w-12 h-12 rounded-full bg-night-600 border border-white/10 flex items-center justify-center">
                <FlippingFlag size="sm" excludeRef={excludeRef} pairId="home" />
              </div>
            </div>

            <span
              className="text-white/30 text-lg font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VS
            </span>

            <div className="flex-1 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-night-600 border border-white/10 flex items-center justify-center">
                <FlippingFlag size="sm" excludeRef={excludeRef} pairId="away" />
              </div>
              <p className="text-white/50 font-medium">TBA</p>
            </div>
          </div>

          <div className="md:w-32 flex-shrink-0 text-center md:text-right">
            <p className="text-white/40 text-sm">Date TBA</p>
            <p className="text-gold-400/70 text-sm font-semibold">Time TBA</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export default function ScheduleContent() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />

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
              Seven legendary matches. Two iconic stadiums. The complete World Legends Cup 2026 fixture list.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tournament Overview */}
      <section className="py-12 px-6 bg-night-800/50 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '7', label: 'MATCHES' },
              { value: '2', label: 'VENUES' },
              { value: '8', label: 'NATIONS' },
              { value: 'TBA', label: 'DATES' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <span
                  className="text-4xl md:text-5xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </span>
                <p className="text-white/40 text-xs tracking-[0.2em] mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Final - Featured */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-2">The Ultimate Match</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE <span className="text-gradient-gold">FINAL</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border-2 border-gold-500/30 glow-gold"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-night-800 to-night-900" />

            <div className="relative p-8 md:p-12">
              {/* Trophy Icon */}
              <div className="text-center mb-8">
                <img src="/legends-cup.png" alt="World Legends Cup Trophy" className="h-20 md:h-28 w-auto mx-auto" />
              </div>

              {/* Teams */}
              <ScheduleFinalFlags />

              {/* Match Details */}
              <div className="flex flex-wrap justify-center gap-4 text-center">
                <div className="px-6 py-3 glass rounded-full">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Venue</p>
                  <p className="text-gold-400 font-semibold">Estádio Maracanã</p>
                </div>
                <div className="px-6 py-3 glass rounded-full">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Date</p>
                  <p className="text-white font-semibold">TBA</p>
                </div>
                <div className="px-6 py-3 glass rounded-full">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Kickoff</p>
                  <p className="text-white font-semibold">TBA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Match List */}
      <section className="py-16 px-6 bg-night-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-green-400 text-xs tracking-[0.4em] uppercase mb-2">Matches 1-6</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE <span className="text-gradient-gold">JOURNEY</span>
            </h2>
            <p className="text-white/50 mt-4">All matches at Estádio Nilton Santos</p>
          </motion.div>

          <div className="space-y-4">
            {matches.map((match, index) => (
              <ScheduleMatchRow key={match.id} matchNumber={match.matchNumber} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Venue Info */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
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
              HOST <span className="text-gradient-gold">VENUES</span>
            </h2>
            <p className="text-white/50">Two legendary stadiums in Rio de Janeiro</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Estádio Maracanã',
                city: 'Rio de Janeiro',
                countryCode: 'BR',
                capacity: '78,838',
                matches: 'Final',
                accent: 'gold'
              },
              {
                name: 'Estádio Nilton Santos',
                city: 'Rio de Janeiro',
                countryCode: 'BR',
                capacity: '46,831',
                matches: 'Matches 1-6',
                accent: 'green'
              },
            ].map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-xl p-6 text-center border ${
                  venue.accent === 'gold' ? 'border-gold-500/20' : 'border-green-500/20'
                }`}
              >
                <div className="flex justify-center mb-4">
                  <Flag countryCode={venue.countryCode} size="xl" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{venue.name}</h3>
                <p className="text-white/50 text-sm mb-2">{venue.city}</p>
                <p className={`text-sm font-semibold mb-2 ${
                  venue.accent === 'gold' ? 'text-gold-400' : 'text-green-400'
                }`}>
                  {venue.matches}
                </p>
                <p className="text-white/40 text-sm">Capacity: {venue.capacity}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Coming Soon Notice */}
      <section className="py-16 px-6 bg-night-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FULL SCHEDULE COMING SOON
            </h3>
            <p className="text-white/50 mb-6">
              Match dates, times, and team assignments will be announced soon.
              Stay tuned for the complete World Legends Cup 2026 fixture list.
            </p>
            <a
              href="/newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-night-900 font-bold rounded-full hover:bg-gold-400 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              GET NOTIFIED
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
