'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('preTitle')}</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gradient-gold">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl font-bold text-white mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('form.title')}
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/50 text-sm mb-2">{t('form.firstName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder={t('form.firstNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-sm mb-2">{t('form.lastName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder={t('form.lastNamePlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2">{t('form.email')}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2">{t('form.subject')}</label>
                  <select className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer">
                    <option value="">{t('form.selectTopic')}</option>
                    <option value="tickets">{t('form.ticketsBooking')}</option>
                    <option value="media">{t('form.mediaPress')}</option>
                    <option value="partnership">{t('form.partnershipInquiries')}</option>
                    <option value="general">{t('form.generalQuestions')}</option>
                    <option value="other">{t('form.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2">{t('form.message')}</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-night-600 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                    placeholder={t('form.messagePlaceholder')}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full hover:from-gold-400 hover:to-gold-500 transition-all"
                >
                  {t('form.sendMessage')}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2
                className="text-3xl font-bold text-white mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('info.title')}
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: '📧',
                    title: t('info.emailTitle'),
                    content: t('info.emailContent'),
                    sub: t('info.emailSub'),
                  },
                  {
                    icon: '📞',
                    title: t('info.phoneTitle'),
                    content: t('info.phoneContent'),
                    sub: t('info.phoneSub'),
                  },
                  {
                    icon: '📍',
                    title: t('info.headquarters'),
                    content: t('info.headquartersContent'),
                    sub: t('info.headquartersSub'),
                  },
                ].map((item) => (
                  <div key={item.title} className="glass rounded-xl p-6 flex items-start gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-white/50 text-sm">{item.title}</p>
                      <p className="text-white font-semibold text-lg">{item.content}</p>
                      <p className="text-white/40 text-sm">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <p className="text-white/50 text-sm mb-4">{t('info.followUs')}</p>
                <div className="flex gap-4">
                  {['𝕏', '📷', '▶', '♪'].map((icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-night-600 border border-gold-500/20 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="glass rounded-xl p-6 mt-8">
                <h3 className="text-white font-semibold mb-2">{t('info.quickAnswers')}</h3>
                <p className="text-white/50 text-sm mb-4">
                  {t('info.quickAnswersDescription')}
                </p>
                <Link href="/faq" className="text-gold-400 hover:text-gold-300 text-sm font-semibold">
                  {t('info.viewFAQ')} →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
