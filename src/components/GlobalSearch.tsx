'use client';

import AdvancedSearch from './AdvancedSearch';

/**
 * GlobalSearch - Enhanced search component for the World Cup Legends website.
 *
 * Features:
 * - Full-page search overlay (Cmd+K or click to open)
 * - Search across: Legends, Products, News, Teams, Matches
 * - Real-time results as you type (debounced)
 * - Category filters in results
 * - Recent searches (localStorage)
 * - Popular searches section
 * - Keyboard navigation (arrow keys, enter, tab, escape)
 * - Result highlighting of matched text
 * - Quick preview on hover for certain categories
 * - Direct action buttons (e.g., add to cart for products)
 *
 * Usage:
 * Simply include <GlobalSearch /> in your layout or navigation.
 * It renders a trigger button that opens the full search overlay.
 */
export default function GlobalSearch() {
  return <AdvancedSearch />;
}

// Re-export the overlay component for programmatic use
export { SearchOverlay } from './AdvancedSearch';
