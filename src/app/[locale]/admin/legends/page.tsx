'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const [legends, setLegends] = useState<Legend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchLegends();
  }, []);

  const fetchLegends = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('legends')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching legends:', error);
    } else {
      setLegends(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('legends').delete().eq('id', id);
    if (error) {
      console.error('Error deleting legend:', error);
    } else {
      setLegends(legends.filter((l) => l.id !== id));
      setDeleteId(null);
    }
  };

  const filteredLegends = legends.filter(
    (legend) =>
      legend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      legend.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      legend.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <input
          type="text"
          placeholder="Search legends by name, country, or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredLegends.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            {searchQuery ? 'No legends found matching your search' : 'No legends yet. Add your first legend!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-night-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Legend</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Stats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Rating</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {filteredLegends.map((legend) => (
                  <tr key={legend.id} className="hover:bg-night-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {legend.image ? (
                          <img
                            src={legend.image}
                            alt={legend.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                            {legend.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-semibold">{legend.name}</p>
                          {legend.jersey_number && (
                            <p className="text-white/40 text-sm">#{legend.jersey_number}</p>
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
                        {legend.goals}G / {legend.assists}A / {legend.appearances} Apps
                      </div>
                      <div className="text-white/40">{legend.world_cups} World Cups</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gold-400 font-bold">{legend.rating || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/legends/${legend.id}`}>
                          <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(legend.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
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
              Are you sure you want to delete this legend? This action cannot be undone.
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
