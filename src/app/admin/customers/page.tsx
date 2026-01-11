'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { customers, orders, type Customer } from '@/data/admin';

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState('recent');

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime());
        break;
      case 'spent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'orders':
        filtered.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [searchQuery, statusFilter, sortBy]);

  const getCustomerOrders = (customerId: string) => {
    return orders.filter((o) => o.customerId === customerId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          CUSTOMERS
        </h1>
        <p className="text-white/50 mt-1">Manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, icon: '👥' },
          { label: 'Active Customers', value: activeCustomers, icon: '✓' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '💰' },
          { label: 'Avg. Order Value', value: `$${avgOrderValue.toFixed(2)}`, icon: '📊' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          <option value="recent">Most Recent</option>
          <option value="spent">Highest Spent</option>
          <option value="orders">Most Orders</option>
          <option value="name">Name A-Z</option>
        </select>

        {/* Export */}
        <button className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors">
          Export
        </button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCustomer(customer)}
            className="glass rounded-xl p-5 cursor-pointer hover:border-gold-500/30 border border-transparent transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center flex-shrink-0">
                <span className="text-night-900 font-bold text-lg">
                  {customer.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold truncate">{customer.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      customer.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
                <p className="text-white/40 text-sm truncate">{customer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gold-500/10">
              <div>
                <p className="text-white/40 text-xs">Orders</p>
                <p className="text-white font-semibold">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Spent</p>
                <p className="text-gold-400 font-semibold">${customer.totalSpent.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Last Order</p>
                <p className="text-white/70 text-sm">{formatDate(customer.lastOrderAt)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-4xl block mb-4">👥</span>
          <p className="text-white/50">No customers found</p>
        </div>
      )}

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-night-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                      <span className="text-night-900 font-bold text-2xl">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
                      <p className="text-white/50">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Status */}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCustomer.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {selectedCustomer.status === 'active' ? 'Active Customer' : 'Inactive'}
                </span>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-night-700 rounded-xl p-4">
                    <p className="text-white/50 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-night-700 rounded-xl p-4">
                    <p className="text-white/50 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-gold-400">${selectedCustomer.totalSpent.toFixed(2)}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-night-700 rounded-xl p-4 mt-6">
                  <h3 className="text-white font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">📧</span>
                      <span className="text-white/70">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">📱</span>
                      <span className="text-white/70">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">📅</span>
                      <span className="text-white/70">Joined {formatDate(selectedCustomer.joinedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-4">Order History</h3>
                  <div className="space-y-3">
                    {getCustomerOrders(selectedCustomer.id).length > 0 ? (
                      getCustomerOrders(selectedCustomer.id).map((order) => (
                        <div
                          key={order.id}
                          className="bg-night-700 rounded-xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-gold-400 font-mono text-sm">{order.id}</p>
                            <p className="text-white/50 text-xs">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${order.total.toFixed(2)}</p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                                order.status === 'delivered'
                                  ? 'bg-green-500/20 text-green-400'
                                  : order.status === 'shipped'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : order.status === 'processing'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 text-center py-4">No orders found</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <button className="w-full py-3 bg-gold-500/20 text-gold-400 rounded-xl hover:bg-gold-500/30 transition-colors">
                    Send Email
                  </button>
                  <button className="w-full py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors">
                    View All Orders
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
