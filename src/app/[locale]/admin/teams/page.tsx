'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/context/ToastContext';

interface Team {
  id: number;
  name: string;
  country_code: string | null;
  flag: string | null;
  world_cups: number;
  world_cup_years: string[] | null;
  confederation: string | null;
  rating: number | null;
  color: string | null;
}

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .is('deleted_at', null)
      .order('name');

    if (error) {
      // Log for debugging but show user-friendly message
      console.error('Error fetching teams:', error);
      showToast('Failed to load teams. Please try again.', 'error');
    } else {
      setTeams(data || []);
    }
    setIsLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    // Soft delete by setting deleted_at timestamp
    const { error } = await supabase
      .from('teams')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error deleting team:', error);
      showToast('Error deleting team', 'error');
    } else {
      setTeams(teams.filter((t) => t.id !== id));
      showToast('Team deleted successfully', 'success');
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.confederation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            TEAMS
          </h1>
          <p className="text-white/50 mt-1">Manage national teams</p>
        </div>
        <Link href="/admin/teams/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
          >
            + Add Team
          </motion.button>
        </Link>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <label htmlFor="teams-search" className="sr-only">Search teams</label>
        <input
          id="teams-search"
          type="text"
          placeholder="Search teams by name or confederation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Teams list">
        {isLoading ? (
          <div className="col-span-full p-12 text-center" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" aria-hidden="true" />
            <span className="sr-only">Loading teams...</span>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="col-span-full p-12 text-center text-white/50" role="status" aria-live="polite">
            {searchQuery ? 'No teams found matching your search' : 'No teams yet. Add your first team!'}
          </div>
        ) : (
          filteredTeams.map((team) => (
            <motion.article
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 hover:border-gold-500/30 transition-colors focus-within:ring-2 focus-within:ring-gold-400"
              role="listitem"
              aria-label={`${team.name} - ${team.world_cups} World Cup${team.world_cups !== 1 ? 's' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {team.flag ? (
                    <img src={team.flag} alt={`${team.name} flag`} className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-gold-500/20 rounded flex items-center justify-center text-gold-400" aria-hidden="true">
                      <span aria-hidden="true">🏴</span>
                      <span className="sr-only">No flag available</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold">{team.name}</h3>
                    <p className="text-white/40 text-sm">{team.confederation || 'N/A'}</p>
                  </div>
                </div>
                {team.rating && (
                  <span className="px-2 py-1 bg-gold-500/20 text-gold-400 rounded-lg text-sm font-bold">
                    {team.rating}
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">World Cups</span>
                  <span className="text-white font-semibold">{team.world_cups} <span aria-hidden="true">🏆</span></span>
                </div>
                {team.world_cup_years && team.world_cup_years.length > 0 && (
                  <div className="text-sm text-white/40">
                    Years: {team.world_cup_years.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/teams/${team.id}`} className="flex-1">
                  <button
                    className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                    aria-label={`Edit ${team.name}`}
                  >
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => setDeleteId(team.id)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-800"
                  aria-label={`Delete ${team.name}`}
                >
                  Delete
                </button>
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
        title="Delete Team?"
        message="Are you sure you want to delete this team? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
