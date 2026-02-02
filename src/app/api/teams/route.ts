import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Fetch teams and legends in parallel, filtering out soft-deleted records
  const [teamsResult, legendsResult] = await Promise.all([
    supabase.from('teams').select('*').is('deleted_at', null).order('rating', { ascending: false }),
    supabase.from('legends').select('name, country_code').is('deleted_at', null)
  ]);

  if (teamsResult.error) {
    console.error('Error fetching teams:', teamsResult.error);
    return NextResponse.json({ error: teamsResult.error.message }, { status: 500 });
  }

  // Create a map of country code to legend names
  const legendsByCountry: Record<string, string[]> = {};
  if (legendsResult.data) {
    legendsResult.data.forEach((legend) => {
      const code = legend.country_code as string;
      if (!legendsByCountry[code]) {
        legendsByCountry[code] = [];
      }
      legendsByCountry[code].push(legend.name as string);
    });
  }

  // Transform snake_case to camelCase for frontend
  const teams = (teamsResult.data || []).map(row => ({
    id: row.id,
    name: row.name,
    countryCode: row.country_code || '',
    flag: row.flag || '',
    worldCups: row.world_cups || 0,
    worldCupYears: row.world_cup_years || [],
    confederation: row.confederation || '',
    rating: row.rating || 0,
    color: row.color || '#FFD700',
    coach: row.coach || '',
    coachImage: row.coach_image || '',
    captain: row.captain || '',
    legends: legendsByCountry[row.country_code] || [],
  }));

  return NextResponse.json(teams);
}
