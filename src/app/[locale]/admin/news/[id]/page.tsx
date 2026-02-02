'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { use } from 'react';
import { useToast } from '@/context/ToastContext';
import { sanitizeText, sanitizeSlug, sanitizeRichHtml, sanitizeImageUrl, isValidUrl } from '@/lib/sanitize';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'general',
    author: '',
    published: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      router.push('/admin/news');
    } else if (data) {
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        image: data.image || '',
        category: data.category || 'general',
        author: data.author || '',
        published: data.published || false,
        tags: data.tags || [],
      });
    }
    setIsLoading(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Validate image URL if provided
    if (formData.image && !isValidUrl(formData.image)) {
      showToast('Invalid image URL. Only http:// and https:// URLs are allowed.', 'error');
      setIsSaving(false);
      return;
    }

    // Sanitize all inputs
    const sanitizedData = {
      title: sanitizeText(formData.title),
      slug: sanitizeSlug(formData.slug),
      excerpt: sanitizeText(formData.excerpt) || null,
      content: sanitizeRichHtml(formData.content),
      image: sanitizeImageUrl(formData.image) || null,
      category: sanitizeText(formData.category),
      author: sanitizeText(formData.author) || null,
      published: formData.published,
      published_at: formData.published ? new Date().toISOString() : null,
      tags: formData.tags.map(tag => sanitizeText(tag)),
    };

    const { error } = await supabase
      .from('news')
      .update(sanitizedData)
      .eq('id', id);

    if (error) {
      console.error('Error updating article:', error);
      showToast('Error updating article: ' + error.message, 'error');
    } else {
      showToast('Article updated successfully!', 'success');
      router.push('/admin/news');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            EDIT ARTICLE
          </h1>
          <p className="text-white/50 mt-1">Update news article</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-white/50 text-sm mb-2 block">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            >
              <option value="general">General</option>
              <option value="tournament">Tournament</option>
              <option value="legends">Legends</option>
              <option value="teams">Teams</option>
              <option value="matches">Matches</option>
              <option value="announcements">Announcements</option>
            </select>
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Featured Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label className="text-white/50 text-sm mb-2 block">Entity Tags</label>
          <p className="text-white/30 text-xs mb-2">Add tags for legends, teams, events, etc. Press Enter to add.</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gold-500/20 text-gold-400 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gold-400/60 hover:text-gold-400 transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            placeholder="Type a tag and press Enter (e.g., Romário, Brazil, WLC 2026)"
          />
        </div>

        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
        )}

        <div>
          <label className="text-white/50 text-sm mb-2 block">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-none"
          />
        </div>

        <div>
          <label className="text-white/50 text-sm mb-2 block">Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={12}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-5 h-5 rounded border-gold-500/30 bg-night-700 text-gold-500"
          />
          <label htmlFor="published" className="text-white">Published</label>
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
