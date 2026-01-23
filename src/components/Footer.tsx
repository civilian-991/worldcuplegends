'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const socialLinks = [
  { label: 'Twitter', icon: '𝕏' },
  { label: 'Instagram', icon: '📷' },
  { label: 'YouTube', icon: '▶' },
  { label: 'TikTok', icon: '♪' },
];

export default function Footer() {
  const t = useTranslations('footer');

  const footerLinks = {
    tournament: [
      { label: t('about'), href: '/about' },
      { label: t('schedule'), href: '/schedule' },
      { label: t('venues'), href: '/venues' },
      { label: t('tickets'), href: '/tickets' },
    ],
    discover: [
      { label: t('legends'), href: '/legends' },
      { label: t('teams'), href: '/teams' },
      { label: t('news'), href: '/news' },
      { label: t('history'), href: '/history' },
    ],
    connect: [
      { label: t('contact'), href: '/contact' },
      { label: t('press'), href: '/press' },
      { label: t('partners'), href: '/partners' },
      { label: t('careers'), href: '/careers' },
    ],
  };

  return (
    <footer className="relative bg-night-800 border-t border-gold-500/10">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-night-900 font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                  WLC
                </span>
              </div>
              <div>
                <p className="text-gold-400 text-xs tracking-[0.3em] uppercase">World Legends</p>
                <p className="text-white text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  CUP 2026
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
              {t('description')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-night-600 border border-gold-500/20 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                >
                  <span className="text-sm">{social.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-4">
              {t('tournament')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.tournament.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-4">
              {t('discover')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-4">
              {t('connect')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {t('copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('termsOfService')}
            </Link>
            <Link href="/cookies" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('cookies')}
            </Link>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gold-500/5 to-transparent opacity-50 pointer-events-none" />
    </footer>
  );
}
