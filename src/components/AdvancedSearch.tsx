'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import useSearch, {
  type SearchCategory,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  popularSearches,
} from '@/hooks/useSearch';
import SearchResult from './SearchResult';

interface AdvancedSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

// Category configuration
const categories: { id: SearchCategory; label: string; icon: React.ReactNode }[] = [
  {
    id: 'all',
    label: 'All',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'legends',
    label: 'Legends',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Products',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
  {
    id: 'matches',
    label: 'Matches',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function AdvancedSearch({ isOpen: controlledIsOpen, onClose: controlledOnClose, standalone = false }: AdvancedSearchProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Use controlled or internal state
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = controlledOnClose
    ? (open: boolean) => !open && controlledOnClose()
    : setInternalIsOpen;

  const {
    query,
    setQuery,
    results,
    isLoading,
    activeCategory,
    setActiveCategory,
    categoryResults,
    totalResults,
    loadData,
  } = useSearch(200);

  // Load recent searches on mount
  useEffect(() => {
    setMounted(true);
    setRecentSearches(getRecentSearches());
  }, []);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      loadData();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, loadData]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length && !query) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (results.length || 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          addRecentSearch(query);
          // Navigate programmatically
          window.location.href = results[selectedIndex].href;
        }
        break;
      case 'Tab':
        e.preventDefault();
        // Cycle through categories
        const currentIndex = categories.findIndex(c => c.id === activeCategory);
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + categories.length) % categories.length
          : (currentIndex + 1) % categories.length;
        setActiveCategory(categories[nextIndex].id);
        break;
    }
  }, [results, selectedIndex, query, activeCategory, setActiveCategory]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery) {
      addRecentSearch(searchQuery);
      setRecentSearches(getRecentSearches());
    }
  };

  const handleClearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(search);
    setRecentSearches(getRecentSearches());
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.15 },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  if (!mounted) return null;

  const searchContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 bg-night-900/90 backdrop-blur-md z-[100]"
          />

          {/* Search Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-4 md:inset-x-auto md:top-[8%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-[100] flex flex-col max-h-[90vh] md:max-h-[85vh]"
          >
            <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
              {/* Search Header */}
              <div className="p-4 border-b border-gold-500/10">
                {/* Search Input */}
                <div className="relative flex items-center gap-3">
                  {/* Search Icon */}
                  <div className="flex-shrink-0">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full"
                      />
                    ) : (
                      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </div>

                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search legends, products, news, teams..."
                    className="flex-1 bg-transparent text-white text-lg placeholder-white/40 focus:outline-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  />

                  {/* Clear Button */}
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleClearInput}
                      className="p-1.5 rounded-lg hover:bg-night-600 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white/50 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}

                  {/* Keyboard Shortcuts */}
                  <div className="hidden md:flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-night-700 rounded text-xs text-white/40">ESC</kbd>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                  {categories.map((category, i) => (
                    <motion.button
                      key={category.id}
                      custom={i}
                      variants={categoryVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                        activeCategory === category.id
                          ? 'bg-gold-500 text-night-900 font-semibold'
                          : 'bg-night-700 text-white/60 hover:text-white hover:bg-night-600'
                      }`}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                      {categoryResults[category.id]?.length > 0 && (
                        <span className={`text-xs ${
                          activeCategory === category.id ? 'text-night-900/60' : 'text-white/40'
                        }`}>
                          {categoryResults[category.id].length}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Results Area */}
              <div ref={resultsRef} className="flex-1 overflow-y-auto">
                {/* Loading State */}
                {isLoading && !results.length && (
                  <div className="p-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 mx-auto border-2 border-gold-400 border-t-transparent rounded-full"
                    />
                    <p className="text-white/50 mt-4">Searching...</p>
                  </div>
                )}

                {/* Search Results */}
                {query && results.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 text-white/40 text-xs uppercase tracking-wider">
                      {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
                    </p>
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <div key={`${result.type}-${result.id}`} data-index={index}>
                          <SearchResult
                            result={result}
                            query={query}
                            index={index}
                            isSelected={index === selectedIndex}
                            onClose={handleClose}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {query && !isLoading && results.length === 0 && (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-night-700 flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <p className="text-white/50 text-lg">No results found for &quot;{query}&quot;</p>
                    <p className="text-white/30 text-sm mt-2">Try searching for something else</p>

                    {/* Suggestions */}
                    <div className="mt-6">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Popular Searches</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {popularSearches.slice(0, 4).map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1.5 bg-night-700 hover:bg-night-600 rounded-full text-sm text-white/60 hover:text-white transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State - Recent & Popular Searches */}
                {!query && (
                  <div className="p-4">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between px-2 mb-3">
                          <p className="text-white/40 text-xs uppercase tracking-wider">Recent Searches</p>
                          <button
                            onClick={handleClearRecentSearches}
                            className="text-xs text-white/30 hover:text-white/50 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.slice(0, 5).map((search, index) => (
                            <motion.button
                              key={search}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSearch(search)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-night-600 transition-colors group"
                            >
                              <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="flex-1 text-left text-white/70 group-hover:text-white transition-colors">
                                {search}
                              </span>
                              <button
                                onClick={(e) => handleRemoveRecentSearch(search, e)}
                                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-night-500 transition-all"
                              >
                                <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <p className="px-2 mb-3 text-white/40 text-xs uppercase tracking-wider">Popular Searches</p>
                      <div className="flex flex-wrap gap-2 px-2">
                        {popularSearches.map((search, index) => (
                          <motion.button
                            key={search}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSearch(search)}
                            className="px-4 py-2 bg-night-700 hover:bg-gold-500/20 border border-transparent hover:border-gold-500/30 rounded-full text-sm text-white/60 hover:text-gold-400 transition-all"
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-6 pt-6 border-t border-gold-500/10">
                      <p className="px-2 mb-3 text-white/40 text-xs uppercase tracking-wider">Quick Links</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
                        {[
                          { label: 'Explore Legends', href: '/legends', icon: '🌟' },
                          { label: 'Shop Jerseys', href: '/shop', icon: '👕' },
                          { label: 'Match Schedule', href: '/schedule', icon: '📅' },
                          { label: 'Latest News', href: '/news', icon: '📰' },
                          { label: 'All Teams', href: '/teams', icon: '🏆' },
                          // { label: 'Buy Tickets', href: '/tickets', icon: '🎟️' }, // Hidden until ticket link is provided
                        ].map((link, index) => (
                          <motion.a
                            key={link.href}
                            href={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            onClick={handleClose}
                            className="flex items-center gap-2 p-3 rounded-xl bg-night-700/50 hover:bg-night-600 transition-colors group"
                          >
                            <span className="text-lg">{link.icon}</span>
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                              {link.label}
                            </span>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gold-500/10 flex items-center justify-between text-xs text-white/30">
                <div className="flex items-center gap-4">
                  <span className="hidden sm:flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-night-700 rounded text-[10px]">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-night-700 rounded text-[10px]">↓</kbd>
                    <span className="ml-1">to navigate</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-night-700 rounded text-[10px]">↵</kbd>
                    <span className="ml-1">to select</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-night-700 rounded text-[10px]">Tab</kbd>
                    <span className="ml-1">categories</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Powered by</span>
                  <span className="text-gold-400 font-semibold">WLC Search</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Trigger Button (when not controlled externally)
  const triggerButton = !standalone && (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-night-700 hover:bg-night-600 rounded-xl transition-all group"
    >
      <svg className="w-4 h-4 text-white/50 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline text-sm text-white/50 group-hover:text-white/70 transition-colors">Search</span>
      <kbd className="hidden md:inline px-2 py-0.5 bg-night-800 rounded text-xs text-white/30 group-hover:text-white/40 transition-colors">
        <span className="mr-0.5">⌘</span>K
      </kbd>
    </button>
  );

  // Render portal for modal
  return (
    <>
      {triggerButton}
      {mounted && createPortal(searchContent, document.body)}
    </>
  );
}

// Export a standalone version that can be used without the trigger button
export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return <AdvancedSearch isOpen={isOpen} onClose={onClose} standalone />;
}
