'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { type VideoData } from './VideoPlayer';

// Demo highlight clips for legends
const DEMO_LEGEND_HIGHLIGHTS: Record<string, VideoData[]> = {
  'Pelé': [
    { id: 'qjp1Zrvn8VQ', type: 'youtube', title: 'World Cup 1970 Final Goal', duration: '1:23', category: 'iconic-goals', legend: 'Pelé', team: 'Brazil' },
    { id: 'dQw4w9WgXcQ', type: 'youtube', title: 'Bicycle Kick vs Belgium', duration: '0:45', category: 'iconic-goals', legend: 'Pelé', team: 'Brazil' },
    { id: 'L0MK7qz13bU', type: 'youtube', title: 'Dribbling Masterclass', duration: '2:15', category: 'highlights', legend: 'Pelé', team: 'Brazil' },
    { id: 'hD3eqUvPmpU', type: 'youtube', title: 'Best Assists Compilation', duration: '3:42', category: 'highlights', legend: 'Pelé', team: 'Brazil' },
  ],
  'Diego Maradona': [
    { id: 'hD3eqUvPmpU', type: 'youtube', title: 'Goal of the Century', duration: '1:15', category: 'iconic-goals', legend: 'Diego Maradona', team: 'Argentina' },
    { id: 'xWvzYmF48sg', type: 'youtube', title: 'Hand of God', duration: '0:58', category: 'iconic-goals', legend: 'Diego Maradona', team: 'Argentina' },
    { id: 'qjp1Zrvn8VQ', type: 'youtube', title: '1986 World Cup Highlights', duration: '5:30', category: 'highlights', legend: 'Diego Maradona', team: 'Argentina' },
    { id: 'OYa5aQb3YGE', type: 'youtube', title: 'Skill Moves Collection', duration: '4:12', category: 'highlights', legend: 'Diego Maradona', team: 'Argentina' },
  ],
  'Zinedine Zidane': [
    { id: 'L0MK7qz13bU', type: 'youtube', title: 'Champions League Volley', duration: '0:52', category: 'iconic-goals', legend: 'Zinedine Zidane', team: 'France' },
    { id: 'RM7ljs8LiKQ', type: 'youtube', title: 'World Cup 1998 Final', duration: '3:20', category: 'highlights', legend: 'Zinedine Zidane', team: 'France' },
    { id: 'GG-jMjvnua8', type: 'youtube', title: 'The Pirouette Master', duration: '2:45', category: 'highlights', legend: 'Zinedine Zidane', team: 'France' },
    { id: 'Rq_pLdLN0rk', type: 'youtube', title: 'Best Dribbles', duration: '4:10', category: 'highlights', legend: 'Zinedine Zidane', team: 'France' },
  ],
  'default': [
    { id: 'dQw4w9WgXcQ', type: 'youtube', title: 'Greatest Moments', duration: '5:00', category: 'highlights', legend: 'Legend', team: 'Team' },
    { id: 'hD3eqUvPmpU', type: 'youtube', title: 'Iconic Goals', duration: '3:30', category: 'iconic-goals', legend: 'Legend', team: 'Team' },
    { id: 'L0MK7qz13bU', type: 'youtube', title: 'Career Highlights', duration: '8:45', category: 'highlights', legend: 'Legend', team: 'Team' },
    { id: 'qjp1Zrvn8VQ', type: 'youtube', title: 'Skills & Tricks', duration: '4:20', category: 'highlights', legend: 'Legend', team: 'Team' },
  ],
};

interface LegendHighlightsProps {
  legendName: string;
  legendTeam?: string;
  highlights?: VideoData[];
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  className?: string;
}

export default function LegendHighlights({
  legendName,
  legendTeam,
  highlights,
  autoAdvance = true,
  autoAdvanceInterval = 5000,
  className = '',
}: LegendHighlightsProps) {
  const videos = highlights || DEMO_LEGEND_HIGHLIGHTS[legendName] || DEMO_LEGEND_HIGHLIGHTS['default'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const currentVideo = videos[currentIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!autoAdvance || isPaused || isPlaying) return;

    const startProgress = () => {
      const stepInterval = autoAdvanceInterval / 100;
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentIndex((idx) => (idx + 1) % videos.length);
            return 0;
          }
          return prev + 1;
        });
      }, stepInterval);
    };

    startProgress();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [autoAdvance, autoAdvanceInterval, isPaused, isPlaying, videos.length, currentIndex]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(true);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setProgress(0);
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setProgress(0);
  }, [videos.length]);

  const getThumbnail = (video: VideoData) => {
    return video.type === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
      : `https://vumbnail.com/${video.id}.jpg`;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={handlePauseToggle}
      onMouseLeave={() => !isPlaying && setIsPaused(false)}
      className={`relative ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-1">
            Career Highlights
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {legendName.toUpperCase()} <span className="text-gold-400">MOMENTS</span>
          </h3>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            className="w-10 h-10 rounded-full bg-night-600/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            aria-label="Previous highlight"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            className="w-10 h-10 rounded-full bg-night-600/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            aria-label="Next highlight"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Main Carousel */}
      <div className="relative glass rounded-2xl overflow-hidden">
        {/* Current Video Display */}
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {/* Thumbnail */}
              <img
                src={getThumbnail(currentVideo)}
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-night-900/60 via-transparent to-night-900/60" />
            </motion.div>
          </AnimatePresence>

          {/* Play Button */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.button
                  onClick={handlePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                  aria-label={`Play ${currentVideo.title}`}
                >
                  {/* Pulse Animation */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gold-500/30"
                    style={{ margin: '-16px' }}
                  />

                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-shadow">
                    <svg
                      className="w-7 h-7 md:w-8 md:h-8 text-night-900 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Embed */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                  title={currentVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleCloseVideo}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-night-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:text-gold-400 transition-colors z-10"
                  aria-label="Close video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {currentVideo.category && (
                <span className="inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full">
                  {currentVideo.category.replace('-', ' ')}
                </span>
              )}
              <h4
                className="text-xl md:text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {currentVideo.title}
              </h4>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/50">
                {currentVideo.duration && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentVideo.duration}
                  </span>
                )}
                {legendTeam && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    {legendTeam}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          {autoAdvance && !isPlaying && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-night-800/50">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="p-3 md:p-4 bg-night-800/50 border-t border-white/5">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
            {videos.map((video, index) => (
              <motion.button
                key={`${video.id}-${index}`}
                onClick={() => handleSelect(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-24 md:w-28 aspect-video rounded-lg overflow-hidden ${
                  index === currentIndex ? 'ring-2 ring-gold-500' : 'opacity-60 hover:opacity-100'
                } transition-all duration-300`}
              >
                <img
                  src={getThumbnail(video)}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-night-900/30 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-3 h-3 text-night-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Current indicator */}
                {index === currentIndex && (
                  <motion.div
                    layoutId="highlight-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                  />
                )}

                {/* Duration */}
                {video.duration && (
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-night-900/80 text-white text-[10px] rounded">
                    {video.duration}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Pause/Play Indicator */}
        <AnimatePresence>
          {isPaused && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-night-800/80 backdrop-blur-sm rounded-full text-white/70 text-xs"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Paused
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gold-400 w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to highlight ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Mini version for cards/previews
export function LegendHighlightsMini({
  legendName,
  highlights,
  onViewAll,
}: {
  legendName: string;
  highlights?: VideoData[];
  onViewAll?: () => void;
}) {
  const videos = highlights || DEMO_LEGEND_HIGHLIGHTS[legendName]?.slice(0, 2) || DEMO_LEGEND_HIGHLIGHTS['default'].slice(0, 2);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const getThumbnail = (video: VideoData) => {
    return video.type === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
      : `https://vumbnail.com/${video.id}.jpg`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm font-semibold">Highlights</p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-gold-400 text-xs hover:text-gold-300 transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {videos.map((video, index) => (
          <motion.div
            key={`${video.id}-${index}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsPlaying(index)}
            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
          >
            <img
              src={getThumbnail(video)}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-night-900/40 flex items-center justify-center group-hover:bg-night-900/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gold-500/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-night-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-night-900/80 text-white text-[10px] rounded">
              {video.duration}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsPlaying(null)}
          >
            <div className="absolute inset-0 bg-night-900/95" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-2xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videos[isPlaying].id}?autoplay=1`}
                title={videos[isPlaying].title}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlaying(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2"
              >
                Press ESC to close
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
