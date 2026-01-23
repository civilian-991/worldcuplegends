'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const locales = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'br', label: 'Português', flag: 'br' },
] as const;

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('languageSwitcher');

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'br' });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-night-600 hover:bg-night-500 transition-colors"
      >
        <img
          src={`https://flagcdn.com/w20/${currentLocale.flag}.png`}
          alt={currentLocale.label}
          className="w-5 h-auto rounded-sm"
        />
        <span className="text-white/70 text-sm hidden sm:inline">{currentLocale.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 py-2 bg-night-700 border border-gold-500/20 rounded-xl shadow-xl z-50"
          >
            {locales.map((localeOption) => (
              <button
                key={localeOption.code}
                onClick={() => handleLocaleChange(localeOption.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                  locale === localeOption.code
                    ? 'bg-gold-500/10 text-gold-400'
                    : 'text-white/70 hover:bg-night-600 hover:text-white'
                }`}
              >
                <img
                  src={`https://flagcdn.com/w20/${localeOption.flag}.png`}
                  alt={localeOption.label}
                  className="w-5 h-auto rounded-sm"
                />
                <span className="text-sm">{localeOption.label}</span>
                {locale === localeOption.code && (
                  <svg className="w-4 h-4 ml-auto text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
