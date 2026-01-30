import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/predictions - Get user's predictions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  const anonymousId = searchParams.get('anonymousId');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from('match_predictions').select('*');

  if (matchId) {
    query = query.eq('match_id', matchId);
  }

  if (user) {
    query = query.eq('user_id', user.id);
  } else if (anonymousId) {
    query = query.eq('anonymous_id', anonymousId);
  } else {
    return NextResponse.json([]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/predictions - Create or update a prediction
export async function POST(request: Request) {
  const body = await request.json();
  const { matchId, homeScore, awayScore, anonymousId } = body;

  if (matchId === undefined || homeScore === undefined || awayScore === undefined) {
    return NextResponse.json(
      { error: 'matchId, homeScore, and awayScore are required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if match exists and hasn't started
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('match_date, match_time')
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  // Check if match has started (compare with current time)
  const matchDateTime = new Date(`${match.match_date}T${match.match_time || '00:00'}`);
  if (matchDateTime < new Date()) {
    return NextResponse.json({ error: 'Match has already started' }, { status: 400 });
  }

  // Upsert prediction
  const predictionData = {
    match_id: matchId,
    user_id: user?.id || null,
    anonymous_id: user ? null : anonymousId,
    home_score: homeScore,
    away_score: awayScore,
    updated_at: new Date().toISOString(),
  };

  // Check for existing prediction
  let existingQuery = supabase
    .from('match_predictions')
    .select('id')
    .eq('match_id', matchId);

  if (user) {
    existingQuery = existingQuery.eq('user_id', user.id);
  } else if (anonymousId) {
    existingQuery = existingQuery.eq('anonymous_id', anonymousId);
  }

  const { data: existing } = await existingQuery.single();

  let result;
  if (existing) {
    // Update
    result = await supabase
      .from('match_predictions')
      .update(predictionData)
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // Insert
    result = await supabase
      .from('match_predictions')
      .insert(predictionData)
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(result.data, { status: existing ? 200 : 201 });
}
