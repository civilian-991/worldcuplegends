'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      showToast('Error loading coupons', 'error');
    } else {
      setCoupons(data || []);
    }
    setIsLoading(false);
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        min_order_amount: coupon.min_order_amount?.toString() || '',
        max_uses: coupon.max_uses?.toString() || '',
        expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
        is_active: coupon.is_active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_uses: '',
        expires_at: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const couponData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      expires_at: formData.expires_at || null,
      is_active: formData.is_active,
    };

    if (editingCoupon) {
      // Update existing coupon
      const { error } = await supabase
        .from('coupons')
        .update(couponData)
        .eq('id', editingCoupon.id);

      if (error) {
        console.error('Error updating coupon:', error);
        showToast('Error updating coupon', 'error');
      } else {
        setCoupons((prev) =>
          prev.map((c) => (c.id === editingCoupon.id ? { ...c, ...couponData } : c))
        );
        showToast('Coupon updated successfully', 'success');
        closeModal();
      }
    } else {
      // Create new coupon
      const { data, error } = await supabase
        .from('coupons')
        .insert([{ ...couponData, used_count: 0 }])
        .select()
        .single();

      if (error) {
        console.error('Error creating coupon:', error);
        if (error.code === '23505') {
          showToast('Coupon code already exists', 'error');
        } else {
          showToast('Error creating coupon', 'error');
        }
      } else {
        setCoupons((prev) => [data, ...prev]);
        showToast('Coupon created successfully', 'success');
        closeModal();
      }
    }

    setIsSaving(false);
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !coupon.is_active })
      .eq('id', coupon.id);

    if (error) {
      console.error('Error toggling coupon status:', error);
      showToast('Error updating coupon', 'error');
    } else {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
      );
      showToast('Coupon status updated', 'success');
    }
  };

  const deleteCoupon = async (couponId: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    const { error } = await supabase.from('coupons').delete().eq('id', couponId);

    if (error) {
      console.error('Error deleting coupon:', error);
      showToast('Error deleting coupon', 'error');
    } else {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      showToast('Coupon deleted', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-3">
            <button
              onClick={fetchCoupons}
              className="px-4 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
            >
              Refresh
            </button>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Coupons', value: coupons.length, icon: '🎟️' },
            {
              label: 'Active',
              value: coupons.filter((c) => c.is_active).length,
              icon: '✅',
              color: 'text-green-400',
            },
            {
              label: 'Inactive',
              value: coupons.filter((c) => !c.is_active).length,
              icon: '⏸️',
              color: 'text-yellow-400',
            },
            {
              label: 'Total Uses',
              value: coupons.reduce((acc, c) => acc + c.used_count, 0),
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
        {coupons.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-4">🎟️</span>
            <p className="text-white/50">No coupons found. Create your first coupon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass rounded-2xl p-6 ${!coupon.is_active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎟️</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {coupon.is_active ? 'Active' : 'Inactive'}
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
                  {coupon.min_order_amount && (
                    <p className="text-white/50">Min. order: ${coupon.min_order_amount}</p>
                  )}
                  {coupon.max_uses && (
                    <p className="text-white/50">
                      Uses: {coupon.used_count} / {coupon.max_uses}
                      {coupon.used_count >= coupon.max_uses && (
                        <span className="text-red-400 ml-2">(Exhausted)</span>
                      )}
                    </p>
                  )}
                  {coupon.expires_at && (
                    <p className="text-white/50">
                      Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                      {new Date(coupon.expires_at) < new Date() && (
                        <span className="text-red-400 ml-2">(Expired)</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCouponStatus(coupon)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      coupon.is_active
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {coupon.is_active ? 'Deactivate' : 'Activate'}
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
        )}

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
                        value={formData.min_order_amount}
                        onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                        placeholder="Optional"
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm mb-2 block">Max Uses</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.max_uses}
                        onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                        placeholder="Unlimited"
                        className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Expiration Date</label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                    />
                    <span className="text-white/70">Active immediately</span>
                  </label>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSaving}
                      className="flex-1 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-night-900/20 border-t-night-900 rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>{editingCoupon ? 'Update' : 'Create'} Coupon</>
                      )}
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
