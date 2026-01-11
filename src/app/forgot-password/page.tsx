'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await resetPassword(email);

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      showToast('Reset link sent to your email', 'success');
    } else {
      setError(result.error || 'Failed to send reset link');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass rounded-2xl p-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <span className="text-4xl">✉️</span>
            </div>
            <h1
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CHECK YOUR EMAIL
            </h1>
            <p className="text-white/60 mb-6">
              We&apos;ve sent a password reset link to <span className="text-gold-400">{email}</span>.
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-white/40 text-sm mb-8">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-gold-400 hover:text-gold-300"
              >
                try again
              </button>
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
              >
                Back to Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center glow-gold-sm">
              <span className="text-night-900 font-bold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                WLC
              </span>
            </div>
          </Link>
          <h1
            className="text-3xl font-bold text-white mt-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FORGOT PASSWORD
          </h1>
          <p className="text-white/50 mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="text-white/50 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>
        </div>

        {/* Back to Login */}
        <p className="text-center mt-6 text-white/50">
          Remember your password?{' '}
          <Link href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
