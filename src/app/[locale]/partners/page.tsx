'use client';

import { motion } from 'framer-motion';

const partners = {
  title: [
    { name: 'Global Sports Corp', tier: 'Title Partner' },
    { name: 'TechVision', tier: 'Title Partner' },
  ],
  official: [
    { name: 'SportWear Pro', category: 'Official Kit Partner' },
    { name: 'AirTravel Plus', category: 'Official Airline' },
    { name: 'StayWorld Hotels', category: 'Official Hotel Partner' },
    { name: 'DrinkFresh', category: 'Official Beverage' },
    { name: 'AutoDrive', category: 'Official Automotive Partner' },
    { name: 'BankGlobal', category: 'Official Banking Partner' },
  ],
  media: [
    { name: 'SportTV Network', type: 'Broadcast Partner' },
    { name: 'GlobalStream', type: 'Streaming Partner' },
    { name: 'RadioSport', type: 'Radio Partner' },
  ],
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Our Partners</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              OFFICIAL <span className="text-gradient-gold">PARTNERS</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              The World Legends Cup is made possible by the support of our
              world-class partners and sponsors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Title Partners */}
      <section className="py-24 px-6">
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
              TITLE PARTNERS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.title.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-12 text-center glow-gold"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center">
                  <span className="text-5xl">🏆</span>
                </div>
                <h3
                  className="text-2xl font-bold text-gold-400 mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {partner.name.toUpperCase()}
                </h3>
                <p className="text-white/50">{partner.tier}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Partners */}
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
              OFFICIAL PARTNERS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.official.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center group hover:bg-gold-500/5 transition-colors"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-night-600 flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-gold-400 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-gold-400/70 text-sm">{partner.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Partners */}
      <section className="py-24 px-6">
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
              MEDIA PARTNERS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.media.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <span className="text-4xl block mb-4">📺</span>
                <h3 className="text-white font-semibold">{partner.name}</h3>
                <p className="text-white/50 text-sm">{partner.type}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-24 px-6 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl font-bold text-night-900 mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BECOME A PARTNER
            </h2>
            <p className="text-night-900/70 mb-8 max-w-2xl mx-auto">
              Join the world&apos;s most prestigious brands in supporting the celebration
              of football&apos;s greatest legends. Partnership opportunities available.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-night-900 text-gold-400 font-bold rounded-full"
            >
              Partnership Inquiries
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
