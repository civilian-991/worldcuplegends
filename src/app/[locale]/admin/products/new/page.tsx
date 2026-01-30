'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

const categories = [
  { slug: 'jerseys', name: 'Jerseys' },
  { slug: 't-shirts', name: 'T-Shirts' },
  { slug: 'outerwear', name: 'Outerwear' },
  { slug: 'shorts', name: 'Shorts' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'equipment', name: 'Equipment' },
  { slug: 'collectibles', name: 'Collectibles' },
];

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    stockQuantity: '100',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare product data for database
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        description: formData.description.trim() || null,
        category: formData.category,
        in_stock: formData.inStock,
        featured: formData.featured,
        sizes: formData.sizes,
        colors: formData.colors.filter(c => c.name.trim() !== ''),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '') : [],
        legend: formData.legend.trim() || null,
        team: formData.team.trim() || null,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        images: [],
        rating: 0,
        review_count: 0,
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        console.error('Error creating product:', error);
        showToast(`Error creating product: ${error.message}`, 'error');
      } else {
        showToast('Product created successfully!', 'success');
        router.push('/admin/products');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {categories.map((cat) => (
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
                disabled={isLoading}
                rows={4}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none disabled:opacity-50"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-white/50 text-sm mb-2 block">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isLoading}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                placeholder="129.99 (leave empty if no sale)"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                disabled={isLoading}
                min="0"
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                placeholder="100"
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
                  disabled={isLoading}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all disabled:opacity-50 ${
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
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    disabled={isLoading}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 disabled:opacity-50"
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      disabled={isLoading}
                      className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
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
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-night-700 text-gold-400 rounded-xl hover:bg-night-600 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                placeholder="Pele, Maradona, etc."
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Team (optional)</label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
              className="w-full py-4 bg-night-700 text-white rounded-xl hover:bg-night-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </Link>
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-night-900/20 border-t-night-900 rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
