'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePredictions, AVAILABLE_BADGES } from '@/context/PredictionContext';

// Medal icons for top 3
const MEDALS = ['🥇', '🥈', '🥉'];

// Rank change indicator
function RankChange({ change }: { change: number }) {
  if (change === 0) return null;

  return (
    <motion.span
      initial={{ opacity: 0, y: change > 0 ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-xs font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}
    >
      {change > 0 ? `+${change}` : change}
    </motion.span>
  );
}

// Points system explanation
function PointsSystem() {
  const rules = [
    { label: 'Exact Score', points: 10, icon: '🎯', description: 'Predict the exact final score' },
    { label: 'Winner + Difference', points: 5, icon: '📊', description: 'Correct winner with exact goal difference' },
    { label: 'Correct Winner', points: 3, icon: '✓', description: 'Predict the winning team' },
    { label: 'Correct Draw', points: 3, icon: '🤝', description: 'Predict a draw when match ends in draw' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 bg-white/5 rounded-xl"
    >
      <h4 className="text-sm text-gold-400 uppercase tracking-wider mb-3">Scoring System</h4>
      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{rule.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{rule.label}</p>
                <p className="text-white/40 text-xs">{rule.description}</p>
              </div>
            </div>
            <span className="text-gold-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              +{rule.points}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// User stats card
function UserStatsCard() {
  const { stats, username, setUsername } = usePredictions();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleSave = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-gold rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
              className="bg-white/10 border border-gold-500/30 rounded-lg px-3 py-1 text-white flex-1"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-gold-500 text-night-900 rounded-lg text-sm font-bold"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {username}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gold-400 hover:text-gold-300 transition-colors"
              aria-label="Edit username"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
        <div className="text-right">
          <span className="text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.totalPoints}
          </span>
          <p className="text-xs text-white/60">Total Points</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.totalPredictions}
          </span>
          <p className="text-xs text-white/40">Predictions</p>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <span className="text-lg font-bold text-green-400" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.exactScores}
          </span>
          <p className="text-xs text-white/40">Exact</p>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <span className="text-lg font-bold text-blue-400" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.correctWinners + stats.correctDraws}
          </span>
          <p className="text-xs text-white/40">Correct</p>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <span className="text-lg font-bold text-orange-400" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.currentStreak}
          </span>
          <p className="text-xs text-white/40">Streak</p>
        </div>
      </div>
    </motion.div>
  );
}

// Badges display
function BadgesSection() {
  const { stats } = usePredictions();
  const [showAll, setShowAll] = useState(false);

  const unlockedBadges = stats.badges;
  const lockedBadges = AVAILABLE_BADGES.filter(b => !unlockedBadges.find(ub => ub.id === b.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Achievements
        </h3>
        <span className="text-sm text-gold-400">
          {unlockedBadges.length}/{AVAILABLE_BADGES.length}
        </span>
      </div>

      {/* Unlocked badges */}
      {unlockedBadges.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {unlockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="relative group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-2xl shadow-lg glow-gold-sm cursor-pointer">
                {badge.icon}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-night-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                <p className="text-white text-sm font-bold">{badge.name}</p>
                <p className="text-white/60 text-xs">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-sm mb-4">Make predictions to unlock achievements!</p>
      )}

      {/* Show/hide locked badges */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="text-gold-400 text-sm hover:text-gold-300 transition-colors"
      >
        {showAll ? 'Hide locked badges' : 'Show all badges'}
      </button>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-wrap gap-2">
              {lockedBadges.map((badge) => (
                <div key={badge.id} className="relative group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl opacity-40 cursor-pointer">
                    {badge.icon}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-night-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                    <p className="text-white text-sm font-bold">{badge.name}</p>
                    <p className="text-white/60 text-xs">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Leaderboard entry row
function LeaderboardRow({
  entry,
  index,
  isExpanded,
  onToggle,
}: {
  entry: {
    rank: number;
    username: string;
    totalPoints: number;
    predictions: number;
    exactScores: number;
    streak: number;
    isCurrentUser: boolean;
  };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isTopThree = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <motion.div
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        className={`relative p-4 rounded-xl cursor-pointer transition-all ${
          entry.isCurrentUser
            ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30'
            : isTopThree
              ? 'bg-white/5 hover:bg-white/10'
              : 'hover:bg-white/5'
        }`}
      >
        {/* Current user indicator */}
        {entry.isCurrentUser && (
          <motion.div
            layoutId="current-user-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 rounded-l-xl"
          />
        )}

        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="w-10 text-center">
            {isTopThree ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: index * 0.1 }}
                className="text-2xl"
              >
                {MEDALS[entry.rank - 1]}
              </motion.span>
            ) : (
              <span className="text-lg text-white/60" style={{ fontFamily: 'var(--font-display)' }}>
                #{entry.rank}
              </span>
            )}
          </div>

          {/* Avatar & Name */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
              entry.isCurrentUser
                ? 'bg-gold-500 text-night-900'
                : 'bg-white/10 text-white'
            }`}>
              {entry.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-bold ${entry.isCurrentUser ? 'text-gold-400' : 'text-white'}`}>
                {entry.username}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs bg-gold-500/20 px-2 py-0.5 rounded-full">You</span>
                )}
              </p>
              <p className="text-xs text-white/40">
                {entry.predictions} predictions
              </p>
            </div>
          </div>

          {/* Points */}
          <div className="text-right">
            <motion.span
              key={entry.totalPoints}
              initial={{ scale: 1.2, color: '#F5C542' }}
              animate={{ scale: 1, color: entry.isCurrentUser ? '#F5C542' : '#ffffff' }}
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {entry.totalPoints}
            </motion.span>
            <p className="text-xs text-white/40">pts</p>
          </div>

          {/* Expand indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-white/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <span className="text-green-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {entry.exactScores}
                  </span>
                  <p className="text-xs text-white/40">Exact Scores</p>
                </div>
                <div className="text-center">
                  <span className="text-orange-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {entry.streak}
                  </span>
                  <p className="text-xs text-white/40">Current Streak</p>
                </div>
                <div className="text-center">
                  <span className="text-blue-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {entry.predictions > 0 ? (entry.totalPoints / entry.predictions).toFixed(1) : '0.0'}
                  </span>
                  <p className="text-xs text-white/40">Avg Points</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function PredictionLeaderboard() {
  const { leaderboard } = usePredictions();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showPointsSystem, setShowPointsSystem] = useState(false);

  return (
    <div className="space-y-6">
      {/* User stats */}
      <UserStatsCard />

      {/* Badges */}
      <BadgesSection />

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Top Predictors
          </h3>
          <button
            onClick={() => setShowPointsSystem(!showPointsSystem)}
            className="text-gold-400 text-sm hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works
          </button>
        </div>

        {/* Points system toggle */}
        <AnimatePresence>
          {showPointsSystem && <PointsSystem />}
        </AnimatePresence>

        {/* Leaderboard list */}
        <div className="space-y-2 mt-4">
          {leaderboard.map((entry, index) => (
            <LeaderboardRow
              key={`${entry.username}-${entry.rank}`}
              entry={entry}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Empty state */}
        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <img src="/legends-cup.png" alt="World Legends Cup Trophy" className="h-12 w-auto mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">No Rankings Yet</h4>
            <p className="text-white/60 text-sm">Be the first to make predictions!</p>
          </div>
        )}
      </motion.div>

      {/* Streak bonus info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-4 flex items-center gap-4"
      >
        <div className="text-3xl">🔥</div>
        <div className="flex-1">
          <h4 className="text-white font-bold">Build Your Streak!</h4>
          <p className="text-white/60 text-sm">
            Unlock special badges by making consecutive correct predictions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
