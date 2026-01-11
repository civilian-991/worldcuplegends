'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import StandingsTable from '@/components/StandingsTable';
import UpcomingMatches from '@/components/UpcomingMatches';
import TeamCarousel from '@/components/TeamCarousel';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Marquee Banner */}
      <div className="bg-gold-500 py-3 overflow-hidden relative">
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              {[
                'PELÉ', 'MARADONA', 'ZIDANE', 'RONALDO', 'MESSI', 'BECKENBAUER',
                'CRUYFF', 'RONALDINHO', 'HENRY', 'MALDINI'
              ].map((name) => (
                <span
                  key={name}
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

      <StandingsTable />

      {/* Quote Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-night-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-500/10 to-transparent opacity-50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="text-gold-400 text-6xl mb-8">&ldquo;</div>
          <blockquote
            className="text-3xl md:text-5xl text-white font-bold leading-tight mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            THE MORE DIFFICULT THE VICTORY, THE GREATER THE HAPPINESS IN WINNING.
          </blockquote>
          <cite className="text-gold-400 text-xl not-italic">— PELÉ</cite>
        </motion.div>
      </section>

      <UpcomingMatches />
      <TeamCarousel />
      <NewsSection />

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-900" />

        {/* Stadium Lights Effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Be Part of History</p>
          <h2
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DON&apos;T MISS THE
            <span className="text-gradient-gold block">GREATEST SHOW</span>
          </h2>
          <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            Witness football legends unite for one extraordinary tournament.
            Get your tickets now and be part of history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-full glow-gold"
            >
              Get Tickets Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border-2 border-gold-500/50 text-gold-400 font-semibold text-lg rounded-full hover:bg-gold-500/10 transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </section>
    </>
  );
}
