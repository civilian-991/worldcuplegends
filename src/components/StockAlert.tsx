'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { STOCK_THRESHOLDS, getStockStatus, type StockStatus } from './StockBadge';

interface StockAlertProps {
  /** Current stock quantity */
  stock: number;
  /** Product name for notifications */
  productName?: string;
  /** Product ID for back-in-stock signup */
  productId?: string | number;
  /** Number of people currently viewing (for urgency) */
  viewersCount?: number;
  /** Show back in stock notification signup when out of stock */
  showBackInStockSignup?: boolean;
  /** Callback when user signs up for back-in-stock notification */
  onBackInStockSignup?: (email: string) => Promise<void>;
  /** Additional CSS classes */
  className?: string;
  /** Hide alert when stock is healthy */
  hideWhenHealthy?: boolean;
}

// Warning icon
const WarningIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Eye icon for viewers
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Bell icon for notifications
const BellIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Fire icon
const FireIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 23C16.5 23 20 19.5 20 15C20 11 17 8.5 17 8.5C17 8.5 16.5 11 15 11C13.5 11 12.5 10 12.5 8.5C12.5 6 14 4 14 4C14 4 10 5 8 8C6 11 6 13 6 15C6 19.5 7.5 23 12 23ZM12 21C9.5 21 8 19 8 17C8 15 9 14 10 13C10 13 10.5 15 12 15C13.5 15 14 13.5 14.5 12.5C15 13.5 16 14.5 16 16C16 18.5 14.5 21 12 21Z" />
  </svg>
);

// Check icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function getAlertConfig(status: StockStatus, stock: number) {
  const configs = {
    'out-of-stock': {
      title: 'Out of Stock',
      message: 'This item is currently unavailable',
      bgGradient: 'from-gray-900/90 to-gray-800/90',
      borderColor: 'border-gray-600/50',
      accentColor: 'text-gray-400',
      progressColor: 'bg-gray-600',
      progressBg: 'bg-gray-800',
      iconBg: 'bg-gray-700/50',
    },
    'critical': {
      title: `Hurry! Only ${stock} ${stock === 1 ? 'item' : 'items'} left`,
      message: 'High demand - order soon to avoid missing out',
      bgGradient: 'from-crimson/20 to-red-900/20',
      borderColor: 'border-crimson/50',
      accentColor: 'text-red-400',
      progressColor: 'bg-gradient-to-r from-crimson to-red-500',
      progressBg: 'bg-red-900/30',
      iconBg: 'bg-crimson/20',
    },
    'selling-fast': {
      title: 'Selling Fast!',
      message: `Only ${stock} ${stock === 1 ? 'item' : 'items'} remaining - high demand`,
      bgGradient: 'from-orange-900/20 to-red-900/20',
      borderColor: 'border-orange-500/50',
      accentColor: 'text-orange-400',
      progressColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      progressBg: 'bg-orange-900/30',
      iconBg: 'bg-orange-500/20',
    },
    'low': {
      title: 'Low Stock',
      message: `${stock} ${stock === 1 ? 'item' : 'items'} remaining`,
      bgGradient: 'from-gold-900/20 to-gold-800/20',
      borderColor: 'border-gold-500/30',
      accentColor: 'text-gold-400',
      progressColor: 'bg-gradient-to-r from-gold-600 to-gold-400',
      progressBg: 'bg-gold-900/30',
      iconBg: 'bg-gold-500/20',
    },
    'in-stock': {
      title: 'In Stock',
      message: 'Ready to ship',
      bgGradient: 'from-green-900/20 to-green-800/20',
      borderColor: 'border-green-500/30',
      accentColor: 'text-green-400',
      progressColor: 'bg-gradient-to-r from-green-600 to-green-400',
      progressBg: 'bg-green-900/30',
      iconBg: 'bg-green-500/20',
    },
  };

  return configs[status];
}

function getStockPercentage(stock: number): number {
  // Assume max stock of 100 for visualization
  const maxStock = 100;
  return Math.min((stock / maxStock) * 100, 100);
}

export default function StockAlert({
  stock,
  productName = 'this item',
  productId,
  viewersCount,
  showBackInStockSignup = true,
  onBackInStockSignup,
  className = '',
  hideWhenHealthy = true,
}: StockAlertProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [displayedViewers, setDisplayedViewers] = useState(viewersCount || 0);

  const status = useMemo(() => getStockStatus(stock, Boolean(viewersCount && viewersCount > 10)), [stock, viewersCount]);
  const config = useMemo(() => getAlertConfig(status, stock), [status, stock]);
  const stockPercentage = useMemo(() => getStockPercentage(stock), [stock]);

  // Simulate fluctuating viewer count for realism
  useEffect(() => {
    if (!viewersCount) return;

    const interval = setInterval(() => {
      setDisplayedViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(1, prev + change);
        return Math.min(newValue, (viewersCount || 0) + 5);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [viewersCount]);

  // Hide if stock is healthy and hideWhenHealthy is true
  if (hideWhenHealthy && status === 'in-stock') {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onBackInStockSignup) {
        await onBackInStockSignup(email);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSubscribed(true);
      setEmail('');
      showToast(`We'll notify you when ${productName} is back in stock!`, 'success');
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOutOfStock = status === 'out-of-stock';
  const isCritical = status === 'critical' || status === 'selling-fast';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} ${className}`}
      >
        {/* Background pulse for critical items */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-crimson/10"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div className="relative p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              className={`flex-shrink-0 p-3 rounded-xl ${config.iconBg}`}
              animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: isCritical ? Infinity : 0 }}
            >
              {isOutOfStock ? (
                <WarningIcon className={`w-6 h-6 ${config.accentColor}`} />
              ) : isCritical ? (
                <FireIcon className={`w-6 h-6 ${config.accentColor}`} />
              ) : (
                <CheckIcon className={`w-6 h-6 ${config.accentColor}`} />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg md:text-xl font-bold text-white mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {config.title}
              </h3>
              <p className="text-white/60 text-sm">{config.message}</p>
            </div>

            {/* Viewers Count */}
            {viewersCount && !isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-night-700/50 rounded-full border border-white/10"
              >
                <EyeIcon className="w-4 h-4 text-gold-400" />
                <motion.span
                  key={displayedViewers}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-white/70"
                >
                  <span className="text-white font-semibold">{displayedViewers}</span> viewing
                </motion.span>
              </motion.div>
            )}
          </div>

          {/* Stock Progress Bar */}
          {!isOutOfStock && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 uppercase tracking-wider">Stock Level</span>
                <span className={`text-xs font-semibold ${config.accentColor}`}>
                  {stock} units
                </span>
              </div>
              <div className={`h-2 rounded-full ${config.progressBg} overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stockPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${config.progressColor}`}
                />
              </div>

              {/* Stock threshold markers */}
              <div className="relative h-4 mt-1">
                <div
                  className="absolute top-0 w-px h-2 bg-red-500/50"
                  style={{ left: `${(STOCK_THRESHOLDS.CRITICAL_MAX / 100) * 100}%` }}
                />
                <div
                  className="absolute top-0 w-px h-2 bg-gold-500/50"
                  style={{ left: `${(STOCK_THRESHOLDS.LOW_MAX / 100) * 100}%` }}
                />
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>Critical</span>
                  <span>Low</span>
                  <span>Healthy</span>
                </div>
              </div>
            </div>
          )}

          {/* Back in Stock Signup */}
          {isOutOfStock && showBackInStockSignup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-4 border-t border-white/10"
            >
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
                >
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <BellIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold">You're on the list!</p>
                    <p className="text-white/50 text-sm">
                      We'll email you when {productName} is back in stock.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BellIcon className="w-5 h-5 text-gold-400" />
                    <h4 className="text-white font-semibold">Get notified when back in stock</h4>
                  </div>
                  <form onSubmit={handleSubscribe} className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50 transition-opacity whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block"
                        >
                          ...
                        </motion.span>
                      ) : (
                        'Notify Me'
                      )}
                    </motion.button>
                  </form>
                  <p className="mt-2 text-xs text-white/30">
                    We'll only email you once when this item is restocked.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Urgency Message for Critical Stock */}
          {isCritical && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-crimson-light"
              >
                ●
              </motion.span>
              <span className="text-white/60">
                {stock <= 2 ? (
                  <>Almost gone! <span className="text-crimson-light font-semibold">Order now</span> to secure yours.</>
                ) : (
                  <>Don't miss out - <span className="text-gold-400 font-semibold">add to cart</span> before it's gone!</>
                )}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export for use in ProductCard enhancements
export type { StockAlertProps };
