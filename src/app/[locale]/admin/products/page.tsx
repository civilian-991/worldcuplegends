'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  category: string;
  subcategory: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  legend: string | null;
  team: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      showToast('Error loading products', 'error');
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    cats.set('all', products.length);
    products.forEach((p) => {
      const count = cats.get(p.category) || 0;
      cats.set(p.category, count + 1);
    });
    return Array.from(cats.entries()).map(([name, count]) => ({
      slug: name === 'all' ? 'all' : name.toLowerCase().replace(/\s+/g, '-'),
      name: name === 'all' ? 'All Products' : name,
      count,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description?.toLowerCase().includes(query) || false) ||
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
        filtered.sort((a, b) => (b.in_stock ? 1 : 0) - (a.in_stock ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

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

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      showToast('Error deleting product', 'error');
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product deleted successfully', 'success');
    }
    setIsDeleting(false);
    setDeleteModal(null);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) return;

    const { error } = await supabase.from('products').delete().in('id', selectedProducts);

    if (error) {
      console.error('Error deleting products:', error);
      showToast('Error deleting products', 'error');
    } else {
      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      showToast(`${selectedProducts.length} products deleted`, 'success');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Jerseys':
        return '👕';
      case 'T-Shirts':
        return '👔';
      case 'Outerwear':
        return '🧥';
      case 'Shorts':
        return '🩳';
      case 'Accessories':
        return '🧢';
      case 'Equipment':
        return '⚽';
      case 'Collectibles':
        return '🏆';
      default:
        return '🛍️';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
          >
            Refresh
          </button>
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
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
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
                        <span className="text-xl">{getCategoryIcon(product.category)}</span>
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
                      {product.original_price && (
                        <p className="text-white/40 text-sm line-through">
                          ${product.original_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.in_stock
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gold-400">★</span>
                      <span className="text-white">{product.rating.toFixed(1)}</span>
                      <span className="text-white/40 text-sm">({product.review_count})</span>
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

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-white/50">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
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
        )}
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
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-night-600 text-white rounded-xl hover:bg-night-500 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
