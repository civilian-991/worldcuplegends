'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { teams } from '@/data/legends';
import Flag from '@/components/Flag';

export default function TeamCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-night-700 via-night-800 to-night-700" />

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Nations</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white line-accent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDARY TEAMS
            </h2>
          </div>
          <Link
            href="/teams"
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2"
          >
            View All Teams →
          </Link>
        </motion.div>
      </div>

      {/* Scrolling Cards */}
      <motion.div
        style={{ x }}
        className="flex gap-6 pl-6"
      >
        {[...teams, ...teams].map((team, index) => (
          <motion.div
            key={`${team.id}-${index}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (index % teams.length) * 0.1 }}
            whileHover={{ y: -10 }}
            className="flex-shrink-0 w-80 glass rounded-2xl overflow-hidden group cursor-pointer"
          >
            {/* Card Header with Country Color */}
            <div
              className="h-2"
              style={{ backgroundColor: team.color }}
            />

            <div className="p-6">
              {/* Flag and Name */}
              <div className="flex items-center gap-4 mb-6">
                <Flag countryCode={team.countryCode} size="xl" />
                <div>
                  <h3
                    className="text-white text-2xl font-bold group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {team.name.toUpperCase()}
                  </h3>
                  <p className="text-white/50 text-sm">{team.confederation}</p>
                </div>
              </div>

              {/* World Cups */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(team.worldCups, 5) }).map((_, i) => (
                    <span key={i} className="text-gold-400 text-xl">🏆</span>
                  ))}
                </div>
                <span className="text-gold-400 font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {team.worldCups} {team.worldCups === 1 ? 'Title' : 'Titles'}
                </span>
              </div>

              {/* Years */}
              {team.worldCupYears.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {team.worldCupYears.map((year) => (
                    <span
                      key={year}
                      className="px-2 py-1 bg-gold-500/10 text-gold-400 text-xs rounded-full"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/50">Rating</span>
                  <span className="text-gold-400 font-bold">{team.rating}</span>
                </div>
                <div className="h-2 bg-night-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${team.rating}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                  />
                </div>
              </div>

              {/* Legends Preview */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Legends</p>
                <p className="text-white/70 text-sm line-clamp-1">
                  {team.legends.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-night-700 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-night-700 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
