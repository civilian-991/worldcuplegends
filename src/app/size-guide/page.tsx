'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Category = 'jerseys' | 'tshirts' | 'outerwear' | 'shorts';
type Unit = 'inches' | 'cm';

const sizeData = {
  jerseys: {
    title: 'Jerseys',
    icon: '👕',
    description: 'Our jerseys feature an athletic fit designed for performance. For a looser fit, consider sizing up.',
    sizes: [
      { size: 'XS', chest: '34-36', waist: '28-30', chestCm: '86-91', waistCm: '71-76' },
      { size: 'S', chest: '36-38', waist: '30-32', chestCm: '91-97', waistCm: '76-81' },
      { size: 'M', chest: '38-40', waist: '32-34', chestCm: '97-102', waistCm: '81-86' },
      { size: 'L', chest: '40-42', waist: '34-36', chestCm: '102-107', waistCm: '86-91' },
      { size: 'XL', chest: '42-44', waist: '36-38', chestCm: '107-112', waistCm: '91-97' },
      { size: '2XL', chest: '44-46', waist: '38-40', chestCm: '112-117', waistCm: '97-102' },
      { size: '3XL', chest: '46-48', waist: '40-42', chestCm: '117-122', waistCm: '102-107' },
    ],
  },
  tshirts: {
    title: 'T-Shirts',
    icon: '👔',
    description: 'T-shirts have a relaxed, comfortable fit. Order your regular size for a classic fit.',
    sizes: [
      { size: 'XS', chest: '32-34', length: '27', chestCm: '81-86', lengthCm: '69' },
      { size: 'S', chest: '34-36', length: '28', chestCm: '86-91', lengthCm: '71' },
      { size: 'M', chest: '38-40', length: '29', chestCm: '97-102', lengthCm: '74' },
      { size: 'L', chest: '42-44', length: '30', chestCm: '107-112', lengthCm: '76' },
      { size: 'XL', chest: '46-48', length: '31', chestCm: '117-122', lengthCm: '79' },
      { size: '2XL', chest: '50-52', length: '32', chestCm: '127-132', lengthCm: '81' },
    ],
  },
  outerwear: {
    title: 'Outerwear',
    icon: '🧥',
    description: 'Jackets and hoodies have a standard fit with room for layering underneath.',
    sizes: [
      { size: 'XS', chest: '36-38', sleeve: '32', chestCm: '91-97', sleeveCm: '81' },
      { size: 'S', chest: '38-40', sleeve: '33', chestCm: '97-102', sleeveCm: '84' },
      { size: 'M', chest: '40-42', sleeve: '34', chestCm: '102-107', sleeveCm: '86' },
      { size: 'L', chest: '42-44', sleeve: '35', chestCm: '107-112', sleeveCm: '89' },
      { size: 'XL', chest: '44-46', sleeve: '36', chestCm: '112-117', sleeveCm: '91' },
      { size: '2XL', chest: '46-48', sleeve: '37', chestCm: '117-122', sleeveCm: '94' },
    ],
  },
  shorts: {
    title: 'Shorts',
    icon: '🩳',
    description: 'Shorts feature an elastic waistband for a comfortable, adjustable fit.',
    sizes: [
      { size: 'XS', waist: '26-28', inseam: '7', waistCm: '66-71', inseamCm: '18' },
      { size: 'S', waist: '28-30', inseam: '7.5', waistCm: '71-76', inseamCm: '19' },
      { size: 'M', waist: '30-32', inseam: '8', waistCm: '76-81', inseamCm: '20' },
      { size: 'L', waist: '32-34', inseam: '8.5', waistCm: '81-86', inseamCm: '22' },
      { size: 'XL', waist: '34-36', inseam: '9', waistCm: '86-91', inseamCm: '23' },
      { size: '2XL', waist: '36-38', inseam: '9.5', waistCm: '91-97', inseamCm: '24' },
    ],
  },
};

export default function SizeGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('jerseys');
  const [unit, setUnit] = useState<Unit>('inches');

  const currentData = sizeData[selectedCategory];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl block mb-6">📏</span>
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SIZE GUIDE
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Find your perfect fit with our detailed size charts and measuring tips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {(Object.keys(sizeData) as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-night-700 text-white/60 hover:text-white hover:bg-night-600'
                }`}
              >
                <span>{sizeData[category].icon}</span>
                <span>{sizeData[category].title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Size Chart */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6">
            {/* Unit Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{currentData.icon}</span>
                  {currentData.title} Size Chart
                </h2>
                <p className="text-white/50 text-sm mt-1">{currentData.description}</p>
              </div>
              <div className="flex bg-night-700 rounded-lg p-1">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    unit === 'inches'
                      ? 'bg-gold-500 text-night-900'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    unit === 'cm'
                      ? 'bg-gold-500 text-night-900'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-500/20">
                    <th className="text-left py-4 px-4 text-gold-400 font-semibold">Size</th>
                    {selectedCategory === 'jerseys' && (
                      <>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Chest ({unit})</th>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Waist ({unit})</th>
                      </>
                    )}
                    {selectedCategory === 'tshirts' && (
                      <>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Chest ({unit})</th>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Length ({unit})</th>
                      </>
                    )}
                    {selectedCategory === 'outerwear' && (
                      <>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Chest ({unit})</th>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Sleeve ({unit})</th>
                      </>
                    )}
                    {selectedCategory === 'shorts' && (
                      <>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Waist ({unit})</th>
                        <th className="text-left py-4 px-4 text-gold-400 font-semibold">Inseam ({unit})</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentData.sizes.map((row, index) => (
                    <motion.tr
                      key={row.size}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gold-500/10 hover:bg-night-700/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-white font-semibold">{row.size}</td>
                      {selectedCategory === 'jerseys' && (
                        <>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { chest: string }).chest : (row as { chestCm: string }).chestCm}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { waist: string }).waist : (row as { waistCm: string }).waistCm}
                          </td>
                        </>
                      )}
                      {selectedCategory === 'tshirts' && (
                        <>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { chest: string }).chest : (row as { chestCm: string }).chestCm}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { length: string }).length : (row as { lengthCm: string }).lengthCm}
                          </td>
                        </>
                      )}
                      {selectedCategory === 'outerwear' && (
                        <>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { chest: string }).chest : (row as { chestCm: string }).chestCm}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { sleeve: string }).sleeve : (row as { sleeveCm: string }).sleeveCm}
                          </td>
                        </>
                      )}
                      {selectedCategory === 'shorts' && (
                        <>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { waist: string }).waist : (row as { waistCm: string }).waistCm}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {unit === 'inches' ? (row as { inseam: string }).inseam : (row as { inseamCm: string }).inseamCm}
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-white mb-8 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            HOW TO MEASURE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📐',
                title: 'Chest',
                desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
              },
              {
                icon: '📏',
                title: 'Waist',
                desc: 'Measure around your natural waistline, keeping the tape comfortably loose.',
              },
              {
                icon: '🦾',
                title: 'Sleeve',
                desc: 'Measure from the center back of neck, along shoulder and down to wrist.',
              },
              {
                icon: '🦵',
                title: 'Inseam',
                desc: 'Measure from the crotch seam to the bottom of the leg along the inner leg.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>💡</span>
              Fitting Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Between Sizes?',
                  desc: 'If you\'re between sizes, we recommend sizing up for a more comfortable fit, especially for jerseys.',
                },
                {
                  title: 'Athletic vs. Relaxed',
                  desc: 'Jerseys have an athletic fit. If you prefer a looser fit, consider going up one size.',
                },
                {
                  title: 'Layering',
                  desc: 'If you plan to layer under outerwear, consider ordering one size up from your regular size.',
                },
                {
                  title: 'First Wash',
                  desc: 'Our products are pre-shrunk, but we recommend washing in cold water to maintain fit.',
                },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{tip.title}</h3>
                    <p className="text-white/50 text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-4">👋</span>
            <h2 className="text-2xl font-bold text-white mb-2">Need Help Finding Your Size?</h2>
            <p className="text-white/60 mb-6">
              Our team is happy to help you find the perfect fit.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
