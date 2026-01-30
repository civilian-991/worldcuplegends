'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/data/products';
import { Legend } from '@/data/legends';

// Type definitions for viewed items
export interface ViewedProduct {
  type: 'product';
  item: Product;
  viewedAt: number;
}

export interface ViewedLegend {
  type: 'legend';
  item: Legend;
  viewedAt: number;
}

export interface ViewedArticle {
  type: 'article';
  item: {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
  };
  viewedAt: number;
}

export type ViewedItem = ViewedProduct | ViewedLegend | ViewedArticle;

interface RecentlyViewedState {
  products: ViewedProduct[];
  legends: ViewedLegend[];
  articles: ViewedArticle[];
}

interface RecentlyViewedContextType {
  // State
  products: ViewedProduct[];
  legends: ViewedLegend[];
  articles: ViewedArticle[];

  // Actions
  addViewedProduct: (product: Product) => void;
  addViewedLegend: (legend: Legend) => void;
  addViewedArticle: (article: ViewedArticle['item']) => void;

  // Utilities
  clearHistory: (category?: 'products' | 'legends' | 'articles') => void;
  getRecentItems: (count?: number) => ViewedItem[];
  getRelatedProducts: (currentProductId: number, count?: number) => ViewedProduct[];
  getRelatedLegends: (currentLegendId: number, count?: number) => ViewedLegend[];

  // Loading state
  isHydrated: boolean;
}

const STORAGE_KEY = 'wlc-recently-viewed';
const MAX_ITEMS_PER_CATEGORY = 20;
const MAX_AGE_DAYS = 30;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

function cleanOldItems<T extends { viewedAt: number }>(items: T[]): T[] {
  const now = Date.now();
  return items.filter(item => now - item.viewedAt < MAX_AGE_MS);
}

function addItemToList<T extends { viewedAt: number }>(
  items: T[],
  newItem: T,
  getId: (item: T) => number
): T[] {
  // Remove existing entry if present
  const filtered = items.filter(item => getId(item) !== getId(newItem));
  // Add new item at the beginning
  const updated = [newItem, ...filtered];
  // Limit to max items
  return updated.slice(0, MAX_ITEMS_PER_CATEGORY);
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RecentlyViewedState>({
    products: [],
    legends: [],
    articles: [],
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as RecentlyViewedState;
        setState({
          products: cleanOldItems(parsed.products || []),
          legends: cleanOldItems(parsed.legends || []),
          articles: cleanOldItems(parsed.articles || []),
        });
      } catch (e) {
        console.error('Failed to parse recently viewed data:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const addViewedProduct = useCallback((product: Product) => {
    setState(prev => ({
      ...prev,
      products: addItemToList(
        prev.products,
        { type: 'product', item: product, viewedAt: Date.now() },
        (p) => p.item.id
      ),
    }));
  }, []);

  const addViewedLegend = useCallback((legend: Legend) => {
    setState(prev => ({
      ...prev,
      legends: addItemToList(
        prev.legends,
        { type: 'legend', item: legend, viewedAt: Date.now() },
        (l) => l.item.id
      ),
    }));
  }, []);

  const addViewedArticle = useCallback((article: ViewedArticle['item']) => {
    setState(prev => ({
      ...prev,
      articles: addItemToList(
        prev.articles,
        { type: 'article', item: article, viewedAt: Date.now() },
        (a) => a.item.id
      ),
    }));
  }, []);

  const clearHistory = useCallback((category?: 'products' | 'legends' | 'articles') => {
    if (category) {
      setState(prev => ({
        ...prev,
        [category]: [],
      }));
    } else {
      setState({
        products: [],
        legends: [],
        articles: [],
      });
    }
  }, []);

  const getRecentItems = useCallback((count = 10): ViewedItem[] => {
    const allItems: ViewedItem[] = [
      ...state.products,
      ...state.legends,
      ...state.articles,
    ];
    return allItems
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, count);
  }, [state]);

  const getRelatedProducts = useCallback((currentProductId: number, count = 5): ViewedProduct[] => {
    return state.products
      .filter(p => p.item.id !== currentProductId)
      .slice(0, count);
  }, [state.products]);

  const getRelatedLegends = useCallback((currentLegendId: number, count = 5): ViewedLegend[] => {
    return state.legends
      .filter(l => l.item.id !== currentLegendId)
      .slice(0, count);
  }, [state.legends]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        products: state.products,
        legends: state.legends,
        articles: state.articles,
        addViewedProduct,
        addViewedLegend,
        addViewedArticle,
        clearHistory,
        getRecentItems,
        getRelatedProducts,
        getRelatedLegends,
        isHydrated,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

// Utility function to format time ago
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `Viewed ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `Viewed ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 30) {
    return `Viewed ${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return 'Viewed over a month ago';
  }
}
