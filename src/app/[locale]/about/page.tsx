'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: '🌍', title: t('values.unity.title'), description: t('values.unity.description') },
    { icon: '🏆', title: t('values.legacy.title'), description: t('values.legacy.description') },
    { icon: '⭐', title: t('values.excellence.title'), description: t('values.excellence.description') },
    { icon: '❤️', title: t('values.passion.title'), description: t('values.passion.description') },
    { icon: '🤝', title: t('values.respect.title'), description: t('values.respect.description') },
    { icon: '💫', title: t('values.inspiration.title'), description: t('values.inspiration.description') },
  ];

  const timeline = [
    { year: '2023', event: t('journey.2023') },
    { year: '2024', event: t('journey.2024') },
    { year: '2025', event: t('journey.2025') },
    { year: '2026', event: t('journey.2026') },
  ];

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
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('preTitle')}</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gradient-gold">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed">
              {t('heroDescription')}
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
                {t('mission.title')}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {t('mission.paragraph1')}
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {t('mission.paragraph2')}
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                {t('mission.paragraph3')}
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
                    {t('mission.slogan')}
                  </h3>
                  <p className="text-white/60">
                    {t('mission.sloganSubtitle')}
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
              {t('values.title')}
            </h2>
            <p className="text-white/50">{t('values.subtitle')}</p>
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
              {t('journey.title')}
            </h2>
            <p className="text-white/50">{t('journey.subtitle')}</p>
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
              {t('hostNations.title')}
            </h2>
            <p className="text-white/50">{t('hostNations.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { flag: '🇺🇸', name: t('hostNations.unitedStates'), venues: 11 },
              { flag: '🇲🇽', name: t('hostNations.mexico'), venues: 3 },
              { flag: '🇨🇦', name: t('hostNations.canada'), venues: 2 },
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
                <p className="text-gold-400">{nation.venues} {t('hostNations.venues')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
