'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/context/ToastContext';

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminNewsPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const supabase = createClient();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      // Log for debugging but show user-friendly message
      console.error('Error fetching news:', error);
      showToast('Failed to load articles. Please try again.', 'error');
    } else {
      setArticles(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('news')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error deleting article:', error);
      showToast('Error deleting article', 'error');
    } else {
      setArticles(articles.filter((a) => a.id !== id));
      showToast('Article deleted successfully', 'success');
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('news')
      .update({
        published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (error) {
      // Log for debugging but show user-friendly message
      console.error('Error updating article:', error);
      showToast('Failed to update article status. Please try again.', 'error');
    } else {
      setArticles(
        articles.map((a) =>
          a.id === id
            ? { ...a, published: !currentStatus, published_at: !currentStatus ? new Date().toISOString() : null }
            : a
        )
      );
      showToast(currentStatus ? 'Article unpublished' : 'Article published', 'success');
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case 'published':
        return article.published;
      case 'draft':
        return !article.published;
      default:
        return true;
    }
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            NEWS
          </h1>
          <p className="text-white/50 mt-1">Manage news articles</p>
        </div>
        <Link href="/admin/news/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            + New Article
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 glass rounded-xl p-4">
          <label htmlFor="news-search" className="sr-only">Search articles</label>
          <input
            id="news-search"
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
          />
        </div>
        <div className="glass rounded-xl p-4 flex gap-2" role="group" aria-label="Filter articles by status">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                filter === f
                  ? 'bg-gold-500 text-night-900'
                  : 'bg-night-700 text-white/70 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4" role="list" aria-label="News articles list">
        {isLoading ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" aria-hidden="true" />
            <span className="sr-only">Loading articles...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/50" role="status" aria-live="polite">
            {searchQuery || filter !== 'all'
              ? 'No articles found'
              : 'No articles yet. Write your first article!'}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 focus-within:ring-2 focus-within:ring-gold-400"
              role="listitem"
              aria-label={`${article.title} - ${article.published ? 'Published' : 'Draft'}`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Image */}
                {article.image && (
                  <div className="lg:w-48 h-32 lg:h-auto flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full">
                          {article.category}
                        </span>
                        {article.published ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-white/50 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-white/40 text-sm">
                        {article.author && <span>By {article.author}</span>}
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => togglePublish(article.id, article.published)}
                    aria-label={article.published ? `Unpublish "${article.title}"` : `Publish "${article.title}"`}
                    className={`flex-1 px-4 py-2 rounded-xl transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                      article.published
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 focus-visible:ring-yellow-400'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 focus-visible:ring-green-400'
                    }`}
                  >
                    {article.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link href={`/admin/news/${article.id}`} className="flex-1">
                    <button
                      className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                      aria-label={`Edit "${article.title}"`}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(article.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                    aria-label={`Delete "${article.title}"`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        title="Delete Article?"
        message="Are you sure you want to delete this article? This action cannot be undone and will remove the article permanently."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
