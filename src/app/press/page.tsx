'use client';

import { motion } from 'framer-motion';

const pressReleases = [
  {
    date: 'Jan 8, 2026',
    title: 'World Legends Cup Announces Final Host City Selection',
    excerpt: 'MetLife Stadium confirmed as venue for the tournament final.',
  },
  {
    date: 'Jan 5, 2026',
    title: 'Legendary Players Confirmed for Opening Match',
    excerpt: 'Brazil and Germany legends to face off in historic opener.',
  },
  {
    date: 'Dec 20, 2025',
    title: 'Broadcast Partners Announced for Global Coverage',
    excerpt: 'Tournament to be broadcast in over 200 countries worldwide.',
  },
  {
    date: 'Dec 15, 2025',
    title: 'Official Tournament Ball Unveiled',
    excerpt: 'Adidas reveals commemorative ball design honoring football legends.',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Media</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              PRESS <span className="text-gradient-gold">CENTER</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Official press releases, media resources, and accreditation information
              for journalists covering the World Legends Cup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-12 px-6 bg-gold-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-night-900">
            <p className="font-bold text-lg">Media Inquiries</p>
            <p className="opacity-70">For press inquiries, contact our media relations team</p>
          </div>
          <a
            href="mailto:press@worldlegendscup.com"
            className="px-8 py-3 bg-night-900 text-gold-400 font-bold rounded-full hover:bg-night-800 transition-colors"
          >
            press@worldlegendscup.com
          </a>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LATEST PRESS RELEASES
            </h2>
          </motion.div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 group cursor-pointer hover:bg-gold-500/5 transition-colors"
              >
                <p className="text-gold-400 text-sm mb-2">{release.date}</p>
                <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-gold-400 transition-colors">
                  {release.title}
                </h3>
                <p className="text-white/50">{release.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Resources */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MEDIA RESOURCES
            </h2>
            <p className="text-white/50">Download official assets and materials</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📸', title: 'Photo Gallery', desc: 'High-resolution images' },
              { icon: '🎬', title: 'Video Assets', desc: 'B-roll and highlights' },
              { icon: '📁', title: 'Press Kit', desc: 'Logos, facts & figures' },
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-8 text-center group cursor-pointer hover:bg-gold-500/5 transition-colors"
              >
                <span className="text-5xl block mb-4">{resource.icon}</span>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-white/50 text-sm mb-4">{resource.desc}</p>
                <button className="text-gold-400 text-sm font-semibold">Download →</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-6xl block mb-6">🎫</span>
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MEDIA ACCREDITATION
            </h2>
            <p className="text-white/60 mb-8">
              Journalists and photographers can apply for media accreditation
              to cover the World Legends Cup. Applications open February 2026.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
            >
              Apply for Accreditation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
