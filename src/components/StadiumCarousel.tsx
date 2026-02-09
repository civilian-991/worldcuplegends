'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Flag from '@/components/Flag';
import { Link } from '@/i18n/navigation';

const stadiums = [
  {
    id: 1,
    name: 'MARACANÃ',
    fullName: 'Estádio Jornalista Mário Filho',
    city: 'Rio de Janeiro',
    countryCode: 'BR',
    image: '/stadium/maracana.jpg',
    tagline: 'THE TEMPLE OF FOOTBALL',
    role: 'THE FINAL',
    matchLabel: 'Final Match',
    stats: [
      { value: '78,838', label: 'CAPACITY' },
      { value: '1950', label: 'OPENED' },
      { value: '199,854', label: 'RECORD ATTENDANCE' },
      { value: '2', label: 'WORLD CUP FINALS' },
    ],
    accentColor: 'gold',
    description: 'Where champions are crowned. The iconic Maracanã will host the ultimate showdown.',
  },
  {
    id: 2,
    name: 'NILTON SANTOS',
    fullName: 'Estádio Olímpico Nilton Santos',
    city: 'Rio de Janeiro',
    countryCode: 'BR',
    image: '/venues/nilton-santos.jpg',
    tagline: 'WHERE LEGENDS ARE FORGED',
    role: 'THE JOURNEY',
    matchLabel: 'Matches 1-6',
    stats: [
      { value: '46,831', label: 'CAPACITY' },
      { value: '2007', label: 'OPENED' },
      { value: '6', label: 'TOURNAMENT MATCHES' },
      { value: '2016', label: 'OLYMPIC GAMES' },
    ],
    accentColor: 'green',
    description: 'The Engenhão - where every legend begins their journey to glory.',
  },
];

export default function StadiumCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeStadium = stadiums[activeIndex];

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stadiums.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 15 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-night-900">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStadium.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0">
            <Image
              src={activeStadium.image}
              alt={activeStadium.fullName}
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_30%]"
            />
          </div>
          {/* Dramatic overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/20 to-night-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-night-900/60 via-transparent to-night-900/60" />

          {/* Accent color line */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${
            activeStadium.accentColor === 'gold' ? 'via-gold-500/50' : 'via-green-500/50'
          } to-transparent`} />
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${
            activeStadium.accentColor === 'gold' ? 'via-gold-500/50' : 'via-green-500/50'
          } to-transparent`} />
        </motion.div>
      </AnimatePresence>

      {/* Animated light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, rotate: -15 }}
          whileInView={{ opacity: 0.1, rotate: -15 }}
          transition={{ duration: 2 }}
          className={`absolute -top-1/2 left-1/4 w-[200px] h-[200%] bg-gradient-to-b ${
            activeStadium.accentColor === 'gold' ? 'from-gold-400/30 via-gold-400/10' : 'from-green-400/30 via-green-400/10'
          } to-transparent blur-3xl`}
        />
        <motion.div
          initial={{ opacity: 0, rotate: 15 }}
          whileInView={{ opacity: 0.1, rotate: 15 }}
          transition={{ duration: 2, delay: 0.3 }}
          className={`absolute -top-1/2 right-1/4 w-[200px] h-[200%] bg-gradient-to-b ${
            activeStadium.accentColor === 'gold' ? 'from-gold-400/30 via-gold-400/10' : 'from-green-400/30 via-green-400/10'
          } to-transparent blur-3xl`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* Role Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`role-${activeStadium.id}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold tracking-[0.3em] ${
                activeStadium.accentColor === 'gold'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {activeStadium.role} — {activeStadium.matchLabel}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-${activeStadium.id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              {/* Location tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-night-800/50 backdrop-blur-sm mb-8"
              >
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  activeStadium.accentColor === 'gold' ? 'bg-gold-500' : 'bg-green-500'
                }`} />
                <span className="text-white/70 text-sm tracking-[0.3em] uppercase">
                  {activeStadium.city}, Brazil
                </span>
                <Flag countryCode={activeStadium.countryCode} size="lg" />
              </motion.div>

              {/* Main title */}
              <h2
                className="text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-tight leading-none mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="block text-white/80">ESTÁDIO</span>
                <span className={`block ${
                  activeStadium.accentColor === 'gold' ? 'text-gradient-gold' : 'text-green-400'
                }`}>
                  {activeStadium.name}
                </span>
              </h2>

              {/* Subtitle */}
              <p
                className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {activeStadium.tagline}
              </p>
              <p className="text-white/40 text-sm italic">
                "{activeStadium.fullName}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Stats Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`stats-${activeStadium.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16"
            >
              {activeStadium.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`relative p-6 md:p-8 rounded-2xl border bg-night-800/30 backdrop-blur-sm text-center ${
                    activeStadium.accentColor === 'gold' ? 'border-gold-500/20' : 'border-green-500/20'
                  }`}
                >
                  {/* Accent corners */}
                  <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl ${
                    activeStadium.accentColor === 'gold' ? 'border-gold-500/50' : 'border-green-500/50'
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl ${
                    activeStadium.accentColor === 'gold' ? 'border-gold-500/50' : 'border-green-500/50'
                  }`} />

                  <p
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                      activeStadium.accentColor === 'gold' ? 'text-gold-400' : 'text-green-400'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-xs md:text-sm tracking-[0.2em] uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-4 mb-12">
            {stadiums.map((stadium, index) => (
              <button
                key={stadium.id}
                onClick={() => handleDotClick(index)}
                className={`group relative flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? stadium.accentColor === 'gold'
                      ? 'bg-gold-500/20 border border-gold-500/50'
                      : 'bg-green-500/20 border border-green-500/50'
                    : 'bg-night-800/50 border border-white/10 hover:border-white/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? stadium.accentColor === 'gold' ? 'bg-gold-400' : 'bg-green-400'
                    : 'bg-white/30 group-hover:bg-white/50'
                }`} />
                <span className={`text-sm font-medium transition-colors ${
                  index === activeIndex ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                }`}>
                  {stadium.name}
                </span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link href="/venues">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-4 font-bold text-lg rounded-full shadow-lg transition-shadow ${
                  activeStadium.accentColor === 'gold'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 shadow-gold-500/20 hover:shadow-gold-500/40'
                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/20 hover:shadow-green-500/40'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                EXPLORE VENUES
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-night-800 z-20">
        <motion.div
          key={activeIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear' }}
          className={`h-full ${
            activeStadium.accentColor === 'gold' ? 'bg-gold-500' : 'bg-green-500'
          }`}
        />
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-700 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
