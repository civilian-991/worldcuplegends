'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeams, getLegends, type Team, type Legend } from '@/lib/api';
import Flag from '@/components/Flag';

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [teamsData, legendsData] = await Promise.all([
        getTeams(),
        getLegends()
      ]);
      setTeams(teamsData);
      setLegends(legendsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Get legends for a team by country code
  const getTeamLegends = (countryCode: string) => {
    return legends.filter(l => l.countryCode === countryCode).map(l => l.name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">National Glory</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDARY <span className="text-gradient-gold">TEAMS</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              The nations that have shaped football history. From Brazil&apos;s samba magic
              to Germany&apos;s efficiency, explore the greatest national teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* World Cup Winners Showcase */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl">🏆</span>
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                WORLD CUP WINNERS
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams
                .filter((t) => t.worldCups > 0)
                .sort((a, b) => b.worldCups - a.worldCups)
                .map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass rounded-xl p-6 text-center group cursor-pointer hover:bg-gold-500/5 transition-colors"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <div className="flex justify-center mb-3">
                      <Flag countryCode={team.countryCode} size="xl" />
                    </div>
                    <h3
                      className="text-white font-bold text-lg group-hover:text-gold-400 transition-colors"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {team.name.toUpperCase()}
                    </h3>
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: team.worldCups }).map((_, i) => (
                        <span key={i} className="text-gold-400 text-sm">🏆</span>
                      ))}
                    </div>
                    <p className="text-gold-400 text-sm mt-1">{team.worldCups} titles</p>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* All Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => {
              const teamLegends = getTeamLegends(team.countryCode);
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedTeam(team)}
                  className="relative overflow-hidden rounded-2xl glass cursor-pointer group card-hover"
                >
                  {/* Color Banner */}
                  <div
                    className="h-2"
                    style={{ backgroundColor: team.color }}
                  />

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Flag countryCode={team.countryCode} size="xl" />
                        <div>
                          <h3
                            className="text-white text-2xl font-bold group-hover:text-gold-400 transition-colors"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {team.name.toUpperCase()}
                          </h3>
                          <p className="text-white/50 text-sm">{team.confederation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-4xl font-bold text-gold-400"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {team.rating}
                        </p>
                        <p className="text-white/40 text-xs">Rating</p>
                      </div>
                    </div>

                    {/* World Cups */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gold-400">🏆</span>
                        <span className="text-white/50 text-sm">World Cup Titles</span>
                      </div>
                      {team.worldCups > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {team.worldCupYears.map((year) => (
                            <span
                              key={year}
                              className="px-3 py-1 bg-gold-500/20 text-gold-400 text-sm rounded-full"
                            >
                              {year}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/30 text-sm">No titles yet</p>
                      )}
                    </div>

                    {/* Legends */}
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Team Legends</p>
                      <div className="flex flex-wrap gap-2">
                        {teamLegends.slice(0, 4).map((legend) => (
                          <span
                            key={legend}
                            className="px-3 py-1 bg-night-600 text-white/70 text-sm rounded-full"
                          >
                            {legend}
                          </span>
                        ))}
                        {teamLegends.length > 4 && (
                          <span className="px-3 py-1 bg-night-600 text-gold-400 text-sm rounded-full">
                            +{teamLegends.length - 4} more
                          </span>
                        )}
                        {teamLegends.length === 0 && (
                          <span className="text-white/30 text-sm">No legends yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTeam(null)}
          >
            <div className="absolute inset-0 bg-night-900/90 backdrop-blur-xl" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl glass rounded-3xl overflow-hidden"
            >
              {/* Color Banner */}
              <div
                className="h-3"
                style={{ backgroundColor: selectedTeam.color }}
              />

              <div className="p-8">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-night-600 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>

                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                  <Flag countryCode={selectedTeam.countryCode} size="xl" className="w-20 h-14" />
                  <div>
                    <h2
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedTeam.name.toUpperCase()}
                    </h2>
                    <p className="text-white/50">{selectedTeam.confederation}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-night-600 rounded-xl">
                    <p
                      className="text-4xl font-bold text-gold-400"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedTeam.worldCups}
                    </p>
                    <p className="text-white/50 text-sm">World Cups</p>
                  </div>
                  <div className="text-center p-4 bg-night-600 rounded-xl">
                    <p
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedTeam.rating}
                    </p>
                    <p className="text-white/50 text-sm">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-night-600 rounded-xl">
                    <p
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {getTeamLegends(selectedTeam.countryCode).length}
                    </p>
                    <p className="text-white/50 text-sm">Legends</p>
                  </div>
                </div>

                {/* World Cup Years */}
                {selectedTeam.worldCups > 0 && (
                  <div className="mb-8">
                    <h3 className="text-white/50 text-sm uppercase tracking-wider mb-3">
                      World Cup Victories
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedTeam.worldCupYears.map((year) => (
                        <span
                          key={year}
                          className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full flex items-center gap-2"
                        >
                          🏆 {year}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legends List */}
                <div>
                  <h3 className="text-white/50 text-sm uppercase tracking-wider mb-3">
                    Team Legends
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getTeamLegends(selectedTeam.countryCode).map((legend) => (
                      <span
                        key={legend}
                        className="px-4 py-2 bg-night-600 text-white rounded-full"
                      >
                        {legend}
                      </span>
                    ))}
                    {getTeamLegends(selectedTeam.countryCode).length === 0 && (
                      <span className="text-white/30">No legends in database</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
