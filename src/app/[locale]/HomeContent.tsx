'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/HeroSection';
import VideoPlayer from '@/components/VideoPlayer';
import StadiumCarousel from '@/components/StadiumCarousel';
import GlobalReach from '@/components/GlobalReach';
import UpcomingMatches from '@/components/UpcomingMatches';
import TeamCarousel from '@/components/TeamCarousel';
import LegendaryCoaches from '@/components/LegendaryCoaches';
import NewsSection from '@/components/NewsSection';
import LegendMarquee from '@/components/LegendMarquee';

export default function HomeContent() {
  const t = useTranslations('home');

  // Promo video data
  const promoVideo = {
    id: 'YvQKopMBvsg',
    type: 'youtube' as const,
    title: t('promoVideo.videoTitle'),
    description: t('promoVideo.description'),
  };

  return (
    <>
      <HeroSection />

      {/* Promo Video Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-night-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent hidden md:block" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent hidden md:block" />
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4"
            >
              {t('promoVideo.preTitle')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('promoVideo.title')}{' '}
              <span className="text-gradient-gold">{t('promoVideo.titleHighlight')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              {t('promoVideo.description')}
            </motion.p>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glow Effect Behind Video */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-gold-500/20 rounded-3xl blur-2xl opacity-50" />

            {/* Video Container with Border */}
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-black/50">
              <VideoPlayer
                video={promoVideo}
                showInfo={false}
                className="w-full"
              />
            </div>

            {/* Corner Accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold-500/50 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold-500/50 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold-500/50 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold-500/50 rounded-br-lg" />
          </motion.div>
        </div>
      </section>

      {/* Marquee Banner - fetches legends from database */}
      <LegendMarquee />

      {/* Quote Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-night-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-500/10 to-transparent opacity-50 hidden md:block" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="text-gold-400 text-6xl mb-8">&ldquo;</div>
          <blockquote
            className="text-3xl md:text-5xl text-white font-bold leading-tight mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('quote')}
          </blockquote>
          <cite className="text-gold-400 text-xl not-italic">— {t('quoteAuthor')}</cite>
        </motion.div>
      </section>

      <StadiumCarousel />

      <GlobalReach />

      <UpcomingMatches />
      <TeamCarousel />
      <LegendaryCoaches />
      <NewsSection />

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 to-night-900" />

        {/* Stadium Lights Effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('ctaSection.preTitle')}</p>
          <h2
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('ctaSection.title')}
            <span className="text-gradient-gold block">{t('ctaSection.titleHighlight')}</span>
          </h2>
          <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            {t('ctaSection.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Get Tickets button - hidden until ticket link is provided
            <Link href="/tickets">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-full glow-gold"
              >
                {t('ctaSection.getTicketsNow')}
              </motion.button>
            </Link>
            */}
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-gold-500/50 text-gold-400 font-semibold text-lg rounded-full hover:bg-gold-500/10 transition-colors"
              >
                {t('ctaSection.learnMore')}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </section>
    </>
  );
}
