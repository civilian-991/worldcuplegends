'use client';

import { motion } from 'framer-motion';

const venues = [
  {
    name: 'Estádio Maracanã',
    city: 'Rio de Janeiro',
    country: '🇧🇷',
    capacity: '78,838',
    matches: ['Semi-Final', 'Final'],
    image: '/stadium/maracana.jpg',
    description: 'The Temple of Football. Home to two World Cup Finals and where legends become immortal. The heart of WLC 2026.',
    featured: true,
  },
  {
    name: 'Allianz Parque',
    city: 'São Paulo',
    country: '🇧🇷',
    capacity: '43,713',
    matches: ['Group Stage', 'Quarter-Final'],
    image: '/venues/allianz-parque.jpg',
    description: 'A modern arena combining world-class facilities with the passionate atmosphere of Brazilian football.',
  },
  {
    name: 'Arena Corinthians',
    city: 'São Paulo',
    country: '🇧🇷',
    capacity: '49,205',
    matches: ['Group Stage', 'Quarter-Final'],
    image: '/venues/arena-corinthians.jpg',
    description: 'Host of the 2014 World Cup opening match, this iconic venue represents the soul of São Paulo football.',
  },
  {
    name: 'Mineirão',
    city: 'Belo Horizonte',
    country: '🇧🇷',
    capacity: '61,846',
    matches: ['Group Stage', 'Semi-Final'],
    image: '/venues/mineirao.jpg',
    description: 'One of Brazil\'s most historic stadiums, witness to countless legendary moments in Brazilian football.',
  },
  {
    name: 'Arena da Baixada',
    city: 'Curitiba',
    country: '🇧🇷',
    capacity: '42,372',
    matches: ['Group Stage'],
    image: '/venues/arena-baixada.jpg',
    description: 'A 2014 World Cup venue known for its intimate atmosphere and passionate southern Brazilian fans.',
  },
  {
    name: 'Beira-Rio',
    city: 'Porto Alegre',
    country: '🇧🇷',
    capacity: '50,128',
    matches: ['Group Stage', 'Round of 16'],
    image: '/venues/beira-rio.jpg',
    description: 'Located on the banks of the Guaíba River, this stunning stadium offers breathtaking views and electric atmosphere.',
  },
  {
    name: 'Arena Fonte Nova',
    city: 'Salvador',
    country: '🇧🇷',
    capacity: '47,907',
    matches: ['Group Stage'],
    image: '/venues/fonte-nova.jpg',
    description: 'Rising from the site of the original Fonte Nova, this modern arena brings Bahian passion to life.',
  },
  {
    name: 'Arena Pernambuco',
    city: 'Recife',
    country: '🇧🇷',
    capacity: '46,154',
    matches: ['Group Stage'],
    image: '/venues/arena-pernambuco.jpg',
    description: 'A state-of-the-art venue in Brazil\'s northeast, bringing World Legends Cup action to Pernambuco.',
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
              Brazil&apos;s most iconic stadiums will play host to the greatest footballers
              in history. Eight legendary nations battling for glory in the home of football.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '8', label: 'Venues' },
              { value: '8', label: 'Nations' },
              { value: '420K+', label: 'Total Capacity' },
              { value: '24', label: 'Matches' },
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
          {/* Featured Venue - Maracanã */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="relative h-80 md:h-96 bg-gradient-to-br from-green-900/40 to-night-900 overflow-hidden">
              <img
                src="/stadium/maracana.jpg"
                alt="Estádio Maracanã"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-night-900/80 to-transparent" />

              {/* Brazilian flag accent lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-green-500" />

              {/* Featured badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-gold-500 text-night-900 text-sm font-bold rounded-full">
                  MAIN VENUE
                </span>
              </div>

              <div className="absolute top-6 right-6">
                <span className="text-5xl drop-shadow-lg">🇧🇷</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Rio de Janeiro, Brazil</p>
                <h3
                  className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ESTÁDIO MARACANÃ
                </h3>
                <p className="text-white/70 text-lg max-w-2xl mb-4">
                  The Temple of Football. Home to two World Cup Finals and where legends become immortal. The heart of WLC 2026.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="px-4 py-2 bg-gold-500/20 backdrop-blur-sm text-gold-400 rounded-full">
                    78,838 capacity
                  </span>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full">
                    Semi-Final
                  </span>
                  <span className="px-4 py-2 bg-gold-500 text-night-900 font-bold rounded-full">
                    FINAL
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other Venues Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {venues.slice(1).map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer card-hover"
              >
                {/* Venue Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-900/20 to-night-800 overflow-hidden">
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

      {/* Competing Nations Section */}
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
              THE <span className="text-gradient-gold">8 NATIONS</span>
            </h2>
            <p className="text-white/50 mb-12">
              Legendary teams competing for ultimate glory
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { flag: '🇧🇷', name: 'Brazil', player: 'Ronaldo' },
                { flag: '🇦🇷', name: 'Argentina', player: 'Legends' },
                { flag: '🇫🇷', name: 'France', player: 'Henry' },
                { flag: '🇳🇱', name: 'Netherlands', player: 'Seedorf' },
                { flag: '🇪🇸', name: 'Spain', player: 'Puyol' },
                { flag: '🇮🇹', name: 'Italy', player: 'Buffon' },
                { flag: '🇸🇦', name: 'Saudi Arabia', player: 'Yasser' },
                { flag: '🇳🇬', name: 'Nigeria', player: 'Kanu' },
              ].map((nation, index) => (
                <motion.div
                  key={nation.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass rounded-xl p-6 cursor-pointer group"
                >
                  <span className="text-5xl mb-3 block">{nation.flag}</span>
                  <h3
                    className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {nation.name.toUpperCase()}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">ft. {nation.player}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
