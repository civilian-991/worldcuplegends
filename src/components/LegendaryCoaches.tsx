'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Flag from './Flag';

interface Team {
  id: number;
  name: string;
  countryCode: string;
  coach: string;
  coachImage: string;
  captain: string;
  color: string;
}

export default function LegendaryCoaches() {
  const t = useTranslations('home.coaches');
  const tCommon = useTranslations('common');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      // Filter to only teams with coaches
      const teamsWithCoaches = data.filter((team: Team) => team.coach);
      setTeams(teamsWithCoaches);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(tCommon('errorLoadingCoaches'));
    } finally {
      setIsLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (isLoading) {
    return (
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-night-700/80 to-night-800/80 backdrop-blur-sm border border-red-500/20 shadow-xl max-w-md w-full text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {tCommon('error')}
              </h3>
              <p className="text-white/60 mb-6">{error}</p>

              {/* Retry Button */}
              <button
                onClick={fetchTeams}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-night-900 font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-gold-500/20"
              >
                <svg
                  className="w-5 h-5"
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
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-night-800">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4"
          >
            {t('preTitle')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}{' '}
            <span className="text-gradient-gold">{t('titleHighlight')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className="relative h-[280px] md:h-[340px] rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${team.color}40 0%, ${team.color}10 50%, transparent 100%)`,
                }}
              >
                {/* Coach Image or Placeholder */}
                <div className="absolute inset-0 flex items-end justify-center">
                  {team.coachImage ? (
                    <Image
                      src={team.coachImage}
                      alt={team.coach}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[120px] font-black text-white/5"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {team.coach.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Gradient Overlay - only at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 via-40% to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  {/* Flag */}
                  <div className="mb-2">
                    <Flag countryCode={team.countryCode} size="md" />
                  </div>

                  {/* Coach Name */}
                  <h3
                    className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {team.coach}
                  </h3>

                  {/* Nation */}
                  <p className="text-white/50 text-sm">{team.name}</p>

                  {/* Coach Badge */}
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-gold-500/20 border border-gold-500/30 rounded text-gold-400 text-xs font-semibold uppercase tracking-wider">
                      {t('coachBadge')}
                    </span>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500/30 transition-colors"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 text-sm mt-12 tracking-widest uppercase"
        >
          {t('tagline')}
        </motion.p>
      </div>
    </section>
  );
}
