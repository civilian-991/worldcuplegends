'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
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
              TERMS OF <span className="text-gradient-gold">SERVICE</span>
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
                1. ACCEPTANCE OF TERMS
              </h2>
              <p className="text-white/70">
                By accessing and using the World Legends Cup website and services, you accept and agree
                to be bound by these Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                2. TICKET PURCHASES
              </h2>
              <p className="text-white/70 mb-4">
                All ticket purchases are subject to availability and confirmation. We reserve the right
                to refuse or cancel any order for any reason.
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Tickets are non-transferable except through official channels</li>
                <li>Resale of tickets at above face value is prohibited</li>
                <li>We reserve the right to cancel tickets obtained through unauthorized channels</li>
                <li>Valid ID matching the ticket holder name may be required for entry</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                3. EVENT ATTENDANCE
              </h2>
              <p className="text-white/70 mb-4">
                By attending World Legends Cup events, you agree to:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Comply with all venue rules and regulations</li>
                <li>Submit to security searches upon entry</li>
                <li>Not bring prohibited items into the venue</li>
                <li>Consent to being photographed or filmed for broadcast</li>
                <li>Follow the directions of event staff and security personnel</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                4. INTELLECTUAL PROPERTY
              </h2>
              <p className="text-white/70">
                All content on this website, including but not limited to text, graphics, logos,
                images, and software, is the property of World Legends Cup or its licensors and
                is protected by copyright and trademark laws. You may not reproduce, distribute,
                or create derivative works without our express written permission.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                5. LIMITATION OF LIABILITY
              </h2>
              <p className="text-white/70">
                World Legends Cup shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or relating to your use of
                our services. Our total liability shall not exceed the amount you paid for
                the specific service giving rise to the claim.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                6. CHANGES TO TERMS
              </h2>
              <p className="text-white/70">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting to this website. Your continued use of our services
                constitutes acceptance of any modified terms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                7. CONTACT
              </h2>
              <p className="text-white/70 mb-4">
                For questions about these Terms of Service, please contact:
              </p>
              <p className="text-gold-400">legal@worldlegendscup.com</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
