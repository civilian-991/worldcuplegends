'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getMatches, type Match } from '@/lib/api';
import FlippingFlagPair from '@/components/FlippingFlag';

function MatchRow({ match, index }: { match: Match; index: number }) {
  return (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-4 group hover:border-green-500/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="text-2xl font-bold text-green-400/50"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            #{index + 1}
          </span>
          <FlippingFlagPair size="sm">
            {(home, away) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-night-600 border border-white/10 flex items-center justify-center">
                  {home}
                </div>
                <span className="text-white/50 font-medium">TBA</span>
                <span className="text-white/30 mx-2">vs</span>
                <span className="text-white/50 font-medium">TBA</span>
                <div className="w-10 h-10 rounded-full bg-night-600 border border-white/10 flex items-center justify-center">
                  {away}
                </div>
              </div>
            )}
          </FlippingFlagPair>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs">Date TBA</p>
        </div>
      </div>
    </motion.div>
  );
}

function FinalCard() {
  return (
    <FlippingFlagPair size="lg">
      {(home, away) => (
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-night-600 border-2 border-gold-500/30 flex items-center justify-center mb-2">
              {home}
            </div>
            <p className="text-white/50 text-sm">TBA</p>
          </div>

          <span
            className="text-3xl font-bold text-gold-400"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            VS
          </span>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-night-600 border-2 border-gold-500/30 flex items-center justify-center mb-2">
              {away}
            </div>
            <p className="text-white/50 text-sm">TBA</p>
          </div>
        </div>
      )}
    </FlippingFlagPair>
  );
}

export default function UpcomingMatches() {
  const t = useTranslations('sections.matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const data = await getMatches();
      setMatches(data);
      setIsLoading(false);
    }
    fetchMatches();
  }, []);

  const finalMatch = matches.find(m => m.stage === 'The Final');
  const journeyMatches = matches.filter(m => m.stage !== 'The Final').slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-24 px-6 relative overflow-hidden bg-night-800">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

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
          className="text-center mb-16"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">{t('preTitle')}</p>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            7 legendary matches. 2 iconic venues. One unforgettable tournament.
          </p>
        </motion.div>

        {/* Tournament Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* The Journey */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
            <div className="pl-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm font-bold rounded-full border border-green-500/30">
                  THE JOURNEY
                </span>
                <span className="text-white/40 text-sm">Estádio Nilton Santos</span>
              </div>

              <div className="space-y-3">
                {journeyMatches.map((match, index) => (
                  <MatchRow key={match.id} match={match} index={index} />
                ))}

                {matches.filter(m => m.stage !== 'The Final').length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-white/40 text-sm">
                      +{matches.filter(m => m.stage !== 'The Final').length - 3} more matches
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* The Final */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {finalMatch && (
              <div className="relative h-full">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
                <div className="pl-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-gold-500/20 text-gold-400 text-sm font-bold rounded-full border border-gold-500/30">
                      THE FINAL
                    </span>
                    <span className="text-white/40 text-sm">Estádio Maracanã</span>
                  </div>

                  <div className="glass rounded-2xl p-8 border-gold-500/20 glow-gold h-[calc(100%-60px)] flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <img src="/legends-cup.png" alt="World Legends Cup Trophy" className="h-16 w-auto mx-auto" />
                      </motion.div>
                    </div>

                    <FinalCard />

                    <div className="text-center">
                      <p className="text-gold-400/70 text-sm mb-1">Where Champions Are Crowned</p>
                      <p className="text-white/30 text-xs">Date & Time TBA</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* View Full Schedule CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/schedule">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VIEW FULL SCHEDULE
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
