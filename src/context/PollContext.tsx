'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Poll types
export type PollCategory = 'greatest-legend' | 'best-goal' | 'best-match' | 'mvp' | 'best-celebration' | 'iconic-moment';

export interface PollOption {
  id: string;
  label: string;
  image?: string;
  description?: string;
  countryCode?: string;
}

export interface Poll {
  id: string;
  question: string;
  category: PollCategory;
  options: PollOption[];
  votes: Record<string, number>;
  totalVotes: number;
  endsAt: Date;
  isFeatured?: boolean;
  createdAt: Date;
}

export interface UserVote {
  pollId: string;
  optionId: string;
  votedAt: Date;
}

interface PollContextType {
  polls: Poll[];
  userVotes: UserVote[];
  featuredPoll: Poll | null;
  hasVoted: (pollId: string) => boolean;
  getUserVote: (pollId: string) => string | null;
  castVote: (pollId: string, optionId: string) => Promise<void>;
  getVotePercentage: (pollId: string, optionId: string) => number;
  getLeadingOption: (pollId: string) => string | null;
  isLoading: boolean;
  selectedCategory: PollCategory | 'all';
  setSelectedCategory: (category: PollCategory | 'all') => void;
  getFilteredPolls: () => Poll[];
  shareResult: (pollId: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

// Storage keys
const VOTES_STORAGE_KEY = 'wlc-poll-votes';
const POLLS_STORAGE_KEY = 'wlc-polls-data';

// Initial poll data
const initialPolls: Poll[] = [
  {
    id: 'greatest-legend-2026',
    question: 'Who is the Greatest World Cup Legend of All Time?',
    category: 'greatest-legend',
    isFeatured: true,
    options: [
      { id: 'pele', label: 'Pele', image: '/legends/pele.png', description: '3 World Cups, 77 Goals', countryCode: 'BR' },
      { id: 'maradona', label: 'Diego Maradona', image: '/legends/maradona.png', description: '1 World Cup, Hand of God', countryCode: 'AR' },
      { id: 'messi', label: 'Lionel Messi', image: '/legends/messi.png', description: '1 World Cup, 109 Goals', countryCode: 'AR' },
      { id: 'zidane', label: 'Zinedine Zidane', image: '/legends/zidane.png', description: '1 World Cup, 2006 Final', countryCode: 'FR' },
      { id: 'ronaldo', label: 'Ronaldo Nazario', image: '/legends/ronaldo.png', description: '2 World Cups, 15 Goals', countryCode: 'BR' },
      { id: 'beckenbauer', label: 'Franz Beckenbauer', image: '/legends/beckenbauer.png', description: '1 World Cup, Der Kaiser', countryCode: 'DE' },
    ],
    votes: { pele: 2847, maradona: 3156, messi: 4521, zidane: 1923, ronaldo: 2134, beckenbauer: 987 },
    totalVotes: 15568,
    endsAt: new Date('2026-02-28T23:59:59'),
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'best-goal-ever',
    question: 'Greatest World Cup Goal Ever Scored?',
    category: 'best-goal',
    options: [
      { id: 'maradona-england', label: 'Maradona vs England (1986)', description: 'Solo run past 6 players', countryCode: 'AR' },
      { id: 'pele-sweden', label: 'Pele vs Sweden (1958)', description: 'Iconic chest control & volley', countryCode: 'BR' },
      { id: 'bergkamp-argentina', label: 'Bergkamp vs Argentina (1998)', description: 'Perfect first touch finish', countryCode: 'NL' },
      { id: 'carlos-france', label: 'Roberto Carlos Free Kick (1997)', description: 'Physics-defying curve', countryCode: 'BR' },
      { id: 'gotze-argentina', label: 'Gotze vs Argentina (2014)', description: 'World Cup winning volley', countryCode: 'DE' },
    ],
    votes: { 'maradona-england': 4521, 'pele-sweden': 1234, 'bergkamp-argentina': 2156, 'carlos-france': 3421, 'gotze-argentina': 1567 },
    totalVotes: 12899,
    endsAt: new Date('2026-03-15T23:59:59'),
    createdAt: new Date('2026-01-05'),
  },
  {
    id: 'best-match-2026',
    question: 'Most Thrilling World Cup Match?',
    category: 'best-match',
    options: [
      { id: 'arg-fra-2022', label: 'Argentina 3-3 France (2022)', description: 'Epic Final, Messi vs Mbappe' },
      { id: 'ger-bra-2014', label: 'Germany 7-1 Brazil (2014)', description: 'Historic Semi-Final' },
      { id: 'ita-ger-2006', label: 'Italy 2-0 Germany (2006)', description: 'Last minute drama' },
      { id: 'eng-ger-1966', label: 'England 4-2 Germany (1966)', description: 'The controversial Final' },
      { id: 'fra-bra-1998', label: 'France 3-0 Brazil (1998)', description: 'Zidane\'s moment' },
    ],
    votes: { 'arg-fra-2022': 5234, 'ger-bra-2014': 2341, 'ita-ger-2006': 1876, 'eng-ger-1966': 987, 'fra-bra-1998': 1543 },
    totalVotes: 11981,
    endsAt: new Date('2026-02-20T23:59:59'),
    createdAt: new Date('2026-01-08'),
  },
  {
    id: 'mvp-tournament-2026',
    question: 'Who Will Be MVP of World Legends Cup 2026?',
    category: 'mvp',
    options: [
      { id: 'messi-mvp', label: 'Lionel Messi', image: '/legends/messi.png', countryCode: 'AR' },
      { id: 'ronaldo-mvp', label: 'Cristiano Ronaldo', image: '/legends/cr7.png', countryCode: 'PT' },
      { id: 'ronaldinho-mvp', label: 'Ronaldinho', image: '/legends/ronaldinho.png', countryCode: 'BR' },
      { id: 'zidane-mvp', label: 'Zinedine Zidane', image: '/legends/zidane.png', countryCode: 'FR' },
    ],
    votes: { 'messi-mvp': 3456, 'ronaldo-mvp': 2987, 'ronaldinho-mvp': 2134, 'zidane-mvp': 1567 },
    totalVotes: 10144,
    endsAt: new Date('2026-06-01T23:59:59'),
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'best-celebration',
    question: 'Most Iconic Goal Celebration?',
    category: 'best-celebration',
    options: [
      { id: 'bebeto-rock', label: 'Bebeto Baby Rock (1994)', description: 'The cradle celebration', countryCode: 'BR' },
      { id: 'roger-milla', label: 'Roger Milla Corner Dance (1990)', description: 'Cameroon\'s joy', countryCode: 'CM' },
      { id: 'klinsmann-dive', label: 'Klinsmann Dive (1994)', description: 'The theatrical dive', countryCode: 'DE' },
      { id: 'tardelli-scream', label: 'Tardelli Scream (1982)', description: 'Pure passion', countryCode: 'IT' },
    ],
    votes: { 'bebeto-rock': 2345, 'roger-milla': 1876, 'klinsmann-dive': 1234, 'tardelli-scream': 2567 },
    totalVotes: 8022,
    endsAt: new Date('2026-03-01T23:59:59'),
    createdAt: new Date('2026-01-12'),
  },
  {
    id: 'iconic-moment',
    question: 'Most Iconic World Cup Moment?',
    category: 'iconic-moment',
    options: [
      { id: 'zidane-headbutt', label: 'Zidane Headbutt (2006)', description: 'The shocking finale', countryCode: 'FR' },
      { id: 'hand-of-god', label: 'Hand of God (1986)', description: 'Maradona\'s controversy', countryCode: 'AR' },
      { id: 'pele-dummy', label: 'Pele Dummy (1970)', description: 'Against Uruguay', countryCode: 'BR' },
      { id: 'gazza-tears', label: 'Gascoigne Tears (1990)', description: 'England\'s heartbreak', countryCode: 'GB' },
    ],
    votes: { 'zidane-headbutt': 3421, 'hand-of-god': 4123, 'pele-dummy': 1567, 'gazza-tears': 1234 },
    totalVotes: 10345,
    endsAt: new Date('2026-02-25T23:59:59'),
    createdAt: new Date('2026-01-15'),
  },
];

export function PollProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PollCategory | 'all'>('all');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load user votes
        const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
        if (savedVotes) {
          const parsedVotes = JSON.parse(savedVotes);
          setUserVotes(parsedVotes.map((v: UserVote) => ({
            ...v,
            votedAt: new Date(v.votedAt),
          })));
        }

        // Load polls with updated vote counts or use initial
        const savedPolls = localStorage.getItem(POLLS_STORAGE_KEY);
        if (savedPolls) {
          const parsedPolls = JSON.parse(savedPolls);
          setPolls(parsedPolls.map((p: Poll) => ({
            ...p,
            endsAt: new Date(p.endsAt),
            createdAt: new Date(p.createdAt),
          })));
        } else {
          setPolls(initialPolls);
        }
      } catch (e) {
        console.error('Failed to load poll data:', e);
        setPolls(initialPolls);
      }
      setIsHydrated(true);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(userVotes));
      localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
    }
  }, [userVotes, polls, isHydrated]);

  // Check if user has voted on a poll
  const hasVoted = useCallback((pollId: string): boolean => {
    return userVotes.some((vote) => vote.pollId === pollId);
  }, [userVotes]);

  // Get user's vote for a poll
  const getUserVote = useCallback((pollId: string): string | null => {
    const vote = userVotes.find((v) => v.pollId === pollId);
    return vote ? vote.optionId : null;
  }, [userVotes]);

  // Cast a vote
  const castVote = useCallback(async (pollId: string, optionId: string): Promise<void> => {
    if (hasVoted(pollId)) {
      throw new Error('Already voted on this poll');
    }

    // Optimistic update for polls
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            votes: {
              ...poll.votes,
              [optionId]: (poll.votes[optionId] || 0) + 1,
            },
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      })
    );

    // Record user vote
    const newVote: UserVote = {
      pollId,
      optionId,
      votedAt: new Date(),
    };
    setUserVotes((prev) => [...prev, newVote]);

    // Simulate network delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, [hasVoted]);

  // Calculate vote percentage
  const getVotePercentage = useCallback((pollId: string, optionId: string): number => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll || poll.totalVotes === 0) return 0;
    const optionVotes = poll.votes[optionId] || 0;
    return Math.round((optionVotes / poll.totalVotes) * 100);
  }, [polls]);

  // Get leading option
  const getLeadingOption = useCallback((pollId: string): string | null => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return null;

    let maxVotes = 0;
    let leadingId: string | null = null;

    Object.entries(poll.votes).forEach(([id, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        leadingId = id;
      }
    });

    return leadingId;
  }, [polls]);

  // Get featured poll
  const featuredPoll = polls.find((p) => p.isFeatured) || polls[0] || null;

  // Filter polls by category
  const getFilteredPolls = useCallback((): Poll[] => {
    if (selectedCategory === 'all') return polls;
    return polls.filter((p) => p.category === selectedCategory);
  }, [polls, selectedCategory]);

  // Share poll result
  const shareResult = useCallback((pollId: string) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;

    const userVote = getUserVote(pollId);
    const votedOption = poll.options.find((o) => o.id === userVote);
    const percentage = userVote ? getVotePercentage(pollId, userVote) : 0;

    const shareText = votedOption
      ? `I voted for ${votedOption.label} (${percentage}%) in "${poll.question}" on World Legends Cup 2026! Cast your vote now!`
      : `Check out this poll: "${poll.question}" on World Legends Cup 2026!`;

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/polls/${pollId}`;

    if (navigator.share) {
      navigator.share({
        title: 'World Legends Cup Poll',
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  }, [polls, getUserVote, getVotePercentage]);

  return (
    <PollContext.Provider
      value={{
        polls,
        userVotes,
        featuredPoll,
        hasVoted,
        getUserVote,
        castVote,
        getVotePercentage,
        getLeadingOption,
        isLoading,
        selectedCategory,
        setSelectedCategory,
        getFilteredPolls,
        shareResult,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}
