'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'World Legends Cup Shop',
    storeEmail: 'shop@wlc2026.com',
    supportEmail: 'support@wlc2026.com',
    phone: '+1 (555) 123-4567',
    address: '123 Football Avenue, New York, NY 10001',
    currency: 'USD',
    timezone: 'America/New_York',
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingRate: 9.99,
    expressShippingRate: 19.99,
    internationalShippingRate: 29.99,
    processingTime: '1-2',
  });

  const [taxSettings, setTaxSettings] = useState({
    enableTax: true,
    taxRate: 8,
    taxIncluded: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    promotionalEmails: false,
    lowStockAlerts: true,
    newCustomerAlerts: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'shipping', label: 'Shipping', icon: '🚚' },
    { id: 'tax', label: 'Tax', icon: '📋' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'payment', label: 'Payment', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          SETTINGS
        </h1>
        <p className="text-white/50 mt-1">Configure your store settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass rounded-xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-white/60 hover:bg-night-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Store Name</label>
                    <input
                      type="text"
                      value={generalSettings.storeName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Store Email</label>
                    <input
                      type="email"
                      value={generalSettings.storeEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-white/50 text-sm mb-2 block">Address</label>
                    <input
                      type="text"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="BRL">BRL (R$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Central European (CET)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Shipping Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Free Shipping Threshold ($)</label>
                    <input
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Standard Shipping ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingSettings.standardShippingRate}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Express Shipping ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingSettings.expressShippingRate}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">International Shipping ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingSettings.internationalShippingRate}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, internationalShippingRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Processing Time (days)</label>
                    <select
                      value={shippingSettings.processingTime}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, processingTime: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="1-2">1-2 business days</option>
                      <option value="2-3">2-3 business days</option>
                      <option value="3-5">3-5 business days</option>
                      <option value="5-7">5-7 business days</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tax Settings */}
          {activeTab === 'tax' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Tax Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">Enable Tax Calculation</p>
                    <p className="text-white/50 text-sm">Calculate tax on orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxSettings.enableTax}
                      onChange={(e) => setTaxSettings({ ...taxSettings, enableTax: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-night-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Default Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxSettings.taxRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-night-700 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">Tax Included in Prices</p>
                    <p className="text-white/50 text-sm">Display prices with tax included</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxSettings.taxIncluded}
                      onChange={(e) => setTaxSettings({ ...taxSettings, taxIncluded: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-night-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { key: 'orderConfirmation', label: 'Order Confirmation', desc: 'Send email when order is placed' },
                  { key: 'shippingUpdates', label: 'Shipping Updates', desc: 'Send email when order ships' },
                  { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Send marketing emails to customers' },
                  { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Get notified when inventory is low' },
                  { key: 'newCustomerAlerts', label: 'New Customer Alerts', desc: 'Get notified of new registrations' },
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
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-night-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Payment Settings</h2>
              <div className="space-y-4">
                {[
                  { name: 'Credit Card', icon: '💳', enabled: true, desc: 'Visa, Mastercard, Amex' },
                  { name: 'PayPal', icon: '🅿️', enabled: true, desc: 'PayPal checkout' },
                  { name: 'Apple Pay', icon: '🍎', enabled: false, desc: 'Apple Pay support' },
                  { name: 'Google Pay', icon: '🔵', enabled: false, desc: 'Google Pay support' },
                ].map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center justify-between p-4 bg-night-700 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="text-white font-semibold">{method.name}</p>
                        <p className="text-white/50 text-sm">{method.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          method.enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {method.enabled ? 'Active' : 'Inactive'}
                      </span>
                      <button className="text-gold-400 hover:text-gold-300 text-sm">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
