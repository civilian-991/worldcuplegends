'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';

// Mock user orders
const userOrders = [
  {
    id: 'WLC-A1B2C3D4E',
    date: '2026-01-10',
    status: 'shipped',
    total: 318.57,
    items: [
      { name: 'World Legends Cup 2026 Official Jersey', quantity: 2, price: 129.99, size: 'L', color: 'Black/Gold' },
      { name: 'WLC 2026 Official Cap', quantity: 1, price: 34.99, color: 'Black/Gold' },
    ],
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
  },
  {
    id: 'WLC-X9Y8Z7W6V',
    date: '2026-01-05',
    status: 'delivered',
    total: 199.97,
    items: [
      { name: 'Argentina Legends Retro Jersey', quantity: 1, price: 99.99, size: 'M' },
      { name: 'Messi #10 Signature Collection Tee', quantity: 2, price: 49.99, size: 'S' },
    ],
    trackingNumber: '1Z999AA10123456785',
    carrier: 'UPS',
  },
  {
    id: 'WLC-P5Q4R3S2T',
    date: '2025-12-20',
    status: 'delivered',
    total: 149.99,
    items: [
      { name: 'WLC Premium Training Jacket', quantity: 1, price: 149.99, size: 'L', color: 'Black' },
    ],
    trackingNumber: '1Z999AA10123456786',
    carrier: 'FedEx',
  },
];

export default function AccountOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<typeof userOrders[0] | null>(null);
  const [filter, setFilter] = useState('all');

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

  const filteredOrders = filter === 'all'
    ? userOrders
    : userOrders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ORDER HISTORY
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-white/50 mb-6">Start shopping to see your orders here</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
            >
              Browse Shop
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gold-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-gold-400 font-mono font-bold">{order.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mt-1">
                      Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-white/50 text-sm">{order.items.length} item(s)</p>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-6">
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold-500/20 to-night-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👕</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{item.name}</p>
                        <p className="text-white/50 text-sm">
                          {item.size && `Size: ${item.size}`}
                          {item.size && 'color' in item && item.color && ' • '}
                          {'color' in item && item.color}
                          {' • Qty: '}{item.quantity}
                        </p>
                      </div>
                      <p className="text-gold-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-white/40 text-sm">+{order.items.length - 2} more item(s)</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gold-500/10">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
                  >
                    View Details
                  </button>
                  {order.status === 'shipped' && (
                    <Link href={`/track-order?id=${order.id}`}>
                      <button className="px-4 py-2 bg-night-700 text-white/70 rounded-lg hover:bg-night-600 hover:text-white transition-colors">
                        Track Order
                      </button>
                    </Link>
                  )}
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 bg-night-700 text-white/70 rounded-lg hover:bg-night-600 hover:text-white transition-colors">
                      Write Review
                    </button>
                  )}
                  <button className="px-4 py-2 bg-night-700 text-white/70 rounded-lg hover:bg-night-600 hover:text-white transition-colors">
                    Buy Again
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-night-800 rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gold-400 font-mono font-bold">{selectedOrder.id}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {selectedOrder.trackingNumber && (
                  <div className="bg-night-700 rounded-xl p-4">
                    <p className="text-white/50 text-sm">Tracking Number</p>
                    <p className="text-white font-mono">{selectedOrder.trackingNumber}</p>
                    <p className="text-gold-400 text-sm mt-1">{selectedOrder.carrier}</p>
                  </div>
                )}

                <div>
                  <p className="text-white/50 text-sm mb-3">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-night-700 rounded-xl p-3">
                        <div>
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-white/40 text-xs">
                            {item.size && `Size: ${item.size}`}
                            {item.size && 'color' in item && item.color && ' • '}
                            {'color' in item && item.color}
                            {' • Qty: '}{item.quantity}
                          </p>
                        </div>
                        <p className="text-gold-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold-500/10 pt-4">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span className="text-gold-400">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedOrder.status === 'shipped' && (
                    <Link href={`/track-order?id=${selectedOrder.id}`} className="flex-1">
                      <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl">
                        Track Order
                      </button>
                    </Link>
                  )}
                  <button className="flex-1 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors">
                    Need Help?
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
