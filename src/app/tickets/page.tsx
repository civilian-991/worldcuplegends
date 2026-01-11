'use client';

import { motion } from 'framer-motion';

const ticketTiers = [
  {
    name: 'Standard',
    price: '$150',
    description: 'Experience the magic of legendary football',
    features: [
      'Single match access',
      'General seating',
      'Digital match program',
      'Food & beverage voucher',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: '$450',
    description: 'Enhanced experience with premium perks',
    features: [
      'Single match access',
      'Premium seating (lower bowl)',
      'Pre-match hospitality lounge',
      'Exclusive merchandise gift',
      'Meet & greet opportunity',
      'Digital photo package',
    ],
    popular: true,
  },
  {
    name: 'VIP Legend',
    price: '$1,500',
    description: 'The ultimate legends experience',
    features: [
      'Single match access',
      'VIP box seating',
      'Full hospitality package',
      'Player tunnel experience',
      'Signed memorabilia',
      'Post-match pitch access',
      'Professional photo session',
      'Concierge service',
    ],
    popular: false,
  },
];

const packages = [
  { name: 'Group Stage Pass', matches: '3 matches', price: 'From $399' },
  { name: 'Knockout Bundle', matches: '4 matches', price: 'From $799' },
  { name: 'Full Tournament', matches: 'All 48 matches', price: 'From $4,999' },
  { name: 'Final Experience', matches: 'Semi-Finals + Final', price: 'From $2,499' },
];

export default function TicketsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Be Part of History</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              GET YOUR <span className="text-gradient-gold">TICKETS</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Secure your place at the greatest celebration of football legends.
              Limited availability—don&apos;t miss out on history.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-12 px-6 bg-gold-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-night-900">
            <p className="font-bold text-lg">TICKETS ON SALE:</p>
            <div className="flex gap-6">
              {[
                { value: '45', label: 'Days' },
                { value: '12', label: 'Hours' },
                { value: '30', label: 'Minutes' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p
                    className="text-4xl font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.value}
                  </p>
                  <p className="text-sm opacity-70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Tiers */}
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
              TICKET OPTIONS
            </h2>
            <p className="text-white/50">Choose the experience that&apos;s right for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ticketTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${
                  tier.popular ? 'glass border-2 border-gold-500' : 'glass'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gold-500 text-night-900 text-center py-2 text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}

                <div className={`p-8 ${tier.popular ? 'pt-14' : ''}`}>
                  <h3
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {tier.name.toUpperCase()}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">{tier.description}</p>

                  <p
                    className="text-5xl font-bold text-gold-400 mb-8"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {tier.price}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-white/70 text-sm">
                        <span className="text-gold-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-full font-bold transition-colors ${
                      tier.popular
                        ? 'bg-gold-500 text-night-900 hover:bg-gold-400'
                        : 'bg-night-600 text-white hover:bg-night-500'
                    }`}
                  >
                    Select {tier.name}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-6 bg-night-800">
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
              MULTI-MATCH PACKAGES
            </h2>
            <p className="text-white/50">Save more with bundle deals</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center group cursor-pointer hover:bg-gold-500/5 transition-colors"
              >
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gold-400 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-white/50 text-sm mb-4">{pkg.matches}</p>
                <p
                  className="text-2xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pkg.price}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
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
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'When do tickets go on sale?', a: 'General ticket sales begin in early 2026. Sign up for our newsletter to be notified.' },
              { q: 'Are there age restrictions?', a: 'Children under 3 years old enter free. Youth tickets (3-16) are available at discounted rates.' },
              { q: 'Can I transfer my tickets?', a: 'Yes, tickets can be transferred through our official platform up to 24 hours before the match.' },
              { q: 'What is the refund policy?', a: 'Full refunds are available up to 30 days before the event. After that, tickets can be resold on our official marketplace.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-night-900 mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DON&apos;T MISS OUT
          </h2>
          <p className="text-night-900/70 mb-8">
            Sign up for priority access and exclusive pre-sale opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-night-900 border border-night-700 rounded-full text-white placeholder-white/40 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-night-900 text-gold-400 font-bold rounded-full"
            >
              Notify Me
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
