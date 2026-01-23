'use client';

import { motion } from 'framer-motion';

const values = [
  { icon: '🌍', title: 'Unity', description: 'Bringing together legends from every corner of the world to celebrate the beautiful game.' },
  { icon: '🏆', title: 'Legacy', description: 'Preserving and honoring the achievements of footballs greatest icons for future generations.' },
  { icon: '⭐', title: 'Excellence', description: 'Showcasing the highest standards of football artistry and sportsmanship.' },
  { icon: '❤️', title: 'Passion', description: 'Igniting the love for football that connects billions of fans worldwide.' },
  { icon: '🤝', title: 'Respect', description: 'Honoring the dedication and sacrifice of players who gave everything to the sport.' },
  { icon: '💫', title: 'Inspiration', description: 'Motivating the next generation of footballers through the stories of legends.' },
];

const timeline = [
  { year: '2023', event: 'World Legends Cup concept announced' },
  { year: '2024', event: 'Host nations confirmed: USA, Mexico, Canada' },
  { year: '2025', event: 'Legend selections and team formations begin' },
  { year: '2026', event: 'Tournament kicks off in June' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Our Story</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ABOUT THE <span className="text-gradient-gold">WORLD LEGENDS CUP</span>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed">
              The World Legends Cup is a groundbreaking tournament that brings together the greatest
              footballers in history for one extraordinary celebration of the beautiful game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                OUR MISSION
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                To honor and celebrate the achievements of legendary figures of football, fostering
                a sense of unity, pride, and inspiration across generations.
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                By showcasing these remarkable players and their contributions, the event aims to
                inspire future generations, preserve the legacies of the past, and create unforgettable
                experiences that resonate on a global scale.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                This is more than a tournament—it&apos;s a tribute to the art of football and the
                heroes who have shaped its history.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 glow-gold">
                <div className="text-center">
                  <span className="text-8xl block mb-6">🏆</span>
                  <h3
                    className="text-3xl font-bold text-gold-400 mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    LEGENDS NEVER DIE
                  </h3>
                  <p className="text-white/60">
                    Their legacy lives on through the beautiful game
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              OUR VALUES
            </h2>
            <p className="text-white/50">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center group hover:bg-gold-500/5 transition-colors"
              >
                <span className="text-5xl block mb-4">{value.icon}</span>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-gold-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-white/50 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE JOURNEY
            </h2>
            <p className="text-white/50">From concept to reality</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold-500/30" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <p
                    className="text-4xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.year}
                  </p>
                  <p className="text-white/70 mt-2">{item.event}</p>
                </div>
                <div className="relative z-10 w-4 h-4 rounded-full bg-gold-500 glow-gold-sm" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Nations */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HOST NATIONS
            </h2>
            <p className="text-white/50">Three nations, one legendary tournament</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { flag: '🇺🇸', name: 'United States', venues: 11 },
              { flag: '🇲🇽', name: 'Mexico', venues: 3 },
              { flag: '🇨🇦', name: 'Canada', venues: 2 },
            ].map((nation, index) => (
              <motion.div
                key={nation.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <span className="text-7xl block mb-4">{nation.flag}</span>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {nation.name.toUpperCase()}
                </h3>
                <p className="text-gold-400">{nation.venues} Venues</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
