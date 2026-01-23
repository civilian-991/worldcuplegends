'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, type Address } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountAddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        label: '',
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      showToast('Address updated', 'success');
    } else {
      addAddress(formData);
      showToast('Address added', 'success');
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    showToast('Address deleted', 'success');
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    showToast('Default address updated', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          SAVED ADDRESSES
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl flex items-center gap-2"
        >
          <span>➕</span>
          Add Address
        </motion.button>
      </div>

      {addresses.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <span className="text-6xl block mb-4">📍</span>
          <h3 className="text-xl font-bold text-white mb-2">No addresses saved</h3>
          <p className="text-white/50 mb-6">Add an address for faster checkout</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            Add Your First Address
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-2xl p-6 relative ${
                address.isDefault ? 'border border-gold-500/30' : ''
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-medium rounded-full">
                  Default
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📍</span>
                <h3 className="text-white font-semibold">{address.label}</h3>
              </div>

              <div className="text-white/60 space-y-1">
                <p>{address.firstName} {address.lastName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p className="pt-2">{address.phone}</p>
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t border-gold-500/10">
                <button
                  onClick={() => openModal(address)}
                  className="px-4 py-2 bg-night-700 text-white/70 rounded-lg hover:bg-night-600 hover:text-white transition-colors text-sm"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="px-4 py-2 bg-night-700 text-white/70 rounded-lg hover:bg-night-600 hover:text-white transition-colors text-sm"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
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
                  <label className="text-white/50 text-sm mb-2 block">Label</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    required
                    placeholder="Home, Office, etc."
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Street Address</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                  />
                  <span className="text-white/70">Set as default address</span>
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
                    {editingAddress ? 'Update' : 'Add'} Address
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
