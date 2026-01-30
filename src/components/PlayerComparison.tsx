'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLegends, type Legend } from '@/lib/api';
import Flag from '@/components/Flag';

// Stat configuration for comparison
const STAT_CONFIG = [
  { key: 'goals', label: 'Goals', max: 120, icon: '\u26BD' },
  { key: 'assists', label: 'Assists', max: 100, icon: '\uD83C\uDFAF' },
  { key: 'appearances', label: 'Appearances', max: 200, icon: '\uD83D\uDC55' },
  { key: 'worldCups', label: 'World Cups', max: 4, icon: '\uD83C\uDFC6' },
  { key: 'rating', label: 'Rating', max: 100, icon: '\u2B50' },
] as const;

// Animated counter hook
function useAnimatedNumber(value: number, duration: number = 1000) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const startValue = previousValue.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    previousValue.current = value;
  }, [value, duration]);

  return displayValue;
}

// Searchable Dropdown Component
function PlayerDropdown({
  legends,
  selectedLegend,
  onSelect,
  placeholder,
  side,
}: {
  legends: Legend[];
  selectedLegend: Legend | null;
  onSelect: (legend: Legend) => void;
  placeholder: string;
  side: 'left' | 'right';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLegends = useMemo(() => {
    return legends.filter((legend) =>
      legend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      legend.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [legends, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 glass rounded-xl border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 flex items-center justify-between gap-3 ${
          side === 'left' ? 'text-left' : 'text-right flex-row-reverse'
        }`}
      >
        {selectedLegend ? (
          <div className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <Flag countryCode={selectedLegend.countryCode} size="md" />
            <div className={side === 'right' ? 'text-right' : 'text-left'}>
              <p className="text-white font-semibold">{selectedLegend.name}</p>
              <p className="text-white/50 text-xs">{selectedLegend.position}</p>
            </div>
          </div>
        ) : (
          <span className="text-white/50">{placeholder}</span>
        )}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-gold-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 glass rounded-xl border border-gold-500/20 overflow-hidden"
          >
            <div className="p-2 border-b border-gold-500/10">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search player..."
                className="w-full px-3 py-2 bg-night-700/50 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-hide">
              {filteredLegends.map((legend) => (
                <button
                  key={legend.id}
                  type="button"
                  onClick={() => {
                    onSelect(legend);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gold-500/10 transition-colors ${
                    selectedLegend?.id === legend.id ? 'bg-gold-500/20' : ''
                  }`}
                >
                  <Flag countryCode={legend.countryCode} size="sm" />
                  <div className="text-left flex-1">
                    <p className="text-white text-sm font-medium">{legend.name}</p>
                    <p className="text-white/40 text-xs">{legend.position} - {legend.era}</p>
                  </div>
                  <span className="text-gold-400 text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {legend.rating}
                  </span>
                </button>
              ))}
              {filteredLegends.length === 0 && (
                <div className="px-4 py-8 text-center text-white/40">
                  No legends found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated Stat Bar Component
function StatBar({
  stat,
  value1,
  value2,
  maxValue,
  showWinner,
}: {
  stat: string;
  value1: number;
  value2: number;
  maxValue: number;
  showWinner: boolean;
}) {
  const percent1 = Math.min((value1 / maxValue) * 100, 100);
  const percent2 = Math.min((value2 / maxValue) * 100, 100);
  const winner = value1 > value2 ? 'left' : value2 > value1 ? 'right' : 'tie';

  const animatedValue1 = useAnimatedNumber(value1);
  const animatedValue2 = useAnimatedNumber(value2);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <motion.span
          className={`text-2xl font-bold ${
            showWinner && winner === 'left' ? 'text-gold-400' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
          animate={{ scale: showWinner && winner === 'left' ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {animatedValue1}
          {showWinner && winner === 'left' && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 text-sm"
            >
              {'\u2728'}
            </motion.span>
          )}
        </motion.span>

        <span className="text-white/60 text-sm uppercase tracking-wider">{stat}</span>

        <motion.span
          className={`text-2xl font-bold ${
            showWinner && winner === 'right' ? 'text-gold-400' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
          animate={{ scale: showWinner && winner === 'right' ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {showWinner && winner === 'right' && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mr-2 text-sm"
            >
              {'\u2728'}
            </motion.span>
          )}
          {animatedValue2}
        </motion.span>
      </div>

      <div className="flex gap-2 items-center">
        {/* Left Bar (reversed) */}
        <div className="flex-1 h-3 bg-night-600 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent1}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full float-right ${
              showWinner && winner === 'left'
                ? 'bg-gradient-to-l from-gold-400 to-gold-600 trophy-shine'
                : 'bg-gradient-to-l from-white/60 to-white/30'
            }`}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gold-500/30" />

        {/* Right Bar */}
        <div className="flex-1 h-3 bg-night-600 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent2}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${
              showWinner && winner === 'right'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 trophy-shine'
                : 'bg-gradient-to-r from-white/30 to-white/60'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// Radar Chart Component using SVG
function RadarChart({
  player1Stats,
  player2Stats,
  labels,
}: {
  player1Stats: number[];
  player2Stats: number[];
  labels: string[];
}) {
  const size = 240;
  const center = size / 2;
  const radius = 90;
  const levels = 4;

  const angleStep = (2 * Math.PI) / labels.length;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (value: number, index: number, maxValue: number = 100) => {
    const angle = startAngle + index * angleStep;
    const normalizedValue = Math.min(value / maxValue, 1);
    const distance = normalizedValue * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const createPath = (stats: number[], maxValues: number[]) => {
    return stats.map((stat, i) => {
      const point = getPoint(stat, i, maxValues[i]);
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
  };

  const maxValues = [120, 100, 200, 4, 100]; // Match STAT_CONFIG max values

  return (
    <motion.svg
      width={size}
      height={size}
      className="mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background levels */}
      {Array.from({ length: levels }).map((_, i) => {
        const levelRadius = (radius / levels) * (i + 1);
        const points = labels.map((_, j) => {
          const angle = startAngle + j * angleStep;
          return `${center + Math.cos(angle) * levelRadius},${center + Math.sin(angle) * levelRadius}`;
        }).join(' ');

        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {labels.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const endX = center + Math.cos(angle) * radius;
        const endY = center + Math.sin(angle) * radius;

        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={endX}
            y2={endY}
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="1"
          />
        );
      })}

      {/* Player 2 area (draw first so it's behind) */}
      <motion.path
        d={createPath(player2Stats, maxValues)}
        fill="rgba(220, 20, 60, 0.2)"
        stroke="rgba(220, 20, 60, 0.8)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Player 1 area */}
      <motion.path
        d={createPath(player1Stats, maxValues)}
        fill="rgba(212, 175, 55, 0.2)"
        stroke="rgba(212, 175, 55, 0.8)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Labels */}
      {labels.map((label, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = radius + 25;
        const x = center + Math.cos(angle) * labelRadius;
        const y = center + Math.sin(angle) * labelRadius;

        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/60 text-[10px] uppercase"
          >
            {label}
          </text>
        );
      })}

      {/* Data points */}
      {player1Stats.map((stat, i) => {
        const point = getPoint(stat, i, maxValues[i]);
        return (
          <motion.circle
            key={`p1-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#D4AF37"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        );
      })}
      {player2Stats.map((stat, i) => {
        const point = getPoint(stat, i, maxValues[i]);
        return (
          <motion.circle
            key={`p2-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#DC143C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          />
        );
      })}
    </motion.svg>
  );
}

// Player Card Component
function PlayerCard({
  legend,
  side,
  isWinner,
}: {
  legend: Legend | null;
  side: 'left' | 'right';
  isWinner: boolean;
}) {
  if (!legend) {
    return (
      <motion.div
        initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-8 text-center h-64 flex flex-col items-center justify-center"
      >
        <div className="w-24 h-24 rounded-full bg-night-600 border-2 border-dashed border-gold-500/30 flex items-center justify-center mb-4">
          <span className="text-4xl text-gold-500/30">?</span>
        </div>
        <p className="text-white/40">Select a legend</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={legend.id}
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative glass rounded-2xl overflow-hidden ${
        isWinner ? 'ring-2 ring-gold-500/50 glow-gold-sm' : ''
      }`}
    >
      {/* Gradient overlay based on team color */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${
            side === 'left' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(220, 20, 60, 0.3)'
          } 0%, transparent 60%)`,
        }}
      />

      {/* Winner badge */}
      <AnimatePresence>
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`absolute top-4 ${side === 'left' ? 'left-4' : 'right-4'} z-10`}
          >
            <div className="bg-gold-500 text-night-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 trophy-shine">
              <span>{'\uD83D\uDC51'}</span> Winner
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-6">
        {/* Jersey Number */}
        <div className={`absolute top-4 ${side === 'left' ? 'right-4' : 'left-4'}`}>
          <span
            className="text-6xl font-bold text-white/10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legend.jerseyNumber}
          </span>
        </div>

        {/* Player Image/Avatar */}
        <div className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative w-28 h-28 rounded-full overflow-hidden border-4 ${
              isWinner ? 'border-gold-500' : 'border-gold-500/30'
            } bg-gradient-to-br from-night-500 to-night-700`}
          >
            {legend.image ? (
              <img
                src={legend.image}
                alt={legend.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-4xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {legend.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Player Info */}
        <div className={`mt-4 ${side === 'right' ? 'text-right' : 'text-left'}`}>
          <h3
            className="text-2xl md:text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legend.name.toUpperCase()}
          </h3>

          <div className={`flex items-center gap-2 ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
            <Flag countryCode={legend.countryCode} size="md" />
            <span className="text-white/60">{legend.country}</span>
          </div>
        </div>

        {/* Era Badge */}
        <div className={`mt-4 ${side === 'right' ? 'text-right' : 'text-left'}`}>
          <span className="inline-block px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-xs uppercase tracking-wider">
            {legend.era}
          </span>
        </div>

        {/* Position & Team */}
        <div className={`mt-4 ${side === 'right' ? 'text-right' : 'text-left'}`}>
          <p className="text-white/50 text-sm">{legend.position}</p>
          <p className="text-white/70 text-sm font-medium">{legend.team}</p>
        </div>

        {/* World Cups */}
        <div className={`mt-4 flex items-center gap-1 ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
          {Array.from({ length: legend.worldCups }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-xl"
            >
              {'\uD83C\uDFC6'}
            </motion.span>
          ))}
          {legend.worldCups === 0 && (
            <span className="text-white/30 text-sm">No World Cup titles</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Main PlayerComparison Component
export default function PlayerComparison() {
  const [legends, setLegends] = useState<Legend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [player1, setPlayer1] = useState<Legend | null>(null);
  const [player2, setPlayer2] = useState<Legend | null>(null);
  const [showRadar, setShowRadar] = useState(false);

  useEffect(() => {
    async function fetchLegends() {
      const data = await getLegends();
      setLegends(data);
      setIsLoading(false);
      // Set default players if available
      if (data.length >= 2) {
        setPlayer1(data[0]);
        setPlayer2(data[1]);
      }
    }
    fetchLegends();
  }, []);

  const calculateTotalScore = (legend: Legend | null) => {
    if (!legend) return 0;
    return legend.goals + legend.assists + legend.appearances + (legend.worldCups * 50) + legend.rating;
  };

  const player1Score = calculateTotalScore(player1);
  const player2Score = calculateTotalScore(player2);
  const player1IsWinner = player1 && player2 && player1Score > player2Score;
  const player2IsWinner = player1 && player2 && player2Score > player1Score;

  const handleShare = async () => {
    if (!player1 || !player2) return;

    const shareText = `${player1.name} vs ${player2.name} - World Cup Legends Comparison\n\nWinner: ${
      player1Score > player2Score ? player1.name : player2Score > player1Score ? player2.name : "It's a tie!"
    }\n\nCompare legends at worldcuplegends.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'World Cup Legends Comparison',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Comparison copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-800" />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-700 via-night-800 to-night-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      {/* Stadium Light Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-crimson-light/5 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Head to Head</p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LEGEND <span className="text-gradient-gold">COMPARISON</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Compare the greatest players in World Cup history. Select two legends and see who comes out on top.
          </p>
        </motion.div>

        {/* Player Selection Dropdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-12"
        >
          <PlayerDropdown
            legends={legends}
            selectedLegend={player1}
            onSelect={setPlayer1}
            placeholder="Select first legend"
            side="left"
          />

          <div className="hidden md:block text-white/30 text-sm uppercase tracking-wider">vs</div>

          <PlayerDropdown
            legends={legends}
            selectedLegend={player2}
            onSelect={setPlayer2}
            placeholder="Select second legend"
            side="right"
          />
        </motion.div>

        {/* Main Comparison Area */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-stretch">
          {/* Player 1 Card */}
          <PlayerCard legend={player1} side="left" isWinner={player1IsWinner ?? false} />

          {/* VS Badge */}
          <div className="flex items-center justify-center py-4 md:py-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gold-500/30 rounded-full blur-xl animate-pulse" />

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center glow-gold"
              >
                <span
                  className="text-3xl md:text-4xl font-bold text-night-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  VS
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Player 2 Card */}
          <PlayerCard legend={player2} side="right" isWinner={player2IsWinner ?? false} />
        </div>

        {/* Stats Comparison */}
        {player1 && player2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 glass rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3
                className="text-xl md:text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                STATISTICS
              </h3>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowRadar(!showRadar)}
                  className="px-4 py-2 text-sm border border-gold-500/30 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  {showRadar ? 'Show Bars' : 'Show Radar'}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2 text-sm bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-lg hover:bg-gold-500/20 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gold-500" />
                <span className="text-white/70 text-sm">{player1.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-crimson-light" />
                <span className="text-white/70 text-sm">{player2.name}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showRadar ? (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <RadarChart
                    player1Stats={[player1.goals, player1.assists, player1.appearances, player1.worldCups, player1.rating]}
                    player2Stats={[player2.goals, player2.assists, player2.appearances, player2.worldCups, player2.rating]}
                    labels={['Goals', 'Assists', 'Apps', 'Cups', 'Rating']}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="bars"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {STAT_CONFIG.map((stat, index) => (
                    <motion.div
                      key={stat.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StatBar
                        stat={stat.label}
                        value1={player1[stat.key as keyof Legend] as number}
                        value2={player2[stat.key as keyof Legend] as number}
                        maxValue={stat.max}
                        showWinner={true}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Total Score */}
            <div className="mt-8 pt-6 border-t border-gold-500/20">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <motion.p
                    key={player1Score}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl md:text-5xl font-bold ${
                      player1IsWinner ? 'text-gold-400' : 'text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {player1Score}
                  </motion.p>
                  <p className="text-white/50 text-sm mt-1">Total Score</p>
                </div>

                <div className="px-8">
                  <span className="text-white/30 text-lg uppercase tracking-wider">vs</span>
                </div>

                <div className="text-center flex-1">
                  <motion.p
                    key={player2Score}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl md:text-5xl font-bold ${
                      player2IsWinner ? 'text-gold-400' : 'text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {player2Score}
                  </motion.p>
                  <p className="text-white/50 text-sm mt-1">Total Score</p>
                </div>
              </div>

              {/* Winner announcement */}
              {player1Score !== player2Score && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-6"
                >
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/30 rounded-full">
                    <span className="text-2xl">{'\uD83C\uDFC6'}</span>
                    <span className="text-gold-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                      {player1Score > player2Score ? player1.name.toUpperCase() : player2.name.toUpperCase()} WINS!
                    </span>
                    <span className="text-2xl">{'\uD83C\uDFC6'}</span>
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
