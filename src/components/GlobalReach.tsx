'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { id: 'countries', value: 75, suffix: '' },
  { id: 'tvAudience', value: 3, suffix: 'B', prefix: '' },
  { id: 'broadcastReach', value: 900, suffix: 'M' },
  { id: 'digitalReach', value: 1, suffix: 'B' },
  { id: 'legends', value: 170, suffix: '+' },
];

// Icon components for each stat
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <path d="M17 2l-5 5-5-5" />
    </svg>
  );
}

function BroadcastIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  );
}

function DigitalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  countries: GlobeIcon,
  tvAudience: TvIcon,
  broadcastReach: BroadcastIcon,
  digitalReach: DigitalIcon,
  legends: StarIcon,
};

// Animated counter component
function AnimatedCounter({
  value,
  suffix,
  prefix = '',
  isInView
}: {
  value: number;
  suffix: string;
  prefix?: string;
  isInView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    damping: 40,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default function GlobalReach() {
  const t = useTranslations('home.globalReach');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden bg-night-900"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="hidden md:block absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4"
          >
            {t('preTitle')}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')} <span className="text-gradient-gold">{t('titleHighlight')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.id];

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative p-6 md:p-8 rounded-2xl border border-gold-500/20 bg-night-800/40 backdrop-blur-md overflow-hidden h-full">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl transition-colors group-hover:border-gold-500/60" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl transition-colors group-hover:border-gold-500/60" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.1,
                        type: 'spring',
                      }}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center mb-4 group-hover:from-gold-500/30 group-hover:to-gold-600/20 transition-all duration-300"
                    >
                      <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-gold-400 group-hover:text-gold-300 transition-colors" />
                    </motion.div>

                    {/* Animated number */}
                    <motion.p
                      className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        isInView={isInView}
                      />
                    </motion.p>

                    {/* Label */}
                    <p className="text-white/50 text-xs md:text-sm tracking-[0.15em] uppercase">
                      {t(`stats.${stat.id}`)}
                    </p>
                  </div>

                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p
            className="text-white/40 text-lg tracking-wide"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('tagline')}
          </p>
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
}
