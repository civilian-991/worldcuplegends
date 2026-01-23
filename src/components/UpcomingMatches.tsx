'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { matches } from '@/data/legends';
import Flag from '@/components/Flag';

const upcomingMatches = matches.slice(0, 4);

export default function UpcomingMatches() {
  const t = useTranslations('sections.matches');

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-night-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

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
            href="/schedule"
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

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative glass rounded-2xl p-6 overflow-hidden group cursor-pointer card-hover"
            >
              {/* Live Badge */}
              {match.isLive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-semibold uppercase">{t('live')}</span>
                </div>
              )}

              {/* Stage Badge */}
              <div className="inline-block px-3 py-1 bg-gold-500/10 rounded-full mb-6">
                <span className="text-gold-400 text-xs font-medium">{match.stage}</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between mb-6">
                {/* Home Team */}
                <div className="flex items-center gap-4 flex-1">
                  {match.homeCountryCode === 'TBD' ? (
                    <span className="text-4xl">🏆</span>
                  ) : (
                    <Flag countryCode={match.homeCountryCode} size="xl" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-lg">{match.homeTeam}</p>
                    {match.homeScore !== undefined && (
                      <p className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                        {match.homeScore}
                      </p>
                    )}
                  </div>
                </div>

                {/* VS */}
                <div className="px-6">
                  {match.homeScore !== undefined ? (
                    <span className="text-white/30 text-sm">-</span>
                  ) : (
                    <span className="text-white/50 text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                      {t('vs')}
                    </span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <div className="text-right">
                    <p className="text-white font-semibold text-lg">{match.awayTeam}</p>
                    {match.awayScore !== undefined && (
                      <p className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                        {match.awayScore}
                      </p>
                    )}
                  </div>
                  {match.awayCountryCode === 'TBD' ? (
                    <span className="text-4xl">🏆</span>
                  ) : (
                    <Flag countryCode={match.awayCountryCode} size="xl" />
                  )}
                </div>
              </div>

              {/* Match Info */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(match.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{match.time}</span>
                </div>
              </div>

              {/* Venue */}
              <div className="mt-3 flex items-center gap-2 text-white/40 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{match.venue}</span>
              </div>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
