'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

interface NewsletterProps {
  variant?: 'inline' | 'banner' | 'footer';
}

export default function Newsletter({ variant = 'banner' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubscribed(true);
    setEmail('');
    setIsLoading(false);
    showToast('Welcome to the team! Check your inbox for a special welcome gift.', 'success');
  };

  if (variant === 'footer') {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Newsletter</h3>
        <p className="text-white/50 text-sm">
          Get exclusive offers and updates delivered to your inbox.
        </p>
        {isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-400"
          >
            <span>✓</span>
            <span className="text-sm">Subscribed!</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-night-700 border border-gold-500/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gold-500 text-night-900 font-semibold text-sm rounded-lg disabled:opacity-50"
            >
              {isLoading ? '...' : 'Join'}
            </motion.button>
          </form>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📧</span>
              <h3 className="text-white font-semibold">Stay in the Game</h3>
            </div>
            <p className="text-white/50 text-sm">
              Subscribe for exclusive drops and 10% off your first order.
            </p>
          </div>
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-400"
            >
              <span>✓</span>
              <span>Subscribed!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 sm:w-auto w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 sm:w-48 px-4 py-2.5 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
              >
                {isLoading ? '...' : 'Join'}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <section className="px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gold-500/20 via-night-800 to-gold-500/20 border border-gold-500/20 p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full mb-4">
                  EXCLUSIVE ACCESS
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  JOIN THE LEGENDS CLUB
                </h2>
                <p className="text-white/60 text-lg">
                  Be the first to know about new drops, exclusive sales, and legendary content.
                  Plus, get <span className="text-gold-400 font-semibold">10% off</span> your first order!
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:w-96"
            >
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <span className="text-5xl block mb-4">🎉</span>
                  <h3 className="text-xl font-bold text-white mb-2">Welcome to the Club!</h3>
                  <p className="text-white/60">
                    Check your inbox for your exclusive 10% discount code.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 bg-night-800 border border-gold-500/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/60 transition-colors"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold text-lg rounded-xl disabled:opacity-50 glow-gold-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          ⚽
                        </motion.span>
                        Subscribing...
                      </span>
                    ) : (
                      'Get 10% Off'
                    )}
                  </motion.button>
                  <p className="text-white/30 text-xs text-center">
                    By subscribing, you agree to our privacy policy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </section>
  );
}
