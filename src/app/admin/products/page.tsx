'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { products, categories } from '@/data/products';

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        filtered.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API
    console.log('Deleting product:', id);
    setDeleteModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            PRODUCTS
          </h1>
          <p className="text-white/50 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl flex items-center gap-2"
          >
            <span>➕</span>
            Add Product
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
        >
          <option value="name">Name A-Z</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock">In Stock First</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 flex items-center justify-between"
        >
          <p className="text-white">
            <span className="font-semibold">{selectedProducts.length}</span> product(s) selected
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-night-600 text-white/70 rounded-lg hover:bg-night-500 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              Delete Selected
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                  />
                </th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Product</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Category</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Price</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Stock</th>
                <th className="p-4 text-left text-white/50 text-sm font-medium">Rating</th>
                <th className="p-4 text-right text-white/50 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gold-500/5 hover:bg-night-700/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-night-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">
                          {product.category === 'Jerseys'
                            ? '👕'
                            : product.category === 'T-Shirts'
                            ? '👔'
                            : product.category === 'Outerwear'
                            ? '🧥'
                            : product.category === 'Shorts'
                            ? '🩳'
                            : product.category === 'Accessories'
                            ? '🧢'
                            : product.category === 'Equipment'
                            ? '⚽'
                            : product.category === 'Collectibles'
                            ? '🏆'
                            : '🛍️'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{product.name}</p>
                        <p className="text-white/40 text-sm">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gold-500/10 text-gold-400 text-sm rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-semibold">${product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-white/40 text-sm line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.inStock
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gold-400">★</span>
                      <span className="text-white">{product.rating}</span>
                      <span className="text-white/40 text-sm">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/shop/${product.id}`}>
                        <button
                          className="w-8 h-8 rounded-lg bg-night-600 flex items-center justify-center text-white/50 hover:text-white hover:bg-night-500 transition-colors"
                          title="View"
                        >
                          👁️
                        </button>
                      </Link>
                      <Link href={`/admin/products/${product.id}`}>
                        <button
                          className="w-8 h-8 rounded-lg bg-night-600 flex items-center justify-center text-white/50 hover:text-white hover:bg-night-500 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteModal(product.id)}
                        className="w-8 h-8 rounded-lg bg-night-600 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gold-500/10 flex items-center justify-between">
          <p className="text-white/50 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-night-700 text-white/50 rounded-lg hover:bg-night-600 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg">1</button>
            <button className="px-4 py-2 bg-night-700 text-white/50 rounded-lg hover:bg-night-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal(null)}
              className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-night-800 rounded-2xl p-6 z-50"
            >
              <h3 className="text-xl font-bold text-white mb-4">Delete Product?</h3>
              <p className="text-white/60 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 bg-night-600 text-white rounded-xl hover:bg-night-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
