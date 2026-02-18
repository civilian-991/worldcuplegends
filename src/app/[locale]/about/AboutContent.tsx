'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Flag from '@/components/Flag';

// SVG Icons for Our Values
const UnityIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const LegacyIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M10 10h4" />
  </svg>
);

const ExcellenceIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
    <path d="M4 22h16" />
    <path d="M10 22V2h4v20" />
    <path d="M7 9h10l-1 6H8z" />
    <path d="M7 15l-1 7" />
    <path d="M17 15l1 7" />
  </svg>
);

const PassionIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21C8 17 2 13 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 22 13 16 17 12 21z" />
  </svg>
);

const RespectValueIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const InspirationIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v1" />
    <path d="M4.93 4.93l.71.71" />
    <path d="M19.07 4.93l-.71.71" />
    <path d="M2 12h1" />
    <path d="M21 12h1" />
    <path d="M15 12a3 3 0 1 1-6 0c0-2 1.5-3 3-5 1.5 2 3 3 3 5z" />
  </svg>
);

// SVG Icons for CUFA Program Elements
const CalendarIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
  </svg>
);

const AuctionIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const FootballIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2l3 7h-6z" />
    <path d="M22 12l-7 3v-6z" />
    <path d="M12 22l-3-7h6z" />
    <path d="M2 12l7-3v6z" />
  </svg>
);

// SVG Icons for the 8 Values of Legends Football
const TeamworkIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <circle cx="15" cy="7" r="3" />
    <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" />
  </svg>
);

const RespectIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const DedicationIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FairPlayIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CourageIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const DisciplineIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PerseveranceIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <path d="M12 2v2" />
  </svg>
);

const UnityValueIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function AboutContent() {
  const t = useTranslations('about');

  const boardMembers = [
    { name: 'H.H. Prince Khalid Al Saud', role: t('board.chairman'), initials: 'KA', image: '/board/khalid-al-saud.jpeg' },
    { name: 'Nasr Jawid Bunyadi', role: t('board.ceo'), initials: 'NB', image: '/board/nasr-bunyadi.jpeg' },
    { name: 'Clarence Seedorf', role: t('board.boardMember'), initials: 'CS', image: '/board/clarence-seedorf.jpeg' },
    { name: 'Raafat Hatoum', role: t('board.cso'), initials: 'RH', image: '/board/raafat-hatoum.jpeg' },
    { name: 'Rami Salman', role: t('board.coo'), initials: 'RS', image: '/board/rami-salman.jpeg' },
    { name: 'Rutger Schouten', role: t('board.clo'), initials: 'RS', image: '/board/rutger-schouten.jpeg' },
  ];

  const values = [
    { icon: UnityIcon, title: t('values.unity.title'), description: t('values.unity.description') },
    { icon: LegacyIcon, title: t('values.legacy.title'), description: t('values.legacy.description') },
    { icon: ExcellenceIcon, title: t('values.excellence.title'), description: t('values.excellence.description') },
    { icon: PassionIcon, title: t('values.passion.title'), description: t('values.passion.description') },
    { icon: RespectValueIcon, title: t('values.respect.title'), description: t('values.respect.description') },
    { icon: InspirationIcon, title: t('values.inspiration.title'), description: t('values.inspiration.description') },
  ];

  const timeline = [
    { year: '2023', event: t('journey.2023') },
    { year: '2024', event: t('journey.2024') },
    { year: '2025', event: t('journey.2025') },
    { year: '2026', event: t('journey.2026') },
  ];

  // 8 Values of Legends Football for CUFA School of Life
  const unicefValues = [
    { icon: CourageIcon, key: 'pride' },
    { icon: RespectIcon, key: 'enjoyment' },
    { icon: DedicationIcon, key: 'control' },
    { icon: PerseveranceIcon, key: 'resilience' },
    { icon: TeamworkIcon, key: 'selfConfidence' },
    { icon: DisciplineIcon, key: 'discipline' },
    { icon: UnityValueIcon, key: 'collaboration' },
    { icon: FairPlayIcon, key: 'respect' },
  ];

  // Program elements
  const programElements = [
    { key: 'yearRound', icon: CalendarIcon },
    { key: 'schoolVisits', icon: SchoolIcon },
    { key: 'galaAuction', icon: AuctionIcon },
    { key: 'manOfMatch', icon: FootballIcon },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 to-night-700" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-[200px] hidden md:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('preTitle')}</p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('pageTitle')} <span className="text-gradient-gold">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed">
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-night-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('mission.title')}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {t('mission.paragraph1')}
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {t('mission.paragraph2')}
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                {t('mission.paragraph3')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 glow-gold">
                <div className="text-center">
                  <Image
                    src="/wlc-logo-vertical.png"
                    alt="World Legends Cup"
                    width={128}
                    height={128}
                    className="mx-auto mb-6"
                  />
                  <h3
                    className="text-3xl font-bold text-gold-400 mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t('mission.slogan')}
                  </h3>
                  <p className="text-white/60">
                    {t('mission.sloganSubtitle')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              {t('values.title')}
            </h2>
            <p className="text-white/50">{t('values.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center group hover:bg-gold-500/5 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 group-hover:text-gold-300 transition-all duration-300">
                  <value.icon />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-gold-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-white/50 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUFA School of Life Section */}
      <section className="py-24 px-6 bg-night-800 relative overflow-hidden">
        {/* Accent glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00AEEF]/10 rounded-full blur-[200px] hidden md:block" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold-400/10 rounded-full blur-[150px] hidden md:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#00AEEF] text-sm tracking-[0.4em] uppercase mb-4">
              {t('unicef.preTitle')}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('unicef.title')} <span className="text-[#00AEEF]">{t('unicef.titleHighlight')}</span>
            </h2>
            <p className="text-white/60 max-w-3xl mx-auto text-lg">
              {t('unicef.description')}
            </p>
          </motion.div>

          {/* Partnership Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="glass rounded-3xl p-8 md:p-12 border border-[#00AEEF]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00AEEF]/20 to-transparent" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF]">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 17a4 4 0 0 0 8 0" />
                        <path d="M5 17a4 4 0 0 1 8 0" />
                        <path d="M7 7l5 5 5-5" />
                        <path d="M2 11l5-5 3 3" />
                        <path d="M22 11l-5-5-3 3" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        <a href="https://cufaglobal.org/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00AEEF] transition-colors">
                          {t('unicef.partnership.title')}
                        </a>
                      </h3>
                      <p className="text-[#00AEEF]">{t('unicef.partnership.subtitle')}</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    {t('unicef.partnership.description')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF] text-sm">
                      {t('unicef.partnership.tag1')}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm">
                      {t('unicef.partnership.tag2')}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF] text-sm">
                      {t('unicef.partnership.tag3')}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="glass rounded-2xl p-8 text-center border border-gold-500/20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0088cc] flex items-center justify-center text-white">
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <h4
                      className="text-xl font-bold text-gold-400 mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {t('unicef.partnership.impactTitle')}
                    </h4>
                    <p className="text-white/50 text-sm">
                      {t('unicef.partnership.impactDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 8 Values of Legends Football */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('unicef.valuesTitle')}
            </h3>
            <p className="text-white/50">{t('unicef.valuesSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
            {unicefValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.key}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <div className="glass rounded-2xl p-6 text-center border border-white/5 group-hover:border-[#00AEEF]/30 transition-all duration-500 h-full relative overflow-hidden">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/0 to-gold-500/0 group-hover:from-[#00AEEF]/10 group-hover:to-gold-500/5 transition-all duration-500" />

                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#00AEEF]/20 to-gold-500/10 flex items-center justify-center text-[#00AEEF] group-hover:text-gold-400 transition-colors duration-300">
                        <IconComponent />
                      </div>
                      <h4 className="text-white font-bold text-lg group-hover:text-[#00AEEF] transition-colors">
                        {t(`unicef.legendsValues.${value.key}.title`)}
                      </h4>
                      <p className="text-white/40 text-sm mt-2 hidden md:block">
                        {t(`unicef.legendsValues.${value.key}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Program Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('unicef.programTitle')}
            </h3>
            <p className="text-white/50">{t('unicef.programSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programElements.map((element, index) => (
              <motion.div
                key={element.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="glass rounded-2xl p-6 border border-white/5 group-hover:border-gold-500/30 transition-all duration-500 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors text-gold-400">
                      <element.icon />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-gold-400 transition-colors">
                        {t(`unicef.program.${element.key}.title`)}
                      </h4>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {t(`unicef.program.${element.key}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Facts Section */}
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
              {t('tournamentFacts.title')}
            </h2>
            <p className="text-white/50">{t('tournamentFacts.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: '60', label: t('tournamentFacts.matchDuration'), desc: t('tournamentFacts.matchDurationDesc') },
              { icon: '∞', label: t('tournamentFacts.substitutions'), desc: t('tournamentFacts.substitutionsDesc') },
              { icon: 'PK', label: t('tournamentFacts.noExtraTime'), desc: t('tournamentFacts.noExtraTimeDesc') },
              { icon: 'FIFA', label: t('tournamentFacts.fifaEndorsed'), desc: t('tournamentFacts.fifaEndorsedDesc') },
              { icon: '75', label: t('tournamentFacts.broadcast'), desc: t('tournamentFacts.broadcastDesc') },
              { icon: '3B', label: t('tournamentFacts.tvAudience'), desc: t('tournamentFacts.tvAudienceDesc') },
            ].map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center group hover:bg-gold-500/5 transition-colors"
              >
                <span
                  className="text-3xl font-bold text-gold-400 block mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {fact.icon}
                </span>
                <h3 className="text-white font-bold text-sm mb-2 group-hover:text-gold-400 transition-colors">
                  {fact.label}
                </h3>
                <p className="text-white/40 text-xs">{fact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-4xl mx-auto">
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
              {t('journey.title')}
            </h2>
            <p className="text-white/50">{t('journey.subtitle')}</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold-500/30" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <p
                    className="text-4xl font-bold text-gold-400"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.year}
                  </p>
                  <p className="text-white/70 mt-2">{item.event}</p>
                </div>
                <div className="relative z-10 w-4 h-4 rounded-full bg-gold-500 glow-gold-sm" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors Section - hidden until ready
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-4">{t('board.preTitle')}</p>
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('board.title')}
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">{t('board.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass rounded-2xl p-8 border border-white/5 group-hover:border-gold-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-500/10 to-transparent" />
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-[2px] group-hover:shadow-lg group-hover:shadow-gold-500/25 transition-shadow duration-500">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full rounded-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-night-800 flex items-center justify-center">
                          <span
                            className="text-2xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {member.initials}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-gold-500/0 group-hover:border-gold-500/30 group-hover:scale-110 transition-all duration-500" />
                  </div>
                  <h3
                    className="text-xl font-bold text-white text-center mb-2 group-hover:text-gold-100 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {member.name}
                  </h3>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-300">
                      {member.role}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent group-hover:w-3/4 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Host Nations */}
      <section className="py-24 px-6 bg-night-800 overflow-hidden">
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
              {t('hostNations.title')}
            </h2>
            <p className="text-white/50">{t('hostNations.subtitle')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-12 text-center max-w-2xl mx-auto glow-gold"
          >
            <div className="mb-6">
              <Image src="https://flagcdn.com/w160/br.png" alt="Brazil flag" width={128} height={90} className="mx-auto rounded-lg shadow-lg" />
            </div>
            <h3
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BRAZIL
            </h3>
            <p className="text-gold-400 text-xl mb-6">2 Venues</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="glass-gold rounded-lg p-6">
                <p className="text-gold-400 font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Maracanã Stadium</p>
                <p className="text-white/60">Rio de Janeiro</p>
                <p className="text-white/40 text-sm mt-2">The Temple of Football</p>
              </div>
              <div className="glass-gold rounded-lg p-6">
                <p className="text-gold-400 font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Estádio Nilton Santos</p>
                <p className="text-white/60">Rio de Janeiro</p>
                <p className="text-white/40 text-sm mt-2">Engenhão</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
