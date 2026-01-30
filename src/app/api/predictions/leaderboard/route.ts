import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/predictions/leaderboard - Get prediction leaderboard
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prediction_leaderboard')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .order('total_points', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add rank to each entry
  const rankedData = (data || []).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return NextResponse.json(rankedData);
}
