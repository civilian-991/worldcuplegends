'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/context/ToastContext';

const ITEMS_PER_PAGE = 10;

interface Legend {
  id: number;
  name: string;
  short_name: string | null;
  country: string;
  country_code: string | null;
  position: string | null;
  era: string | null;
  goals: number;
  assists: number;
  appearances: number;
  world_cups: number;
  image: string | null;
  team: string | null;
  jersey_number: number | null;
  rating: number | null;
}

export default function AdminLegendsPage() {
  const { showToast } = useToast();
  const [legends, setLegends] = useState<Legend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const supabase = createClient();

  const fetchLegends = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('legends')
      .select('*')
      .is('deleted_at', null)
      .order('name');

    if (error) {
      // Log for debugging but show user-friendly message
      console.error('Error fetching legends:', error);
      showToast('Failed to load legends. Please try again.', 'error');
    } else {
      setLegends(data || []);
    }
    setIsLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    fetchLegends();
  }, [fetchLegends]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('legends')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error deleting legend:', error);
      showToast('Error deleting legend', 'error');
    } else {
      setLegends(legends.filter((l) => l.id !== id));
      showToast('Legend deleted successfully', 'success');
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredLegends = useMemo(() => {
    return legends.filter(
      (legend) =>
        legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        legend.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [legends, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLegends.length / ITEMS_PER_PAGE);
  const paginatedLegends = filteredLegends.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            LEGENDS
          </h1>
          <p className="text-white/50 mt-1">Manage football legends</p>
        </div>
        <Link href="/admin/legends/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            + Add Legend
          </motion.button>
        </Link>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <label htmlFor="legends-search" className="sr-only">Search legends</label>
        <input
          id="legends-search"
          type="text"
          placeholder="Search legends by name, country, or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden" role="region" aria-label="Legends table">
        {isLoading ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" aria-hidden="true" />
            <span className="sr-only">Loading legends...</span>
          </div>
        ) : paginatedLegends.length === 0 ? (
          <div className="p-12 text-center text-white/50" role="status" aria-live="polite">
            {searchQuery ? 'No legends found matching your search' : 'No legends yet. Add your first legend!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Football legends list">
              <thead className="bg-night-700">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white/70">Legend</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white/70">Country</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white/70">Position</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white/70">Stats</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white/70">Rating</th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {paginatedLegends.map((legend) => (
                  <tr key={legend.id} className="hover:bg-night-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {legend.image ? (
                          <img
                            src={legend.image}
                            alt=""
                            aria-hidden="true"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400" aria-hidden="true">
                            {legend.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-semibold">{legend.name}</p>
                          {legend.jersey_number && (
                            <p className="text-white/40 text-sm"><span className="sr-only">Jersey number </span>#{legend.jersey_number}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{legend.country}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm">
                        {legend.position || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">
                      <div>
                        <span className="sr-only">Goals: </span>{legend.goals}G / <span className="sr-only">Assists: </span>{legend.assists}A / <span className="sr-only">Appearances: </span>{legend.appearances} Apps
                      </div>
                      <div className="text-white/40">{legend.world_cups} World Cups</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gold-400 font-bold"><span className="sr-only">Rating: </span>{legend.rating || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/legends/${legend.id}`}>
                          <button
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                            aria-label={`Edit ${legend.name}`}
                          >
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(legend.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                          aria-label={`Delete ${legend.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredLegends.length > 0 && (
          <nav className="p-4 border-t border-gold-500/10 flex items-center justify-between" aria-label="Legends pagination">
            <p className="text-white/50 text-sm" aria-live="polite">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredLegends.length)} of {filteredLegends.length} legends
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className={`px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                  currentPage === 1
                    ? 'bg-night-700/50 text-white/30 cursor-not-allowed'
                    : 'bg-night-700 text-white/50 hover:bg-night-600'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white/70 text-sm" aria-current="page">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className={`px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800 ${
                  currentPage === totalPages
                    ? 'bg-night-700/50 text-white/30 cursor-not-allowed'
                    : 'bg-night-700 text-white/50 hover:bg-night-600'
                }`}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        title="Delete Legend?"
        message="Are you sure you want to delete this legend? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
