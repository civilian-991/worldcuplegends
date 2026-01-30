import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
  'Saudi Arabia': 'SA',
  'Nigeria': 'NG',
  'TBD': 'TBD',
};

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true });

  if (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform snake_case to camelCase for frontend
  const matches = (data || []).map(row => ({
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeFlag: row.home_flag || '',
    awayFlag: row.away_flag || '',
    homeCountryCode: teamToCountryCode[row.home_team] || 'TBD',
    awayCountryCode: teamToCountryCode[row.away_team] || 'TBD',
    matchDate: row.match_date,
    matchTime: row.match_time || '',
    date: row.match_date,
    time: row.match_time || '',
    venue: row.venue || '',
    stage: row.stage || '',
    homeScore: row.home_score,
    awayScore: row.away_score,
    isLive: row.is_live || false,
  }));

  return NextResponse.json(matches);
}
