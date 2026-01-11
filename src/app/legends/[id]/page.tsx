'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { legends } from '@/data/legends';

export default function LegendDetailPage() {
  const params = useParams();
  const legendId = parseInt(params.id as string);
  const legend = legends.find((l) => l.id === legendId);

  if (!legend) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-night-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Legend Not Found</h1>
          <Link href="/legends" className="text-gold-400 hover:text-gold-300">
            ← Back to Legends
          </Link>
        </div>
      </div>
    );
  }

  // Team colors based on country
  const teamColors: Record<string, string> = {
    BR: '#009c3b',
    AR: '#75aadb',
    FR: '#002654',
    DE: '#000000',
    IT: '#008c45',
    NL: '#ff6f00',
    PT: '#006600',
    ES: '#c60b1e',
    GB: '#012169',
  };

  const flags: Record<string, string> = {
    BR: '🇧🇷',
    AR: '🇦🇷',
    FR: '🇫🇷',
    DE: '🇩🇪',
    IT: '🇮🇹',
    NL: '🇳🇱',
    PT: '🇵🇹',
    ES: '🇪🇸',
    GB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  };

  const teamColor = teamColors[legend.countryCode] || '#d4af37';
  const nameParts = legend.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  // Get related legends (same country or era)
  const relatedLegends = legends
    .filter(l => l.id !== legend.id && (l.countryCode === legend.countryCode || l.era === legend.era))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-night-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Background with team color gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor}30 0%, transparent 50%, transparent 100%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-800/50 to-night-900" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/legends"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all legends
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pb-12"
            >
              {/* Rating Badge */}
              <div className="mb-6">
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${
                    legend.rating >= 97
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : legend.rating >= 95
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {legend.rating} RATING
                </span>
              </div>

              {/* Name */}
              <p className="text-white/60 text-xl font-medium mb-1">{firstName}</p>
              <h1
                className="text-6xl md:text-8xl font-black text-white mb-6 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {lastName.toUpperCase()}
              </h1>

              {/* Country & Position */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{flags[legend.countryCode] || '🏳️'}</span>
                  <span className="text-white/70 text-lg">{legend.country}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <span className="text-white/50">{legend.position}</span>
                <div className="w-px h-6 bg-white/20" />
                <span className="text-white/50">{legend.era}</span>
              </div>

              {/* Team Color Bar */}
              <div
                className="h-1.5 w-32 rounded-full mb-8"
                style={{ backgroundColor: teamColor }}
              />

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p
                    className="text-4xl font-black text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.goals}
                  </p>
                  <p className="text-white/40 text-sm uppercase tracking-wider mt-1">Goals</p>
                </div>
                <div>
                  <p
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.assists}
                  </p>
                  <p className="text-white/40 text-sm uppercase tracking-wider mt-1">Assists</p>
                </div>
                <div>
                  <p
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.appearances}
                  </p>
                  <p className="text-white/40 text-sm uppercase tracking-wider mt-1">Apps</p>
                </div>
                <div>
                  <p
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.worldCups}
                  </p>
                  <p className="text-white/40 text-sm uppercase tracking-wider mt-1">World Cups</p>
                </div>
              </div>

              {/* World Cup Trophies */}
              {legend.worldCups > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-white/40 text-sm uppercase tracking-wider mb-3">World Cup Titles</p>
                  <div className="flex gap-2">
                    {Array.from({ length: legend.worldCups }).map((_, i) => (
                      <span key={i} className="text-3xl">🏆</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              {legend.image ? (
                <img
                  src={legend.image}
                  alt={legend.name}
                  className="absolute bottom-0 right-0 h-full w-full object-cover object-top rounded-t-3xl"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-night-800 to-night-700 rounded-t-3xl">
                  <span
                    className="text-[200px] font-black text-white/5"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {legend.jerseyNumber}
                  </span>
                </div>
              )}

              {/* Jersey Number Overlay */}
              <div className="absolute top-8 right-8">
                <span
                  className="text-8xl font-black text-white/20"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {legend.jerseyNumber}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CAREER HIGHLIGHTS
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              {legend.name} is widely regarded as one of the greatest footballers of all time.
              Representing {legend.country} on the international stage, they made {legend.appearances} appearances
              and scored {legend.goals} goals, cementing their legacy in football history.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              Playing primarily as a {legend.position.toLowerCase()}, their skill, vision, and
              determination inspired millions of fans around the world. Now, they return to the
              pitch in the World Legends Cup 2026 to showcase their timeless talent once more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Legends */}
      {relatedLegends.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl font-bold text-white mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                RELATED LEGENDS
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedLegends.map((related) => {
                  const relatedColor = teamColors[related.countryCode] || '#d4af37';
                  return (
                    <Link key={related.id} href={`/legends/${related.id}`}>
                      <div className="relative bg-night-800 rounded-xl overflow-hidden group cursor-pointer">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: relatedColor }}
                        />
                        <div className="relative h-40">
                          {related.image ? (
                            <img
                              src={related.image}
                              alt={related.name}
                              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl font-black text-white/5">
                                {related.jerseyNumber}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-night-800 to-transparent" />
                        </div>
                        <div className="p-4">
                          <p className="text-white/60 text-xs">{related.name.split(' ')[0]}</p>
                          <p className="text-white font-bold group-hover:text-gold-400 transition-colors">
                            {(related.name.split(' ').slice(1).join(' ') || related.name).toUpperCase()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">{flags[related.countryCode]}</span>
                            <span className="text-white/40 text-xs">{related.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
