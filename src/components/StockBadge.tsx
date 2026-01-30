'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

// Stock thresholds
const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,
  CRITICAL_MAX: 5,
  LOW_MAX: 15,
} as const;

type StockStatus = 'out-of-stock' | 'critical' | 'low' | 'selling-fast' | 'in-stock';

type BadgeVariant = 'only-x-left' | 'low-stock' | 'in-stock' | 'out-of-stock' | 'selling-fast';

type BadgeSize = 'sm' | 'md' | 'lg';

interface StockBadgeProps {
  /** Current stock quantity */
  stock: number;
  /** Force a specific badge variant (overrides automatic detection) */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Show icon alongside text */
  showIcon?: boolean;
  /** Show exact stock count in tooltip on hover */
  showTooltip?: boolean;
  /** Mark item as selling fast (high demand) */
  sellingFast?: boolean;
  /** Hide badge when stock is healthy (16+) */
  hideWhenInStock?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Fire icon for selling fast
const FireIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 23C16.5 23 20 19.5 20 15C20 11 17 8.5 17 8.5C17 8.5 16.5 11 15 11C13.5 11 12.5 10 12.5 8.5C12.5 6 14 4 14 4C14 4 10 5 8 8C6 11 6 13 6 15C6 19.5 7.5 23 12 23ZM12 21C9.5 21 8 19 8 17C8 15 9 14 10 13C10 13 10.5 15 12 15C13.5 15 14 13.5 14.5 12.5C15 13.5 16 14.5 16 16C16 18.5 14.5 21 12 21Z" />
  </svg>
);

// Warning icon for low stock
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

// Check icon for in stock
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

// X icon for out of stock
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function getStockStatus(stock: number, sellingFast?: boolean): StockStatus {
  if (stock <= STOCK_THRESHOLDS.OUT_OF_STOCK) return 'out-of-stock';
  if (sellingFast && stock <= STOCK_THRESHOLDS.LOW_MAX) return 'selling-fast';
  if (stock <= STOCK_THRESHOLDS.CRITICAL_MAX) return 'critical';
  if (stock <= STOCK_THRESHOLDS.LOW_MAX) return 'low';
  return 'in-stock';
}

function getBadgeConfig(status: StockStatus, stock: number, variant?: BadgeVariant) {
  // Allow variant override
  const effectiveVariant = variant || (
    status === 'out-of-stock' ? 'out-of-stock' :
    status === 'critical' ? 'only-x-left' :
    status === 'selling-fast' ? 'selling-fast' :
    status === 'low' ? 'low-stock' :
    'in-stock'
  );

  const configs = {
    'only-x-left': {
      text: `Only ${stock} left!`,
      bgColor: 'bg-gradient-to-r from-crimson to-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-500/50',
      pulseColor: 'rgba(139, 0, 0, 0.4)',
      shouldPulse: true,
      icon: WarningIcon,
    },
    'low-stock': {
      text: 'Low Stock',
      bgColor: 'bg-gradient-to-r from-gold-600 to-gold-500',
      textColor: 'text-night-900',
      borderColor: 'border-gold-400/50',
      pulseColor: 'rgba(212, 175, 55, 0.3)',
      shouldPulse: false,
      icon: WarningIcon,
    },
    'in-stock': {
      text: 'In Stock',
      bgColor: 'bg-gradient-to-r from-green-600 to-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-400/50',
      pulseColor: 'rgba(34, 197, 94, 0.3)',
      shouldPulse: false,
      icon: CheckIcon,
    },
    'out-of-stock': {
      text: 'Out of Stock',
      bgColor: 'bg-gradient-to-r from-gray-700 to-gray-600',
      textColor: 'text-white/80',
      borderColor: 'border-gray-500/50',
      pulseColor: 'rgba(107, 114, 128, 0.3)',
      shouldPulse: false,
      icon: XIcon,
    },
    'selling-fast': {
      text: 'Selling Fast',
      bgColor: 'bg-gradient-to-r from-orange-600 via-red-500 to-crimson',
      textColor: 'text-white',
      borderColor: 'border-orange-400/50',
      pulseColor: 'rgba(249, 115, 22, 0.4)',
      shouldPulse: true,
      icon: FireIcon,
    },
  };

  return configs[effectiveVariant];
}

const sizeClasses = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1',
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-4 py-1.5',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
};

export default function StockBadge({
  stock,
  variant,
  size = 'md',
  showIcon = true,
  showTooltip = false,
  sellingFast = false,
  hideWhenInStock = true,
  className = '',
}: StockBadgeProps) {
  const status = useMemo(() => getStockStatus(stock, sellingFast), [stock, sellingFast]);
  const config = useMemo(() => getBadgeConfig(status, stock, variant), [status, stock, variant]);
  const sizeConfig = sizeClasses[size];

  // Hide badge when in stock and hideWhenInStock is true
  if (hideWhenInStock && status === 'in-stock' && !variant) {
    return null;
  }

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`relative inline-flex items-center ${sizeConfig.gap} ${sizeConfig.padding} ${config.bgColor} ${config.textColor} ${sizeConfig.text} font-bold rounded-full border ${config.borderColor} ${className}`}
        title={showTooltip ? `${stock} items in stock` : undefined}
      >
        {/* Pulse animation for critical/selling fast */}
        {config.shouldPulse && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: config.pulseColor }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: config.pulseColor }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Icon */}
        {showIcon && (
          <motion.span
            className="relative z-10"
            animate={config.shouldPulse ? { scale: [1, 1.1, 1] } : {}}
            transition={{
              duration: 0.8,
              repeat: config.shouldPulse ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <IconComponent className={sizeConfig.icon} />
          </motion.span>
        )}

        {/* Text */}
        <span className="relative z-10 whitespace-nowrap">
          {/* Animated number for "Only X left!" */}
          {status === 'critical' && !variant && (
            <motion.span
              key={stock}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline"
            >
              {config.text}
            </motion.span>
          )}
          {(status !== 'critical' || variant) && config.text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// Export types and utilities for use in other components
export { STOCK_THRESHOLDS, getStockStatus };
export type { StockStatus, BadgeVariant, BadgeSize, StockBadgeProps };
