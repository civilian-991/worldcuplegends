'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, products } from '@/data/products';
import { Legend, legends, news, NewsArticle } from '@/data/legends';

// Types for trending items
export type TrendingCategory = 'legends' | 'products' | 'news';
export type TimePeriod = 'today' | 'week' | 'allTime';
export type TrendDirection = 'up' | 'down' | 'new' | 'stable';

export interface TrendingItem {
  id: number;
  type: TrendingCategory;
  views: number;
  previousRank: number | null;
  currentRank: number;
  direction: TrendDirection;
  isNew: boolean;
  lastViewed: number;
  viewsToday: number;
  viewsWeek: number;
  viewsAllTime: number;
}

export interface TrendingLegend extends TrendingItem {
  type: 'legends';
  data: Legend;
}

export interface TrendingProduct extends TrendingItem {
  type: 'products';
  data: Product;
  sales: number;
}

export interface TrendingNewsArticle extends TrendingItem {
  type: 'news';
  data: NewsArticle;
}

export type TrendingItemWithData = TrendingLegend | TrendingProduct | TrendingNewsArticle;

interface ViewRecord {
  id: number;
  type: TrendingCategory;
  timestamp: number;
}

interface TrendingState {
  viewRecords: ViewRecord[];
  lastUpdated: number;
}

interface TrendingContextType {
  // State
  trendingLegends: TrendingLegend[];
  trendingProducts: TrendingProduct[];
  trendingNews: TrendingNewsArticle[];

  // Actions
  trackView: (id: number, type: TrendingCategory) => void;

  // Getters
  getTrending: (category: TrendingCategory, period: TimePeriod, limit?: number) => TrendingItemWithData[];
  getViewCount: (id: number, type: TrendingCategory, period: TimePeriod) => number;
  getRank: (id: number, type: TrendingCategory) => number | null;

  // Loading state
  isHydrated: boolean;
}

const STORAGE_KEY = 'wlc-trending-data';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;
const MAX_RECORDS = 10000;

// Mock data to simulate trending activity
const generateMockData = (): ViewRecord[] => {
  const now = Date.now();
  const records: ViewRecord[] = [];

  // Generate mock views for legends
  legends.forEach((legend) => {
    // Higher rated legends get more views
    const baseViews = Math.floor((legend.rating / 100) * 50);
    const variance = Math.random() * 30;
    const totalViews = Math.floor(baseViews + variance);

    for (let i = 0; i < totalViews; i++) {
      records.push({
        id: legend.id,
        type: 'legends',
        timestamp: now - Math.floor(Math.random() * ONE_WEEK_MS),
      });
    }
  });

  // Generate mock views for products
  products.forEach((product) => {
    // Featured and high-rated products get more views
    const baseViews = product.featured ? 40 : 20;
    const ratingBonus = (product.rating / 5) * 15;
    const variance = Math.random() * 20;
    const totalViews = Math.floor(baseViews + ratingBonus + variance);

    for (let i = 0; i < totalViews; i++) {
      records.push({
        id: product.id,
        type: 'products',
        timestamp: now - Math.floor(Math.random() * ONE_WEEK_MS),
      });
    }
  });

  // Generate mock views for news
  news.forEach((article, index) => {
    // Newer articles get more views
    const recencyBonus = (news.length - index) * 5;
    const baseViews = 15;
    const variance = Math.random() * 25;
    const totalViews = Math.floor(baseViews + recencyBonus + variance);

    for (let i = 0; i < totalViews; i++) {
      records.push({
        id: article.id,
        type: 'news',
        timestamp: now - Math.floor(Math.random() * ONE_WEEK_MS),
      });
    }
  });

  return records;
};

const TrendingContext = createContext<TrendingContextType | undefined>(undefined);

function calculateTrending<T extends { id: number }>(
  items: T[],
  records: ViewRecord[],
  type: TrendingCategory,
  period: TimePeriod
): (TrendingItem & { data: T })[] {
  const now = Date.now();
  const cutoff = period === 'today'
    ? now - ONE_DAY_MS
    : period === 'week'
      ? now - ONE_WEEK_MS
      : 0;

  const viewCounts = new Map<number, { today: number; week: number; allTime: number }>();

  // Initialize all items
  items.forEach(item => {
    viewCounts.set(item.id, { today: 0, week: 0, allTime: 0 });
  });

  // Count views
  records
    .filter(r => r.type === type)
    .forEach(record => {
      const counts = viewCounts.get(record.id);
      if (counts) {
        counts.allTime++;
        if (record.timestamp >= now - ONE_WEEK_MS) {
          counts.week++;
        }
        if (record.timestamp >= now - ONE_DAY_MS) {
          counts.today++;
        }
      }
    });

  // Sort and rank
  const sorted = items
    .map(item => {
      const counts = viewCounts.get(item.id) || { today: 0, week: 0, allTime: 0 };
      const views = period === 'today' ? counts.today : period === 'week' ? counts.week : counts.allTime;

      // Check if item is "new" (added within 3 days)
      const firstView = records.find(r => r.id === item.id && r.type === type);
      const isNew = firstView ? (now - firstView.timestamp) < (3 * ONE_DAY_MS) : true;

      return {
        item,
        views,
        counts,
        isNew,
      };
    })
    .sort((a, b) => b.views - a.views);

  // Calculate previous ranks (simulate from week data for "today", etc.)
  const previousSorted = [...sorted].sort((a, b) => {
    const aViews = period === 'today' ? a.counts.week : a.counts.allTime;
    const bViews = period === 'today' ? b.counts.week : b.counts.allTime;
    return bViews - aViews;
  });

  const previousRanks = new Map<number, number>();
  previousSorted.forEach((item, index) => {
    previousRanks.set(item.item.id, index + 1);
  });

  return sorted.map((entry, index) => {
    const currentRank = index + 1;
    const previousRank = previousRanks.get(entry.item.id) || null;

    let direction: TrendDirection = 'stable';
    if (entry.isNew) {
      direction = 'new';
    } else if (previousRank !== null) {
      if (previousRank > currentRank) {
        direction = 'up';
      } else if (previousRank < currentRank) {
        direction = 'down';
      }
    }

    return {
      id: entry.item.id,
      type,
      views: entry.views,
      previousRank,
      currentRank,
      direction,
      isNew: entry.isNew,
      lastViewed: now,
      viewsToday: entry.counts.today,
      viewsWeek: entry.counts.week,
      viewsAllTime: entry.counts.allTime,
      data: entry.item,
    };
  });
}

export function TrendingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrendingState>({
    viewRecords: [],
    lastUpdated: Date.now(),
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage and merge with mock data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let existingRecords: ViewRecord[] = [];

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as TrendingState;
        existingRecords = parsed.viewRecords || [];
      } catch (e) {
        console.error('Failed to parse trending data:', e);
      }
    }

    // Always have some mock data for demonstration
    const mockRecords = generateMockData();

    // Merge existing user records with mock data, prioritizing user data
    const mergedRecords = [...existingRecords, ...mockRecords]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_RECORDS);

    setState({
      viewRecords: mergedRecords,
      lastUpdated: Date.now(),
    });
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const trackView = useCallback((id: number, type: TrendingCategory) => {
    setState(prev => ({
      ...prev,
      viewRecords: [
        { id, type, timestamp: Date.now() },
        ...prev.viewRecords,
      ].slice(0, MAX_RECORDS),
      lastUpdated: Date.now(),
    }));
  }, []);

  const getTrending = useCallback((
    category: TrendingCategory,
    period: TimePeriod,
    limit = 10
  ): TrendingItemWithData[] => {
    if (category === 'legends') {
      return calculateTrending(legends, state.viewRecords, 'legends', period)
        .slice(0, limit) as TrendingLegend[];
    } else if (category === 'products') {
      const trending = calculateTrending(products, state.viewRecords, 'products', period)
        .slice(0, limit);
      return trending.map(item => ({
        ...item,
        sales: Math.floor(item.views * 0.3), // Simulate sales as 30% of views
      })) as TrendingProduct[];
    } else {
      return calculateTrending(news, state.viewRecords, 'news', period)
        .slice(0, limit) as TrendingNewsArticle[];
    }
  }, [state.viewRecords]);

  const getViewCount = useCallback((
    id: number,
    type: TrendingCategory,
    period: TimePeriod
  ): number => {
    const now = Date.now();
    const cutoff = period === 'today'
      ? now - ONE_DAY_MS
      : period === 'week'
        ? now - ONE_WEEK_MS
        : 0;

    return state.viewRecords.filter(r =>
      r.id === id &&
      r.type === type &&
      r.timestamp >= cutoff
    ).length;
  }, [state.viewRecords]);

  const getRank = useCallback((id: number, type: TrendingCategory): number | null => {
    const trending = getTrending(type, 'week', 100);
    const item = trending.find(t => t.id === id);
    return item ? item.currentRank : null;
  }, [getTrending]);

  // Compute trending lists
  const trendingLegends = getTrending('legends', 'week') as TrendingLegend[];
  const trendingProducts = getTrending('products', 'week') as TrendingProduct[];
  const trendingNews = getTrending('news', 'week') as TrendingNewsArticle[];

  return (
    <TrendingContext.Provider
      value={{
        trendingLegends,
        trendingProducts,
        trendingNews,
        trackView,
        getTrending,
        getViewCount,
        getRank,
        isHydrated,
      }}
    >
      {children}
    </TrendingContext.Provider>
  );
}

export function useTrending() {
  const context = useContext(TrendingContext);
  if (context === undefined) {
    throw new Error('useTrending must be used within a TrendingProvider');
  }
  return context;
}

export function useTrackView(id: number, type: TrendingCategory) {
  const { trackView } = useTrending();

  useEffect(() => {
    trackView(id, type);
  }, [id, type, trackView]);
}

// Format view count for display
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
