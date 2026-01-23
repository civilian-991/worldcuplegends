import { createClient } from '@/lib/supabase/client';

// Types
export interface Legend {
  id: number;
  name: string;
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
}

// Transform database row to frontend type
function transformLegend(row: Record<string, unknown>): Legend {
  return {
    id: row.id as number,
    name: row.name as string,
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
  };
}

// API Functions
export async function getLegends(): Promise<Legend[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching legends:', error);
    return [];
  }

  return (data || []).map(transformLegend);
}

export async function getLegendById(id: number): Promise<Legend | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching legend:', error);
    return null;
  }

  return data ? transformLegend(data) : null;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = createClient();

  // Fetch teams and legends in parallel
  const [teamsResult, legendsResult] = await Promise.all([
    supabase.from('teams').select('*').order('rating', { ascending: false }),
    supabase.from('legends').select('name, country_code')
  ]);

  if (teamsResult.error) {
    console.error('Error fetching teams:', teamsResult.error);
    return [];
  }

  // Create a map of country code to legend names
  const legendsByCountry: Record<string, string[]> = {};
  if (legendsResult.data) {
    legendsResult.data.forEach((legend: Record<string, unknown>) => {
      const code = legend.country_code as string;
      if (!legendsByCountry[code]) {
        legendsByCountry[code] = [];
      }
      legendsByCountry[code].push(legend.name as string);
    });
  }

  // Transform teams and add legends
  return (teamsResult.data || []).map((row: Record<string, unknown>) => {
    const team = transformTeam(row);
    team.legends = legendsByCountry[team.countryCode] || [];
    return team;
  });
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return (data || []).map(transformNews);
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }

  return (data || []).map(transformNews);
}
