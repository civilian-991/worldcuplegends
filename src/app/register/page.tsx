'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    router.push('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.success) {
        showToast('Account created! Please check your email to verify.', 'success');
        router.push('/login');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            CREATE ACCOUNT
          </h1>
          <p className="text-white/50 mt-2">Join the legends community</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  placeholder="Legend"
                />
              </div>
            </div>

            <div>
              <label className="text-white/50 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-white/50 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="••••••••"
              />
              <p className="text-white/30 text-xs mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="text-white/50 text-sm mb-2 block">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                />
                <span className="text-white/60 text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-gold-400 hover:text-gold-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-gold-400 hover:text-gold-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                />
                <span className="text-white/60 text-sm">
                  Subscribe to newsletter for exclusive offers
                </span>
              </label>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold-500/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-night-800 text-white/40">or sign up with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 px-4 bg-night-700 rounded-xl text-white/70 hover:bg-night-600 hover:text-white transition-colors flex items-center justify-center gap-2">
              <span>🔵</span>
              Google
            </button>
            <button className="py-3 px-4 bg-night-700 rounded-xl text-white/70 hover:bg-night-600 hover:text-white transition-colors flex items-center justify-center gap-2">
              <span>⚫</span>
              Apple
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-white/50">
          Already have an account?{' '}
          <Link href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
