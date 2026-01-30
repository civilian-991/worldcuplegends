'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { type SearchResultItem, highlightMatch } from '@/hooks/useSearch';
import { useState } from 'react';

interface SearchResultProps {
  result: SearchResultItem;
  query: string;
  index: number;
  isSelected: boolean;
  onClose: () => void;
}

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  legends: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  products: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  news: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  teams: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  matches: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

// Render highlighted text
function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);

  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          className={part.isHighlight ? 'text-gold-400 font-semibold' : ''}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

// Legend result card
function LegendResult({ result, query, isSelected, onClose }: Omit<SearchResultProps, 'index'>) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Link href={result.href} onClick={onClose}>
      <div
        className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          isSelected ? 'bg-gold-500/20 ring-1 ring-gold-500/50' : 'hover:bg-night-600'
        }`}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {/* Image */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold-500/30 flex-shrink-0 bg-night-700">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-500">
              {categoryIcons.legends}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            <HighlightedText text={result.title} query={query} />
          </p>
          <p className="text-white/50 text-sm truncate">{result.subtitle}</p>
          {result.description && (
            <p className="text-white/30 text-xs mt-1 truncate">{result.description}</p>
          )}
        </div>

        {/* Stats Badge */}
        {result.metadata?.rating && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gold-500/10 rounded-full">
            <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gold-400 text-xs font-semibold">{result.metadata.rating}</span>
          </div>
        )}

        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        {/* Quick Preview on Hover */}
        {showPreview && result.metadata && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-0 top-full mt-2 z-50 p-4 glass rounded-xl shadow-xl min-w-[200px] hidden lg:block"
          >
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-white/50">Position</span>
                <span className="text-white">{result.metadata.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Goals</span>
                <span className="text-gold-400">{result.metadata.goals}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Link>
  );
}

// Product result card
function ProductResult({ result, query, isSelected, onClose }: Omit<SearchResultProps, 'index'>) {
  return (
    <Link href={result.href} onClick={onClose}>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          isSelected ? 'bg-gold-500/20 ring-1 ring-gold-500/50' : 'hover:bg-night-600'
        }`}
      >
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-night-600 flex-shrink-0">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-500">
              {categoryIcons.products}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            <HighlightedText text={result.title} query={query} />
          </p>
          <p className="text-gold-400 text-sm font-semibold">{result.subtitle?.split(' - ')[0]}</p>
          <p className="text-white/40 text-xs">{result.subtitle?.split(' - ')[1]}</p>
        </div>

        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {result.metadata?.inStock && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
              In Stock
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to cart logic
            }}
            className="p-2 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// News result card
function NewsResult({ result, query, isSelected, onClose }: Omit<SearchResultProps, 'index'>) {
  return (
    <Link href={result.href} onClick={onClose}>
      <div
        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          isSelected ? 'bg-gold-500/20 ring-1 ring-gold-500/50' : 'hover:bg-night-600'
        }`}
      >
        {/* Image */}
        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-night-600 flex-shrink-0">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-500">
              {categoryIcons.news}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold line-clamp-2">
            <HighlightedText text={result.title} query={query} />
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-gold-500/10 text-gold-400 text-xs rounded-full">
              {result.subtitle}
            </span>
            {result.metadata?.publishedAt && (
              <span className="text-white/30 text-xs">
                {new Date(result.metadata.publishedAt as string).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// Team result card
function TeamResult({ result, query, isSelected, onClose }: Omit<SearchResultProps, 'index'>) {
  return (
    <Link href={result.href} onClick={onClose}>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          isSelected ? 'bg-gold-500/20 ring-1 ring-gold-500/50' : 'hover:bg-night-600'
        }`}
      >
        {/* Flag */}
        <div className="relative w-12 h-8 rounded overflow-hidden bg-night-600 flex-shrink-0">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-500">
              {categoryIcons.teams}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            <HighlightedText text={result.title} query={query} />
          </p>
          <p className="text-white/50 text-sm truncate">{result.subtitle}</p>
          {result.description && (
            <p className="text-white/30 text-xs mt-0.5 truncate">Legends: {result.description}</p>
          )}
        </div>

        {/* World Cups Badge */}
        {result.metadata?.worldCups && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gold-500/10 rounded-full">
            <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
            </svg>
            <span className="text-gold-400 text-xs font-semibold">{result.metadata.worldCups}</span>
          </div>
        )}

        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// Match result card
function MatchResult({ result, query, isSelected, onClose }: Omit<SearchResultProps, 'index'>) {
  return (
    <Link href={result.href} onClick={onClose}>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          isSelected ? 'bg-gold-500/20 ring-1 ring-gold-500/50' : 'hover:bg-night-600'
        }`}
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
          {categoryIcons.matches}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            <HighlightedText text={result.title} query={query} />
          </p>
          <p className="text-white/50 text-sm truncate">{result.subtitle}</p>
          {result.description && (
            <p className="text-white/30 text-xs mt-0.5 truncate">{result.description}</p>
          )}
        </div>

        {/* Live Badge */}
        {result.metadata?.isLive && (
          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full animate-pulse">
            LIVE
          </span>
        )}

        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// Main SearchResult component
export default function SearchResult({ result, query, index, isSelected, onClose }: SearchResultProps) {
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    }),
  };

  const ResultComponent = {
    legends: LegendResult,
    products: ProductResult,
    news: NewsResult,
    teams: TeamResult,
    matches: MatchResult,
    all: LegendResult, // Default fallback
  }[result.type] || LegendResult;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <ResultComponent
        result={result}
        query={query}
        isSelected={isSelected}
        onClose={onClose}
      />
    </motion.div>
  );
}

// Export individual result components for direct use
export { LegendResult, ProductResult, NewsResult, TeamResult, MatchResult };
