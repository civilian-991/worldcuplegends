'use client';

import { motion } from 'framer-motion';

const worldCupHistory = [
  { year: '1930', host: 'Uruguay 🇺🇾', winner: 'Uruguay 🇺🇾', final: 'Uruguay 4-2 Argentina' },
  { year: '1950', host: 'Brazil 🇧🇷', winner: 'Uruguay 🇺🇾', final: 'Uruguay 2-1 Brazil' },
  { year: '1958', host: 'Sweden 🇸🇪', winner: 'Brazil 🇧🇷', final: 'Brazil 5-2 Sweden' },
  { year: '1962', host: 'Chile 🇨🇱', winner: 'Brazil 🇧🇷', final: 'Brazil 3-1 Czechoslovakia' },
  { year: '1966', host: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', winner: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', final: 'England 4-2 West Germany' },
  { year: '1970', host: 'Mexico 🇲🇽', winner: 'Brazil 🇧🇷', final: 'Brazil 4-1 Italy' },
  { year: '1974', host: 'West Germany 🇩🇪', winner: 'West Germany 🇩🇪', final: 'West Germany 2-1 Netherlands' },
  { year: '1978', host: 'Argentina 🇦🇷', winner: 'Argentina 🇦🇷', final: 'Argentina 3-1 Netherlands' },
  { year: '1982', host: 'Spain 🇪🇸', winner: 'Italy 🇮🇹', final: 'Italy 3-1 West Germany' },
  { year: '1986', host: 'Mexico 🇲🇽', winner: 'Argentina 🇦🇷', final: 'Argentina 3-2 West Germany' },
  { year: '1990', host: 'Italy 🇮🇹', winner: 'West Germany 🇩🇪', final: 'West Germany 1-0 Argentina' },
  { year: '1994', host: 'USA 🇺🇸', winner: 'Brazil 🇧🇷', final: 'Brazil 0-0 Italy (3-2 pen)' },
  { year: '1998', host: 'France 🇫🇷', winner: 'France 🇫🇷', final: 'France 3-0 Brazil' },
  { year: '2002', host: 'Korea/Japan 🇰🇷🇯🇵', winner: 'Brazil 🇧🇷', final: 'Brazil 2-0 Germany' },
  { year: '2006', host: 'Germany 🇩🇪', winner: 'Italy 🇮🇹', final: 'Italy 1-1 France (5-3 pen)' },
  { year: '2010', host: 'South Africa 🇿🇦', winner: 'Spain 🇪🇸', final: 'Spain 1-0 Netherlands' },
  { year: '2014', host: 'Brazil 🇧🇷', winner: 'Germany 🇩🇪', final: 'Germany 1-0 Argentina' },
  { year: '2018', host: 'Russia 🇷🇺', winner: 'France 🇫🇷', final: 'France 4-2 Croatia' },
  { year: '2022', host: 'Qatar 🇶🇦', winner: 'Argentina 🇦🇷', final: 'Argentina 3-3 France (4-2 pen)' },
];

const iconicMoments = [
  {
    year: '1970',
    title: 'The Beautiful Game',
    description: 'Brazil\'s 1970 team is widely considered the greatest ever, with Pelé, Jairzinho, and Tostão playing breathtaking football.',
    icon: '🇧🇷',
  },
  {
    year: '1986',
    title: 'Hand of God & Goal of the Century',
    description: 'Maradona\'s two most famous goals came in the same match against England—one controversial, one sublime.',
    icon: '🇦🇷',
  },
  {
    year: '1998',
    title: 'Zidane\'s Coronation',
    description: 'Zinedine Zidane headed France to glory with two goals in the final against Brazil.',
    icon: '🇫🇷',
  },
  {
    year: '2014',
    title: 'Germany\'s 7-1',
    description: 'Germany demolished hosts Brazil in an unforgettable semi-final that shocked the world.',
    icon: '🇩🇪',
  },
  {
    year: '2022',
    title: 'The Greatest Final',
    description: 'Messi finally lifted the trophy after an incredible final against France, considered by many the best ever.',
    icon: '🏆',
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Since 1930</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              WORLD CUP <span className="text-gradient-gold">HISTORY</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Nearly a century of glory, heartbreak, and legendary moments.
              Explore the rich history of football&apos;s greatest tournament.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trophy Count */}
      <section className="py-12 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { country: '🇧🇷', name: 'Brazil', titles: 5 },
              { country: '🇩🇪', name: 'Germany', titles: 4 },
              { country: '🇮🇹', name: 'Italy', titles: 4 },
              { country: '🇦🇷', name: 'Argentina', titles: 3 },
              { country: '🇫🇷', name: 'France', titles: 2 },
            ].map((team, index) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl block mb-2">{team.country}</span>
                <p className="text-white font-semibold">{team.name}</p>
                <div className="flex justify-center gap-1 mt-2">
                  {Array.from({ length: team.titles }).map((_, i) => (
                    <span key={i} className="text-gold-400">🏆</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Iconic Moments */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ICONIC MOMENTS
            </h2>
            <p className="text-white/50">The moments that defined generations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iconicMoments.map((moment, index) => (
              <motion.div
                key={moment.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 group hover:bg-gold-500/5 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{moment.icon}</span>
                  <div>
                    <p
                      className="text-2xl font-bold text-gold-400"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {moment.year}
                    </p>
                    <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors">
                      {moment.title}
                    </h3>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{moment.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full History Table */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ALL WORLD CUP FINALS
            </h2>
            <p className="text-white/50">Every final from 1930 to 2022</p>
          </motion.div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gold-500/10 text-sm text-white/50 uppercase tracking-wider">
              <div>Year</div>
              <div>Host</div>
              <div>Winner</div>
              <div>Final Score</div>
            </div>

            {worldCupHistory.map((wc, index) => (
              <motion.div
                key={wc.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 border-b border-white/5 hover:bg-gold-500/5 transition-colors"
              >
                <div>
                  <span
                    className="text-xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {wc.year}
                  </span>
                </div>
                <div className="text-white/70">{wc.host}</div>
                <div className="text-white font-semibold">{wc.winner}</div>
                <div className="text-white/50 text-sm col-span-2 md:col-span-1">{wc.final}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
