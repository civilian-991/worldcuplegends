'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching teams:', error);
    } else {
      setTeams(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) {
      console.error('Error deleting team:', error);
    } else {
      setTeams(teams.filter((t) => t.id !== id));
      setDeleteId(null);
    }
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
        <input
          type="text"
          placeholder="Search teams by name or confederation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="col-span-full p-12 text-center text-white/50">
            {searchQuery ? 'No teams found matching your search' : 'No teams yet. Add your first team!'}
          </div>
        ) : (
          filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {team.flag ? (
                    <img src={team.flag} alt={team.name} className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-gold-500/20 rounded flex items-center justify-center text-gold-400">
                      🏴
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
                  <span className="text-white font-semibold">{team.world_cups} 🏆</span>
                </div>
                {team.world_cup_years && team.world_cup_years.length > 0 && (
                  <div className="text-sm text-white/40">
                    Years: {team.world_cup_years.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/teams/${team.id}`} className="flex-1">
                  <button className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => setDeleteId(team.id)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
                >
                  Delete
                </button>
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
              Are you sure you want to delete this team? This action cannot be undone.
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
