'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PROFILE INFORMATION
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-xl hover:bg-gold-500/30 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-white/50 text-sm mb-2 block">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            ) : (
              <p className="text-white py-3">{user?.firstName || '-'}</p>
            )}
          </div>

          <div>
            <label className="text-white/50 text-sm mb-2 block">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            ) : (
              <p className="text-white py-3">{user?.lastName || '-'}</p>
            )}
          </div>

          <div>
            <label className="text-white/50 text-sm mb-2 block">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            ) : (
              <p className="text-white py-3">{user?.email || '-'}</p>
            )}
          </div>

          <div>
            <label className="text-white/50 text-sm mb-2 block">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            ) : (
              <p className="text-white py-3">{user?.phone || '-'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
            >
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '5', icon: '📦' },
          { label: 'Wishlist Items', value: '3', icon: '♥' },
          { label: 'Reviews Written', value: '2', icon: '⭐' },
          { label: 'Member Since', value: 'Nov 2025', icon: '📅' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 text-center">
            <span className="text-2xl block mb-2">{stat.icon}</span>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Security Section */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
            <div>
              <p className="text-white font-semibold">Password</p>
              <p className="text-white/50 text-sm">Last changed 30 days ago</p>
            </div>
            <button className="px-4 py-2 bg-night-600 text-gold-400 rounded-lg hover:bg-night-500 transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
            <div>
              <p className="text-white font-semibold">Two-Factor Authentication</p>
              <p className="text-white/50 text-sm">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-night-600 text-gold-400 rounded-lg hover:bg-night-500 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
