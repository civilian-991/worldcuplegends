'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewLegendPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    country: '',
    country_code: '',
    position: '',
    era: '',
    goals: 0,
    assists: 0,
    appearances: 0,
    world_cups: 0,
    image: '',
    team: '',
    jersey_number: '',
    rating: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('legends').insert({
      ...formData,
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
    });

    if (error) {
      console.error('Error creating legend:', error);
      alert('Error creating legend');
    } else {
      router.push('/admin/legends');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            ADD LEGEND
          </h1>
          <p className="text-white/50 mt-1">Create a new football legend</p>
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
            <label className="text-white/50 text-sm mb-2 block">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., Lionel Messi"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Short Name</label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., Messi"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., Argentina"
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
              placeholder="e.g., ARG"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            >
              <option value="">Select position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Era</label>
            <input
              type="text"
              value={formData.era}
              onChange={(e) => setFormData({ ...formData, era: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., 2004-present"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Team</label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., Inter Miami"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Jersey Number</label>
            <input
              type="number"
              value={formData.jersey_number}
              onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
              min="1"
              max="99"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-sm mb-2 block">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="text-white/50 text-sm mb-2 block">Goals</label>
            <input
              type="number"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Assists</label>
            <input
              type="number"
              value={formData.assists}
              onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Appearances</label>
            <input
              type="number"
              value={formData.appearances}
              onChange={(e) => setFormData({ ...formData, appearances: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">World Cups</label>
            <input
              type="number"
              value={formData.world_cups}
              onChange={(e) => setFormData({ ...formData, world_cups: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm mb-2 block">Rating</label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
              placeholder="0-10"
            />
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
            {isLoading ? 'Creating...' : 'Create Legend'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
