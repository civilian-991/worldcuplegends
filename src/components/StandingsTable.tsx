'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { legends } from '@/data/legends';
import Flag from '@/components/Flag';

const topLegends = [...legends].sort((a, b) => b.rating - a.rating).slice(0, 6);

export default function StandingsTable() {
  const t = useTranslations('sections.standings');
  const tc = useTranslations('common');

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-800" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">{t('preTitle')}</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white line-accent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/legends"
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2 group"
          >
            {t('viewAll')}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gold-500/10 text-sm text-white/50 uppercase tracking-wider">
            <div className="col-span-1">Pos.</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-2">Team</div>
            <div className="col-span-1 text-center">{tc('goals')}</div>
            <div className="col-span-1 text-center">{tc('appearances')}</div>
            <div className="col-span-1 text-center">{tc('rating')}</div>
          </div>

          {/* Table Body */}
          {topLegends.map((legend, index) => (
            <motion.div
              key={legend.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
              className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-white/5 items-center cursor-pointer group"
            >
              {/* Position */}
              <div className="col-span-2 md:col-span-1">
                <span
                  className={`text-2xl font-bold ${index < 3 ? 'text-gold-400' : 'text-white/30'}`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Player */}
              <div className="col-span-10 md:col-span-4 flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center overflow-hidden border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors">
                    <span className="text-2xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                      {legend.jerseyNumber}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                      <span className="text-night-900 text-xs">★</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-gold-400 transition-colors">
                    {legend.name}
                  </p>
                  <p className="text-white/40 text-sm">{legend.position}</p>
                </div>
              </div>

              {/* Country - Hidden on mobile */}
              <div className="hidden md:flex col-span-2 items-center gap-2">
                <Flag countryCode={legend.countryCode} size="lg" />
                <span className="text-white/70 text-sm">{legend.country}</span>
              </div>

              {/* Team - Hidden on mobile */}
              <div className="hidden md:block col-span-2">
                <span className="text-white/70 text-sm">{legend.team}</span>
              </div>

              {/* Goals - Hidden on mobile */}
              <div className="hidden md:block col-span-1 text-center">
                <span className="text-white font-semibold">{legend.goals}</span>
              </div>

              {/* Appearances - Hidden on mobile */}
              <div className="hidden md:block col-span-1 text-center">
                <span className="text-white/70">{legend.appearances}</span>
              </div>

              {/* Rating */}
              <div className="hidden md:block col-span-1 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
