'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import { useToast } from '@/context/ToastContext';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = products.map((p) => {
  const stockQty = p.inStock ? Math.floor(Math.random() * 130) + 20 : Math.floor(Math.random() * 5);
  return {
    id: p.id,
    name: p.name,
    sku: `WLC-${String(p.id).padStart(4, '0')}`,
    category: p.category,
    stock: stockQty,
    lowStockThreshold: 20,
    status:
      stockQty === 0
        ? 'out_of_stock'
        : stockQty < 20
        ? 'low_stock'
        : 'in_stock',
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  };
});

export default function AdminInventoryPage() {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStock, setNewStock] = useState('');

  const filteredInventory = inventory.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'low_stock' && item.status === 'low_stock') ||
      (filter === 'out_of_stock' && item.status === 'out_of_stock');

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-500/20 text-green-400';
      case 'low_stock':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'out_of_stock':
        return 'bg-red-500/20 text-red-400';
    }
  };

  const getStatusLabel = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
    }
  };

  const handleUpdateStock = (itemId: number) => {
    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      showToast('Please enter a valid stock quantity', 'error');
      return;
    }

    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stock: stockValue,
              status:
                stockValue === 0
                  ? 'out_of_stock'
                  : stockValue < item.lowStockThreshold
                  ? 'low_stock'
                  : 'in_stock',
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );

    setEditingItem(null);
    setNewStock('');
    showToast('Stock updated successfully', 'success');
  };

  const stats = {
    totalProducts: inventory.length,
    inStock: inventory.filter((i) => i.status === 'in_stock').length,
    lowStock: inventory.filter((i) => i.status === 'low_stock').length,
    outOfStock: inventory.filter((i) => i.status === 'out_of_stock').length,
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
              INVENTORY MANAGEMENT
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            Export CSV
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: '📦' },
            { label: 'In Stock', value: stats.inStock, icon: '✅', color: 'text-green-400' },
            { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: 'text-yellow-400' },
            { label: 'Out of Stock', value: stats.outOfStock, icon: '❌', color: 'text-red-400' },
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-3 bg-night-800 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'low_stock', 'out_of_stock'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  filter === f
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-night-700 text-white/60 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : f === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-500/20 bg-night-800/50">
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">SKU</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Category</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Stock</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Last Updated</th>
                  <th className="text-left py-4 px-6 text-gold-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gold-500/10 hover:bg-night-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-white font-medium truncate max-w-[200px]">{item.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white/60 font-mono text-sm">{item.sku}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white/60">{item.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      {editingItem?.id === item.id ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-20 px-2 py-1 bg-night-600 border border-gold-500/30 rounded text-white text-center"
                          autoFocus
                        />
                      ) : (
                        <span className="text-white font-medium">{item.stock}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white/50 text-sm">{item.lastUpdated}</span>
                    </td>
                    <td className="py-4 px-6">
                      {editingItem?.id === item.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStock(item.id)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setNewStock('');
                            }}
                            className="px-3 py-1 bg-night-600 text-white/50 rounded-lg text-sm hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewStock(item.stock.toString());
                          }}
                          className="px-3 py-1 bg-night-600 text-white/50 rounded-lg text-sm hover:text-white hover:bg-night-500"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-4">📦</span>
              <p className="text-white/50">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
