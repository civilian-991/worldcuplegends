'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const accountNav = [
  { href: '/account', label: 'Profile', icon: '👤' },
  { href: '/account/orders', label: 'Orders', icon: '📦' },
  { href: '/account/addresses', label: 'Addresses', icon: '📍' },
  { href: '/account/wishlist', label: 'Wishlist', icon: '♥' },
  { href: '/account/settings', label: 'Settings', icon: '⚙️' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 animate-pulse" />
          <p className="text-white/50 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-8 px-6 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <span className="text-night-900 font-bold text-2xl">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-white/50">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-4 px-6 border-b border-gold-500/10 sticky top-20 z-30 glass">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-2 overflow-x-auto">
            {accountNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-gold-500/20 text-gold-400'
                        : 'text-white/60 hover:bg-night-700 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
