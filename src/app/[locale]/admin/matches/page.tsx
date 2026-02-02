'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/context/ToastContext';

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  home_flag: string | null;
  away_flag: string | null;
  match_date: string;
  match_time: string | null;
  venue: string | null;
  stage: string | null;
  home_score: number | null;
  away_score: number | null;
  is_live: boolean;
}

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'live'>('all');

  const supabase = createClient();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .is('deleted_at', null)
      .order('match_date', { ascending: false });

    if (error) {
      // Log for debugging but show user-friendly message
      console.error('Error fetching matches:', error);
      showToast('Failed to load matches. Please try again.', 'error');
    } else {
      setMatches(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('matches')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error deleting match:', error);
      showToast('Error deleting match', 'error');
    } else {
      setMatches(matches.filter((m) => m.id !== id));
      showToast('Match deleted successfully', 'success');
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.venue?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'upcoming':
        return match.match_date >= today && !match.is_live;
      case 'completed':
        return match.home_score !== null && match.away_score !== null;
      case 'live':
        return match.is_live;
      default:
        return true;
    }
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
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
            MATCHES
          </h1>
          <p className="text-white/50 mt-1">Manage match schedule and results</p>
        </div>
        <Link href="/admin/matches/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            + Add Match
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 glass rounded-xl p-4">
          <label htmlFor="matches-search" className="sr-only">Search matches</label>
          <input
            id="matches-search"
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
          />
        </div>
        <div className="glass rounded-xl p-4 flex gap-2" role="group" aria-label="Filter matches by status">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((f) => (
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

      {/* Matches List */}
      <div className="space-y-4" role="list" aria-label="Matches list">
        {isLoading ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" aria-hidden="true" />
            <span className="sr-only">Loading matches...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/50" role="status" aria-live="polite">
            {searchQuery || filter !== 'all'
              ? 'No matches found'
              : 'No matches yet. Add your first match!'}
          </div>
        ) : (
          filteredMatches.map((match) => (
            <motion.article
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 focus-within:ring-2 focus-within:ring-gold-400"
              role="listitem"
              aria-label={`${match.home_team} vs ${match.away_team}, ${formatDate(match.match_date)}${match.is_live ? ', Live' : ''}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between lg:justify-start gap-4 mb-2">
                    <span className="text-white/40 text-sm">{formatDate(match.match_date)}</span>
                    {match.match_time && (
                      <span className="text-white/40 text-sm">{match.match_time}</span>
                    )}
                    {match.is_live && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                    {match.stage && (
                      <span className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full">
                        {match.stage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex items-center gap-3">
                      {match.home_flag && (
                        <img src={match.home_flag} alt="" className="w-8 h-6 object-cover rounded" />
                      )}
                      <span className="text-white font-semibold">{match.home_team}</span>
                    </div>

                    {/* Score */}
                    <div className="px-4 py-2 bg-night-700 rounded-xl text-center min-w-[80px]">
                      {match.home_score !== null && match.away_score !== null ? (
                        <span className="text-gold-400 font-bold text-xl">
                          {match.home_score} - {match.away_score}
                        </span>
                      ) : (
                        <span className="text-white/40">vs</span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <span className="text-white font-semibold">{match.away_team}</span>
                      {match.away_flag && (
                        <img src={match.away_flag} alt="" className="w-8 h-6 object-cover rounded" />
                      )}
                    </div>
                  </div>

                  {match.venue && (
                    <p className="text-white/40 text-sm mt-2"><span aria-hidden="true">📍</span> <span className="sr-only">Venue: </span>{match.venue}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col">
                  <Link href={`/admin/matches/${match.id}`} className="flex-1">
                    <button
                      className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                      aria-label={`Edit match ${match.home_team} vs ${match.away_team}`}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(match.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                    aria-label={`Delete match ${match.home_team} vs ${match.away_team}`}
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
        title="Delete Match?"
        message="Are you sure you want to delete this match? This action cannot be undone and will remove all match data."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
