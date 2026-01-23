'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

const returnSteps = [
  {
    step: 1,
    icon: '📝',
    title: 'Start Your Return',
    description: 'Log into your account and select the order you want to return. Click "Return Items" and select the items you wish to send back.',
  },
  {
    step: 2,
    icon: '📋',
    title: 'Select Return Reason',
    description: 'Choose your reason for return and any additional details. This helps us improve our products and service.',
  },
  {
    step: 3,
    icon: '🏷️',
    title: 'Print Shipping Label',
    description: 'US orders receive a prepaid return label. International customers will receive return instructions via email.',
  },
  {
    step: 4,
    icon: '📦',
    title: 'Pack & Ship',
    description: 'Pack items securely in original packaging if possible. Attach the shipping label and drop off at your nearest carrier location.',
  },
  {
    step: 5,
    icon: '💰',
    title: 'Receive Refund',
    description: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days.',
  },
];

const eligibleItems = [
  { item: 'Jerseys (unworn, tags attached)', eligible: true },
  { item: 'T-Shirts & Apparel (unworn, tags attached)', eligible: true },
  { item: 'Accessories (unused, original packaging)', eligible: true },
  { item: 'Equipment (unopened, original packaging)', eligible: true },
  { item: 'Customized/Personalized items', eligible: false },
  { item: 'Sale items marked "Final Sale"', eligible: false },
  { item: 'Items without original tags', eligible: false },
  { item: 'Worn or washed items', eligible: false },
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState<'returns' | 'exchanges'>('returns');

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl block mb-6">↩️</span>
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              RETURNS & EXCHANGES
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Easy returns within 30 days. Free return shipping for US orders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📅', title: '30-Day Returns', desc: 'Return within 30 days of delivery' },
              { icon: '🆓', title: 'Free Return Shipping', desc: 'Prepaid labels for US orders' },
              { icon: '⚡', title: 'Fast Refunds', desc: 'Processed within 5-7 business days' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveTab('returns')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'returns'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-night-700 text-white/60 hover:text-white'
              }`}
            >
              Returns
            </button>
            <button
              onClick={() => setActiveTab('exchanges')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'exchanges'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-night-700 text-white/60 hover:text-white'
              }`}
            >
              Exchanges
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'returns' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Return Steps */}
              <h2
                className="text-2xl font-bold text-white mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                HOW TO RETURN
              </h2>
              <div className="space-y-4 mb-12">
                {returnSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6 flex items-start gap-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-400 font-bold">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-white font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-white/60">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Start Return CTA */}
              <div className="glass rounded-2xl p-8 text-center mb-12">
                <h3 className="text-xl font-bold text-white mb-4">Ready to Start Your Return?</h3>
                <p className="text-white/60 mb-6">
                  Log in to your account to initiate a return for any eligible order.
                </p>
                <Link href="/account/orders">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                  >
                    Start a Return
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Exchange Process */}
              <h2
                className="text-2xl font-bold text-white mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                HOW TO EXCHANGE
              </h2>
              <div className="glass rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">🔄</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Exchange Process</h3>
                    <p className="text-white/60 mb-4">
                      To ensure you get your new item as quickly as possible, we recommend the following process:
                    </p>
                    <ol className="text-white/60 space-y-3 list-decimal list-inside">
                      <li>Place a new order for the correct size/color you need</li>
                      <li>Initiate a return for the original item through your account</li>
                      <li>Ship back the original item using the prepaid label</li>
                      <li>Receive your refund once we process your return</li>
                    </ol>
                  </div>
                </div>
                <div className="bg-gold-500/10 rounded-xl p-4 border border-gold-500/20">
                  <p className="text-gold-400 text-sm">
                    <strong>Tip:</strong> This method ensures you get your new item quickly instead of waiting for the return to be processed first.
                  </p>
                </div>
              </div>

              {/* Size Assistance */}
              <div className="glass rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">📏</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Not Sure About Sizing?</h3>
                    <p className="text-white/60 mb-4">
                      Check our size guide before ordering to find your perfect fit and reduce the need for exchanges.
                    </p>
                    <Link href="/size-guide">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-night-600 text-white/70 rounded-lg hover:bg-night-500 hover:text-white transition-colors"
                      >
                        View Size Guide
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Eligibility */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            RETURN ELIGIBILITY
          </h2>
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleItems.map((item) => (
                <div
                  key={item.item}
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    item.eligible ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <span className="text-xl">
                    {item.eligible ? '✅' : '❌'}
                  </span>
                  <span className={item.eligible ? 'text-white/80' : 'text-white/50'}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            REFUND INFORMATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '💳',
                title: 'Original Payment Method',
                desc: 'Refunds are credited to the original payment method used at checkout.',
              },
              {
                icon: '⏱️',
                title: 'Processing Time',
                desc: 'Refunds are processed within 5-7 business days after we receive your return.',
              },
              {
                icon: '🏦',
                title: 'Bank Processing',
                desc: 'After we process your refund, please allow 3-5 additional business days for your bank.',
              },
              {
                icon: '🧾',
                title: 'Shipping Costs',
                desc: 'Original shipping costs are non-refundable unless the return is due to our error.',
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6">
                <span className="text-3xl block mb-4">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Damaged Items */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Received a Damaged Item?</h3>
                <p className="text-white/60 mb-4">
                  If your order arrived damaged or defective, please contact us within 48 hours of delivery.
                  Include photos of the damage and your order number.
                </p>
                <p className="text-white/60 mb-4">
                  We&apos;ll arrange a free replacement or full refund, including original shipping costs.
                </p>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-night-600 text-white/70 rounded-lg hover:bg-night-500 hover:text-white transition-colors"
                  >
                    Report Damaged Item
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-4">❓</span>
            <h2 className="text-2xl font-bold text-white mb-2">Questions About Returns?</h2>
            <p className="text-white/60 mb-6">
              Our customer service team is here to help with any return or exchange questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                >
                  View FAQ
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
