'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { use } from 'react';

export default function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country_code: '',
    flag: '',
    world_cups: 0,
    world_cup_years: '',
    confederation: '',
    rating: '',
    color: '#FFD700',
  });

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      router.push('/admin/teams');
    } else if (data) {
      setFormData({
        name: data.name || '',
        country_code: data.country_code || '',
        flag: data.flag || '',
        world_cups: data.world_cups || 0,
        world_cup_years: data.world_cup_years?.join(', ') || '',
        confederation: data.confederation || '',
        rating: data.rating?.toString() || '',
        color: data.color || '#FFD700',
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from('teams')
      .update({
        name: formData.name,
        country_code: formData.country_code || null,
        flag: formData.flag || null,
        world_cups: formData.world_cups,
        world_cup_years: formData.world_cup_years ? formData.world_cup_years.split(',').map(y => y.trim()) : null,
        confederation: formData.confederation || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        color: formData.color || null,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating team:', error);
      alert('Error updating team');
    } else {
      router.push('/admin/teams');
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            EDIT TEAM
          </h1>
          <p className="text-white/50 mt-1">Update team information</p>
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
          <div>
            <label className="text-white/50 text-sm mb-2 block">Team Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Country Code</label>
            <input
              type="text"
              value={formData.country_code}
              onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
              maxLength={3}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Confederation</label>
            <select
              value={formData.confederation}
              onChange={(e) => setFormData({ ...formData, confederation: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            >
              <option value="">Select confederation</option>
              <option value="UEFA">UEFA (Europe)</option>
              <option value="CONMEBOL">CONMEBOL (South America)</option>
              <option value="CONCACAF">CONCACAF (North/Central America)</option>
              <option value="CAF">CAF (Africa)</option>
              <option value="AFC">AFC (Asia)</option>
              <option value="OFC">OFC (Oceania)</option>
            </select>
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">World Cups Won</label>
            <input
              type="number"
              value={formData.world_cups}
              onChange={(e) => setFormData({ ...formData, world_cups: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-sm mb-2 block">World Cup Years (comma separated)</label>
          <input
            type="text"
            value={formData.world_cup_years}
            onChange={(e) => setFormData({ ...formData, world_cup_years: e.target.value })}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div>
          <label className="text-white/50 text-sm mb-2 block">Flag Image URL</label>
          <input
            type="url"
            value={formData.flag}
            onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
          />
          {formData.flag && (
            <img src={formData.flag} alt="Flag preview" className="mt-2 w-16 h-10 object-cover rounded" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-white/50 text-sm mb-2 block">Rating (0-10)</label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Team Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-12 bg-night-700 border border-gold-500/20 rounded-xl cursor-pointer"
            />
          </div>
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
