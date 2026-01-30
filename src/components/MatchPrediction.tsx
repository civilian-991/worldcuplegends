'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flag from '@/components/Flag';
import { Match } from '@/lib/api';
import { usePredictions } from '@/context/PredictionContext';

interface MatchPredictionProps {
  match: Match;
  onPredictionSubmit?: () => void;
}

// Confetti particle component
function Confetti() {
  const colors = ['#F5C542', '#D4AF37', '#FFD966', '#B8962E', '#FFF0BF'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}%`, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
}

// Score input component with +/- buttons
function ScoreInput({
  value,
  onChange,
  disabled,
  teamName,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  teamName: string;
}) {
  const increment = () => {
    if (value < 10 && !disabled) onChange(value + 1);
  };

  const decrement = () => {
    if (value > 0 && !disabled) onChange(value - 1);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={increment}
        disabled={disabled || value >= 10}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
          ${disabled || value >= 10
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
          }`}
        aria-label={`Increase ${teamName} score`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>

      <motion.div
        key={value}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <span
          className="text-5xl font-bold text-white tabular-nums"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </span>
        <motion.div
          className="absolute inset-0 bg-gold-500/20 rounded-lg -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <motion.button
        onClick={decrement}
        disabled={disabled || value <= 0}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
          ${disabled || value <= 0
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
          }`}
        aria-label={`Decrease ${teamName} score`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
    </div>
  );
}

// Countdown timer with circular progress
function DeadlineCountdown({ timeRemaining }: { timeRemaining: number }) {
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Calculate progress (assuming max 48 hours = 172800000ms)
  const maxTime = 48 * 60 * 60 * 1000;
  const progress = Math.min(timeRemaining / maxTime, 1);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  const isUrgent = hours < 1;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isUrgent ? '#DC143C' : '#D4AF37'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xs uppercase tracking-wider ${isUrgent ? 'text-red-400' : 'text-gold-400'}`}>
            {isUrgent ? 'Hurry!' : 'Deadline'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 text-center">
        <div className="glass-gold px-3 py-2 rounded-lg min-w-[50px]">
          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {hours.toString().padStart(2, '0')}
          </span>
          <p className="text-xs text-white/60">hrs</p>
        </div>
        <span className="text-2xl text-gold-400 self-center">:</span>
        <div className="glass-gold px-3 py-2 rounded-lg min-w-[50px]">
          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {minutes.toString().padStart(2, '0')}
          </span>
          <p className="text-xs text-white/60">min</p>
        </div>
        <span className="text-2xl text-gold-400 self-center">:</span>
        <div className="glass-gold px-3 py-2 rounded-lg min-w-[50px]">
          <motion.span
            key={seconds}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {seconds.toString().padStart(2, '0')}
          </motion.span>
          <p className="text-xs text-white/60">sec</p>
        </div>
      </div>
    </div>
  );
}

// Community predictions display
function CommunityPredictions({ matchId }: { matchId: number }) {
  const { getCommunityPredictions } = usePredictions();
  const { avgHome, avgAway, total } = getCommunityPredictions(matchId);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 pt-6 border-t border-white/10"
    >
      <h4 className="text-sm text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Community Predictions ({total} users)
      </h4>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Avg Home</p>
          <span className="text-2xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
            {avgHome.toFixed(1)}
          </span>
        </div>

        <div className="flex-1 mx-6">
          {/* Prediction distribution bar */}
          <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(avgHome / (avgHome + avgAway)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-gold-500 to-gold-400"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(avgAway / (avgHome + avgAway)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="bg-gradient-to-r from-white/40 to-white/30"
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/40">{Math.round((avgHome / (avgHome + avgAway)) * 100)}%</span>
            <span className="text-xs text-white/40">{Math.round((avgAway / (avgHome + avgAway)) * 100)}%</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Avg Away</p>
          <span className="text-2xl font-bold text-white/80" style={{ fontFamily: 'var(--font-display)' }}>
            {avgAway.toFixed(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Lock animation when deadline passes
function LockedOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-night-900/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center rounded-2xl"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-4"
      >
        <svg className="w-16 h-16 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Predictions Locked
      </h3>
      <p className="text-white/60 text-sm text-center max-w-xs">
        Match is about to start. Predictions are now closed.
      </p>
    </motion.div>
  );
}

export default function MatchPrediction({ match, onPredictionSubmit }: MatchPredictionProps) {
  const {
    getPrediction,
    hasPredicted,
    canPredict,
    addPrediction,
    getTimeUntilDeadline,
  } = usePredictions();

  const existingPrediction = getPrediction(match.id);
  const [homeScore, setHomeScore] = useState(existingPrediction?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(existingPrediction?.awayScore ?? 0);
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilDeadline(match));
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(hasPredicted(match.id));

  const isLocked = !canPredict(match);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilDeadline(match));
    }, 1000);

    return () => clearInterval(interval);
  }, [match, getTimeUntilDeadline]);

  // Handle prediction submission
  const handleSubmit = useCallback(() => {
    if (isLocked || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      addPrediction(match.id, homeScore, awayScore);
      setShowConfetti(true);
      setHasSubmitted(true);
      setIsSubmitting(false);
      onPredictionSubmit?.();

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2500);
    }, 500);
  }, [match.id, homeScore, awayScore, isLocked, isSubmitting, addPrediction, onPredictionSubmit]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Main card */}
      <div className="relative glass rounded-2xl overflow-hidden">
        {/* Stadium background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/stadium-pattern.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Locked overlay */}
        <AnimatePresence>
          {isLocked && <LockedOverlay />}
        </AnimatePresence>

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-400 text-xs font-medium rounded-full mb-2">
                {match.stage}
              </span>
              <p className="text-white/60 text-sm">
                {formatDate(match.matchDate)} • {match.matchTime}
              </p>
            </div>

            {!isLocked && (
              <DeadlineCountdown timeRemaining={timeRemaining} />
            )}
          </div>

          {/* Teams and Score Input */}
          <div className="flex items-center justify-between gap-4 md:gap-8 py-6">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block mb-4"
              >
                {match.homeCountryCode === 'TBD' ? (
                  <span className="text-6xl">🏆</span>
                ) : (
                  <Flag countryCode={match.homeCountryCode} size="xl" className="w-16 h-12" />
                )}
              </motion.div>
              <h3
                className="text-lg md:text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {match.homeTeam}
              </h3>
              <ScoreInput
                value={homeScore}
                onChange={setHomeScore}
                disabled={isLocked}
                teamName={match.homeTeam}
              />
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
              <span
                className="text-2xl text-gold-400 py-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VS
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block mb-4"
              >
                {match.awayCountryCode === 'TBD' ? (
                  <span className="text-6xl">🏆</span>
                ) : (
                  <Flag countryCode={match.awayCountryCode} size="xl" className="w-16 h-12" />
                )}
              </motion.div>
              <h3
                className="text-lg md:text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {match.awayTeam}
              </h3>
              <ScoreInput
                value={awayScore}
                onChange={setAwayScore}
                disabled={isLocked}
                teamName={match.awayTeam}
              />
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{match.venue}</span>
          </div>

          {/* Points info */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: 'Exact', points: 10 },
              { label: 'Diff', points: 5 },
              { label: 'Winner', points: 3 },
              { label: 'Draw', points: 3 },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 bg-white/5 rounded-lg">
                <span className="text-gold-400 text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  +{item.points}
                </span>
                <p className="text-white/40 text-xs">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={handleSubmit}
              disabled={isLocked || isSubmitting}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all relative overflow-hidden
                ${isLocked
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : hasSubmitted
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 glow-gold'
                }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-night-900/30 border-t-night-900 rounded-full"
                  />
                  Submitting...
                </span>
              ) : hasSubmitted ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prediction Saved
                </span>
              ) : (
                'Submit Prediction'
              )}
            </motion.button>

            <motion.button
              onClick={() => setShowCommunity(!showCommunity)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-6 rounded-xl font-bold text-lg border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-all"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showCommunity ? 'Hide' : 'Stats'}
              </span>
            </motion.button>
          </div>

          {/* Community predictions */}
          <AnimatePresence>
            {showCommunity && <CommunityPredictions matchId={match.id} />}
          </AnimatePresence>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </div>
    </motion.div>
  );
}
