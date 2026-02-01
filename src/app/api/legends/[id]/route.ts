import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const legendId = parseInt(id);

  if (isNaN(legendId)) {
    return NextResponse.json({ error: 'Invalid legend ID' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('legends')
    .select('*')
    .eq('id', legendId)
    .single();

  if (error) {
    console.error('Error fetching legend:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Legend not found' }, { status: 404 });
  }

  // Transform snake_case to camelCase for frontend
  const legend = {
    id: data.id,
    name: data.name,
    shortName: data.short_name || '',
    country: data.country,
    countryCode: data.country_code || '',
    position: data.position || '',
    era: data.era || '',
    goals: data.goals || 0,
    assists: data.assists || 0,
    appearances: data.appearances || 0,
    worldCups: data.world_cups || 0,
    image: data.image || '',
    team: data.team || '',
    jerseyNumber: data.jersey_number || 0,
    rating: data.rating || 0,
  };

  return NextResponse.json(legend);
}
