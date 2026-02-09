'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Flag from '@/components/Flag';

const stats = [
  { value: '78,838', label: 'CAPACITY', suffix: '' },
  { value: '1950', label: 'OPENED', suffix: '' },
  { value: '199,854', label: 'RECORD ATTENDANCE', suffix: '' },
  { value: '2', label: 'WORLD CUP FINALS', suffix: '' },
];

const legendaryMoments = [
  { year: '1950', event: 'First World Cup Final - Uruguay defeats Brazil' },
  { year: '2014', event: 'Germany wins World Cup Final vs Argentina' },
  { year: '2016', event: 'Olympic Games Opening Ceremony' },
  { year: '2026', event: 'World Legends Cup - The Return of Glory' },
];

export default function MaracanaShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-night-900">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Stadium Image */}
        <div className="absolute inset-0">
          <Image
            src="/stadium/maracana.jpg"
            alt="Maracana Stadium"
            fill
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
        </div>
        {/* Dramatic overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/20 to-night-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-night-900/60 via-transparent to-night-900/60" />

        {/* Brazilian flag color accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      </motion.div>

      {/* Animated light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, rotate: -15 }}
          whileInView={{ opacity: 0.1, rotate: -15 }}
          transition={{ duration: 2 }}
          className="absolute -top-1/2 left-1/4 w-[200px] h-[200%] bg-gradient-to-b from-gold-400/30 via-gold-400/10 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, rotate: 15 }}
          whileInView={{ opacity: 0.1, rotate: 15 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute -top-1/2 right-1/4 w-[200px] h-[200%] bg-gradient-to-b from-gold-400/30 via-gold-400/10 to-transparent blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Location tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gold-500/30 bg-night-800/50 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">
                Rio de Janeiro, Brazil
              </span>
              <Flag countryCode="BR" size="lg" />
            </motion.div>

            {/* Main title */}
            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                ESTÁDIO
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block text-gradient-gold"
              >
                MARACANÃ
              </motion.span>
            </h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE TEMPLE OF FOOTBALL
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                className="relative p-6 md:p-8 rounded-2xl border border-gold-500/20 bg-night-800/30 backdrop-blur-sm text-center group transition-colors"
              >
                {/* Accent corner */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/50 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/50 rounded-br-2xl" />

                <motion.p
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold-400 mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: 'spring' }}
                >
                  {stat.value}
                  <span className="text-gold-500/70">{stat.suffix}</span>
                </motion.p>
                <p className="text-white/50 text-xs md:text-sm tracking-[0.2em] uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline of Legendary Moments */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-8 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDARY <span className="text-gold-400">MOMENTS</span>
            </h3>

            {/* Timeline line */}
            <div className="absolute left-1/2 top-20 bottom-0 w-px bg-gradient-to-b from-gold-500/50 via-gold-500/20 to-transparent hidden md:block" />

            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
              {legendaryMoments.map((moment, index) => (
                <motion.div
                  key={moment.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`relative flex items-center gap-4 p-4 md:p-6 rounded-xl border border-white/10 bg-night-800/20 backdrop-blur-sm hover:border-gold-500/30 transition-colors ${
                    index % 2 === 0 ? 'md:text-right md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Year badge */}
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <span
                      className="text-night-900 text-lg md:text-xl font-bold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {moment.year}
                    </span>
                  </div>

                  {/* Event description */}
                  <p className="text-white/80 text-sm md:text-base flex-1">
                    {moment.event}
                  </p>

                  {/* Highlight for 2026 */}
                  {moment.year === '2026' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 px-3 py-1 bg-gold-500 text-night-900 text-xs font-bold rounded-full"
                    >
                      UPCOMING
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <p className="text-white/60 text-lg mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              WHERE LEGENDS BECOME IMMORTAL
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              EXPLORE VENUE
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-700 to-transparent z-20" />
    </section>
  );
}
