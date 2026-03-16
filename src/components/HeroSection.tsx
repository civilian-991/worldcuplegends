'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

function generateParticles(count: number) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: `${(i * 3.33) % 100}%`,
      size: 2 + (i % 4),
      duration: 6 + (i % 8),
      delay: (i * 0.4) % 10,
      opacity: 0.4 + ((i % 4) * 0.12),
      drift: ((i % 7) - 3) * 12,
    });
  }
  return particles;
}

export default function HeroSection() {
  const t = useTranslations('home');
  const [muted, setMuted] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroWords = ['LEGENDS', 'GLORY', 'PASSION', 'HISTORY', 'LEGACY'];
  const particles = useMemo(() => generateParticles(25), []);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % heroWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [heroWords.length]);

  useEffect(() => {
    if (desktopVideoRef.current) desktopVideoRef.current.muted = muted;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = muted;
  }, [muted]);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">

      {/* ===== VIDEO BACKGROUNDS ===== */}
      <motion.div style={{ y }} className="absolute inset-0">
        {/* Desktop — landscape 1920×1080 */}
        <video
          ref={desktopVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          aria-hidden="true"
          onCanPlay={(e) => { (e.target as HTMLVideoElement).muted = false; }}
        >
          <source
            src="https://upfraliejktotrlwkgfi.supabase.co/storage/v1/object/public/videos/wlc-hero-bg.mp4"
            type="video/mp4"
          />
        </video>

        {/* Mobile — portrait 800×1200 */}
        <video
          ref={mobileVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          aria-hidden="true"
          onCanPlay={(e) => { (e.target as HTMLVideoElement).muted = false; }}
        >
          <source
            src="https://upfraliejktotrlwkgfi.supabase.co/storage/v1/object/public/videos/wlc-hero-bg-mobile.mp4"
            type="video/mp4"
          />
        </video>

      </motion.div>

      {/* ===== GOLDEN PARTICLES ===== */}
      <div className="absolute inset-0 z-[13] pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--particle-drift': `${p.drift}px`,
              '--particle-opacity': p.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ===== LEFT-SIDE CONTENT ===== */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex items-center"
      >
        <div className="px-8 md:px-14 lg:px-20 max-w-xl lg:max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass border border-gold-500/30 text-gold-400 text-xs tracking-[0.25em] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            World Cup Legends · 2026
          </motion.div>

          {/* Cycling word */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-3"
          >
            <p className="text-white/40 text-sm md:text-base tracking-[0.3em] uppercase mb-1">
              The Art of
            </p>
            <h1
              className="text-[5.5rem] md:text-[7rem] lg:text-[9rem] font-bold leading-none tracking-tight text-gradient-gold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {heroWords[currentWord].split('').map((char, i) => (
                <motion.span
                  key={`${currentWord}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm"
          >
            The greatest players of their generation. One tournament. One unforgettable summer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/legends">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-7 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-base rounded-full overflow-hidden glow-gold"
              >
                <span className="relative z-10">{t('exploreLegends')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
            </Link>

            <Link href="/schedule">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 border border-gold-500/40 text-gold-400 font-semibold text-base rounded-full hover:bg-gold-500/10 hover:border-gold-500/70 transition-all"
              >
                {t('viewSchedule')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats — left-aligned under CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10"
          >
            {[
              { value: '170+', label: t('stats.legends') },
              { value: '8', label: t('stats.teams') },
              { value: '7', label: t('stats.matches') },
              { value: '70K', label: t('stats.seats') },
            ].map((stat, i) => (
              <div key={i}>
                <p
                  className="text-2xl md:text-3xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs tracking-wider uppercase mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ===== MUTE TOGGLE — bottom right ===== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-10 right-6 z-30 w-10 h-10 rounded-full glass border border-gold-500/30 flex items-center justify-center text-gold-400 hover:text-gold-200 hover:border-gold-400/60 transition-all"
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
            <span className="absolute inset-0 rounded-full border border-gold-400/40 animate-ping" />
          </>
        )}
      </motion.button>

      {/* ===== SCROLL INDICATOR — bottom center ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-9 rounded-full border border-gold-400/25 flex justify-center pt-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-0.5 h-2 bg-gold-400/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
