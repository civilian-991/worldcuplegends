import { createClient } from '@/lib/supabase/client';

// Types
export interface Legend {
  id: number;
  name: string;
  fullName: string;
  shortName: string;
  country: string;
  countryCode: string;
  position: string;
  era: string;
  goals: number;
  assists: number;
  appearances: number;
  worldCups: number;
  image: string;
  team: string;
  jerseyNumber: number;
  rating: number;
  isCaptain: boolean;
  isCoach: boolean;
}

export interface Team {
  id: number;
  name: string;
  countryCode: string;
  flag: string;
  worldCups: number;
  worldCupYears: string[];
  confederation: string;
  rating: number;
  color: string;
  coach: string;
  coachImage: string;
  captain: string;
  legends: string[];
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeCountryCode: string;
  awayCountryCode: string;
  matchDate: string;
  matchTime: string;
  date: string; // alias for matchDate for component compatibility
  time: string; // alias for matchTime for component compatibility
  venue: string;
  stage: string;
  homeScore?: number | null;
  awayScore?: number | null;
  isLive: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  sourceUrl?: string | null;
  sourceName?: string | null;
  tags?: string[];
}

// Transform database row to frontend type
function transformLegend(row: Record<string, unknown>): Legend {
  return {
    id: row.id as number,
    name: row.name as string,
    fullName: (row.full_name as string) || (row.name as string),
    shortName: (row.short_name as string) || '',
    country: row.country as string,
    countryCode: (row.country_code as string) || '',
    position: (row.position as string) || '',
    era: (row.era as string) || '',
    goals: (row.goals as number) || 0,
    assists: (row.assists as number) || 0,
    appearances: (row.appearances as number) || 0,
    worldCups: (row.world_cups as number) || 0,
    image: (row.image as string) || '',
    team: (row.team as string) || '',
    jerseyNumber: (row.jersey_number as number) || 0,
    rating: (row.rating as number) || 0,
    isCaptain: (row.is_captain as boolean) || false,
    isCoach: (row.is_coach as boolean) || false,
  };
}

function transformTeam(row: Record<string, unknown>): Team {
  return {
    id: row.id as number,
    name: row.name as string,
    countryCode: (row.country_code as string) || '',
    flag: (row.flag as string) || '',
    worldCups: (row.world_cups as number) || 0,
    worldCupYears: (row.world_cup_years as string[]) || [],
    confederation: (row.confederation as string) || '',
    rating: (row.rating as number) || 0,
    color: (row.color as string) || '#FFD700',
    coach: (row.coach as string) || '',
    coachImage: (row.coach_image as string) || '',
    captain: (row.captain as string) || '',
    legends: (row.legends as string[]) || [],
  };
}

// Map team names to country codes
const teamToCountryCode: Record<string, string> = {
  'Brazil': 'BR',
  'Germany': 'DE',
  'Argentina': 'AR',
  'France': 'FR',
  'Italy': 'IT',
  'Netherlands': 'NL',
  'Spain': 'ES',
  'England': 'GB',
  'Portugal': 'PT',
  'TBD': 'TBD',
};

function transformMatch(row: Record<string, unknown>): Match {
  const homeTeam = row.home_team as string;
  const awayTeam = row.away_team as string;
  const matchDate = row.match_date as string;
  const matchTime = (row.match_time as string) || '';

  return {
    id: row.id as number,
    homeTeam,
    awayTeam,
    homeFlag: (row.home_flag as string) || '',
    awayFlag: (row.away_flag as string) || '',
    homeCountryCode: teamToCountryCode[homeTeam] || 'TBD',
    awayCountryCode: teamToCountryCode[awayTeam] || 'TBD',
    matchDate,
    matchTime,
    date: matchDate, // alias for component compatibility
    time: matchTime, // alias for component compatibility
    venue: (row.venue as string) || '',
    stage: (row.stage as string) || '',
    homeScore: row.home_score as number | null,
    awayScore: row.away_score as number | null,
    isLive: (row.is_live as boolean) || false,
  };
}

function transformNews(row: Record<string, unknown>): NewsArticle {
  return {
    id: row.id as number,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string) || '',
    content: (row.content as string) || '',
    image: (row.image as string) || '',
    category: (row.category as string) || 'general',
    author: (row.author as string) || '',
    publishedAt: (row.published_at as string) || (row.created_at as string) || '',
    sourceUrl: (row.sourceUrl as string) || (row.source_url as string) || null,
    sourceName: (row.sourceName as string) || (row.source_name as string) || null,
    tags: (row.tags as string[]) || [],
  };
}

// API Functions - Use server-side routes to avoid client-side Supabase issues in production
export async function getLegends(): Promise<Legend[]> {
  try {
    const response = await fetch('/api/legends');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching legends:', error);
    return [];
  }
}

export async function getLegendById(id: number): Promise<Legend | null> {
  try {
    const response = await fetch(`/api/legends/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching legend:', error);
    return null;
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    const response = await fetch('/api/teams');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

export async function getTeamById(id: number): Promise<Team | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching team:', error);
    return null;
  }

  return data ? transformTeam(data) : null;
}

export async function getMatches(): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function getUpcomingMatches(limit: number = 5): Promise<Match[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .gte('match_date', today)
    .order('match_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}

export async function getLiveMatches(): Promise<Match[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('is_live', true);

  if (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsById(id: number): Promise<NewsArticle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching news article:', error);
    return null;
  }

  return data ? transformNews(data) : null;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching news article:', error);
    return null;
  }

  return data ? transformNews(data) : null;
}

export async function getLatestNews(limit: number = 6): Promise<NewsArticle[]> {
  try {
    const news = await getNews();
    return news.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
}
