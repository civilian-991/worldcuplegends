'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getLegends, getMatches, getTeams, type Legend, type Match, type Team } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { BarChart, DonutChart, LineChart, type BarChartData, type DonutChartData } from '@/components/StatsChart';
import Flag from '@/components/Flag';

// =============================================================================
// TYPES
// =============================================================================

interface TournamentStats {
  totalGoals: number;
  totalMatches: number;
  avgGoalsPerMatch: number;
  completedMatches: number;
  upcomingMatches: number;
  liveMatches: number;
}

interface TeamStats {
  name: string;
  countryCode: string;
  goals: number;
  wins: number;
  draws: number;
  losses: number;
  rating: number;
}

interface StageStats {
  stage: string;
  matches: number;
  goals: number;
  avgGoals: number;
}

// =============================================================================
// ICONS
// =============================================================================

const GoalIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M12 6v12M6 12h12" />
  </svg>
);

const MatchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M3 10h18M12 4v16" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l-2 5h4l-2-5zM5 3h14c0 0 1 0 1 1v3c0 2-1 4-3 5-1 .5-2 1-2 2v1H9v-1c0-1-1-1.5-2-2-2-1-3-3-3-5V4c0-1 1-1 1-1z" />
  </svg>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function StatsDashboard() {
  const [legends, setLegends] = useState<Legend[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tournamentStats, setTournamentStats] = useState<TournamentStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [stageStats, setStageStats] = useState<StageStats[]>([]);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [legendsData, matchesData, teamsData] = await Promise.all([
          getLegends(),
          getMatches(),
          getTeams(),
        ]);

        setLegends(legendsData);
        setMatches(matchesData);
        setTeams(teamsData);

        // Calculate tournament stats
        const completedMatches = matchesData.filter(m => m.homeScore !== null && m.homeScore !== undefined);
        const totalGoals = completedMatches.reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0);
        const liveMatches = matchesData.filter(m => m.isLive);

        setTournamentStats({
          totalGoals,
          totalMatches: matchesData.length,
          avgGoalsPerMatch: completedMatches.length > 0 ? totalGoals / completedMatches.length : 0,
          completedMatches: completedMatches.length,
          upcomingMatches: matchesData.length - completedMatches.length - liveMatches.length,
          liveMatches: liveMatches.length,
        });

        // Calculate team stats from matches
        const teamStatsMap = new Map<string, TeamStats>();

        // Initialize teams
        teamsData.forEach(team => {
          teamStatsMap.set(team.name, {
            name: team.name,
            countryCode: team.countryCode,
            goals: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            rating: team.rating,
          });
        });

        // Process completed matches
        completedMatches.forEach(match => {
          const homeTeam = teamStatsMap.get(match.homeTeam);
          const awayTeam = teamStatsMap.get(match.awayTeam);

          if (homeTeam && match.homeScore !== null && match.homeScore !== undefined) {
            const homeScoreVal = match.homeScore;
            const awayScoreVal = match.awayScore ?? 0;
            homeTeam.goals += homeScoreVal;
            if (homeScoreVal > awayScoreVal) homeTeam.wins++;
            else if (homeScoreVal < awayScoreVal) homeTeam.losses++;
            else homeTeam.draws++;
          }

          if (awayTeam && match.awayScore !== null && match.awayScore !== undefined) {
            const awayScoreVal = match.awayScore;
            const homeScoreVal = match.homeScore ?? 0;
            awayTeam.goals += awayScoreVal;
            if (awayScoreVal > homeScoreVal) awayTeam.wins++;
            else if (awayScoreVal < homeScoreVal) awayTeam.losses++;
            else awayTeam.draws++;
          }
        });

        setTeamStats(
          Array.from(teamStatsMap.values())
            .filter(t => t.goals > 0 || t.wins > 0)
            .sort((a, b) => b.goals - a.goals)
        );

        // Calculate stage stats
        const stageMap = new Map<string, StageStats>();
        completedMatches.forEach(match => {
          const existing = stageMap.get(match.stage) || { stage: match.stage, matches: 0, goals: 0, avgGoals: 0 };
          existing.matches++;
          existing.goals += (match.homeScore || 0) + (match.awayScore || 0);
          existing.avgGoals = existing.goals / existing.matches;
          stageMap.set(match.stage, existing);
        });

        setStageStats(Array.from(stageMap.values()));

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats data:', error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-700 via-night-800 to-night-900" />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            <p className="text-white/60 text-sm uppercase tracking-wider">Loading Stats...</p>
          </div>
        </div>
      </section>
    );
  }

  // Top scorers from legends
  const topScorers = legends.slice(0, 5);

  // Team goals data for bar chart
  const teamGoalsData: BarChartData[] = teamStats.slice(0, 8).map(team => ({
    label: team.name,
    value: team.goals,
    icon: <Flag countryCode={team.countryCode} size="sm" />,
  }));

  // Match results distribution
  const totalWins = teamStats.reduce((sum, t) => sum + t.wins, 0);
  const totalDraws = teamStats.reduce((sum, t) => sum + t.draws, 0) / 2; // Divide by 2 since each draw is counted twice
  const totalLosses = teamStats.reduce((sum, t) => sum + t.losses, 0);

  const resultsData: DonutChartData[] = [
    { label: 'Wins', value: Math.round(totalWins / 2), color: '#22C55E' }, // Divide by 2 since wins are counted for both sides
    { label: 'Draws', value: Math.round(totalDraws), color: '#F5C542' },
    { label: 'Losses', value: Math.round(totalLosses / 2), color: '#EF4444' },
  ];

  // Recent results for line chart (simulated trend data if no real data)
  const recentResults = matches
    .filter(m => m.homeScore !== null)
    .slice(-10)
    .map((match, i) => ({
      label: `M${i + 1}`,
      value: (match.homeScore || 0) + (match.awayScore || 0),
    }));

  // If no completed matches, show placeholder data
  const lineChartData = recentResults.length > 0 ? recentResults : [
    { label: 'W1', value: 3 },
    { label: 'W2', value: 5 },
    { label: 'W3', value: 4 },
    { label: 'W4', value: 7 },
    { label: 'W5', value: 6 },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-700 via-night-800 to-night-900" />

      {/* Stadium Light Effects */}
      <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-[200px]" />
      <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-[200px]" />

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-3">
            Tournament Overview
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-gradient-gold">STATS</span> DASHBOARD
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real-time tournament statistics, player performances, and team analytics
          </p>
        </motion.div>

        {/* ================================================================= */}
        {/* SECTION 1: Hero Stats Row (4 Key Metrics) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard
            value={tournamentStats?.totalGoals || 0}
            label="Total Goals"
            icon={<GoalIcon />}
            variant="highlight"
            delay={0}
            isLive={tournamentStats?.liveMatches ? tournamentStats.liveMatches > 0 : false}
          />
          <StatCard
            value={tournamentStats?.completedMatches || 0}
            label="Matches Played"
            suffix={`/${tournamentStats?.totalMatches || 0}`}
            icon={<MatchIcon />}
            delay={0.1}
          />
          <StatCard
            value={tournamentStats?.avgGoalsPerMatch || 0}
            label="Avg Goals/Match"
            decimals={2}
            icon={<ChartIcon />}
            delay={0.2}
          />
          <StatCard
            value={teams.length}
            label="Competing Nations"
            icon={<TrophyIcon />}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* ================================================================= */}
          {/* SECTION 2: Top Scorers Mini-Leaderboard */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  TOP SCORERS
                </h3>
                <span className="text-gold-400 text-sm">All-Time</span>
              </div>

              <div className="space-y-4">
                {topScorers.map((legend, index) => (
                  <motion.div
                    key={legend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                    className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors group"
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-gold-500 text-night-900' :
                      index === 1 ? 'bg-gray-400 text-night-900' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-night-600 text-white/60'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Flag countryCode={legend.countryCode} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate group-hover:text-gold-400 transition-colors">
                          {legend.name}
                        </p>
                        <p className="text-white/50 text-xs truncate">{legend.team}</p>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold text-gold-400"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {legend.goals}
                      </p>
                      <p className="text-white/40 text-xs">GOALS</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ================================================================= */}
          {/* SECTION 3: Team Performance Chart */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2"
          >
            {teamGoalsData.length > 0 ? (
              <BarChart
                data={teamGoalsData}
                title="GOALS BY TEAM"
                showValues={true}
                delay={0.6}
              />
            ) : (
              <BarChart
                data={teams.slice(0, 8).map(t => ({
                  label: t.name,
                  value: t.rating,
                  icon: <Flag countryCode={t.countryCode} size="sm" />,
                }))}
                title="TEAM RATINGS"
                showValues={true}
                delay={0.6}
              />
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* ================================================================= */}
          {/* SECTION 4: Match Results Distribution */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <DonutChart
              data={resultsData.some(d => d.value > 0) ? resultsData : [
                { label: 'Upcoming', value: tournamentStats?.upcomingMatches || 1, color: '#F5C542' },
                { label: 'Completed', value: tournamentStats?.completedMatches || 0, color: '#22C55E' },
              ]}
              title="MATCH RESULTS"
              size={180}
              strokeWidth={20}
              centerLabel="Matches"
              centerValue={tournamentStats?.completedMatches || 0}
              delay={0.7}
            />
          </motion.div>

          {/* ================================================================= */}
          {/* SECTION 5: Goals Trend */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <LineChart
              data={lineChartData}
              title="GOALS PER MATCH"
              height={220}
              showPoints={true}
              showArea={true}
              delay={0.8}
            />
          </motion.div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 6: Stage Breakdown */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass rounded-2xl p-6"
        >
          <h3
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            STAGE BREAKDOWN
          </h3>

          {stageStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stageStats.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-night-600/50 rounded-xl p-5 border border-gold-500/10 hover:border-gold-500/30 transition-all cursor-pointer group"
                >
                  <p className="text-gold-400 text-xs uppercase tracking-wider mb-2 group-hover:text-gold-300">
                    {stage.stage}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-3xl font-bold text-white group-hover:text-gold-400 transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {stage.goals}
                      </p>
                      <p className="text-white/50 text-sm">Total Goals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white/80">{stage.matches}</p>
                      <p className="text-white/40 text-xs">Matches</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">Avg Goals/Match</span>
                      <span className="text-gold-400 font-bold">{stage.avgGoals.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Placeholder stage cards when no matches have been played
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Group Stage', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'].map((stage, index) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="bg-night-600/50 rounded-xl p-5 border border-gold-500/10"
                >
                  <p className="text-gold-400 text-xs uppercase tracking-wider mb-2">
                    {stage}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-3xl font-bold text-white/30"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        --
                      </p>
                      <p className="text-white/30 text-sm">Total Goals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white/30">--</p>
                      <p className="text-white/30 text-xs">Matches</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center">
                    <span className="text-white/30 text-sm">Upcoming</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ================================================================= */}
        {/* Recent Results Section */}
        {/* ================================================================= */}
        {matches.filter(m => m.homeScore !== null).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                RECENT RESULTS
              </h3>
              <span className="text-gold-400 text-sm">Last 5 Matches</span>
            </div>

            <div className="space-y-3">
              {matches
                .filter(m => m.homeScore !== null)
                .slice(-5)
                .reverse()
                .map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-night-600/30 rounded-xl hover:bg-night-600/50 transition-colors"
                  >
                    {/* Home Team */}
                    <div className="flex items-center gap-3 flex-1">
                      <Flag countryCode={match.homeCountryCode} size="md" />
                      <span className={`font-semibold ${
                        (match.homeScore || 0) > (match.awayScore || 0) ? 'text-green-400' : 'text-white'
                      }`}>
                        {match.homeTeam}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4 px-6">
                      <span
                        className="text-2xl font-bold text-gold-400"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {match.homeScore}
                      </span>
                      <span className="text-white/40">-</span>
                      <span
                        className="text-2xl font-bold text-gold-400"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {match.awayScore}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className={`font-semibold ${
                        (match.awayScore || 0) > (match.homeScore || 0) ? 'text-green-400' : 'text-white'
                      }`}>
                        {match.awayTeam}
                      </span>
                      <Flag countryCode={match.awayCountryCode} size="md" />
                    </div>

                    {/* Stage */}
                    <div className="hidden md:block ml-6">
                      <span className="text-xs text-white/40 uppercase tracking-wider px-3 py-1 bg-night-700 rounded-full">
                        {match.stage}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
