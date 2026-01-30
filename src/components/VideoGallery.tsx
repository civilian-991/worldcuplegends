'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import VideoPlayer, { VideoCard, type VideoData } from './VideoPlayer';

// Demo video data with placeholder YouTube IDs
const DEMO_VIDEOS: VideoData[] = [
  {
    id: 'dQw4w9WgXcQ',
    type: 'youtube',
    title: 'Pelé - The King of Football',
    description: 'Experience the magic of the greatest player to ever grace the World Cup stage. Three-time World Cup winner.',
    duration: '12:45',
    legend: 'Pelé',
    team: 'Brazil',
    era: '1958-1970',
    category: 'documentaries',
  },
  {
    id: 'hD3eqUvPmpU',
    type: 'youtube',
    title: 'Maradona\'s Hand of God & Goal of the Century',
    description: 'The most controversial and the most beautiful goals in World Cup history, both in the same match.',
    duration: '8:32',
    legend: 'Diego Maradona',
    team: 'Argentina',
    era: '1982-1994',
    category: 'iconic-goals',
  },
  {
    id: 'L0MK7qz13bU',
    type: 'youtube',
    title: 'Zinedine Zidane - The Maestro',
    description: 'Witness the elegance and brilliance of France\'s most gifted footballer.',
    duration: '15:20',
    legend: 'Zinedine Zidane',
    team: 'France',
    era: '1998-2006',
    category: 'highlights',
  },
  {
    id: 'qjp1Zrvn8VQ',
    type: 'youtube',
    title: 'Brazil 1970 - The Beautiful Team',
    description: 'The greatest team ever assembled. Pelé, Jairzinho, Tostão, Gérson, and Rivelino.',
    duration: '22:15',
    legend: 'Brazil Squad',
    team: 'Brazil',
    era: '1958-1970',
    category: 'documentaries',
  },
  {
    id: 'xWvzYmF48sg',
    type: 'youtube',
    title: 'Ronaldo Nazário - Il Fenomeno',
    description: 'From the heartbreak of 1998 to the redemption of 2002.',
    duration: '18:45',
    legend: 'Ronaldo',
    team: 'Brazil',
    era: '1994-2010',
    category: 'highlights',
  },
  {
    id: 'RM7ljs8LiKQ',
    type: 'youtube',
    title: 'Exclusive: Beckenbauer Interview',
    description: 'Der Kaiser shares his memories of winning the World Cup as both player and manager.',
    duration: '25:00',
    legend: 'Franz Beckenbauer',
    team: 'Germany',
    era: '1966-1990',
    category: 'interviews',
  },
  {
    id: '9HO7J6HWMKk',
    type: 'youtube',
    title: 'Carlos Alberto\'s Perfect Goal',
    description: 'The greatest team goal in World Cup history - Brazil vs Italy, 1970 Final.',
    duration: '3:45',
    legend: 'Carlos Alberto',
    team: 'Brazil',
    era: '1958-1970',
    category: 'iconic-goals',
  },
  {
    id: 'GG-jMjvnua8',
    type: 'youtube',
    title: 'Johan Cruyff & Total Football',
    description: 'How the Dutch master revolutionized the beautiful game.',
    duration: '20:30',
    legend: 'Johan Cruyff',
    team: 'Netherlands',
    era: '1974-1978',
    category: 'documentaries',
  },
  {
    id: 'Rq_pLdLN0rk',
    type: 'youtube',
    title: 'Messi vs Croatia - 2022 Semi-Final',
    description: 'Lionel Messi\'s masterclass performance that led Argentina to the final.',
    duration: '10:15',
    legend: 'Lionel Messi',
    team: 'Argentina',
    era: '2006-2022',
    category: 'highlights',
  },
  {
    id: 'OYa5aQb3YGE',
    type: 'youtube',
    title: 'Roberto Baggio - Divine Ponytail',
    description: 'The Italian genius who carried his nation to the 1994 final.',
    duration: '16:40',
    legend: 'Roberto Baggio',
    team: 'Italy',
    era: '1990-1998',
    category: 'highlights',
  },
  {
    id: 'QRZPqCDhKN8',
    type: 'youtube',
    title: 'Eusébio - The Black Panther',
    description: 'Portugal\'s first football superstar and top scorer of 1966.',
    duration: '14:20',
    legend: 'Eusébio',
    team: 'Portugal',
    era: '1966',
    category: 'documentaries',
  },
  {
    id: 'F3dlyaGgprc',
    type: 'youtube',
    title: 'Gerd Müller Interview - The Bomber',
    description: 'The legendary German striker discusses his incredible goal-scoring record.',
    duration: '18:30',
    legend: 'Gerd Müller',
    team: 'Germany',
    era: '1970-1974',
    category: 'interviews',
  },
];

type Category = 'all' | 'highlights' | 'interviews' | 'iconic-goals' | 'documentaries';
type Era = 'all' | '1958-1970' | '1974-1978' | '1982-1994' | '1994-2010' | '2006-2022';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Videos' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'iconic-goals', label: 'Iconic Goals' },
  { id: 'documentaries', label: 'Documentaries' },
];

const ERAS: { id: Era; label: string }[] = [
  { id: 'all', label: 'All Eras' },
  { id: '1958-1970', label: '1958-1970' },
  { id: '1974-1978', label: '1974-1978' },
  { id: '1982-1994', label: '1982-1994' },
  { id: '1994-2010', label: '1994-2010' },
  { id: '2006-2022', label: '2006-2022' },
];

interface VideoGalleryProps {
  videos?: VideoData[];
  title?: string;
  showFilters?: boolean;
  showFeatured?: boolean;
  initialCategory?: Category;
  legendFilter?: string;
  teamFilter?: string;
  maxVideos?: number;
  loadMoreIncrement?: number;
  className?: string;
}

export default function VideoGallery({
  videos = DEMO_VIDEOS,
  title = 'Video Gallery',
  showFilters = true,
  showFeatured = true,
  initialCategory = 'all',
  legendFilter,
  teamFilter,
  maxVideos,
  loadMoreIncrement = 6,
  className = '',
}: VideoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedEra, setSelectedEra] = useState<Era>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [visibleCount, setVisibleCount] = useState(loadMoreIncrement);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
    if (selectedEra !== 'all' && video.era !== selectedEra) return false;
    if (legendFilter && video.legend !== legendFilter) return false;
    if (teamFilter && video.team !== teamFilter) return false;
    return true;
  });

  const displayVideos = maxVideos
    ? filteredVideos.slice(0, maxVideos)
    : filteredVideos.slice(0, visibleCount);

  const hasMore = !maxVideos && visibleCount < filteredVideos.length;
  const featuredVideo = showFeatured && filteredVideos.length > 0 ? filteredVideos[0] : null;
  const gridVideos = showFeatured ? displayVideos.slice(1) : displayVideos;

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount((prev) => prev + loadMoreIncrement);
      setIsLoadingMore(false);
    }, 500);
  }, [loadMoreIncrement]);

  const handleVideoSelect = useCallback((video: VideoData) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideo(null);
    document.body.style.overflow = '';
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(loadMoreIncrement);
  }, [selectedCategory, selectedEra, loadMoreIncrement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section ref={containerRef} className={`relative py-16 md:py-24 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-800 via-night-700 to-night-800" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">
            Relive The Glory
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white line-accent"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === title.split(' ').length - 1 ? 'text-gradient-gold' : ''}>
                {word}{' '}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-10"
          >
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gold-500 text-night-900 shadow-lg shadow-gold-500/30'
                      : 'bg-night-600/50 text-white/70 border border-white/10 hover:border-gold-500/30 hover:text-gold-400'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>

            {/* Era Dropdown */}
            <div className="relative">
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value as Era)}
                className="appearance-none px-4 py-2 pr-10 rounded-full text-sm font-semibold bg-night-600/50 text-white/70 border border-white/10 hover:border-gold-500/30 cursor-pointer transition-all focus:outline-none focus:border-gold-500"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {ERAS.map((era) => (
                  <option key={era.id} value={era.id} className="bg-night-700">
                    {era.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-white/50 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              No videos found for the selected filters
            </p>
          </motion.div>
        )}

        {/* Featured Video Hero */}
        {featuredVideo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative">
                <VideoPlayer
                  video={featuredVideo}
                  showInfo={true}
                  onPlay={() => handleVideoSelect(featuredVideo)}
                  className="w-full"
                />
                {/* Featured Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gold-500 text-night-900 text-xs font-bold uppercase tracking-wider rounded-full"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {gridVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                layout
              >
                <VideoCard
                  video={video}
                  onClick={() => handleVideoSelect(video)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-3 border-2 border-gold-500/50 text-gold-400 font-semibold rounded-full hover:bg-gold-500/10 transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Load More Videos
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/40 text-sm mt-6"
        >
          Showing {displayVideos.length} of {filteredVideos.length} videos
        </motion.p>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-night-900/95 backdrop-blur-sm"
              onClick={handleCloseVideo}
            />

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-5xl z-10"
            >
              <VideoPlayer
                video={selectedVideo}
                autoPlay
                showInfo={true}
                onClose={handleCloseVideo}
              />

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleCloseVideo}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <span className="flex items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                  Press ESC to close
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Compact gallery variant for sidebars or smaller spaces
export function VideoGalleryCompact({
  videos = DEMO_VIDEOS.slice(0, 4),
  title = 'Latest Videos',
  onViewAll,
}: {
  videos?: VideoData[];
  title?: string;
  onViewAll?: () => void;
}) {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-gold-400 text-sm hover:text-gold-300 transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-4">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ x: 4 }}
            onClick={() => setSelectedVideo(video)}
            className="flex gap-3 cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-night-900/50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gold-500/90 flex items-center justify-center">
                  <svg className="w-3 h-3 text-night-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {video.duration && (
                <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-night-900/80 text-white text-xs rounded">
                  {video.duration}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-gold-400 transition-colors">
                {video.title}
              </h4>
              <p className="text-white/40 text-xs mt-1">{video.legend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="absolute inset-0 bg-night-900/95" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer video={selectedVideo} autoPlay onClose={() => setSelectedVideo(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
