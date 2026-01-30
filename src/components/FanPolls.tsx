'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { usePoll, PollCategory, Poll, PollOption } from '@/context/PollContext';
import Image from 'next/image';

// Category configuration
const categories: { id: PollCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Polls', icon: '🗳️' },
  { id: 'greatest-legend', label: 'Greatest Legend', icon: '⭐' },
  { id: 'best-goal', label: 'Best Goal', icon: '⚽' },
  { id: 'best-match', label: 'Best Match', icon: '🏟️' },
  { id: 'mvp', label: 'MVP', icon: '🏆' },
  { id: 'best-celebration', label: 'Celebrations', icon: '🎉' },
  { id: 'iconic-moment', label: 'Iconic Moments', icon: '📸' },
];

// Confetti particle component
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#F5C542', '#D4AF37', '#FFD966', '#ffffff', '#009739', '#75AADB'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{ y: -20, x, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: 400,
        x: x + (Math.random() - 0.5) * 200,
        opacity: 0,
        rotate: Math.random() * 720 - 360,
        scale: 0.5,
      }}
      transition={{ duration: 2 + Math.random(), delay, ease: 'easeOut' }}
      className="absolute top-0 w-3 h-3 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
}

// Confetti explosion component
function ConfettiExplosion({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={Math.random() * 0.5}
          x={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)}
        />
      ))}
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (endValue - startValue) * easeOutQuart);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// Countdown timer component
function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endsAt).getTime() - Date.now();

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="text-sm">Poll Ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <div className="flex gap-2 text-sm">
        {timeLeft.days > 0 && (
          <span className="text-gold-400 font-bold">{timeLeft.days}d</span>
        )}
        <span className="text-white/70">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// Progress bar with animation
function AnimatedProgressBar({
  percentage,
  isLeading,
  isVoted,
  delay = 0,
}: {
  percentage: number;
  isLeading: boolean;
  isVoted: boolean;
  delay?: number;
}) {
  return (
    <div className="relative h-2 bg-night-600 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className={`absolute inset-y-0 left-0 rounded-full ${
          isLeading
            ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500'
            : isVoted
              ? 'bg-gradient-to-r from-green-500 to-green-400'
              : 'bg-gradient-to-r from-white/30 to-white/20'
        }`}
      />
      {isLeading && (
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ width: '50%' }}
        />
      )}
    </div>
  );
}

// Poll option card with flip animation
function PollOptionCard({
  option,
  pollId,
  isSelected,
  hasVoted,
  percentage,
  isLeading,
  voteCount,
  onVote,
  index,
}: {
  option: PollOption;
  pollId: string;
  isSelected: boolean;
  hasVoted: boolean;
  percentage: number;
  isLeading: boolean;
  voteCount: number;
  onVote: () => void;
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Flip card when vote is cast
  useEffect(() => {
    if (hasVoted && isSelected) {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 600);
    }
  }, [hasVoted, isSelected]);

  const handleClick = () => {
    if (!hasVoted) {
      onVote();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative perspective-1000"
    >
      <motion.button
        onClick={handleClick}
        disabled={hasVoted}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isHovered && !hasVoted ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        className={`relative w-full p-4 rounded-xl border transition-all duration-300 text-left ${
          hasVoted
            ? isSelected
              ? 'border-gold-500/50 bg-gold-500/10'
              : 'border-white/10 bg-night-700/50'
            : 'border-white/10 bg-night-700/50 hover:border-gold-500/30 hover:bg-night-600/50 cursor-pointer'
        } ${isLeading && hasVoted ? 'ring-2 ring-gold-500/30' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Leading indicator pulse */}
        {isLeading && hasVoted && (
          <motion.div
            className="absolute -inset-px rounded-xl border-2 border-gold-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Hover glow effect */}
        {!hasVoted && (
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-gold-500/20 blur-lg opacity-0 transition-opacity"
            style={{ opacity: isHovered ? 0.5 : 0 }}
          />
        )}

        <div className="relative flex items-center gap-4">
          {/* Option image or flag */}
          {option.image ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-night-600 flex-shrink-0">
              <Image
                src={option.image}
                alt={option.label}
                fill
                className="object-cover"
              />
              {option.countryCode && (
                <div className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center bg-night-800/80 rounded-tl-lg">
                  <FlagImage countryCode={option.countryCode} size="sm" />
                </div>
              )}
            </div>
          ) : option.countryCode ? (
            <div className="w-16 h-16 rounded-lg bg-night-600 flex items-center justify-center flex-shrink-0">
              <FlagImage countryCode={option.countryCode} size="lg" />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {option.label}
              </h4>
              {isSelected && hasVoted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-gold-400 text-lg"
                >
                  ✓
                </motion.span>
              )}
            </div>
            {option.description && (
              <p className="text-white/50 text-sm truncate">{option.description}</p>
            )}

            {/* Results section - only show after voting */}
            {hasVoted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-3 space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-bold ${isLeading ? 'text-gold-400' : 'text-white/70'}`}>
                    {percentage}%
                  </span>
                  <span className="text-white/50">
                    <AnimatedCounter value={voteCount} /> votes
                  </span>
                </div>
                <AnimatedProgressBar
                  percentage={percentage}
                  isLeading={isLeading}
                  isVoted={isSelected}
                  delay={index * 0.1}
                />
              </motion.div>
            )}
          </div>

          {/* Vote indicator circle */}
          {!hasVoted && (
            <div className="w-6 h-6 rounded-full border-2 border-white/30 flex-shrink-0 transition-colors hover:border-gold-400" />
          )}
        </div>
      </motion.button>
    </motion.div>
  );
}

// Get flag image from country code
function FlagImage({ countryCode, size = 'md' }: { countryCode: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-3', md: 'w-6 h-4', lg: 'w-10 h-7' };
  const widthMap = { sm: 20, md: 40, lg: 80 };
  return (
    <img
      src={`https://flagcdn.com/w${widthMap[size]}/${countryCode.toLowerCase()}.png`}
      alt={`${countryCode} flag`}
      className={`${sizeMap[size]} object-cover rounded-sm`}
    />
  );
}

// Single poll card component
function PollCard({ poll, isFeatured = false }: { poll: Poll; isFeatured?: boolean }) {
  const { hasVoted, getUserVote, castVote, getVotePercentage, getLeadingOption, shareResult } = usePoll();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const pollHasVote = hasVoted(poll.id);
  const userVote = getUserVote(poll.id);
  const leadingOption = getLeadingOption(poll.id);

  const handleVote = async (optionId: string) => {
    if (pollHasVote || isVoting) return;

    setIsVoting(true);
    try {
      await castVote(poll.id, optionId);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative rounded-2xl overflow-hidden ${
        isFeatured
          ? 'glass-gold border-gold-500/30'
          : 'glass border-white/10'
      }`}
    >
      {/* Confetti explosion */}
      <ConfettiExplosion isActive={showConfetti} />

      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full text-night-900 text-xs font-bold flex items-center gap-1"
          >
            <span>⭐</span>
            <span>FEATURED</span>
          </motion.div>
        </div>
      )}

      <div className="p-6">
        {/* Poll header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">
              {categories.find((c) => c.id === poll.category)?.icon || '🗳️'}
            </span>
            <span className="text-gold-400/70 text-sm tracking-wider uppercase">
              {categories.find((c) => c.id === poll.category)?.label || 'Poll'}
            </span>
          </div>

          <h3
            className={`font-bold text-white mb-4 ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {poll.question}
          </h3>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <CountdownTimer endsAt={poll.endsAt} />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span>🗳️</span>
              <span>
                <AnimatedCounter value={poll.totalVotes} /> total votes
              </span>
            </div>
          </div>
        </div>

        {/* Poll options */}
        <div className={`grid gap-3 ${isFeatured ? 'md:grid-cols-2' : ''}`}>
          {poll.options.map((option, index) => (
            <PollOptionCard
              key={option.id}
              option={option}
              pollId={poll.id}
              isSelected={userVote === option.id}
              hasVoted={pollHasVote}
              percentage={getVotePercentage(poll.id, option.id)}
              isLeading={leadingOption === option.id}
              voteCount={poll.votes[option.id] || 0}
              onVote={() => handleVote(option.id)}
              index={index}
            />
          ))}
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {isVoting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-night-900/50 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-vote actions */}
        {pollHasVote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"
          >
            <p className="text-white/50 text-sm">
              Thanks for voting! Share with friends.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => shareResult(poll.id)}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-400 text-sm font-medium hover:bg-gold-500/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Category filter tabs
function CategoryTabs() {
  const { selectedCategory, setSelectedCategory } = usePoll();
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mb-8 -mx-6 px-6">
      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'text-night-900'
                : 'text-white/70 hover:text-white bg-night-700/50 border border-white/10'
            }`}
          >
            {selectedCategory === category.id && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.icon}</span>
            <span className="relative z-10">{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute right-6 top-0 bottom-2 w-12 bg-gradient-to-l from-night-700 to-transparent pointer-events-none" />
    </div>
  );
}

// Main FanPolls component
export default function FanPolls() {
  const { featuredPoll, getFilteredPolls, isLoading } = usePoll();
  const filteredPolls = getFilteredPolls();
  const nonFeaturedPolls = filteredPolls.filter((p) => !p.isFeatured);

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-night-700 rounded-lg w-1/3" />
            <div className="h-96 bg-night-700 rounded-2xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-night-700 rounded-2xl" />
              <div className="h-64 bg-night-700 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-night-700 via-night-800 to-night-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px]" />
      <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6"
          >
            <span className="text-xl">🗳️</span>
            <span className="text-gold-400 text-sm tracking-wider uppercase font-medium">
              Fan Polls
            </span>
          </motion.div>

          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            HAVE YOUR <span className="text-gradient-gold">SAY</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Vote on the greatest legends, iconic moments, and unforgettable matches.
            Your voice shapes World Cup history.
          </p>
        </motion.div>

        {/* Category tabs */}
        <CategoryTabs />

        {/* Featured poll */}
        {featuredPoll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <PollCard poll={featuredPoll} isFeatured />
          </motion.div>
        )}

        {/* Other polls grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {nonFeaturedPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredPolls.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              No Polls Available
            </h3>
            <p className="text-white/50">
              Check back soon for new polls in this category.
            </p>
          </motion.div>
        )}

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active Polls', value: filteredPolls.length, icon: '🗳️' },
            { label: 'Total Votes', value: filteredPolls.reduce((sum, p) => sum + p.totalVotes, 0), icon: '📊' },
            { label: 'Categories', value: 6, icon: '📁' },
            { label: 'Legends Featured', value: 15, icon: '⭐' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-white/10 bg-night-700/30 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/50 mb-4">Want to see more polls? Follow us on social media!</p>
          <div className="flex justify-center gap-4">
            {['twitter', 'instagram', 'facebook'].map((social) => (
              <motion.a
                key={social}
                href={`#${social}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-night-600 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
              >
                {social === 'twitter' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social === 'instagram' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
                {social === 'facebook' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
