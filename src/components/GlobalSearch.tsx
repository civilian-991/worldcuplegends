'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import { legends } from '@/data/legends';
import { news } from '@/data/legends';

interface SearchResult {
  type: 'product' | 'legend' | 'news' | 'page';
  id: string | number;
  title: string;
  subtitle?: string;
  href: string;
  icon: string;
}

const staticPages = [
  { title: 'Home', href: '/', icon: '🏠' },
  { title: 'Shop', href: '/shop', icon: '🛍️' },
  { title: 'Legends', href: '/legends', icon: '⭐' },
  { title: 'Teams', href: '/teams', icon: '🏆' },
  { title: 'Schedule', href: '/schedule', icon: '📅' },
  { title: 'News', href: '/news', icon: '📰' },
  { title: 'Tickets', href: '/tickets', icon: '🎟️' },
  { title: 'Venues', href: '/venues', icon: '🏟️' },
  { title: 'About', href: '/about', icon: '📖' },
  { title: 'Contact', href: '/contact', icon: '📧' },
  { title: 'FAQ', href: '/faq', icon: '❓' },
  { title: 'Track Order', href: '/track-order', icon: '📦' },
];

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search products
    products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery))
      )
      .slice(0, 4)
      .forEach((p) => {
        newResults.push({
          type: 'product',
          id: p.id,
          title: p.name,
          subtitle: `$${p.price.toFixed(2)} • ${p.category}`,
          href: `/shop/${p.id}`,
          icon: p.category === 'Jerseys' ? '👕' : p.category === 'Accessories' ? '🧢' : '🛍️',
        });
      });

    // Search legends
    legends
      .filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery) ||
          l.country.toLowerCase().includes(searchQuery) ||
          l.position.toLowerCase().includes(searchQuery)
      )
      .slice(0, 3)
      .forEach((l) => {
        newResults.push({
          type: 'legend',
          id: l.id,
          title: l.name,
          subtitle: `${l.country} • ${l.position}`,
          href: '/legends',
          icon: '⭐',
        });
      });

    // Search news
    news
      .filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery) ||
          n.excerpt.toLowerCase().includes(searchQuery)
      )
      .slice(0, 2)
      .forEach((n) => {
        newResults.push({
          type: 'news',
          id: n.id,
          title: n.title,
          subtitle: n.category,
          href: `/news/${n.id}`,
          icon: '📰',
        });
      });

    // Search static pages
    staticPages
      .filter((p) => p.title.toLowerCase().includes(searchQuery))
      .forEach((p) => {
        newResults.push({
          type: 'page',
          id: p.href,
          title: p.title,
          href: p.href,
          icon: p.icon,
        });
      });

    setResults(newResults);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-night-700 rounded-xl text-white/50 hover:text-white hover:bg-night-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-sm">Search</span>
        <kbd className="hidden md:inline px-2 py-0.5 bg-night-800 rounded text-xs text-white/30">⌘K</kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[60] px-4"
            >
              <div className="bg-night-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-4 p-4 border-b border-gold-500/10">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products, legends, news..."
                    className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
                  />
                  <kbd
                    onClick={handleClose}
                    className="px-2 py-1 bg-night-700 rounded text-xs text-white/40 cursor-pointer hover:bg-night-600"
                  >
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {query && results.length === 0 && (
                    <div className="p-8 text-center">
                      <span className="text-4xl block mb-4">🔍</span>
                      <p className="text-white/50">No results found for &quot;{query}&quot;</p>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="p-2">
                      {['product', 'legend', 'news', 'page'].map((type) => {
                        const typeResults = results.filter((r) => r.type === type);
                        if (typeResults.length === 0) return null;

                        return (
                          <div key={type} className="mb-4">
                            <p className="px-3 py-2 text-white/40 text-xs uppercase tracking-wider">
                              {type === 'product' ? 'Products' :
                               type === 'legend' ? 'Legends' :
                               type === 'news' ? 'News' : 'Pages'}
                            </p>
                            {typeResults.map((result) => (
                              <Link
                                key={`${result.type}-${result.id}`}
                                href={result.href}
                                onClick={handleClose}
                              >
                                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-night-700 transition-colors cursor-pointer">
                                  <span className="text-2xl">{result.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{result.title}</p>
                                    {result.subtitle && (
                                      <p className="text-white/40 text-sm truncate">{result.subtitle}</p>
                                    )}
                                  </div>
                                  <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!query && (
                    <div className="p-4">
                      <p className="px-3 py-2 text-white/40 text-xs uppercase tracking-wider">Quick Links</p>
                      <div className="grid grid-cols-2 gap-2">
                        {staticPages.slice(0, 6).map((page) => (
                          <Link key={page.href} href={page.href} onClick={handleClose}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-night-700 transition-colors">
                              <span>{page.icon}</span>
                              <span className="text-white/70">{page.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
