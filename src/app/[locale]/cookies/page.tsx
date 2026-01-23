'use client';

import { motion } from 'framer-motion';

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Legal</p>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              COOKIE <span className="text-gradient-gold">POLICY</span>
            </h1>
            <p className="text-white/60">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                WHAT ARE COOKIES?
              </h2>
              <p className="text-white/70">
                Cookies are small text files that are placed on your computer or mobile device when
                you visit a website. They are widely used to make websites work more efficiently and
                provide information to website owners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                HOW WE USE COOKIES
              </h2>
              <p className="text-white/70 mb-4">We use cookies for the following purposes:</p>
              <div className="space-y-4">
                <div className="p-4 bg-night-600 rounded-xl">
                  <h3 className="text-gold-400 font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-white/60 text-sm">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div className="p-4 bg-night-600 rounded-xl">
                  <h3 className="text-gold-400 font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-white/60 text-sm">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="p-4 bg-night-600 rounded-xl">
                  <h3 className="text-gold-400 font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-white/60 text-sm">
                    Used to deliver relevant advertisements and track campaign performance.
                  </p>
                </div>
                <div className="p-4 bg-night-600 rounded-xl">
                  <h3 className="text-gold-400 font-semibold mb-2">Preference Cookies</h3>
                  <p className="text-white/60 text-sm">
                    Remember your preferences and settings for a better experience.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                THIRD-PARTY COOKIES
              </h2>
              <p className="text-white/70">
                We may also use third-party cookies from services such as Google Analytics,
                social media platforms, and advertising networks. These cookies are governed
                by the respective third parties&apos; privacy policies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                MANAGING COOKIES
              </h2>
              <p className="text-white/70 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Cookie preferences: Use our cookie preference center (coming soon)</li>
                <li>Third-party opt-outs: Visit individual advertiser opt-out pages</li>
              </ul>
              <p className="text-white/70 mt-4">
                Note that disabling certain cookies may affect website functionality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                CONTACT US
              </h2>
              <p className="text-white/70 mb-4">
                If you have questions about our use of cookies, please contact:
              </p>
              <p className="text-gold-400">privacy@worldlegendscup.com</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
