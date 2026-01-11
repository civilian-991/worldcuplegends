'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const words = ['LEGENDS', 'GLORY', 'PASSION', 'HISTORY', 'LEGACY'];

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Video/Image Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/banners/hero-home.png)' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/50 to-night-900 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night-900/80 via-transparent to-night-900/80 z-10" />
      </motion.div>

      {/* Stadium Lights Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[150px] stadium-light" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[150px] stadium-light" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-20 h-full flex flex-col items-center justify-center px-6"
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
          <span className="text-gold-400 text-sm tracking-[0.4em] uppercase font-medium">
            World Legends Cup 2026
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
        </motion.div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-gradient-gold">
              {words[currentWord].split('').map((char, i) => (
                <motion.span
                  key={`${currentWord}-${i}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-2xl md:text-4xl text-white/90 mt-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            NEVER DIE
          </motion.p>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-white/60 text-lg md:text-xl text-center max-w-2xl mb-12"
        >
          The greatest footballers in history unite for one legendary tournament.
          <br />
          <span className="text-gold-400">USA • Mexico • Canada</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-full overflow-hidden glow-gold"
          >
            <span className="relative z-10">Explore Legends</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-gold-500/50 text-gold-400 font-semibold text-lg rounded-full hover:bg-gold-500/10 transition-colors"
          >
            View Schedule
          </motion.button>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-16 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center gap-12 md:gap-20">
            {[
              { value: '100+', label: 'Legends' },
              { value: '32', label: 'Teams' },
              { value: '48', label: 'Matches' },
              { value: '3', label: 'Host Nations' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gold-400/30 flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-gold-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
