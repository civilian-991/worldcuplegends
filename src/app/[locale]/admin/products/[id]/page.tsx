'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import { use } from 'react';

interface ProductColor {
  name: string;
  hex: string;
}

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const productId = parseInt(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    stockQuantity: '',
    sizes: [] as string[],
    colors: [] as ProductColor[],
    tags: [] as string[],
    featured: false,
    inStock: true,
    legend: '',
    team: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      showToast('Product not found', 'error');
      router.push('/admin/products');
    } else if (data) {
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        price: data.price?.toString() || '',
        originalPrice: data.original_price?.toString() || '',
        category: data.category || '',
        description: data.description || '',
        stockQuantity: data.stock_quantity?.toString() || '0',
        sizes: data.sizes || [],
        colors: data.colors || [],
        tags: data.tags || [],
        featured: data.featured || false,
        inStock: data.in_stock ?? true,
        legend: data.legend || '',
        team: data.team || '',
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        description: formData.description.trim() || null,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        sizes: formData.sizes,
        colors: formData.colors,
        tags: formData.tags,
        featured: formData.featured,
        in_stock: formData.inStock,
        legend: formData.legend.trim() || null,
        team: formData.team.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) {
        console.error('Error updating product:', error);
        showToast(`Error updating product: ${error.message}`, 'error');
      } else {
        showToast('Product updated successfully', 'success');
        router.push('/admin/products');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        showToast(`Error deleting product: ${error.message}`, 'error');
      } else {
        showToast('Product deleted successfully', 'success');
        router.push('/admin/products');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
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
          <p className="text-white/50 mt-1">Update product information</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting || isSaving}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete Product'
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-white/50 text-sm mb-2 block">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer disabled:opacity-50"
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

            <div>
              <label className="text-white/50 text-sm mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                disabled={isSaving}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors resize-none disabled:opacity-50"
              />
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
                disabled={isSaving}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
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
                disabled={isSaving}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                disabled={isSaving}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Variants - Sizes */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
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

        {/* Colors */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Colors</h2>
          <div className="space-y-3">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(index, 'name', e.target.value)}
                  placeholder="Color name (e.g., Black/Gold)"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(index, 'hex', e.target.value)}
                  disabled={isSaving}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  disabled={isSaving}
                  className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addColor}
            disabled={isSaving}
            className="mt-3 px-4 py-2 bg-night-700 text-gold-400 rounded-xl hover:bg-night-600 transition-colors disabled:opacity-50"
          >
            + Add Color
          </button>
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
                  disabled={isSaving}
                  className="text-white/40 hover:text-white disabled:opacity-50"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add tag and press Enter"
            disabled={isSaving}
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
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Additional Info */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-sm mb-2 block">Legend (optional)</label>
              <input
                type="text"
                value={formData.legend}
                onChange={(e) => setFormData({ ...formData, legend: e.target.value })}
                disabled={isSaving}
                placeholder="Pele, Maradona, etc."
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Team (optional)</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                disabled={isSaving}
                placeholder="Brazil, Argentina, etc."
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
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
                disabled={isSaving}
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
                disabled={isSaving}
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
              disabled={isSaving}
              className="w-full py-4 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </Link>
          <motion.button
            whileHover={{ scale: isSaving ? 1 : 1.01 }}
            whileTap={{ scale: isSaving ? 1 : 0.99 }}
            type="submit"
            disabled={isSaving || isDeleting}
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-night-900/20 border-t-night-900 rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
