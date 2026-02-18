'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { getLegends, type Legend } from '@/lib/api';
import Flag from '@/components/Flag';

// ===== TYPES =====
interface Award {
  id: string;
  name: string;
  icon: string;
  description: string;
  winner?: Legend;
  year: number;
}

interface TopScorer {
  legend: Legend;
  goals: number;
  rank: number;
}

// ===== MOCK DATA FOR AWARDS (in production, this would come from API) =====
const TOURNAMENT_YEARS = [2026, 2022, 2018, 2014, 2010, 2006, 2002, 1998];

const awardCategories = [
  { id: 'golden-ball', name: 'Golden Ball', icon: '⚽', description: 'Best Player of the Tournament' },
  { id: 'golden-boot', name: 'Golden Boot', icon: '👟', description: 'Top Scorer of the Tournament' },
  { id: 'golden-glove', name: 'Golden Glove', icon: '🧤', description: 'Best Goalkeeper' },
  { id: 'best-young', name: 'Best Young Player', icon: '⭐', description: 'Outstanding Young Talent' },
];

// ===== COMPONENTS =====

// Gold Particle Effect Component
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-400"
          initial={{
            x: Math.random() * 100 + '%',
            y: '100%',
            opacity: 0,
          }}
          animate={{
            y: '-20%',
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}

// Trophy Card with 3D Effect
function TrophyCard({ award, index, isSelected, onClick }: {
  award: Award;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative cursor-pointer rounded-2xl overflow-hidden
          ${isSelected ? 'ring-2 ring-gold-400 glow-gold' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-night-600 via-night-700 to-night-800" />

        {/* Gold Accent Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-transparent to-gold-600/10 opacity-50" />

        {/* Trophy Shine Effect */}
        <div className="trophy-shine absolute inset-0" />

        {/* Content */}
        <div className="relative p-6 flex flex-col items-center text-center" style={{ transform: 'translateZ(20px)' }}>
          {/* Trophy Icon */}
          <motion.div
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-6xl mb-4 drop-shadow-lg"
          >
            {award.icon}
          </motion.div>

          {/* Award Name */}
          <h3
            className="text-xl font-bold text-gradient-gold mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {award.name}
          </h3>

          {/* Year Badge */}
          <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 text-sm font-medium mb-3">
            {award.year}
          </span>

          {/* Winner Preview */}
          {award.winner && (
            <div className="flex items-center gap-2 mt-2">
              <Flag countryCode={award.winner.countryCode} size="sm" />
              <span className="text-white/70 text-sm">{award.winner.name}</span>
            </div>
          )}
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

// Award Detail Card with Winner Photo
function AwardDetailCard({ award, onClose }: { award: Award; onClose: () => void }) {
  if (!award.winner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-3xl overflow-hidden glass-gold"
    >
      {/* Background with Winner Image */}
      <div className="absolute inset-0">
        {award.winner.image && (
          <Image
            src={award.winner.image}
            alt={award.winner.name}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Winner Photo */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-gold-500/50 glow-gold">
              {award.winner.image ? (
                <Image
                  src={award.winner.image}
                  alt={award.winner.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-600/30 to-gold-800/30 flex items-center justify-center">
                  <span className="text-6xl">{award.icon}</span>
                </div>
              )}
            </div>
            {/* Award Badge */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-3xl shadow-lg">
              {award.icon}
            </div>
          </div>

          {/* Winner Info */}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Flag countryCode={award.winner.countryCode} size="lg" />
              <span className="text-white/60">{award.winner.country}</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {award.winner.name}
            </h2>
            <p className="text-gold-400 text-xl mb-4">{award.name} {award.year}</p>
            <p className="text-white/60 max-w-md">{award.description}</p>

            {/* Stats */}
            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                  {award.winner.goals}
                </p>
                <p className="text-white/50 text-sm">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                  {award.winner.assists}
                </p>
                <p className="text-white/50 text-sm">Assists</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                  {award.winner.appearances}
                </p>
                <p className="text-white/50 text-sm">Appearances</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Top Scorers Leaderboard
function TopScorersLeaderboard({ legends }: { legends: Legend[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const topScorers = useMemo(() => {
    return [...legends]
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10)
      .map((legend, index) => ({
        legend,
        goals: legend.goals,
        rank: index + 1,
      }));
  }, [legends]);

  const maxGoals = topScorers[0]?.goals || 1;

  return (
    <div ref={ref} className="space-y-3">
      {topScorers.map((scorer, index) => (
        <motion.div
          key={scorer.legend.id}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl bg-night-600/50 hover:bg-night-600 transition-colors border border-white/5 hover:border-gold-500/30">
            {/* Rank */}
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${scorer.rank <= 3 ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-night-900' : 'bg-night-500 text-white/60'}
              `}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {scorer.rank}
            </div>

            {/* Player Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-night-500 flex-shrink-0">
                {scorer.legend.image ? (
                  <Image
                    src={scorer.legend.image}
                    alt={scorer.legend.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{scorer.legend.name}</p>
                <div className="flex items-center gap-2">
                  <Flag countryCode={scorer.legend.countryCode} size="sm" />
                  <span className="text-white/50 text-sm">{scorer.legend.country}</span>
                </div>
              </div>
            </div>

            {/* Goals Bar */}
            <div className="flex-1 max-w-[200px] hidden md:block">
              <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(scorer.goals / maxGoals) * 100}%` } : {}}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                />
              </div>
            </div>

            {/* Goals Count */}
            <div className="text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {scorer.goals}
              </motion.p>
              <p className="text-white/40 text-xs">goals</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Best XI Formation Display
function BestXIFormation({ legends }: { legends: Legend[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Select best XI based on position and rating
  const bestXI = useMemo(() => {
    const positions = {
      GK: legends.filter(l => l.position === 'GK').slice(0, 1),
      DF: legends.filter(l => l.position === 'DF' || l.position === 'Defender').slice(0, 4),
      MF: legends.filter(l => l.position === 'MF' || l.position === 'Midfielder').slice(0, 3),
      FW: legends.filter(l => l.position === 'FW' || l.position === 'Forward').slice(0, 3),
    };

    // Fill remaining spots with highest rated
    const selected = [...positions.GK, ...positions.DF, ...positions.MF, ...positions.FW];
    const remaining = legends.filter(l => !selected.includes(l)).slice(0, 11 - selected.length);

    return [...selected, ...remaining].slice(0, 11);
  }, [legends]);

  // 4-3-3 Formation positions (percentages)
  const formationPositions = [
    { x: 50, y: 90, role: 'GK' },     // Goalkeeper
    { x: 15, y: 70, role: 'LB' },     // Left Back
    { x: 38, y: 72, role: 'CB' },     // Center Back
    { x: 62, y: 72, role: 'CB' },     // Center Back
    { x: 85, y: 70, role: 'RB' },     // Right Back
    { x: 25, y: 48, role: 'CM' },     // Left Mid
    { x: 50, y: 50, role: 'CM' },     // Center Mid
    { x: 75, y: 48, role: 'CM' },     // Right Mid
    { x: 20, y: 25, role: 'LW' },     // Left Wing
    { x: 50, y: 20, role: 'ST' },     // Striker
    { x: 80, y: 25, role: 'RW' },     // Right Wing
  ];

  return (
    <div ref={ref} className="relative">
      {/* Stadium/Pitch Background */}
      <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-2xl overflow-hidden">
        {/* Pitch */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-green-950/50">
          {/* Pitch Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Center Circle */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
            {/* Center Line */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
            {/* Penalty Box Top */}
            <rect x="20" y="0" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
            {/* Penalty Box Bottom */}
            <rect x="20" y="80" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
          </svg>
        </div>

        {/* Spotlight Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent opacity-50" />

        {/* Stadium Lights */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gold-400/20 rounded-full blur-[80px] stadium-light" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gold-400/20 rounded-full blur-[80px] stadium-light" style={{ animationDelay: '2s' }} />

        {/* Players */}
        {bestXI.map((player, index) => {
          const pos = formationPositions[index] || { x: 50, y: 50 };
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Player Card */}
              <div className="relative">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-full bg-gold-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Player Photo */}
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-gold-500/50 group-hover:ring-gold-400 transition-all bg-night-700">
                  {player.image ? (
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-500 font-bold text-lg">
                      {player.jerseyNumber}
                    </div>
                  )}
                </div>

                {/* Jersey Number Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-night-900 font-bold text-xs">
                  {player.jerseyNumber}
                </div>

                {/* Name Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="glass px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <p className="text-white text-sm font-medium">{player.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <Flag countryCode={player.countryCode} size="sm" />
                      <span className="text-white/50 text-xs">{player.position}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend List Below */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
        {bestXI.slice(0, 8).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-night-600/30 hover:bg-night-600/50 transition-colors"
          >
            <span className="text-gold-400 font-bold text-sm w-4">{player.jerseyNumber}</span>
            <Flag countryCode={player.countryCode} size="sm" />
            <span className="text-white/80 text-sm truncate">{player.shortName || player.name.split(' ').pop()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Inductee Spotlight Card
function InducteeSpotlight({ legend, isActive }: { legend: Legend; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      className={`
        relative overflow-hidden rounded-2xl
        ${isActive ? 'glow-gold' : ''}
      `}
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/50 via-transparent to-gold-600/50 p-[1px] rounded-2xl">
        <div className="w-full h-full bg-night-800 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Photo with Emboss Effect */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden">
              {legend.image ? (
                <Image
                  src={legend.image}
                  alt={legend.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-600/30 to-gold-800/30 flex items-center justify-center">
                  <span
                    className="text-6xl font-bold text-gold-500/50"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.jerseyNumber}
                  </span>
                </div>
              )}
            </div>
            {/* HOF Badge */}
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-night-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Flag countryCode={legend.countryCode} size="lg" />
              <span className="text-white/60">{legend.country}</span>
            </div>
            <h3
              className="text-3xl md:text-4xl font-bold text-gradient-gold mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {legend.name}
            </h3>
            <p className="text-gold-400/80 mb-4">{legend.position} | {legend.team}</p>

            {/* Career Highlights */}
            <div className="space-y-2">
              <h4 className="text-white/50 text-sm uppercase tracking-wider">Career Highlights</h4>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {legend.worldCups > 0 && (
                  <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 text-sm">
                    {legend.worldCups}x World Cup
                  </span>
                )}
                <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 text-sm">
                  {legend.goals} Goals
                </span>
                <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 text-sm">
                  {legend.appearances} Caps
                </span>
                <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 text-sm">
                  Era: {legend.era}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
              <span className="text-white/50 text-sm">Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(legend.rating / 20) ? 'text-gold-400' : 'text-white/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gold-400 font-bold ml-1">{legend.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Year Selector
function YearSelector({ years, selectedYear, onSelect }: {
  years: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelect(year)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${selectedYear === year
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 glow-gold-sm'
              : 'bg-night-600 text-white/60 hover:bg-night-500 hover:text-white'
            }
          `}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function HallOfFame() {
  const [legends, setLegends] = useState<Legend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(TOURNAMENT_YEARS[0]);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [currentInducteeIndex, setCurrentInducteeIndex] = useState(0);

  // Fetch legends
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getLegends();
      setLegends(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Generate awards based on legends
  const awards = useMemo(() => {
    if (legends.length === 0) return [];

    const sortedByRating = [...legends].sort((a, b) => b.rating - a.rating);
    const sortedByGoals = [...legends].sort((a, b) => b.goals - a.goals);
    const goalkeepers = legends.filter(l => l.position === 'GK');
    const youngPlayers = sortedByRating.slice(5, 10); // Simulated young players

    return awardCategories.map((cat, index) => ({
      ...cat,
      year: selectedYear,
      winner: index === 0 ? sortedByRating[0] :
              index === 1 ? sortedByGoals[0] :
              index === 2 ? goalkeepers[0] || sortedByRating[2] :
              youngPlayers[0],
    }));
  }, [legends, selectedYear]);

  // Top inductees (highest rated legends)
  const topInductees = useMemo(() => {
    return [...legends].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [legends]);

  // Auto-rotate inductee spotlight
  useEffect(() => {
    if (topInductees.length === 0) return;
    const interval = setInterval(() => {
      setCurrentInducteeIndex((prev) => (prev + 1) % topInductees.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topInductees.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
          <p className="text-gold-400 animate-pulse">Loading Hall of Fame...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-700 via-night-800 to-night-900 relative overflow-hidden">
      {/* Gold Particles Background */}
      <GoldParticles />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-[150px] hidden md:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Trophy Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <img src="/legends-cup.png" alt="World Legends Cup Trophy" className="h-24 w-auto mx-auto" />
                <img src="/legends-cup.png" alt="" aria-hidden="true" className="absolute inset-0 h-24 w-auto mx-auto animate-ping opacity-30" />
              </div>
            </motion.div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-gold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HALL OF FAME
            </h1>
            <p className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              Celebrating the greatest legends who have graced the World Cup stage
            </p>

            {/* Year Selector */}
            <YearSelector
              years={TOURNAMENT_YEARS}
              selectedYear={selectedYear}
              onSelect={setSelectedYear}
            />
          </motion.div>
        </div>
      </section>

      {/* Trophy Cabinet - Award Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TROPHY <span className="text-gold-400">CABINET</span>
            </h2>
            <p className="text-white/50">Individual honors and achievements</p>
          </motion.div>

          {/* Award Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {awards.map((award, index) => (
              <TrophyCard
                key={award.id}
                award={award}
                index={index}
                isSelected={selectedAward?.id === award.id}
                onClick={() => setSelectedAward(selectedAward?.id === award.id ? null : award)}
              />
            ))}
          </div>

          {/* Selected Award Detail */}
          <AnimatePresence>
            {selectedAward && (
              <AwardDetailCard
                award={selectedAward}
                onClose={() => setSelectedAward(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Top Scorers Leaderboard */}
      <section className="py-16 px-6 bg-night-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ALL-TIME <span className="text-gold-400">TOP SCORERS</span>
            </h2>
            <p className="text-white/50">The greatest goal scorers in World Cup history</p>
          </motion.div>

          <TopScorersLeaderboard legends={legends} />
        </div>
      </section>

      {/* Best XI Formation */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BEST XI <span className="text-gold-400">ALL-TIME</span>
            </h2>
            <p className="text-white/50">The ultimate dream team of World Cup legends</p>
          </motion.div>

          <BestXIFormation legends={legends} />
        </div>
      </section>

      {/* Inductee Spotlight */}
      <section className="py-16 px-6 bg-night-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              INDUCTEE <span className="text-gold-400">SPOTLIGHT</span>
            </h2>
            <p className="text-white/50">Honoring the elite of World Cup football</p>
          </motion.div>

          {/* Spotlight Card */}
          <AnimatePresence mode="wait">
            {topInductees[currentInducteeIndex] && (
              <motion.div
                key={topInductees[currentInducteeIndex].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <InducteeSpotlight
                  legend={topInductees[currentInducteeIndex]}
                  isActive={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inductee Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {topInductees.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInducteeIndex(index)}
                className={`
                  w-3 h-3 rounded-full transition-all
                  ${index === currentInducteeIndex
                    ? 'bg-gold-400 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                  }
                `}
                aria-label={`View inductee ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDS NEVER <span className="text-gradient-gold">DIE</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Experience the magic of World Cup history. Explore the legends who defined generations of football.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-full glow-gold"
            >
              Explore All Legends
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
