'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'highlight' | 'compact';
  delay?: number;
  duration?: number;
  decimals?: number;
  isLive?: boolean;
}

export default function StatCard({
  value,
  label,
  suffix = '',
  prefix = '',
  icon,
  trend,
  variant = 'default',
  delay = 0,
  duration = 2,
  decimals = 0,
  isLive = false,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  // Animate number counting
  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime - delay * 1000;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, delay, duration]);

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  const baseClasses = 'relative overflow-hidden rounded-2xl transition-all duration-500';

  const variantClasses = {
    default: 'glass p-6 md:p-8',
    highlight: 'glass-gold p-6 md:p-8 glow-gold-sm',
    compact: 'glass p-4',
  };

  const numberClasses = {
    default: 'text-4xl md:text-5xl lg:text-6xl',
    highlight: 'text-5xl md:text-6xl lg:text-7xl',
    compact: 'text-2xl md:text-3xl',
  };

  const labelClasses = {
    default: 'text-sm md:text-base',
    highlight: 'text-base md:text-lg',
    compact: 'text-xs md:text-sm',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`${baseClasses} ${variantClasses[variant]} group`}
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Live Pulse Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Live</span>
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          {/* Icon */}
          {icon && (
            <div className="mb-4 text-gold-400 opacity-80">
              {icon}
            </div>
          )}

          {/* Number */}
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span
                className={`${numberClasses[variant]} font-bold text-gold-400`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {prefix}
              </span>
            )}
            <span
              className={`${numberClasses[variant]} font-bold text-gold-400 stat-number`}
              style={{
                fontFamily: 'var(--font-display)',
                textShadow: variant === 'highlight'
                  ? '0 0 60px rgba(212, 175, 55, 0.6)'
                  : '0 0 40px rgba(212, 175, 55, 0.4)'
              }}
            >
              {formattedValue}
            </span>
            {suffix && (
              <span
                className={`${variant === 'compact' ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-gold-400/70`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {suffix}
              </span>
            )}
          </div>

          {/* Label */}
          <p
            className={`${labelClasses[variant]} text-white/60 mt-2 uppercase tracking-wider`}
          >
            {label}
          </p>

          {/* Trend Indicator */}
          {trend && (
            <div className={`flex items-center gap-1 mt-3 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <svg
                className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm font-semibold">
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Corner Accent */}
      {variant === 'highlight' && (
        <>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gold-500/10 to-transparent" />
        </>
      )}

      {/* Bottom Accent Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent origin-left"
      />
    </motion.div>
  );
}
