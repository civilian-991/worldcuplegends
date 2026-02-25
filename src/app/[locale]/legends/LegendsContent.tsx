'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { type Legend } from '@/lib/api';
import { Link } from '@/i18n/navigation';
import Flag from '@/components/Flag';

interface Team {
  id: number;
  name: string;
  countryCode: string;
  coach: string;
  coachImage: string;
  captain: string;
  color: string;
}

const eras = ['All Eras', '1980s-1990s', '1990s-2000s', '2000s', '2000s-2010s'];
const LEGENDS_PER_PAGE = 12;

const legendsFetcher = async (url: string): Promise<Legend[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
};

const teamsFetcher = async (url: string): Promise<Team[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return data.filter((team: Team) => team.coach);
};

export default function LegendsContent() {
  const t = useTranslations('legends');
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(LEGENDS_PER_PAGE);

  const { data: legends = [], error: legendsError, isLoading: legendsLoading } = useSWR<Legend[]>(
    '/api/legends',
    legendsFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data: teams = [], error: teamsError, isLoading: teamsLoading } = useSWR<Team[]>(
    '/api/teams',
    teamsFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  // Captains
  const captains = useMemo(() => {
    return legends.filter((l) => l.isCaptain).sort((a, b) => b.rating - a.rating);
  }, [legends]);

  // Players filtered by era + search
  const filteredPlayers = useMemo(() => {
    return legends.filter((legend) => {
      const matchesEra = selectedEra === 'All Eras' || legend.era === selectedEra;
      const matchesSearch =
        legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesSearch;
    });
  }, [legends, selectedEra, searchQuery]);

  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => b.rating - a.rating);
  }, [filteredPlayers]);

  const visiblePlayers = useMemo(() => {
    return sortedPlayers.slice(0, visibleCount);
  }, [sortedPlayers, visibleCount]);

  useEffect(() => {
    setVisibleCount(LEGENDS_PER_PAGE);
  }, [selectedEra, searchQuery]);

  const hasMorePlayers = visibleCount < sortedPlayers.length;

  return (
    <div className="min-h-screen bg-night-700">
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gold-400">{t('year')}</span>
            </h1>
            <p className="text-white/50 text-base">
              {t('pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── COACHES SECTION ── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            preTitle={t('coachesPreTitle')}
            title={t('coachesTitle')}
            titleHighlight={t('coachesTitleHighlight')}
            description={t('coachesDescription')}
          />

          {teamsLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <CoachSkeletonCard key={i} />)}
            </div>
          )}

          {!teamsLoading && teams.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {teams.map((team, index) => (
                <CoachCard key={team.id} team={team} index={index} />
              ))}
            </div>
          )}

          {!teamsLoading && teams.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center text-white/40 text-sm mt-10 tracking-widest uppercase"
            >
              {t('coachesTagline')}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── CAPTAINS SECTION ── */}
      <section className="py-16 px-6 relative overflow-hidden bg-night-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            preTitle={t('captainsPreTitle')}
            title={t('captainsTitle')}
            titleHighlight={t('captainsTitleHighlight')}
            description={t('captainsDescription')}
          />

          {legendsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!legendsLoading && captains.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {captains.map((legend, index) => (
                <LegendCard key={legend.id} legend={legend} index={index} showCaptainBadge />
              ))}
            </div>
          )}

          {!legendsLoading && captains.length === 0 && !legendsError && (
            <p className="text-center text-white/40 py-12">{t('noCaptains')}</p>
          )}
        </div>
      </section>

      {/* ── PLAYERS SECTION ── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            preTitle={t('playersPreTitle')}
            title={t('playersTitle')}
            titleHighlight={t('playersTitleHighlight')}
            description={t('playersDescription')}
          />

          {/* Search + Era Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search legends"
                className="w-full px-4 py-2 bg-night-600 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  aria-pressed={selectedEra === era}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                    selectedEra === era
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-600 text-white/60 hover:bg-night-500 hover:text-white'
                  }`}
                >
                  {era === 'All Eras' ? t('allEras') : era}
                </button>
              ))}
            </div>
          </div>

          {legendsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!legendsLoading && (
            <>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {visiblePlayers.map((legend, index) => (
                    <LegendCard key={legend.id} legend={legend} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More */}
              {sortedPlayers.length > 0 && hasMorePlayers && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center mt-10 gap-3"
                >
                  <p className="text-white/40 text-sm">
                    {t('showingCount', { count: visiblePlayers.length, total: sortedPlayers.length })}
                  </p>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + LEGENDS_PER_PAGE)}
                    className="px-6 py-2.5 rounded text-sm font-medium transition-all bg-night-600 text-white/60 hover:bg-gold-500 hover:text-night-900"
                  >
                    {t('loadMore')}
                  </button>
                </motion.div>
              )}

              {sortedPlayers.length > 0 && !hasMorePlayers && sortedPlayers.length > LEGENDS_PER_PAGE && (
                <div className="flex justify-center mt-10">
                  <p className="text-white/40 text-sm">
                    {t('showingCount', { count: sortedPlayers.length, total: sortedPlayers.length })}
                  </p>
                </div>
              )}

              {legendsError && (
                <div className="text-center py-20">
                  <p className="text-red-400 text-xl mb-4">Failed to load legends.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!legendsError && sortedPlayers.length === 0 && legends.length > 0 && (
                <div className="text-center py-20">
                  <p className="text-white/50 text-xl">{t('noResults')}</p>
                  <button
                    onClick={() => { setSelectedEra('All Eras'); setSearchQuery(''); }}
                    className="mt-4 text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    {t('clearFilters')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ preTitle, title, titleHighlight, description }: {
  preTitle: string;
  title: string;
  titleHighlight: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{preTitle}</p>
      <h2
        className="text-4xl md:text-5xl font-bold text-white mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title} <span className="text-gradient-gold">{titleHighlight}</span>
      </h2>
      <p className="text-white/60 text-lg max-w-2xl mx-auto">{description}</p>
    </motion.div>
  );
}

/* ── Coach Card ── */
function CoachCard({ team, index }: { team: Team; index: number }) {
  const t = useTranslations('legends');

  return (
    <motion.div
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
              <span className="text-[120px] font-black text-white/5" style={{ fontFamily: 'var(--font-display)' }}>
                {team.coach.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 via-40% to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="mb-2">
            <Flag countryCode={team.countryCode} size="md" />
          </div>
          <h3
            className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {team.coach}
          </h3>
          <p className="text-white/50 text-sm">{team.name}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-gold-500/20 border border-gold-500/30 rounded text-gold-400 text-xs font-semibold uppercase tracking-wider">
              {t('coachBadge')}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500/30 transition-colors"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}
        />
      </div>
    </motion.div>
  );
}

/* ── Coach Skeleton ── */
function CoachSkeletonCard() {
  return (
    <div
      className="relative h-[280px] md:h-[340px] rounded-2xl overflow-hidden animate-pulse"
      style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 via-40% to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div className="h-5 w-8 bg-night-800/50 rounded mb-2" />
        <div className="h-7 w-28 bg-night-800/50 rounded mb-2" />
        <div className="h-4 w-20 bg-night-800/50 rounded mb-2" />
        <div className="h-6 w-24 bg-night-800/30 rounded mt-2" />
      </div>
    </div>
  );
}

/* ── Legend Card ── */
function LegendCard({ legend, index, showCaptainBadge = false }: { legend: Legend; index: number; showCaptainBadge?: boolean }) {
  const t = useTranslations('legends');
  const teamColors: Record<string, { bg: string; accent: string }> = {
    BR: { bg: 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)', accent: '#009c3b' },
    AR: { bg: 'linear-gradient(135deg, #2d4a6f 0%, #1a2d42 100%)', accent: '#75aadb' },
    FR: { bg: 'linear-gradient(135deg, #1a2744 0%, #0d1522 100%)', accent: '#002654' },
    DE: { bg: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', accent: '#cfcfcf' },
    IT: { bg: 'linear-gradient(135deg, #1a3d5c 0%, #0d1f2e 100%)', accent: '#0066cc' },
    NL: { bg: 'linear-gradient(135deg, #8b4513 0%, #5c2d0e 100%)', accent: '#ff6f00' },
    PT: { bg: 'linear-gradient(135deg, #4a1a1a 0%, #2d0d0d 100%)', accent: '#c41e3a' },
    ES: { bg: 'linear-gradient(135deg, #5c1a1a 0%, #3d0d0d 100%)', accent: '#c60b1e' },
    GB: { bg: 'linear-gradient(135deg, #1a2744 0%, #0d1522 100%)', accent: '#012169' },
  };

  const nameParts = legend.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];
  const colors = teamColors[legend.countryCode] || { bg: 'linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 100%)', accent: '#d4af37' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      <Link href={`/legends/${legend.id}`}>
        <div
          className="relative h-[280px] rounded-lg overflow-hidden cursor-pointer group"
          style={{ background: colors.bg }}
        >
          <div className="relative h-full flex">
            <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
              <div>
                <p className="text-white/70 text-sm font-medium">{firstName}</p>
                <h3
                  className="text-white text-3xl font-black leading-tight group-hover:text-gold-400 transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {lastName}
                </h3>
                <p className="text-white/50 text-sm mt-1">{legend.team || legend.country}</p>
                {showCaptainBadge && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gold-500/20 border border-gold-500/30 rounded text-gold-400 text-xs font-semibold uppercase tracking-wider">
                    {t('captainBadge')}
                  </span>
                )}
              </div>

              <div className="mt-auto">
                <span
                  className="text-7xl font-black leading-none"
                  style={{ fontFamily: 'var(--font-display)', color: colors.accent, opacity: 0.9 }}
                >
                  {legend.jerseyNumber}
                </span>
              </div>

              <div className="mt-4">
                <Flag countryCode={legend.countryCode} size="lg" />
              </div>
            </div>

            <div className="relative w-[45%] h-full">
              {legend.image ? (
                <Image
                  src={legend.image}
                  alt={legend.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{
                    maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                  }}
                  priority={index < 4}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[100px] font-black text-white/5" style={{ fontFamily: 'var(--font-display)' }}>
                    {legend.jerseyNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Player Skeleton ── */
function SkeletonCard() {
  return (
    <div
      className="relative h-[280px] rounded-lg overflow-hidden animate-pulse"
      style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
    >
      <div className="relative h-full flex">
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          <div>
            <div className="h-4 w-16 bg-night-800/50 rounded mb-2" />
            <div className="h-8 w-32 bg-night-800/50 rounded mb-2" />
            <div className="h-4 w-24 bg-night-800/50 rounded mt-1" />
          </div>
          <div className="mt-auto">
            <div className="h-16 w-20 bg-night-800/30 rounded" />
          </div>
          <div className="mt-4">
            <div className="h-6 w-9 bg-night-800/50 rounded" />
          </div>
        </div>
        <div className="relative w-[45%] h-full">
          <div
            className="absolute inset-0 bg-night-800/30"
            style={{
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
            }}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
