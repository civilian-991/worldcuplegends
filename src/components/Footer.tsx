'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const socialLinks = [
  { label: 'Twitter', icon: <XIcon />, href: 'https://twitter.com/wlcworld' },
  { label: 'Instagram', icon: <InstagramIcon />, href: 'https://instagram.com/wlcworld' },
  { label: 'YouTube', icon: <YouTubeIcon />, href: 'https://youtube.com/@wlcworld' },
  { label: 'TikTok', icon: <TikTokIcon />, href: 'https://tiktok.com/@wlcworld' },
];

// Accordion component for mobile link sections
function MobileAccordion({
  title,
  children,
  isOpen,
  onToggle
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-gold-400 font-semibold text-sm tracking-wider uppercase">
          {title}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const [openSection, setOpenSection] = useState<string | null>(null);

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
    ],
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="relative bg-night-800 border-t border-gold-500/10 overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Decorative corner accents - mobile visible */}
      <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-gold-500/30 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-gold-500/30 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-gold-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Brand Section - Centered on mobile */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <img
                src="/wlc-logo-vertical.png"
                alt="World Legends Cup"
                className="h-24 w-auto mx-auto"
              />
            </motion.div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Social Icons - Prominent on mobile */}
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-night-600 to-night-700 border border-gold-500/20 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Divider with gold accent */}
          <div className="relative h-px bg-white/5 mb-6">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-px bg-gold-500/50" />
          </div>

          {/* Accordion Links */}
          <div className="mb-6">
            <MobileAccordion
              title={t('tournament')}
              isOpen={openSection === 'tournament'}
              onToggle={() => toggleSection('tournament')}
            >
              <div className="grid grid-cols-2 gap-3">
                {footerLinks.tournament.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm py-1 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            <MobileAccordion
              title={t('discover')}
              isOpen={openSection === 'discover'}
              onToggle={() => toggleSection('discover')}
            >
              <div className="grid grid-cols-2 gap-3">
                {footerLinks.discover.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm py-1 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            <MobileAccordion
              title={t('connect')}
              isOpen={openSection === 'connect'}
              onToggle={() => toggleSection('connect')}
            >
              <div className="grid grid-cols-2 gap-3">
                {footerLinks.connect.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm py-1 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            <MobileAccordion
              title={t('contactInfo')}
              isOpen={openSection === 'contact'}
              onToggle={() => toggleSection('contact')}
            >
              <div className="space-y-2 text-white/60 text-sm">
                <p className="font-medium text-white/80">{t('companyName')}</p>
                <p>{t('address1')}</p>
                <p>{t('address2')}</p>
                <p className="pt-2">
                  <a
                    href="mailto:info@wlc.world"
                    className="text-gold-400/80 hover:text-gold-400 transition-colors"
                  >
                    info@wlc.world
                  </a>
                </p>
              </div>
            </MobileAccordion>
          </div>

          {/* Bottom Section - Mobile */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
              <Link href="/privacy" className="text-white/40 hover:text-white/70 transition-colors">
                {t('privacyPolicy')}
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors">
                {t('termsOfService')}
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/cookies" className="text-white/40 hover:text-white/70 transition-colors">
                {t('cookies')}
              </Link>
            </div>
            <p className="text-white/30 text-xs text-center">
              © {t('copyright')}
            </p>
          </div>
        </div>

        {/* Desktop Layout - Keep original structure */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img
                  src="/wlc-logo-vertical.png"
                  alt="World Legends Cup"
                  className="h-32 w-auto"
                />
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
                {t('description')}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-night-600 border border-gold-500/20 flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h4 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-4">
                {t('contactInfo')}
              </h4>
              <div className="space-y-3 text-white/60 text-sm">
                <p className="font-medium text-white/80">{t('companyName')}</p>
                <p>{t('address1')}</p>
                <p>{t('address2')}</p>
                <p className="pt-2">
                  <a
                    href="mailto:info@wlc.world"
                    className="hover:text-gold-400 transition-colors"
                  >
                    info@wlc.world
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.wlc.world"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-400 transition-colors"
                  >
                    www.wlc.world
                  </a>
                </p>
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

          {/* Bottom Section - Desktop */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {t('copyright')}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('termsOfService')}
              </Link>
              <Link href="/cookies" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-gradient-radial from-gold-500/5 to-transparent opacity-50 pointer-events-none" />
    </footer>
  );
}
