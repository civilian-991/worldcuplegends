'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Flag from './Flag';

interface Team {
  id: number;
  name: string;
  country_code: string;
  coach: string;
  captain: string;
  color: string;
}

// Coach images mapping - add actual images when available
const coachImages: Record<string, string> = {
  'Zico': '/legends/zico.png',
  'Batistuta': '/coaches/batistuta.png',
  'Vieira': '/coaches/vieira.png',
  'Maldini': '/coaches/maldini.png',
  'Gullit': '/legends/ruud-gullit.png',
  'Abdullah': '/coaches/abdullah.png',
  'Fadiga': '/coaches/fadiga.png',
  'Hierro': '/coaches/hierro.png',
};

export default function LegendaryCoaches() {
  const t = useTranslations('home.coaches');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, country_code, coach, captain, color')
        .order('rating', { ascending: false });

      if (!error && data) {
        setTeams(data);
      }
      setIsLoading(false);
    }
    fetchTeams();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-night-800">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4"
          >
            {t('preTitle')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}{' '}
            <span className="text-gradient-gold">{t('titleHighlight')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className="relative h-[280px] md:h-[340px] rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${team.color}40 0%, ${team.color}10 50%, transparent 100%)`,
                }}
              >
                {/* Coach Image or Placeholder */}
                <div className="absolute inset-0 flex items-end justify-center">
                  {coachImages[team.coach] ? (
                    <img
                      src={coachImages[team.coach]}
                      alt={team.coach}
                      className="h-[85%] w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[120px] font-black text-white/5"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {team.coach.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  {/* Flag */}
                  <div className="mb-2">
                    <Flag countryCode={team.country_code} size="md" />
                  </div>

                  {/* Coach Name */}
                  <h3
                    className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {team.coach}
                  </h3>

                  {/* Nation */}
                  <p className="text-white/50 text-sm">{team.name}</p>

                  {/* Coach Badge */}
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-gold-500/20 border border-gold-500/30 rounded text-gold-400 text-xs font-semibold uppercase tracking-wider">
                      {t('coachBadge')}
                    </span>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500/30 transition-colors"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 text-sm mt-12 tracking-widest uppercase"
        >
          {t('tagline')}
        </motion.p>
      </div>
    </section>
  );
}
