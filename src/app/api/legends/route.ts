import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching legends:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform snake_case to camelCase for frontend
  const legends = (data || []).map(row => ({
    id: row.id,
    name: row.name,
    fullName: row.full_name || row.name,
    shortName: row.short_name || '',
    country: row.country,
    countryCode: row.country_code || '',
    position: row.position || '',
    era: row.era || '',
    goals: row.goals || 0,
    assists: row.assists || 0,
    appearances: row.appearances || 0,
    worldCups: row.world_cups || 0,
    image: row.image || '',
    team: row.team || '',
    jerseyNumber: row.jersey_number || 0,
    rating: row.rating || 0,
  }));

  return NextResponse.json(legends);
}
