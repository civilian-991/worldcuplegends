'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useToast } from '@/context/ToastContext';

interface Return {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'received' | 'refunded';
  reason: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }[];
  refundAmount: number;
  requestedAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
}

const mockReturns: Return[] = [
  {
    id: 'RTN-001',
    orderId: 'WLC-A1B2C3D4E',
    customerId: '1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    status: 'pending',
    reason: 'Size too small',
    items: [
      { name: 'World Legends Cup 2026 Official Jersey', quantity: 1, price: 89.99, size: 'M' },
    ],
    refundAmount: 89.99,
    requestedAt: '2026-01-10',
    updatedAt: '2026-01-10',
  },
  {
    id: 'RTN-002',
    orderId: 'WLC-E5F6G7H8I',
    customerId: '2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    status: 'approved',
    reason: 'Changed my mind',
    items: [
      { name: 'WLC 2026 Official Cap', quantity: 2, price: 29.99 },
    ],
    refundAmount: 59.98,
    requestedAt: '2026-01-08',
    updatedAt: '2026-01-09',
    notes: 'Customer confirmed return shipping',
  },
  {
    id: 'RTN-003',
    orderId: 'WLC-J9K0L1M2N',
    customerId: '3',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    status: 'received',
    reason: 'Product defect - stitching issue',
    items: [
      { name: 'Pelé Legend Edition Jersey', quantity: 1, price: 149.99, size: 'L' },
    ],
    refundAmount: 149.99,
    requestedAt: '2026-01-05',
    updatedAt: '2026-01-10',
    trackingNumber: '1Z999AA10987654321',
    notes: 'Quality team confirmed defect. Priority refund.',
  },
  {
    id: 'RTN-004',
    orderId: 'WLC-O3P4Q5R6S',
    customerId: '4',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    status: 'refunded',
    reason: 'Wrong item received',
    items: [
      { name: 'Legends Training Shorts', quantity: 1, price: 49.99, size: 'S' },
    ],
    refundAmount: 49.99,
    requestedAt: '2026-01-02',
    updatedAt: '2026-01-08',
    notes: 'Refund processed. Store credit also offered for inconvenience.',
  },
  {
    id: 'RTN-005',
    orderId: 'WLC-T7U8V9W0X',
    customerId: '5',
    customerName: 'David Wilson',
    customerEmail: 'david@example.com',
    status: 'rejected',
    reason: 'Item worn/washed',
    items: [
      { name: 'World Cup Finals T-Shirt', quantity: 1, price: 39.99, size: 'XL' },
    ],
    refundAmount: 0,
    requestedAt: '2026-01-04',
    updatedAt: '2026-01-06',
    notes: 'Item shows clear signs of wear and washing. Does not meet return policy requirements.',
  },
];

export default function AdminReturnsPage() {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<Return[]>(mockReturns);
  const [filter, setFilter] = useState<Return['status'] | 'all'>('all');
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [actionNote, setActionNote] = useState('');

  const filteredReturns = filter === 'all' ? returns : returns.filter((r) => r.status === filter);

  const getStatusStyle = (status: Return['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'approved':
        return 'bg-blue-500/20 text-blue-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'received':
        return 'bg-purple-500/20 text-purple-400';
      case 'refunded':
        return 'bg-green-500/20 text-green-400';
    }
  };

  const updateStatus = (returnId: string, newStatus: Return['status']) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? {
              ...r,
              status: newStatus,
              updatedAt: new Date().toISOString().split('T')[0],
              notes: actionNote ? `${r.notes ? r.notes + ' | ' : ''}${actionNote}` : r.notes,
            }
          : r
      )
    );
    setActionNote('');
    setSelectedReturn(null);
    showToast(`Return ${newStatus}`, 'success');
  };

  const stats = {
    pending: returns.filter((r) => r.status === 'pending').length,
    approved: returns.filter((r) => r.status === 'approved').length,
    received: returns.filter((r) => r.status === 'received').length,
    refunded: returns.filter((r) => r.status === 'refunded').length,
    totalRefundAmount: returns
      .filter((r) => r.status === 'refunded')
      .reduce((acc, r) => acc + r.refundAmount, 0),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-gold-400 text-sm hover:underline mb-2 block">
              ← Back to Dashboard
            </Link>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              RETURNS MANAGEMENT
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            Export Report
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, icon: '✓', color: 'text-blue-400' },
            { label: 'Received', value: stats.received, icon: '📦', color: 'text-purple-400' },
            { label: 'Refunded', value: stats.refunded, icon: '💰', color: 'text-green-400' },
            {
              label: 'Total Refunded',
              value: `$${stats.totalRefundAmount.toFixed(2)}`,
              icon: '💵',
              color: 'text-gold-400',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{stat.icon}</span>
                <span className="text-white/50 text-sm">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'approved', 'received', 'refunded', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-night-700 text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Returns List */}
        <div className="space-y-4">
          {filteredReturns.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <span className="text-4xl block mb-4">📦</span>
              <p className="text-white/50">No returns found</p>
            </div>
          ) : (
            filteredReturns.map((returnItem) => (
              <motion.div
                key={returnItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Return Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-gold-400 font-mono font-bold">{returnItem.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(returnItem.status)}`}>
                        {returnItem.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-white/50 text-sm">Customer</p>
                        <p className="text-white font-medium">{returnItem.customerName}</p>
                        <p className="text-white/60 text-sm">{returnItem.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Order ID</p>
                        <p className="text-white font-mono">{returnItem.orderId}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-white/50 text-sm">Reason</p>
                      <p className="text-white">{returnItem.reason}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-white/50 text-sm mb-2">Items</p>
                      <div className="space-y-2">
                        {returnItem.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between bg-night-700 rounded-lg p-3">
                            <span className="text-white/80">
                              {item.name}
                              {item.size && <span className="text-white/40"> ({item.size})</span>}
                              {item.quantity > 1 && <span className="text-white/40"> ×{item.quantity}</span>}
                            </span>
                            <span className="text-white font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {returnItem.notes && (
                      <div className="mb-4">
                        <p className="text-white/50 text-sm">Notes</p>
                        <p className="text-white/70 text-sm">{returnItem.notes}</p>
                      </div>
                    )}

                    {returnItem.trackingNumber && (
                      <div>
                        <p className="text-white/50 text-sm">Tracking Number</p>
                        <p className="text-gold-400 font-mono">{returnItem.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="glass rounded-xl p-4 space-y-4">
                      <div className="text-center">
                        <p className="text-white/50 text-sm">Refund Amount</p>
                        <p className="text-2xl font-bold text-gold-400">
                          ${returnItem.refundAmount.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-center text-sm text-white/40">
                        <p>Requested: {returnItem.requestedAt}</p>
                        <p>Updated: {returnItem.updatedAt}</p>
                      </div>

                      {returnItem.status === 'pending' && (
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedReturn(returnItem)}
                            className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            Review & Approve
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Reject this return request?')) {
                                updateStatus(returnItem.id, 'rejected');
                              }
                            }}
                            className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {returnItem.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(returnItem.id, 'received')}
                          className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                        >
                          Mark as Received
                        </button>
                      )}

                      {returnItem.status === 'received' && (
                        <button
                          onClick={() => updateStatus(returnItem.id, 'refunded')}
                          className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                        >
                          Process Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Approval Modal */}
        <AnimatePresence>
          {selectedReturn && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedReturn(null)}
                className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-night-800 rounded-2xl p-6 z-50"
              >
                <h3 className="text-xl font-bold text-white mb-4">Approve Return</h3>
                <p className="text-white/60 mb-4">
                  Approving this return will send the customer instructions to ship the item back.
                </p>

                <div className="mb-4">
                  <label className="text-white/50 text-sm mb-2 block">Add a note (optional)</label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Internal note about this return..."
                    rows={3}
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="flex-1 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateStatus(selectedReturn.id, 'approved')}
                    className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                  >
                    Approve Return
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
