'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
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
      .order('match_date', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
    } else {
      setMatches(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) {
      console.error('Error deleting match:', error);
    } else {
      setMatches(matches.filter((m) => m.id !== id));
      setDeleteId(null);
    }
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
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div className="glass rounded-xl p-4 flex gap-2">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/50">
            {searchQuery || filter !== 'all'
              ? 'No matches found'
              : 'No matches yet. Add your first match!'}
          </div>
        ) : (
          filteredMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
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
                    <p className="text-white/40 text-sm mt-2">📍 {match.venue}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col">
                  <Link href={`/admin/matches/${match.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(match.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-night-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this match? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 bg-night-700 text-white rounded-xl hover:bg-night-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
