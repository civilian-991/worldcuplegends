'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-night-900 pt-20">
      {/* Desktop Sidebar */}
      <aside
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
              className="w-8 h-8 rounded-lg bg-night-700 flex items-center justify-center text-white/50 hover:text-white hover:bg-night-600 transition-colors"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gold-500/20 text-gold-400'
                        : 'text-white/60 hover:bg-night-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive && isSidebarOpen && (
                      <motion.div
                        layoutId="activeAdminNav"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Quick Links */}
          <div className="p-4 border-t border-gold-500/10">
            <Link href="/shop">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all">
                <span className="text-xl">🏪</span>
                {isSidebarOpen && <span className="font-medium">View Store</span>}
              </div>
            </Link>
            <Link href="/">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all">
                <span className="text-xl">🏠</span>
                {isSidebarOpen && <span className="font-medium">Back to Site</span>}
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed left-4 top-24 z-30 w-12 h-12 rounded-xl bg-night-800 border border-gold-500/20 flex items-center justify-center text-gold-400"
      >
        ☰
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
            />
            <motion.aside
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
                  className="w-8 h-8 rounded-lg bg-night-700 flex items-center justify-center text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gold-500/20 text-gold-400'
                            : 'text-white/60 hover:bg-night-700 hover:text-white'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Quick Links */}
              <div className="p-4 border-t border-gold-500/10">
                <Link href="/shop" onClick={() => setIsMobileSidebarOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-night-700 hover:text-white transition-all">
                    <span className="text-xl">🏪</span>
                    <span className="font-medium">View Store</span>
                  </div>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
