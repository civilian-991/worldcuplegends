'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/products';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    description: '',
    category: 'Jerseys',
    inStock: true,
    featured: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: '', hex: '#000000' }],
    tags: '',
    legend: '',
    team: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating product:', formData);
    router.push('/admin/products');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000' }],
    }));
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      ),
    }));
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products" className="text-gold-400 hover:text-gold-300 text-sm mb-4 inline-block">
          ← Back to Products
        </Link>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ADD NEW PRODUCT
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-white/50 text-sm mb-2 block">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="World Legends Cup 2026 Official Jersey"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="wlc-2026-official-jersey"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
              >
                {categories.filter(c => c.slug !== 'all').map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white/50 text-sm mb-2 block">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/50 text-sm mb-2 block">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="99.99"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Original Price ($)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="129.99 (leave empty if no sale)"
              />
            </div>
          </div>
        </motion.div>

        {/* Variants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Variants</h2>

          {/* Sizes */}
          <div className="mb-6">
            <label className="text-white/50 text-sm mb-3 block">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                    formData.sizes.includes(size)
                      ? 'bg-gold-500 text-night-900'
                      : 'bg-night-700 text-white/50 hover:bg-night-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-white/50 text-sm mb-3 block">Colors</label>
            <div className="space-y-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    placeholder="Color name (e.g., Black/Gold)"
                    className="flex-1 px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0"
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColor}
              className="mt-3 px-4 py-2 bg-night-700 text-gold-400 rounded-xl hover:bg-night-600 transition-colors"
            >
              + Add Color
            </button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/50 text-sm mb-2 block">Legend (optional)</label>
              <input
                type="text"
                name="legend"
                value={formData.legend}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="Pelé, Maradona, etc."
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Team (optional)</label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="Brazil, Argentina, etc."
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-white/50 text-sm mb-2 block">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="official, jersey, new arrival"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
              />
              <span className="text-white">In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gold-500/30 bg-night-700 text-gold-500 focus:ring-gold-500/50"
              />
              <span className="text-white">Featured Product</span>
            </label>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/admin/products" className="flex-1">
            <button
              type="button"
              className="w-full py-4 bg-night-700 text-white rounded-xl hover:bg-night-600 transition-colors"
            >
              Cancel
            </button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            Create Product
          </motion.button>
        </div>
      </form>
    </div>
  );
}
