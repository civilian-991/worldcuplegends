'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
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
              PRIVACY <span className="text-gradient-gold">POLICY</span>
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
                1. INFORMATION WE COLLECT
              </h2>
              <p className="text-white/70 mb-4">
                We collect information you provide directly to us, such as when you create an account,
                purchase tickets, sign up for our newsletter, or contact us for support.
              </p>
              <p className="text-white/70">
                This may include: name, email address, postal address, phone number, payment information,
                and any other information you choose to provide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                2. HOW WE USE YOUR INFORMATION
              </h2>
              <p className="text-white/70 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                3. SHARING OF INFORMATION
              </h2>
              <p className="text-white/70 mb-4">
                We may share information about you as follows or as otherwise described in this Privacy Policy:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>With vendors, consultants, and service providers</li>
                <li>In response to legal process or government requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>With your consent or at your direction</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                4. DATA SECURITY
              </h2>
              <p className="text-white/70">
                We take reasonable measures to help protect information about you from loss, theft,
                misuse, unauthorized access, disclosure, alteration, and destruction. All payment
                transactions are encrypted using SSL technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                5. YOUR RIGHTS
              </h2>
              <p className="text-white/70 mb-4">
                You have the right to access, correct, or delete your personal information.
                You may also opt out of receiving promotional communications at any time.
              </p>
              <p className="text-white/70">
                To exercise these rights, please contact us at privacy@worldlegendscup.com
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                6. CONTACT US
              </h2>
              <p className="text-white/70 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gold-400">privacy@worldlegendscup.com</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
