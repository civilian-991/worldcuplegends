'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HeroSection() {
  const t = useTranslations('home');
  const [muted, setMuted] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  useEffect(() => {
    if (desktopVideoRef.current) desktopVideoRef.current.muted = muted;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = muted;
  }, [muted]);

  const stats = [
    { value: '170+', label: t('stats.legends') },
    { value: '8', label: t('stats.teams') },
    { value: '7', label: t('stats.matches') },
    { value: '70,000', label: t('stats.seats') },
  ];

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-night-900">

      {/* ─── Video layer with parallax ─── */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-110 origin-center">
        {/* Desktop */}
        <video
          ref={desktopVideoRef}
          autoPlay muted loop playsInline
          onCanPlay={(e) => { (e.target as HTMLVideoElement).muted = false; }}
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          aria-hidden="true"
        >
          <source src="https://upfraliejktotrlwkgfi.supabase.co/storage/v1/object/public/videos/wlc-hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Mobile */}
        <video
          ref={mobileVideoRef}
          autoPlay muted loop playsInline
          onCanPlay={(e) => { (e.target as HTMLVideoElement).muted = false; }}
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          aria-hidden="true"
        >
          <source src="https://upfraliejktotrlwkgfi.supabase.co/storage/v1/object/public/videos/wlc-hero-bg-mobile.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ─── Cinema vignette — frames the video on all sides ─── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 110% 90% at 50% 40%, transparent 55%, rgba(5,5,5,0.55) 100%)' }}
      />

      {/* ─── Bottom scrim — fades video into stage floor ─── */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: '52%', background: 'linear-gradient(to top, #050505 0%, #050505 18%, rgba(5,5,5,0.93) 35%, rgba(5,5,5,0.6) 55%, rgba(5,5,5,0.15) 75%, transparent 100%)' }}
      />

      {/* ─── Mute toggle ─── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-[115px] right-5 md:top-[88px] md:bottom-auto z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(5,5,5,0.55)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.25)',
          color: muted ? 'rgba(255,255,255,0.4)' : 'rgba(212,175,55,0.9)',
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
          </svg>
        )}
      </motion.button>

      {/* ══════════════════════════════════════════
          STAGE FLOOR — the designed bottom panel
      ══════════════════════════════════════════ */}
      <motion.div style={{ opacity: contentOpacity }} className="absolute inset-x-0 bottom-0 z-20">

        {/* Gold hairline — the dividing line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-px origin-left"
          style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.7) 20%, rgba(212,175,55,0.7) 80%, transparent)' }}
        />

        {/* ─── DESKTOP panel ─── */}
        <div className="hidden md:flex items-center px-14 lg:px-20 py-7 gap-0 bg-night-900">

          {/* Left zone: event identity */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex-shrink-0 pr-10 lg:pr-14"
          >
            <p
              className="text-gold-500 text-[10px] tracking-[0.35em] uppercase mb-0.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              World Cup Legends
            </p>
            <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase">
              The Art of Legends · 2026
            </p>
          </motion.div>

          {/* Vertical gold rule */}
          <div className="flex-shrink-0 w-px self-stretch my-1" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.3) 70%, transparent)' }} />

          {/* Center zone: CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex items-center gap-3 px-10 lg:px-14"
          >
            <Link href="/legends">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-7 py-2.5 rounded-full font-bold text-sm overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F5C542, #D4AF37)',
                  color: '#050505',
                  boxShadow: '0 0 24px rgba(212,175,55,0.25)',
                }}
              >
                <span className="relative z-10 tracking-wide">{t('exploreLegends')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-300 to-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.button>
            </Link>

            <Link href="/schedule">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300"
                style={{
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: 'rgba(212,175,55,0.85)',
                  background: 'rgba(212,175,55,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
                }}
              >
                {t('viewSchedule')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Vertical gold rule */}
          <div className="flex-shrink-0 w-px self-stretch my-1" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.3) 70%, transparent)' }} />

          {/* Right zone: stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex items-center gap-8 lg:gap-12 pl-10 lg:pl-14 ml-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-gold-400 font-bold leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}
                >
                  {stat.value}
                </p>
                <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── MOBILE panel ─── */}
        <div className="md:hidden px-5 pt-5 pb-9 bg-night-900">

          {/* CTAs row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-2.5 mb-5"
          >
            <Link href="/legends" className="flex-1">
              <button
                className="w-full py-3 rounded-full font-bold text-sm tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #F5C542, #D4AF37)',
                  color: '#050505',
                  boxShadow: '0 0 20px rgba(212,175,55,0.2)',
                }}
              >
                {t('exploreLegends')}
              </button>
            </Link>
            <Link href="/schedule" className="flex-1">
              <button
                className="w-full py-3 rounded-full font-semibold text-sm tracking-wide"
                style={{
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: 'rgba(212,175,55,0.85)',
                  background: 'rgba(212,175,55,0.04)',
                }}
              >
                {t('viewSchedule')}
              </button>
            </Link>
          </motion.div>

          {/* Thin divider */}
          <div className="h-px mb-4" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.25) 70%, transparent)' }} />

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex items-center justify-between"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-gold-400 font-bold leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
                >
                  {stat.value}
                </p>
                <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Scroll cue (desktop only) ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-[105px] left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-6" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.5))' }} />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-50">
            <path d="M1 1L5 5L9 1" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

    </section>
  );
}
