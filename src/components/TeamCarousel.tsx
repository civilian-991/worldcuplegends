'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getTeams, type Team } from '@/lib/api';
import Flag from '@/components/Flag';

export default function TeamCarousel() {
  const t = useTranslations('sections.teams');
  const tc = useTranslations('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useMotionValue(0);
  const CARD_WIDTH = 320; // w-80 = 320px
  const GAP = 24; // gap-6 = 24px
  const CARD_TOTAL = CARD_WIDTH + GAP;

  useEffect(() => {
    async function fetchTeams() {
      const data = await getTeams();
      setTeams(data);
      setIsLoading(false);
    }
    fetchTeams();
  }, []);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine swipe direction based on velocity and offset
    let newIndex = currentIndex;
    if (offset < -50 || velocity < -500) {
      newIndex = Math.min(currentIndex + 1, teams.length - 1);
    } else if (offset > 50 || velocity > 500) {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    setCurrentIndex(newIndex);
    animate(x, -newIndex * CARD_TOTAL, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    animate(x, -index * CARD_TOTAL, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  const goNext = () => {
    if (currentIndex < teams.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  if (isLoading || teams.length === 0) {
    return (
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 via-night-800 to-night-700" />
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

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
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">{t('preTitle')}</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white line-accent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/teams"
            className="mt-6 md:mt-0 text-gold-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2"
          >
            {t('viewAll')} →
          </Link>
        </motion.div>
      </div>

      {/* Swipeable Cards Container */}
      <div className="relative px-6 md:px-12">
        {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-night-600/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous team"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goNext}
          disabled={currentIndex >= teams.length - 1}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-night-600/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next team"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{
              left: -(teams.length - 1) * CARD_TOTAL,
              right: 0,
            }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="flex gap-6 cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.1 }}
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
                      <span className="text-white/50">{tc('rating')}</span>
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
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {teams.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gold-400 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to team ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-night-700 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-night-700 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
