'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const partners = [
  { name: 'Red Sea Global', logo: '/sponsors/red-sea-global.png', tier: 'Title Partner' },
  { name: 'Partner', logo: '/sponsors/sponsor-2.png', tier: 'Official Partner' },
  { name: 'Van Wagner', logo: '/sponsors/van-wagner.png', tier: 'Official Partner' },
  { name: 'Partner', logo: '/sponsors/sponsor-4.png', tier: 'Official Partner' },
  { name: 'Partner', logo: '/sponsors/sponsor-5.png', tier: 'Official Partner' },
  { name: 'All American Licensing', logo: '/sponsors/all-american-licensing.png', tier: 'Official Partner' },
  { name: 'Sport Five', logo: '/sponsors/sport-five.png', tier: 'Official Partner' },
];

export default function PartnersContent() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />

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
              world-class partners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid */}
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
              OUR PARTNERS
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              World-class brands supporting the celebration of football&apos;s greatest legends
            </p>
          </motion.div>

          {/* Main Partners Display */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-2xl p-8 h-48 flex items-center justify-center group-hover:bg-gold-500/5 transition-all duration-300 group-hover:border-gold-500/30">
                  <Image
                    src={partner.logo}
                    alt={partner.name === 'Partner' ? '' : partner.name}
                    width={220}
                    height={110}
                    className="max-h-28 max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden={partner.name === 'Partner' ? true : undefined}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Marquee */}
      <section className="py-16 bg-night-800 overflow-hidden">
        <div className="relative">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-16 items-center"
          >
            {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <Image
                key={index}
                src={partner.logo}
                alt={partner.name === 'Partner' ? '' : partner.name}
                width={180}
                height={72}
                className="h-16 w-auto object-contain opacity-50 flex-shrink-0"
                aria-hidden={partner.name === 'Partner' ? true : undefined}
              />
            ))}
          </motion.div>
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
