'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Flag from '@/components/Flag';

const venues = [
  {
    name: 'Estádio Maracanã',
    city: 'Rio de Janeiro',
    countryCode: 'BR',
    capacity: '78,838',
    matches: ['Final'],
    matchCount: 1,
    image: '/stadium/maracana.jpg',
    description: 'The Temple of Football. Home to two World Cup Finals and where legends become immortal.',
    tagline: 'WHERE CHAMPIONS ARE CROWNED',
    role: 'THE FINAL',
  },
  {
    name: 'Estádio Nilton Santos',
    city: 'Rio de Janeiro',
    countryCode: 'BR',
    capacity: '46,831',
    matches: ['Group Stage', 'Round of 16', 'Quarter-Final', 'Semi-Final'],
    matchCount: 6,
    image: '/venues/nilton-santos.jpg',
    description: 'Known as the Engenhão, this Olympic stadium combines modern architecture with Rio\'s passionate football culture.',
    tagline: 'WHERE LEGENDS ARE FORGED',
    role: 'THE JOURNEY',
  },
];

export default function VenuesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <div className="min-h-screen bg-night-900" ref={containerRef}>
      {/* Epic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Radial Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-green-500/5 via-transparent to-transparent" />

        {/* Spotlight Beams */}
        <motion.div
          className="absolute top-0 left-1/4 w-1 h-screen bg-gradient-to-b from-gold-400/20 via-gold-400/5 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-1 h-screen bg-gradient-to-b from-gold-400/20 via-gold-400/5 to-transparent"
          animate={{ opacity: [0.6, 0.3, 0.6], x: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 text-center px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Overline */}
            <motion.p
              className="text-gold-400 text-xs md:text-sm tracking-[0.5em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              World Legends Cup 2026 • Rio de Janeiro
            </motion.p>

            {/* Main Title */}
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                TWO STADIUMS
              </motion.span>
              <motion.span
                className="block text-gradient-gold"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                ONE DESTINY
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Where the journey begins and where champions are crowned.
              Seven matches. Two legendary arenas. Infinite glory.
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-gold-500/30 rounded-full mx-auto flex justify-center"
                animate={{ borderColor: ['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.6)', 'rgba(212, 175, 55, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1.5 h-3 bg-gold-400 rounded-full mt-2"
                  animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-night-900 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative py-8 px-6 bg-night-800/50 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2', label: 'STADIUMS', suffix: '' },
              { value: '7', label: 'MATCHES', suffix: '' },
              { value: '125', label: 'CAPACITY', suffix: 'K+' },
              { value: '8', label: 'NATIONS', suffix: '' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="text-4xl md:text-5xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-2xl text-gold-400/70" style={{ fontFamily: 'var(--font-display)' }}>
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs tracking-[0.2em] mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Stadium Showcase - Split Screen Design */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">The Arenas</p>
            <h2
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEGENDARY <span className="text-gradient-gold">VENUES</span>
            </h2>
          </motion.div>
        </div>

        {/* Stadium Cards - Epic Dual Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative group"
              >
                {/* Card Container */}
                <div className="relative rounded-2xl overflow-hidden bg-night-800 border border-white/5 hover:border-gold-500/30 transition-all duration-500">
                  {/* Image Section */}
                  <div className="relative h-72 md:h-96 overflow-hidden">
                    <motion.img
                      src={venue.image}
                      alt={venue.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-night-900/50 to-transparent" />

                    {/* Animated Glow on Hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: index === 0
                          ? 'radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.15), transparent 60%)'
                          : 'radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.1), transparent 60%)',
                      }}
                    />

                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${index === 0 ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500' : 'bg-gradient-to-r from-green-500 via-yellow-500 to-green-500'}`} />

                    {/* Role Badge */}
                    <div className="absolute top-6 left-6">
                      <motion.div
                        className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider ${
                          index === 0
                            ? 'bg-gold-500 text-night-900'
                            : 'bg-green-500/90 text-night-900'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {venue.role}
                      </motion.div>
                    </div>

                    {/* Flag */}
                    <div className="absolute top-6 right-6">
                      <Flag countryCode={venue.countryCode} size="xl" className="drop-shadow-lg" />
                    </div>

                    {/* Match Count Badge */}
                    <div className="absolute bottom-6 right-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-night-900/80 backdrop-blur-sm rounded-full border border-white/10">
                        <span className="text-2xl font-bold text-gold-400" style={{ fontFamily: 'var(--font-display)' }}>
                          {venue.matchCount}
                        </span>
                        <span className="text-white/60 text-xs uppercase tracking-wider">
                          {venue.matchCount === 1 ? 'Match' : 'Matches'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    {/* Tagline */}
                    <p className="text-gold-400/80 text-xs tracking-[0.3em] uppercase mb-3">
                      {venue.tagline}
                    </p>

                    {/* Stadium Name */}
                    <h3
                      className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {venue.name.toUpperCase()}
                    </h3>

                    {/* City */}
                    <p className="text-white/40 text-sm mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {venue.city}, Brazil
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                      {venue.description}
                    </p>

                    {/* Capacity Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Capacity</span>
                        <span className="text-gold-400 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                          {venue.capacity}
                        </span>
                      </div>
                      <div className="h-1 bg-night-600 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-gold-600 to-gold-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: index === 0 ? '100%' : '60%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Matches Hosted */}
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Hosting</p>
                      <div className="flex flex-wrap gap-2">
                        {venue.matches.map((match, i) => (
                          <motion.span
                            key={match}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              match === 'Final'
                                ? 'bg-gold-500 text-night-900'
                                : 'bg-night-600 text-white/70 border border-white/10'
                            }`}
                          >
                            {match}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center VS Connector (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
            >
              <div className="w-20 h-20 rounded-full bg-night-900 border-2 border-gold-500/50 flex items-center justify-center glow-gold">
                <span
                  className="text-gold-400 text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  VS
                </span>
              </div>
              {/* Pulse Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gold-500/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative py-24 px-6 bg-night-800/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Tournament Flow</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE PATH TO <span className="text-gradient-gold">GLORY</span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-gold-500/50 to-gold-500" />

            {/* Timeline Items */}
            {[
              { stage: 'Group Stage', venue: 'Nilton Santos', matches: 4, icon: '⚽' },
              { stage: 'Round of 16', venue: 'Nilton Santos', matches: 1, icon: '🎯' },
              { stage: 'Quarter-Finals', venue: 'Nilton Santos', matches: 1, icon: '🔥' },
              { stage: 'Semi-Finals', venue: 'Nilton Santos', matches: 1, icon: '⭐' },
              { stage: 'The Final', venue: 'Maracanã', matches: 1, icon: '🏆' },
            ].map((item, index) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block glass rounded-xl p-6 ${
                      item.stage === 'The Final' ? 'border border-gold-500/30 glow-gold-sm' : ''
                    }`}
                  >
                    <p className="text-3xl mb-2">{item.icon}</p>
                    <h3
                      className={`text-xl font-bold mb-1 ${
                        item.stage === 'The Final' ? 'text-gold-400' : 'text-white'
                      }`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.stage.toUpperCase()}
                    </h3>
                    <p className="text-white/50 text-sm">{item.venue}</p>
                    <p className="text-gold-400/70 text-xs mt-2">
                      {item.matches} {item.matches === 1 ? 'Match' : 'Matches'}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="relative z-10">
                  <motion.div
                    className={`w-4 h-4 rounded-full ${
                      item.stage === 'The Final'
                        ? 'bg-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                        : 'bg-green-500/70'
                    }`}
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                  />
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competing Nations */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">The Contenders</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE <span className="text-gradient-gold">8 NATIONS</span>
            </h2>
            <p className="text-white/50 mb-12 max-w-xl mx-auto">
              Legendary teams competing for ultimate glory in Rio de Janeiro
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { countryCode: 'BR', name: 'Brazil', player: 'Ronaldo' },
                { countryCode: 'AR', name: 'Argentina', player: 'Legends' },
                { countryCode: 'FR', name: 'France', player: 'Henry' },
                { countryCode: 'NL', name: 'Netherlands', player: 'Seedorf' },
                { countryCode: 'ES', name: 'Spain', player: 'Puyol' },
                { countryCode: 'IT', name: 'Italy', player: 'Buffon' },
                { countryCode: 'SA', name: 'Saudi Arabia', player: 'Yasser' },
                { countryCode: 'NG', name: 'Nigeria', player: 'Kanu' },
              ].map((nation, index) => (
                <motion.div
                  key={nation.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass rounded-xl p-5 md:p-6 cursor-pointer group border border-transparent hover:border-gold-500/20 transition-all duration-300"
                >
                  <div className="mb-3 flex justify-center">
                    <motion.img
                      src={`https://flagcdn.com/w80/${nation.countryCode.toLowerCase()}.png`}
                      alt={nation.name}
                      className="w-12 h-auto rounded shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <h3
                    className="text-lg md:text-xl font-bold text-white group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {nation.name.toUpperCase()}
                  </h3>
                  <p className="text-white/40 text-xs mt-1">ft. {nation.player}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/stadium/maracana.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/90 to-night-900" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              WITNESS <span className="text-gradient-gold">HISTORY</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Be part of the greatest gathering of football legends ever assembled.
              Two iconic stadiums. Seven unforgettable matches. One ultimate champion.
            </p>
            <motion.a
              href="/tickets"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-night-900 font-bold rounded-full hover:bg-gold-400 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              GET YOUR TICKETS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
