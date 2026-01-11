'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '5-7 Business Days',
    price: '$7.99',
    freeThreshold: 'Free on orders over $75',
    icon: '📦',
    description: 'Our most economical option, perfect for non-urgent orders.',
  },
  {
    name: 'Express Shipping',
    time: '2-3 Business Days',
    price: '$14.99',
    freeThreshold: null,
    icon: '🚀',
    description: 'Faster delivery for when you need your gear sooner.',
  },
  {
    name: 'Overnight Shipping',
    time: 'Next Business Day',
    price: '$29.99',
    freeThreshold: null,
    icon: '⚡',
    description: 'Order by 2pm EST for delivery by end of next business day.',
  },
];

const internationalZones = [
  {
    zone: 'Canada & Mexico',
    time: '5-10 Business Days',
    price: 'From $14.99',
  },
  {
    zone: 'Europe',
    time: '7-14 Business Days',
    price: 'From $19.99',
  },
  {
    zone: 'Asia & Australia',
    time: '10-21 Business Days',
    price: 'From $24.99',
  },
  {
    zone: 'Rest of World',
    time: '14-28 Business Days',
    price: 'From $29.99',
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl block mb-6">🚚</span>
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SHIPPING INFORMATION
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Fast, reliable shipping worldwide. Free standard shipping on orders over $75.
            </p>
          </motion.div>
        </div>
      </section>

      {/* US Shipping Options */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            US SHIPPING OPTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 flex flex-col"
              >
                <span className="text-4xl mb-4">{option.icon}</span>
                <h3 className="text-white font-bold text-lg mb-1">{option.name}</h3>
                <p className="text-gold-400 font-semibold mb-2">{option.time}</p>
                <p className="text-white/50 text-sm flex-1">{option.description}</p>
                <div className="mt-4 pt-4 border-t border-gold-500/10">
                  <p className="text-white font-bold text-xl">{option.price}</p>
                  {option.freeThreshold && (
                    <p className="text-green-400 text-sm mt-1">{option.freeThreshold}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30 rounded-2xl p-8 text-center"
          >
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-2xl font-bold text-white mb-2">Free Shipping on Orders Over $75!</h2>
            <p className="text-white/60 mb-6">
              Spend $75 or more and get free standard shipping anywhere in the continental US.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            INTERNATIONAL SHIPPING
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-500/20 bg-night-800/50">
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Destination</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Delivery Time</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Starting Price</th>
                </tr>
              </thead>
              <tbody>
                {internationalZones.map((zone, index) => (
                  <motion.tr
                    key={zone.zone}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="border-b border-gold-500/10 hover:bg-night-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-white font-medium">{zone.zone}</td>
                    <td className="py-4 px-6 text-white/70">{zone.time}</td>
                    <td className="py-4 px-6 text-white/70">{zone.price}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-sm mt-4">
            * International shipping rates are calculated at checkout based on weight, dimensions, and destination.
            Customs duties and taxes may apply and are the responsibility of the recipient.
          </p>
        </div>
      </section>

      {/* Shipping Policies */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SHIPPING POLICIES
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: '📅',
                title: 'Processing Time',
                content:
                  'Orders are typically processed within 1-2 business days. During peak seasons or sales, processing may take up to 3-4 business days.',
              },
              {
                icon: '📍',
                title: 'Order Tracking',
                content:
                  'Once your order ships, you\'ll receive an email with your tracking number. You can also track your order anytime using our Track Order page.',
              },
              {
                icon: '📦',
                title: 'Order Consolidation',
                content:
                  'Multiple items in your order will be shipped together whenever possible. If items ship separately, you\'ll receive tracking for each shipment.',
              },
              {
                icon: '🏠',
                title: 'Delivery Attempts',
                content:
                  'Our carriers will typically make 2-3 delivery attempts. If delivery cannot be completed, the package may be held at a local facility for pickup.',
              },
              {
                icon: '📮',
                title: 'PO Boxes & APO/FPO',
                content:
                  'We can ship to PO Boxes via USPS. APO/FPO addresses are also supported with standard USPS shipping times.',
              },
              {
                icon: '🏢',
                title: 'Business Addresses',
                content:
                  'Shipping to a business address? Make sure someone is available to receive the package during business hours.',
              },
            ].map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{policy.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{policy.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{policy.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-6 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            OUR SHIPPING PARTNERS
          </h2>
          <div className="flex flex-wrap justify-center gap-8 glass rounded-2xl p-8">
            {['UPS', 'FedEx', 'USPS', 'DHL'].map((carrier) => (
              <div key={carrier} className="text-white/40 font-bold text-2xl">
                {carrier}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-4">📞</span>
            <h2 className="text-2xl font-bold text-white mb-2">Questions About Shipping?</h2>
            <p className="text-white/60 mb-6">
              Our customer service team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/track-order">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                >
                  Track Your Order
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors"
                >
                  Contact Support
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
