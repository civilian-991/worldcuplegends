'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountSettingsPage() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    productReviews: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showWishlist: false,
  });

  const handleSaveNotifications = () => {
    showToast('Notification preferences saved', 'success');
  };

  const handleSavePrivacy = () => {
    showToast('Privacy settings saved', 'success');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2
        className="text-2xl font-bold text-white"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ACCOUNT SETTINGS
      </h2>

      {/* Notification Preferences */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status' },
            { key: 'promotions', label: 'Promotions & Sales', desc: 'Receive exclusive offers and discounts' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Weekly updates about new products and legends' },
            { key: 'productReviews', label: 'Review Reminders', desc: 'Reminders to review purchased products' },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-night-700 rounded-xl"
            >
              <div>
                <p className="text-white font-semibold">{setting.label}</p>
                <p className="text-white/50 text-sm">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[setting.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [setting.key]: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-night-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveNotifications}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
        >
          Save Preferences
        </motion.button>
      </div>

      {/* Privacy Settings */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Privacy Settings</h3>
        <div className="space-y-4">
          {[
            { key: 'showProfile', label: 'Public Profile', desc: 'Allow others to see your profile' },
            { key: 'showWishlist', label: 'Public Wishlist', desc: 'Allow others to see your wishlist' },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-night-700 rounded-xl"
            >
              <div>
                <p className="text-white font-semibold">{setting.label}</p>
                <p className="text-white/50 text-sm">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy[setting.key as keyof typeof privacy]}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, [setting.key]: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-night-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePrivacy}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
        >
          Save Settings
        </motion.button>
      </div>

      {/* Connected Accounts */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Connected Accounts</h3>
        <div className="space-y-3">
          {[
            { name: 'Google', icon: '🔵', connected: false },
            { name: 'Apple', icon: '⚫', connected: false },
            { name: 'Facebook', icon: '🔷', connected: false },
          ].map((account) => (
            <div
              key={account.name}
              className="flex items-center justify-between p-4 bg-night-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{account.icon}</span>
                <span className="text-white">{account.name}</span>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  account.connected
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                }`}
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
            <div>
              <p className="text-white font-semibold">Download My Data</p>
              <p className="text-white/50 text-sm">Get a copy of all your data</p>
            </div>
            <button className="px-4 py-2 bg-night-600 text-white/70 rounded-lg hover:bg-night-500 transition-colors">
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
            <div>
              <p className="text-white font-semibold">Delete Account</p>
              <p className="text-white/50 text-sm">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
