'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orders, type Order } from '@/data/admin';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerEmail.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'refunded':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ORDERS
        </h1>
        <p className="text-white/50 mt-1">Manage customer orders</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 rounded-xl transition-all ${
                statusFilter === status.value
                  ? 'glass border border-gold-500/30'
                  : 'bg-night-800 hover:bg-night-700'
              }`}
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-white/50 text-sm">{status.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Export */}
        <button className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors">
          Export
        </button>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="p-4 text-left text-white/50 text-sm font-medium">Order ID</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Items</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Total</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Status</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Payment</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Date</th>
                <th className="p-4 text-right text-white/50 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gold-500/5 hover:bg-night-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-4">
                    <p className="text-gold-400 font-mono font-semibold">{order.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">{order.customerName}</p>
                    <p className="text-white/40 text-sm">{order.customerEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{order.items.length} item(s)</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">${order.total.toFixed(2)}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-white/60 text-sm">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-white/50">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gold-400 font-mono font-bold text-lg">{selectedOrder.id}</p>
                    <p className="text-white/50 text-sm">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Status */}
                <div className="flex gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Customer</h3>
                  <p className="text-white">{selectedOrder.customerName}</p>
                  <p className="text-white/50 text-sm">{selectedOrder.customerEmail}</p>
                </div>

                {/* Shipping Address */}
                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Shipping Address</h3>
                  <p className="text-white/70">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.productName}</p>
                          <p className="text-white/40 text-xs">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color}
                            {' • Qty: '}{item.quantity}
                          </p>
                        </div>
                        <p className="text-gold-400 text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-night-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Subtotal</span>
                      <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Shipping</span>
                      <span className="text-white">{selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Tax</span>
                      <span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gold-500/10">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-gold-400 font-bold">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                      <button
                        key={status}
                        className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gold-500 text-night-900'
                            : 'bg-night-600 text-white/70 hover:bg-night-500'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {selectedOrder.status !== 'cancelled' && (
                    <button className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
