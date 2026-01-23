'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useToast } from '@/context/ToastContext';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  applicableCategories?: string[];
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'LEGENDS10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 50,
    maxUses: 1000,
    usedCount: 342,
    expiresAt: '2026-06-30',
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    maxUses: undefined,
    usedCount: 156,
    expiresAt: '2026-12-31',
    isActive: true,
    createdAt: '2025-12-01',
  },
  {
    id: '3',
    code: 'JERSEY25',
    type: 'fixed',
    value: 25,
    minOrderAmount: 100,
    maxUses: 500,
    usedCount: 500,
    expiresAt: '2026-03-01',
    isActive: false,
    createdAt: '2025-11-15',
    applicableCategories: ['Jerseys'],
  },
  {
    id: '4',
    code: 'FREESHIP',
    type: 'fixed',
    value: 7.99,
    minOrderAmount: 30,
    usedCount: 89,
    isActive: true,
    createdAt: '2026-01-05',
  },
];

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
    isActive: true,
  });

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        minOrderAmount: coupon.minOrderAmount?.toString() || '',
        maxUses: coupon.maxUses?.toString() || '',
        expiresAt: coupon.expiresAt || '',
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        maxUses: '',
        expiresAt: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const couponData: Coupon = {
      id: editingCoupon?.id || Date.now().toString(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      expiresAt: formData.expiresAt || undefined,
      isActive: formData.isActive,
      usedCount: editingCoupon?.usedCount || 0,
      createdAt: editingCoupon?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingCoupon) {
      setCoupons((prev) => prev.map((c) => (c.id === couponData.id ? couponData : c)));
      showToast('Coupon updated successfully', 'success');
    } else {
      setCoupons((prev) => [couponData, ...prev]);
      showToast('Coupon created successfully', 'success');
    }

    closeModal();
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Coupon status updated', 'success');
  };

  const deleteCoupon = (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    showToast('Coupon deleted', 'success');
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
              COUPON MANAGEMENT
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl flex items-center gap-2"
          >
            <span>➕</span>
            Create Coupon
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Coupons', value: coupons.length, icon: '🎟️' },
            {
              label: 'Active',
              value: coupons.filter((c) => c.isActive).length,
              icon: '✅',
              color: 'text-green-400',
            },
            {
              label: 'Inactive',
              value: coupons.filter((c) => !c.isActive).length,
              icon: '⏸️',
              color: 'text-yellow-400',
            },
            {
              label: 'Total Uses',
              value: coupons.reduce((acc, c) => acc + c.usedCount, 0),
              icon: '📊',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{stat.icon}</span>
                <span className="text-white/50 text-sm">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-2xl p-6 ${!coupon.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎟️</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => openModal(coupon)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  ✏️
                </button>
              </div>

              <h3
                className="text-2xl font-bold text-gold-400 mb-2 font-mono"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {coupon.code}
              </h3>

              <p className="text-white text-lg mb-4">
                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
              </p>

              <div className="space-y-2 text-sm mb-6">
                {coupon.minOrderAmount && (
                  <p className="text-white/50">Min. order: ${coupon.minOrderAmount}</p>
                )}
                {coupon.maxUses && (
                  <p className="text-white/50">
                    Uses: {coupon.usedCount} / {coupon.maxUses}
                    {coupon.usedCount >= coupon.maxUses && (
                      <span className="text-red-400 ml-2">(Exhausted)</span>
                    )}
                  </p>
                )}
                {coupon.expiresAt && (
                  <p className="text-white/50">
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                    {new Date(coupon.expiresAt) < new Date() && (
                      <span className="text-red-400 ml-2">(Expired)</span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    coupon.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteCoupon(coupon.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-night-800 rounded-2xl p-6 z-50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Coupon Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      placeholder="e.g., SUMMER20"
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Discount Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as 'percentage' | 'fixed',
                          })
                        }
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">
                        Value {formData.type === 'percentage' ? '(%)' : '($)'} *
                      </label>
                      <input
                        type="number"
                        step={formData.type === 'percentage' ? '1' : '0.01'}
                        min="0"
                        max={formData.type === 'percentage' ? '100' : undefined}
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Min. Order Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                        placeholder="Optional"
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Max Uses</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxUses}
                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                        placeholder="Unlimited"
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Expiration Date</label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                    />
                    <span className="text-white/70">Active immediately</span>
                  </label>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                    >
                      {editingCoupon ? 'Update' : 'Create'} Coupon
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
