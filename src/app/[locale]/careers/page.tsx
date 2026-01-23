'use client';

import { motion } from 'framer-motion';

const openings = [
  {
    title: 'Event Operations Manager',
    department: 'Operations',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    type: 'Full-time',
  },
  {
    title: 'Sponsorship Coordinator',
    department: 'Partnerships',
    location: 'Miami, FL',
    type: 'Full-time',
  },
  {
    title: 'Social Media Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Guest Experience Lead',
    department: 'Operations',
    location: 'Multiple Locations',
    type: 'Contract',
  },
  {
    title: 'Broadcast Production Assistant',
    department: 'Media',
    location: 'New York, NY',
    type: 'Contract',
  },
];

const benefits = [
  { icon: '🎫', title: 'Event Access', desc: 'VIP access to all World Legends Cup events' },
  { icon: '🌍', title: 'Travel', desc: 'Opportunities to work across three countries' },
  { icon: '⚽', title: 'Football Culture', desc: 'Work alongside football legends and icons' },
  { icon: '📈', title: 'Growth', desc: 'Career development in global sports events' },
  { icon: '🏥', title: 'Benefits', desc: 'Comprehensive health and wellness packages' },
  { icon: '💰', title: 'Compensation', desc: 'Competitive salary and performance bonuses' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Join Our Team</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BUILD <span className="text-gradient-gold">LEGENDS</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Be part of the team creating the greatest celebration of football
              legends. Join us in making history.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
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
              WHY JOIN US
            </h2>
            <p className="text-white/50">More than a job—it&apos;s a legendary experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center group hover:bg-gold-500/5 transition-colors"
              >
                <span className="text-4xl block mb-4">{benefit.icon}</span>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-white/50 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
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
              OPEN POSITIONS
            </h2>
            <p className="text-white/50">Find your role in the legends team</p>
          </motion.div>

          <div className="space-y-4">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 group cursor-pointer hover:bg-gold-500/5 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-gold-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/50">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gold-500/10 text-gold-400 rounded-full text-sm font-semibold hover:bg-gold-500/20 transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-6xl block mb-6">📝</span>
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              DON&apos;T SEE THE RIGHT FIT?
            </h2>
            <p className="text-white/60 mb-8">
              We&apos;re always looking for talented individuals. Send us your resume
              and we&apos;ll keep you in mind for future opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-full"
            >
              Submit General Application
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
