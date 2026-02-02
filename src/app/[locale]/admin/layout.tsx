'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', iconLabel: 'Chart' },
  { href: '/admin/legends', label: 'Legends', icon: '⭐', iconLabel: 'Star' },
  { href: '/admin/teams', label: 'Teams', icon: '🏆', iconLabel: 'Trophy' },
  { href: '/admin/matches', label: 'Matches', icon: '⚽', iconLabel: 'Football' },
  { href: '/admin/news', label: 'News', icon: '📰', iconLabel: 'Newspaper' },
  { href: '/admin/products', label: 'Products', icon: '📦', iconLabel: 'Package' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒', iconLabel: 'Shopping cart' },
  { href: '/admin/customers', label: 'Customers', icon: '👥', iconLabel: 'People' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈', iconLabel: 'Graph' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', iconLabel: 'Gear' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        // Logged in but not admin - redirect to homepage
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show redirect message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-900 pt-20">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-24 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-night-900 focus:rounded-lg focus:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <aside
        role="navigation"
        aria-label="Admin navigation"
        aria-expanded={isSidebarOpen}
        className={`fixed left-0 top-20 bottom-0 z-40 hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-full bg-night-800 border-r border-gold-500/10 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gold-500/10 flex items-center justify-between">
            {isSidebarOpen && (
              <h2
                className="text-gold-400 font-bold text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ADMIN PANEL
              </h2>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={isSidebarOpen}
              className="w-8 h-8 rounded-lg bg-night-700 flex items-center justify-center text-white/50 hover:text-white hover:bg-night-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
            >
              <span aria-hidden="true">{isSidebarOpen ? '◀' : '▶'}</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" aria-label="Main admin menu">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-white/60 hover:bg-night-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <span className={isSidebarOpen ? 'font-medium' : 'sr-only'}>{item.label}</span>
                  {isActive && isSidebarOpen && (
                    <motion.div
                      layoutId="activeAdminNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Links */}
          <div className="p-4 border-t border-gold-500/10">
            <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
            >
              <span className="text-xl" aria-hidden="true">🏪</span>
              <span className={isSidebarOpen ? 'font-medium' : 'sr-only'}>View Store</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
            >
              <span className="text-xl" aria-hidden="true">🏠</span>
              <span className={isSidebarOpen ? 'font-medium' : 'sr-only'}>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isMobileSidebarOpen}
        aria-controls="mobile-sidebar"
        className="lg:hidden fixed left-4 top-24 z-30 w-12 h-12 rounded-xl bg-night-800 border border-gold-500/20 flex items-center justify-center text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        <span aria-hidden="true">☰</span>
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-night-900/80 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            <motion.aside
              id="mobile-sidebar"
              role="navigation"
              aria-label="Mobile admin navigation"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-night-800 z-50 flex flex-col"
            >
              {/* Mobile Header */}
              <div className="p-4 border-b border-gold-500/10 flex items-center justify-between">
                <h2
                  className="text-gold-400 font-bold text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ADMIN PANEL
                </h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-8 h-8 rounded-lg bg-night-700 flex items-center justify-center text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2" aria-label="Mobile admin menu">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                        isActive
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-white/60 hover:bg-night-700 hover:text-white'
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Quick Links */}
              <div className="p-4 border-t border-gold-500/10">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                >
                  <span className="text-xl" aria-hidden="true">🏪</span>
                  <span className="font-medium">View Store</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`transition-all duration-300 focus:outline-none ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Aria Live Region for Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="admin-announcements"
      />
    </div>
  );
}
