'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

export interface VideoData {
  id: string;
  type: 'youtube' | 'vimeo';
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  legend?: string;
  team?: string;
  era?: string;
  category?: 'highlights' | 'interviews' | 'iconic-goals' | 'documentaries';
}

interface VideoPlayerProps {
  video: VideoData;
  autoPlay?: boolean;
  showInfo?: boolean;
  onPlay?: () => void;
  onClose?: () => void;
  className?: string;
}

// Generate YouTube thumbnail URL
const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres') => {
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

// Generate Vimeo thumbnail (requires API call in production, using placeholder)
const getVimeoThumbnail = (videoId: string) => {
  return `https://vumbnail.com/${videoId}.jpg`;
};

export default function VideoPlayer({
  video,
  autoPlay = false,
  showInfo = true,
  onPlay,
  onClose,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const thumbnail = video.thumbnail ||
    (video.type === 'youtube' ? getYouTubeThumbnail(video.id) : getVimeoThumbnail(video.id));

  // YouTube privacy-enhanced mode with minimal branding
  // - youtube-nocookie.com: Privacy-enhanced mode, no tracking cookies
  // - modestbranding=1: Minimal YouTube logo
  // - rel=0: Don't show related videos from other channels
  // - showinfo=0: Hide video title and uploader (deprecated but still works partially)
  // - iv_load_policy=3: Hide video annotations
  // - disablekb=1: Disable keyboard controls
  // - fs=0: Hide fullscreen button (we have our own cinema mode)
  // - playsinline=1: Play inline on iOS
  const embedUrl = video.type === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`
    : `https://player.vimeo.com/video/${video.id}?autoplay=1`;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handleCinemaToggle = useCallback(() => {
    setIsCinemaMode(prev => !prev);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Escape key to exit cinema mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaMode]);

  return (
    <>
      {/* Cinema Mode Backdrop */}
      <AnimatePresence>
        {isCinemaMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-night-900/95 z-40"
            onClick={() => setIsCinemaMode(false)}
          />
        )}
      </AnimatePresence>

      {/* Video Container */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden rounded-2xl ${
          isCinemaMode
            ? 'fixed inset-8 md:inset-16 lg:inset-24 z-50 shadow-2xl shadow-black/50'
            : className
        }`}
        layout
      >
        {/* Aspect Ratio Container */}
        <div className="relative w-full aspect-video bg-night-800">
          {/* Loading Shimmer */}
          <AnimatePresence>
            {!isLoaded && !isPlaying && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-night-700"
              >
                <div className="absolute inset-0 shimmer opacity-30" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thumbnail with Blur Placeholder */}
          {!isPlaying && (
            <motion.div
              initial={{ scale: 1.1, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  // Fallback to lower quality thumbnail
                  const target = e.target as HTMLImageElement;
                  if (video.type === 'youtube' && target.src.includes('maxresdefault')) {
                    target.src = getYouTubeThumbnail(video.id, 'hq');
                  }
                }}
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-night-900/40 via-transparent to-night-900/40" />
            </motion.div>
          )}

          {/* Video Embed */}
          {isPlaying && (
            <motion.iframe
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Play Button Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.button
                  onClick={handlePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                  aria-label={`Play ${video.title}`}
                >
                  {/* Pulse Ring Animation */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gold-500/30"
                    style={{ margin: '-20px' }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 rounded-full bg-gold-500/20"
                    style={{ margin: '-40px' }}
                  />

                  {/* Play Button */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-shadow">
                    <motion.svg
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                      className="w-8 h-8 md:w-10 md:h-10 text-night-900 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </motion.svg>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Info Overlay */}
          <AnimatePresence>
            {showInfo && !isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
              >
                {/* Category Badge */}
                {video.category && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full"
                  >
                    {video.category.replace('-', ' ')}
                  </motion.span>
                )}

                <h3
                  className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-white/60 text-sm md:text-base line-clamp-2 max-w-2xl">
                    {video.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-white/50">
                  {video.duration && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {video.duration}
                    </span>
                  )}
                  {video.legend && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {video.legend}
                    </span>
                  )}
                  {video.team && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      {video.team}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cinema Mode Controls */}
          <AnimatePresence>
            {isPlaying && showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 flex gap-2 z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCinemaToggle}
                  className="p-3 rounded-full bg-night-800/80 backdrop-blur-sm border border-white/10 text-white hover:text-gold-400 transition-colors"
                  aria-label={isCinemaMode ? 'Exit cinema mode' : 'Enter cinema mode'}
                >
                  {isCinemaMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </motion.button>

                {isCinemaMode && onClose && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-3 rounded-full bg-night-800/80 backdrop-blur-sm border border-white/10 text-white hover:text-red-400 transition-colors"
                    aria-label="Close video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duration Badge (on thumbnail) */}
          {!isPlaying && video.duration && (
            <div className="absolute bottom-4 right-4 px-2 py-1 bg-night-900/90 backdrop-blur-sm rounded text-xs font-bold text-white">
              {video.duration}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// Compact Video Card for galleries
export function VideoCard({
  video,
  onClick,
  featured = false,
}: {
  video: VideoData;
  onClick?: () => void;
  featured?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const thumbnail = video.thumbnail ||
    (video.type === 'youtube' ? getYouTubeThumbnail(video.id, 'hq') : getVimeoThumbnail(video.id));

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl cursor-pointer group ${
        featured ? 'col-span-2 row-span-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/30 to-transparent" />

        {/* Hover Preview Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gold-500/10"
        />

        {/* Play Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0.7 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-night-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-night-900/90 backdrop-blur-sm rounded text-xs font-bold text-white">
            {video.duration}
          </div>
        )}

        {/* Category Badge */}
        {video.category && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded text-xs font-bold uppercase tracking-wider text-gold-400">
            {video.category.replace('-', ' ')}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4
          className="text-white font-bold text-sm md:text-base line-clamp-2 group-hover:text-gold-400 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {video.title}
        </h4>
        {featured && video.description && (
          <p className="text-white/60 text-sm mt-1 line-clamp-2">{video.description}</p>
        )}
        {(video.legend || video.team) && (
          <p className="text-white/40 text-xs mt-2">
            {video.legend && <span>{video.legend}</span>}
            {video.legend && video.team && <span> | </span>}
            {video.team && <span>{video.team}</span>}
          </p>
        )}
      </div>

      {/* Border Glow on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 rounded-xl border-2 border-gold-500/50 pointer-events-none"
      />
    </motion.div>
  );
}
