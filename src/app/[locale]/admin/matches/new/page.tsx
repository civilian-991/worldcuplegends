'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewMatchPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    home_flag: '',
    away_flag: '',
    match_date: '',
    match_time: '',
    venue: '',
    stage: '',
    home_score: '',
    away_score: '',
    is_live: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('matches').insert({
      home_team: formData.home_team,
      away_team: formData.away_team,
      home_flag: formData.home_flag || null,
      away_flag: formData.away_flag || null,
      match_date: formData.match_date,
      match_time: formData.match_time || null,
      venue: formData.venue || null,
      stage: formData.stage || null,
      home_score: formData.home_score ? parseInt(formData.home_score) : null,
      away_score: formData.away_score ? parseInt(formData.away_score) : null,
      is_live: formData.is_live,
    });

    if (error) {
      console.error('Error creating match:', error);
      alert('Error creating match');
    } else {
      router.push('/admin/matches');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            ADD MATCH
          </h1>
          <p className="text-white/50 mt-1">Schedule a new match</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
        {/* Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Home Team</h3>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Team Name *</label>
              <input
                type="text"
                value={formData.home_team}
                onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                placeholder="e.g., Brazil"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Flag URL</label>
              <input
                type="url"
                value={formData.home_flag}
                onChange={(e) => setFormData({ ...formData, home_flag: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                placeholder="https://flagcdn.com/w80/br.png"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Away Team</h3>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Team Name *</label>
              <input
                type="text"
                value={formData.away_team}
                onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                required
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                placeholder="e.g., Argentina"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm mb-2 block">Flag URL</label>
              <input
                type="url"
                value={formData.away_flag}
                onChange={(e) => setFormData({ ...formData, away_flag: e.target.value })}
                className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                placeholder="https://flagcdn.com/w80/ar.png"
              />
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-white/50 text-sm mb-2 block">Match Date *</label>
            <input
              type="date"
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Match Time</label>
            <input
              type="time"
              value={formData.match_time}
              onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., MetLife Stadium, New Jersey"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            >
              <option value="">Select stage</option>
              <option value="Group A">Group A</option>
              <option value="Group B">Group B</option>
              <option value="Group C">Group C</option>
              <option value="Group D">Group D</option>
              <option value="Group E">Group E</option>
              <option value="Group F">Group F</option>
              <option value="Group G">Group G</option>
              <option value="Group H">Group H</option>
              <option value="Round of 16">Round of 16</option>
              <option value="Quarter Final">Quarter Final</option>
              <option value="Semi Final">Semi Final</option>
              <option value="Third Place">Third Place</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </div>

        {/* Score */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="text-white/50 text-sm mb-2 block">Home Score</label>
            <input
              type="number"
              value={formData.home_score}
              onChange={(e) => setFormData({ ...formData, home_score: e.target.value })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="-"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Away Score</label>
            <input
              type="number"
              value={formData.away_score}
              onChange={(e) => setFormData({ ...formData, away_score: e.target.value })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="-"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_live"
              checked={formData.is_live}
              onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
              className="w-5 h-5 rounded border-gold-500/30 bg-night-700 text-gold-500"
            />
            <label htmlFor="is_live" className="text-white">Match is LIVE</label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Match'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
