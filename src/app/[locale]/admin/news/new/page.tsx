'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'general',
    author: '',
    published: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('news').insert({
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || null,
      content: formData.content,
      image: formData.image || null,
      category: formData.category,
      author: formData.author || null,
      published: formData.published,
      published_at: formData.published ? new Date().toISOString() : null,
    });

    if (error) {
      console.error('Error creating article:', error);
      alert('Error creating article: ' + error.message);
    } else {
      router.push('/admin/news');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            NEW ARTICLE
          </h1>
          <p className="text-white/50 mt-1">Write a news article</p>
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
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="Article title"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="article-url-slug"
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
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Featured Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-sm mb-2 block">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-none"
            placeholder="Brief summary of the article..."
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
            placeholder="Write your article content here..."
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
          <label htmlFor="published" className="text-white">Publish immediately</label>
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : formData.published ? 'Publish Article' : 'Save as Draft'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
