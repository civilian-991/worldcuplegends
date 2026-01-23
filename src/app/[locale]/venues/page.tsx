'use client';

import { motion } from 'framer-motion';

const venues = [
  {
    name: 'MetLife Stadium',
    city: 'East Rutherford, New Jersey',
    country: '🇺🇸',
    capacity: '82,500',
    matches: ['Group Stage', 'Semi-Final', 'Final'],
    image: '/venues/metlife.jpg',
    description: 'Home of the NFL\'s Giants and Jets, this iconic venue will host the World Legends Cup Final.',
  },
  {
    name: 'SoFi Stadium',
    city: 'Los Angeles, California',
    country: '🇺🇸',
    capacity: '70,240',
    matches: ['Group Stage', 'Quarter-Final'],
    image: '/venues/sofi.jpg',
    description: 'A state-of-the-art stadium that combines cutting-edge technology with spectacular design.',
  },
  {
    name: 'Rose Bowl',
    city: 'Pasadena, California',
    country: '🇺🇸',
    capacity: '88,438',
    matches: ['Group Stage', 'Semi-Final'],
    image: '/venues/rosebowl.jpg',
    description: 'A historic venue that has hosted multiple FIFA World Cup matches and Olympic events.',
  },
  {
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: '🇲🇽',
    capacity: '87,523',
    matches: ['Group Stage', 'Quarter-Final'],
    image: '/venues/azteca.jpg',
    description: 'The legendary stadium where Maradona scored the "Hand of God" and "Goal of the Century".',
  },
  {
    name: 'AT&T Stadium',
    city: 'Arlington, Texas',
    country: '🇺🇸',
    capacity: '80,000',
    matches: ['Group Stage', 'Round of 16'],
    image: '/venues/att.jpg',
    description: 'Features the world\'s largest column-free interior and a massive video board.',
  },
  {
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens, Florida',
    country: '🇺🇸',
    capacity: '64,767',
    matches: ['Group Stage', 'Round of 16'],
    image: '/venues/hardrock.jpg',
    description: 'A versatile venue that hosts NFL, tennis, and major concerts year-round.',
  },
  {
    name: 'Lumen Field',
    city: 'Seattle, Washington',
    country: '🇺🇸',
    capacity: '68,740',
    matches: ['Group Stage'],
    image: '/venues/lumen.jpg',
    description: 'Known for its incredible atmosphere and passionate fans.',
  },
  {
    name: 'BMO Field',
    city: 'Toronto',
    country: '🇨🇦',
    capacity: '45,500',
    matches: ['Group Stage'],
    image: '/venues/bmo.jpg',
    description: 'Canada\'s premier soccer-specific stadium and home of Toronto FC.',
  },
];

export default function VenuesPage() {
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
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">Stadiums</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDARY <span className="text-gradient-gold">VENUES</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              The world&apos;s most iconic stadiums will play host to the greatest footballers
              in history. Experience the magic across three nations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '16', label: 'Venues' },
              { value: '3', label: 'Countries' },
              { value: '1M+', label: 'Total Capacity' },
              { value: '48', label: 'Matches' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p
                  className="text-4xl md:text-5xl font-bold text-gold-400"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer card-hover"
              >
                {/* Venue Image */}
                <div className="relative h-48 bg-gradient-to-br from-gold-600/20 to-night-800 overflow-hidden">
                  {venue.image && (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-night-900 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="text-4xl drop-shadow-lg">{venue.country}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-gold-500/20 backdrop-blur-sm text-gold-400 text-sm rounded-full">
                      {venue.capacity} capacity
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="text-2xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {venue.name.toUpperCase()}
                  </h3>
                  <p className="text-white/50 text-sm mb-4">{venue.city}</p>
                  <p className="text-white/60 text-sm mb-4">{venue.description}</p>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Hosting</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.matches.map((match) => (
                        <span
                          key={match}
                          className="px-3 py-1 bg-night-600 text-white/70 text-xs rounded-full"
                        >
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ACROSS NORTH AMERICA
            </h2>
            <p className="text-white/50 mb-12">
              From coast to coast, experience legendary football in world-class venues
            </p>

            <div className="glass rounded-3xl p-12">
              <div className="flex justify-center items-center gap-8 text-6xl">
                <span>🇺🇸</span>
                <span>🇲🇽</span>
                <span>🇨🇦</span>
              </div>
              <p className="text-white/40 mt-8">Interactive map coming soon</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
