'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Match } from '@/lib/api';

// Types
export interface Prediction {
  matchId: number;
  homeScore: number;
  awayScore: number;
  timestamp: number;
}

export interface PredictionResult {
  matchId: number;
  prediction: Prediction;
  actualHomeScore: number;
  actualAwayScore: number;
  points: number;
  type: 'exact' | 'difference' | 'winner' | 'draw' | 'incorrect';
}

export interface UserStats {
  totalPredictions: number;
  totalPoints: number;
  exactScores: number;
  correctWinners: number;
  correctDraws: number;
  currentStreak: number;
  bestStreak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalPoints: number;
  predictions: number;
  exactScores: number;
  streak: number;
  isCurrentUser: boolean;
}

// Available badges
const AVAILABLE_BADGES: Badge[] = [
  { id: 'first_prediction', name: 'First Steps', description: 'Make your first prediction', icon: '🎯' },
  { id: 'exact_score', name: 'Crystal Ball', description: 'Predict an exact score', icon: '🔮' },
  { id: 'streak_3', name: 'Hot Streak', description: '3 correct predictions in a row', icon: '🔥' },
  { id: 'streak_5', name: 'On Fire', description: '5 correct predictions in a row', icon: '⚡' },
  { id: 'streak_10', name: 'Legendary', description: '10 correct predictions in a row', icon: '👑' },
  { id: 'predictions_10', name: 'Dedicated Fan', description: 'Make 10 predictions', icon: '⭐' },
  { id: 'predictions_25', name: 'Super Fan', description: 'Make 25 predictions', icon: '🌟' },
  { id: 'points_50', name: 'Rising Star', description: 'Earn 50 points', icon: '📈' },
  { id: 'points_100', name: 'Champion', description: 'Earn 100 points', icon: '🏆' },
  { id: 'exact_5', name: 'Oracle', description: 'Predict 5 exact scores', icon: '🧙' },
];

// Mock leaderboard data (simulates community)
const MOCK_LEADERBOARD: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { rank: 1, username: 'PelePredictor', totalPoints: 156, predictions: 28, exactScores: 8, streak: 4 },
  { rank: 2, username: 'MaradonaMagic', totalPoints: 142, predictions: 25, exactScores: 6, streak: 2 },
  { rank: 3, username: 'ZidaneFan2026', totalPoints: 128, predictions: 24, exactScores: 5, streak: 7 },
  { rank: 4, username: 'RonaldoRules', totalPoints: 115, predictions: 22, exactScores: 4, streak: 3 },
  { rank: 5, username: 'MessiMaster', totalPoints: 108, predictions: 20, exactScores: 4, streak: 1 },
  { rank: 6, username: 'BrazilBeliever', totalPoints: 95, predictions: 19, exactScores: 3, streak: 2 },
  { rank: 7, username: 'GermanGoals', totalPoints: 88, predictions: 18, exactScores: 3, streak: 0 },
  { rank: 8, username: 'ArgentinaAce', totalPoints: 82, predictions: 17, exactScores: 2, streak: 1 },
  { rank: 9, username: 'ItaliaFan', totalPoints: 75, predictions: 16, exactScores: 2, streak: 4 },
  { rank: 10, username: 'FranceForce', totalPoints: 68, predictions: 15, exactScores: 1, streak: 0 },
];

interface PredictionContextType {
  predictions: Prediction[];
  results: PredictionResult[];
  stats: UserStats;
  leaderboard: LeaderboardEntry[];
  username: string;
  setUsername: (name: string) => void;
  addPrediction: (matchId: number, homeScore: number, awayScore: number) => void;
  getPrediction: (matchId: number) => Prediction | undefined;
  hasPredicted: (matchId: number) => boolean;
  canPredict: (match: Match) => boolean;
  calculatePoints: (prediction: Prediction, actualHome: number, actualAway: number) => PredictionResult;
  processMatchResult: (match: Match) => void;
  getTimeUntilDeadline: (match: Match) => number;
  getCommunityPredictions: (matchId: number) => { avgHome: number; avgAway: number; total: number };
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

const STORAGE_KEY = 'wlc-predictions';
const USERNAME_KEY = 'wlc-prediction-username';

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalPredictions: 0,
    totalPoints: 0,
    exactScores: 0,
    correctWinners: 0,
    correctDraws: 0,
    currentStreak: 0,
    bestStreak: 0,
    badges: [],
  });
  const [username, setUsernameState] = useState('Guest');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedUsername = localStorage.getItem(USERNAME_KEY);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPredictions(parsed.predictions || []);
        setResults(parsed.results || []);
        setStats(parsed.stats || {
          totalPredictions: 0,
          totalPoints: 0,
          exactScores: 0,
          correctWinners: 0,
          correctDraws: 0,
          currentStreak: 0,
          bestStreak: 0,
          badges: [],
        });
      } catch (e) {
        console.error('Failed to parse predictions:', e);
      }
    }

    if (savedUsername) {
      setUsernameState(savedUsername);
    }

    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ predictions, results, stats }));
    }
  }, [predictions, results, stats, isHydrated]);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
    localStorage.setItem(USERNAME_KEY, name);
  }, []);

  // Check if user can still make a prediction (1 hour before match)
  const canPredict = useCallback((match: Match): boolean => {
    const matchTime = new Date(`${match.matchDate}T${match.matchTime || '00:00'}`).getTime();
    const deadline = matchTime - 60 * 60 * 1000; // 1 hour before
    return Date.now() < deadline;
  }, []);

  // Get time until prediction deadline
  const getTimeUntilDeadline = useCallback((match: Match): number => {
    const matchTime = new Date(`${match.matchDate}T${match.matchTime || '00:00'}`).getTime();
    const deadline = matchTime - 60 * 60 * 1000;
    return Math.max(0, deadline - Date.now());
  }, []);

  // Check badges and unlock new ones
  const checkBadges = useCallback((newStats: UserStats): Badge[] => {
    const unlockedBadges = [...newStats.badges];
    const now = Date.now();

    const badgeChecks: { id: string; condition: boolean }[] = [
      { id: 'first_prediction', condition: newStats.totalPredictions >= 1 },
      { id: 'exact_score', condition: newStats.exactScores >= 1 },
      { id: 'streak_3', condition: newStats.bestStreak >= 3 },
      { id: 'streak_5', condition: newStats.bestStreak >= 5 },
      { id: 'streak_10', condition: newStats.bestStreak >= 10 },
      { id: 'predictions_10', condition: newStats.totalPredictions >= 10 },
      { id: 'predictions_25', condition: newStats.totalPredictions >= 25 },
      { id: 'points_50', condition: newStats.totalPoints >= 50 },
      { id: 'points_100', condition: newStats.totalPoints >= 100 },
      { id: 'exact_5', condition: newStats.exactScores >= 5 },
    ];

    badgeChecks.forEach(({ id, condition }) => {
      if (condition && !unlockedBadges.find(b => b.id === id)) {
        const badge = AVAILABLE_BADGES.find(b => b.id === id);
        if (badge) {
          unlockedBadges.push({ ...badge, unlockedAt: now });
        }
      }
    });

    return unlockedBadges;
  }, []);

  // Calculate points for a prediction
  const calculatePoints = useCallback((
    prediction: Prediction,
    actualHome: number,
    actualAway: number
  ): PredictionResult => {
    const predictedHome = prediction.homeScore;
    const predictedAway = prediction.awayScore;

    let points = 0;
    let type: PredictionResult['type'] = 'incorrect';

    // Exact score: 10 points
    if (predictedHome === actualHome && predictedAway === actualAway) {
      points = 10;
      type = 'exact';
    }
    // Correct winner + goal difference: 5 points
    else if (
      (predictedHome - predictedAway) === (actualHome - actualAway) &&
      Math.sign(predictedHome - predictedAway) === Math.sign(actualHome - actualAway)
    ) {
      points = 5;
      type = 'difference';
    }
    // Correct winner only: 3 points
    else if (
      (predictedHome > predictedAway && actualHome > actualAway) ||
      (predictedHome < predictedAway && actualHome < actualAway)
    ) {
      points = 3;
      type = 'winner';
    }
    // Correct draw: 3 points
    else if (predictedHome === predictedAway && actualHome === actualAway) {
      points = 3;
      type = 'draw';
    }

    return {
      matchId: prediction.matchId,
      prediction,
      actualHomeScore: actualHome,
      actualAwayScore: actualAway,
      points,
      type,
    };
  }, []);

  // Add a new prediction
  const addPrediction = useCallback((matchId: number, homeScore: number, awayScore: number) => {
    const newPrediction: Prediction = {
      matchId,
      homeScore,
      awayScore,
      timestamp: Date.now(),
    };

    setPredictions(prev => {
      const filtered = prev.filter(p => p.matchId !== matchId);
      return [...filtered, newPrediction];
    });

    // Update stats for new prediction (if it's a new match)
    setStats(prev => {
      const isNewPrediction = !predictions.find(p => p.matchId === matchId);
      if (isNewPrediction) {
        const newStats = {
          ...prev,
          totalPredictions: prev.totalPredictions + 1,
        };
        newStats.badges = checkBadges(newStats);
        return newStats;
      }
      return prev;
    });
  }, [predictions, checkBadges]);

  // Process a match result
  const processMatchResult = useCallback((match: Match) => {
    if (match.homeScore === null || match.awayScore === null) return;

    const prediction = predictions.find(p => p.matchId === match.id);
    if (!prediction) return;

    // Check if already processed
    if (results.find(r => r.matchId === match.id)) return;

    const result = calculatePoints(prediction, match.homeScore ?? 0, match.awayScore ?? 0);

    setResults(prev => [...prev, result]);

    setStats(prev => {
      const isCorrect = result.points > 0;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;

      const newStats: UserStats = {
        ...prev,
        totalPoints: prev.totalPoints + result.points,
        exactScores: prev.exactScores + (result.type === 'exact' ? 1 : 0),
        correctWinners: prev.correctWinners + (result.type === 'winner' ? 1 : 0),
        correctDraws: prev.correctDraws + (result.type === 'draw' ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        badges: prev.badges,
      };

      newStats.badges = checkBadges(newStats);
      return newStats;
    });
  }, [predictions, results, calculatePoints, checkBadges]);

  // Get prediction for a specific match
  const getPrediction = useCallback((matchId: number): Prediction | undefined => {
    return predictions.find(p => p.matchId === matchId);
  }, [predictions]);

  // Check if user has predicted a match
  const hasPredicted = useCallback((matchId: number): boolean => {
    return predictions.some(p => p.matchId === matchId);
  }, [predictions]);

  // Get mock community predictions
  const getCommunityPredictions = useCallback((matchId: number): { avgHome: number; avgAway: number; total: number } => {
    // Simulate community predictions based on matchId for consistency
    const seed = matchId * 7;
    const avgHome = Math.round((((seed % 10) / 10) * 3 + 0.5) * 10) / 10;
    const avgAway = Math.round((((seed % 13) / 13) * 2.5 + 0.3) * 10) / 10;
    const total = 150 + (seed % 200);
    return { avgHome, avgAway, total };
  }, []);

  // Generate leaderboard with current user
  const leaderboard: LeaderboardEntry[] = [...MOCK_LEADERBOARD].map(entry => ({
    ...entry,
    isCurrentUser: false,
  }));

  // Insert current user into leaderboard based on their points
  if (stats.totalPoints > 0) {
    const userEntry: LeaderboardEntry = {
      rank: 0,
      username: username,
      totalPoints: stats.totalPoints,
      predictions: stats.totalPredictions,
      exactScores: stats.exactScores,
      streak: stats.currentStreak,
      isCurrentUser: true,
    };

    // Find position
    let inserted = false;
    for (let i = 0; i < leaderboard.length; i++) {
      if (stats.totalPoints > leaderboard[i].totalPoints) {
        leaderboard.splice(i, 0, userEntry);
        inserted = true;
        break;
      }
    }
    if (!inserted && leaderboard.length < 10) {
      leaderboard.push(userEntry);
    }

    // Update ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        results,
        stats,
        leaderboard: leaderboard.slice(0, 10),
        username,
        setUsername,
        addPrediction,
        getPrediction,
        hasPredicted,
        canPredict,
        calculatePoints,
        processMatchResult,
        getTimeUntilDeadline,
        getCommunityPredictions,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictions() {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
}

export { AVAILABLE_BADGES };
