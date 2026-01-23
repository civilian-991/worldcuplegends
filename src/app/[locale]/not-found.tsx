'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* Animated Soccer Ball */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.span
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
            className="text-8xl inline-block"
          >
            ⚽
          </motion.span>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1
            className="text-[150px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-600/50"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            OFFSIDE! PAGE NOT FOUND
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Looks like this play didn&apos;t make it past the defense. The page you&apos;re looking for
            has been moved, deleted, or never existed.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl glow-gold-sm"
            >
              Back to Home
            </motion.button>
          </Link>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-night-700 text-white/70 font-semibold rounded-xl hover:bg-night-600 hover:text-white transition-colors"
            >
              Visit Shop
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gold-500/10"
        >
          <p className="text-white/40 text-sm mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: '/legends', label: 'Legends', icon: '⭐' },
              { href: '/schedule', label: 'Schedule', icon: '📅' },
              { href: '/news', label: 'News', icon: '📰' },
              { href: '/tickets', label: 'Tickets', icon: '🎟️' },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-night-800 rounded-lg text-white/60 hover:text-white hover:bg-night-700 transition-colors"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Support Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8"
        >
          <p className="text-white/30 text-sm">
            Need help?{' '}
            <Link href="/contact" className="text-gold-400 hover:underline">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Decorative Field Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none opacity-10">
        <svg
          viewBox="0 0 1200 200"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Center Circle */}
          <circle
            cx="600"
            cy="200"
            r="100"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Center Line */}
          <line
            x1="0"
            y1="200"
            x2="1200"
            y2="200"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Side Lines */}
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="200"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          <line
            x1="1100"
            y1="0"
            x2="1100"
            y2="200"
            stroke="#D4AF37"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
