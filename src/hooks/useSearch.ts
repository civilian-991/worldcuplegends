'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getLegends, getNews, getTeams, getMatches, type Legend, type NewsArticle, type Team, type Match } from '@/lib/api';
import { products, type Product } from '@/data/products';

// Search result types
export type SearchCategory = 'all' | 'legends' | 'products' | 'news' | 'teams' | 'matches';

export interface SearchResultItem {
  type: SearchCategory;
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface SearchState {
  query: string;
  results: SearchResultItem[];
  isLoading: boolean;
  activeCategory: SearchCategory;
  totalResults: number;
  categoryResults: Record<SearchCategory, SearchResultItem[]>;
}

// Recent searches management
const RECENT_SEARCHES_KEY = 'wlc_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail
  }
}

export function removeRecentSearch(query: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearches();
    const updated = recent.filter(s => s.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

// Popular searches (can be dynamic in production)
export const popularSearches = [
  'Pelé',
  'Messi',
  'Maradona',
  'Brazil',
  'Jersey',
  'World Cup',
  'Finals',
  'Argentina',
];

// Highlight matching text in results
export function highlightMatch(text: string, query: string): { text: string; isHighlight: boolean }[] {
  if (!query.trim()) return [{ text, isHighlight: false }];

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map(part => ({
    text: part,
    isHighlight: part.toLowerCase() === query.toLowerCase(),
  }));
}

// Calculate relevance score
function calculateScore(item: string, query: string, weight: number = 1): number {
  const lowerItem = item.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact match
  if (lowerItem === lowerQuery) return 100 * weight;

  // Starts with query
  if (lowerItem.startsWith(lowerQuery)) return 80 * weight;

  // Contains query as word
  const words = lowerItem.split(/\s+/);
  if (words.some(word => word.startsWith(lowerQuery))) return 60 * weight;

  // Contains query
  if (lowerItem.includes(lowerQuery)) return 40 * weight;

  return 0;
}

// Search functions for each category
function searchLegends(legends: Legend[], query: string): SearchResultItem[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const legend of legends) {
    const nameScore = calculateScore(legend.name, query, 2);
    const countryScore = calculateScore(legend.country, query, 1.5);
    const positionScore = calculateScore(legend.position, query, 1);
    const teamScore = calculateScore(legend.team || '', query, 1);

    const score = nameScore + countryScore + positionScore + teamScore;

    if (score === 0 && !legend.name.toLowerCase().includes(lowerQuery) &&
        !legend.country.toLowerCase().includes(lowerQuery) &&
        !legend.position.toLowerCase().includes(lowerQuery)) {
      continue;
    }

    results.push({
      type: 'legends',
      id: legend.id,
      title: legend.name,
      subtitle: `${legend.country} - ${legend.position}`,
      description: `${legend.worldCups} World Cup${legend.worldCups !== 1 ? 's' : ''} - ${legend.goals} Goals`,
      image: legend.image,
      href: `/legends/${legend.id}`,
      score: score || 10,
      metadata: {
        country: legend.country,
        position: legend.position,
        rating: legend.rating,
        goals: legend.goals,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function searchProducts(query: string): SearchResultItem[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const product of products) {
    const nameScore = calculateScore(product.name, query, 2);
    const categoryScore = calculateScore(product.category, query, 1.5);
    const tagScore = product.tags.reduce((acc, tag) => acc + calculateScore(tag, query, 0.5), 0);
    const legendScore = product.legend ? calculateScore(product.legend, query, 1.5) : 0;
    const teamScore = product.team ? calculateScore(product.team, query, 1) : 0;

    const score = nameScore + categoryScore + tagScore + legendScore + teamScore;

    if (score === 0 && !product.name.toLowerCase().includes(lowerQuery) &&
        !product.category.toLowerCase().includes(lowerQuery) &&
        !product.tags.some(t => t.toLowerCase().includes(lowerQuery))) {
      continue;
    }

    results.push({
      type: 'products',
      id: product.id,
      title: product.name,
      subtitle: `$${product.price.toFixed(2)} - ${product.category}`,
      description: product.description,
      image: product.images[0],
      href: `/shop/${product.slug}`,
      score: score || 10,
      metadata: {
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        rating: product.rating,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function searchNews(news: NewsArticle[], query: string): SearchResultItem[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const article of news) {
    const titleScore = calculateScore(article.title, query, 2);
    const excerptScore = article.excerpt.toLowerCase().includes(lowerQuery) ? 20 : 0;
    const categoryScore = calculateScore(article.category, query, 1);

    const score = titleScore + excerptScore + categoryScore;

    if (score === 0 && !article.title.toLowerCase().includes(lowerQuery) &&
        !article.excerpt.toLowerCase().includes(lowerQuery)) {
      continue;
    }

    results.push({
      type: 'news',
      id: article.id,
      title: article.title,
      subtitle: article.category,
      description: article.excerpt,
      image: article.image,
      href: `/news/${article.slug}`,
      score: score || 10,
      metadata: {
        category: article.category,
        author: article.author,
        publishedAt: article.publishedAt,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function searchTeams(teams: Team[], query: string): SearchResultItem[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const team of teams) {
    const nameScore = calculateScore(team.name, query, 2);
    const confScore = calculateScore(team.confederation, query, 1);
    const legendsScore = team.legends.reduce((acc, legend) =>
      acc + (legend.toLowerCase().includes(lowerQuery) ? 15 : 0), 0);

    const score = nameScore + confScore + legendsScore;

    if (score === 0 && !team.name.toLowerCase().includes(lowerQuery) &&
        !team.legends.some(l => l.toLowerCase().includes(lowerQuery))) {
      continue;
    }

    results.push({
      type: 'teams',
      id: team.id,
      title: team.name,
      subtitle: `${team.worldCups} World Cup${team.worldCups !== 1 ? 's' : ''} - ${team.confederation}`,
      description: team.legends.slice(0, 3).join(', '),
      image: team.flag,
      href: `/teams/${team.id}`,
      score: score || 10,
      metadata: {
        worldCups: team.worldCups,
        confederation: team.confederation,
        rating: team.rating,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function searchMatches(matches: Match[], query: string): SearchResultItem[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const match of matches) {
    const homeScore = calculateScore(match.homeTeam, query, 1.5);
    const awayScore = calculateScore(match.awayTeam, query, 1.5);
    const venueScore = calculateScore(match.venue, query, 1);
    const stageScore = calculateScore(match.stage, query, 1);

    const score = homeScore + awayScore + venueScore + stageScore;

    if (score === 0 && !match.homeTeam.toLowerCase().includes(lowerQuery) &&
        !match.awayTeam.toLowerCase().includes(lowerQuery) &&
        !match.venue.toLowerCase().includes(lowerQuery) &&
        !match.stage.toLowerCase().includes(lowerQuery)) {
      continue;
    }

    const dateStr = new Date(match.matchDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    results.push({
      type: 'matches',
      id: match.id,
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      subtitle: `${match.stage} - ${dateStr}`,
      description: `${match.venue} - ${match.matchTime}`,
      href: `/schedule`,
      score: score || 10,
      metadata: {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        venue: match.venue,
        stage: match.stage,
        isLive: match.isLive,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

// Main search hook
export function useSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [categoryResults, setCategoryResults] = useState<Record<SearchCategory, SearchResultItem[]>>({
    all: [],
    legends: [],
    products: [],
    news: [],
    teams: [],
    matches: [],
  });

  // Cache for API data
  const dataCache = useRef<{
    legends: Legend[];
    news: NewsArticle[];
    teams: Team[];
    matches: Match[];
    loaded: boolean;
  }>({
    legends: [],
    news: [],
    teams: [],
    matches: [],
    loaded: false,
  });

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Load API data on mount
  const loadData = useCallback(async () => {
    if (dataCache.current.loaded) return;

    setIsLoading(true);
    try {
      const [legends, news, teams, matches] = await Promise.all([
        getLegends(),
        getNews(),
        getTeams(),
        getMatches(),
      ]);

      dataCache.current = {
        legends,
        news,
        teams,
        matches,
        loaded: true,
      };
    } catch (error) {
      console.error('Error loading search data:', error);
    }
    setIsLoading(false);
  }, []);

  // Perform search
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCategoryResults({
        all: [],
        legends: [],
        products: [],
        news: [],
        teams: [],
        matches: [],
      });
      return;
    }

    const { legends, news, teams, matches } = dataCache.current;

    const legendResults = searchLegends(legends, searchQuery).slice(0, 8);
    const productResults = searchProducts(searchQuery).slice(0, 8);
    const newsResults = searchNews(news, searchQuery).slice(0, 6);
    const teamResults = searchTeams(teams, searchQuery).slice(0, 6);
    const matchResults = searchMatches(matches, searchQuery).slice(0, 6);

    const allResults = [
      ...legendResults,
      ...productResults,
      ...newsResults,
      ...teamResults,
      ...matchResults,
    ].sort((a, b) => b.score - a.score);

    setCategoryResults({
      all: allResults,
      legends: legendResults,
      products: productResults,
      news: newsResults,
      teams: teamResults,
      matches: matchResults,
    });

    // Set results based on active category
    if (activeCategory === 'all') {
      setResults(allResults);
    } else {
      setResults(categoryResults[activeCategory] || []);
    }
  }, [activeCategory]);

  // Update results when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setResults(categoryResults.all);
    } else {
      setResults(categoryResults[activeCategory]);
    }
  }, [activeCategory, categoryResults]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (dataCache.current.loaded) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

  // Load data and search
  useEffect(() => {
    loadData().then(() => {
      if (debouncedQuery) {
        performSearch(debouncedQuery);
      }
    });
  }, [loadData, debouncedQuery, performSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    activeCategory,
    setActiveCategory,
    categoryResults,
    totalResults: categoryResults.all.length,
    loadData,
  };
}

export default useSearch;
