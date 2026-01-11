'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { products, type Product } from '@/data/products';
import { useToast } from '@/context/ToastContext';

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    stock: '',
    sizes: [] as string[],
    tags: [] as string[],
    featured: false,
    inStock: true,
  });

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData({
        name: foundProduct.name,
        price: foundProduct.price.toString(),
        originalPrice: foundProduct.originalPrice?.toString() || '',
        category: foundProduct.category,
        description: foundProduct.description,
        stock: '100',
        sizes: foundProduct.sizes || [],
        tags: foundProduct.tags,
        featured: foundProduct.featured || false,
        inStock: foundProduct.inStock,
      });
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast('Product updated successfully', 'success');
    setIsLoading(false);
    router.push('/admin/products');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast('Product deleted', 'success');
    router.push('/admin/products');
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-white/50">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/products" className="text-gold-400 text-sm hover:underline mb-2 block">
              ← Back to Products
            </Link>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              EDIT PRODUCT
            </h1>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Delete Product
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-white/50 text-sm mb-2 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-white/50 text-sm mb-2 block">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="Jerseys">Jerseys</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Collectibles">Collectibles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Compare at Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-700 text-white/60 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-night-700 text-white/70 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((t) => t !== tag),
                      })
                    }
                    className="text-white/40 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value && !formData.tags.includes(value)) {
                    setFormData({ ...formData, tags: [...formData.tags, value] });
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>

          {/* Status */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Status</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-night-700 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">In Stock</p>
                  <p className="text-white/50 text-sm">Product is available for purchase</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-5 h-5 rounded border-gold-500/30 bg-night-600 text-gold-500 focus:ring-gold-500/50"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-night-700 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Featured Product</p>
                  <p className="text-white/50 text-sm">Show on homepage featured section</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gold-500/30 bg-night-600 text-gold-500 focus:ring-gold-500/50"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/admin/products" className="flex-1">
              <button
                type="button"
                className="w-full py-4 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
