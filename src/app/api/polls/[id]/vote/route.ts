import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/polls/[id]/vote - Vote on a poll
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { optionId, anonymousId } = body;

  if (!optionId) {
    return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
  }

  const supabase = await createClient();

  // Get current user if authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // Check if poll exists and is active
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (pollError || !poll) {
    return NextResponse.json({ error: 'Poll not found or inactive' }, { status: 404 });
  }

  // Check if poll has ended
  if (poll.ends_at && new Date(poll.ends_at) < new Date()) {
    return NextResponse.json({ error: 'Poll has ended' }, { status: 400 });
  }

  // Check if user/anonymous has already voted
  let existingVote;
  if (user) {
    const { data } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', id)
      .eq('user_id', user.id)
      .single();
    existingVote = data;
  } else if (anonymousId) {
    const { data } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', id)
      .eq('anonymous_id', anonymousId)
      .single();
    existingVote = data;
  }

  if (existingVote) {
    return NextResponse.json({ error: 'Already voted on this poll' }, { status: 400 });
  }

  // Cast vote
  const { error: voteError } = await supabase
    .from('poll_votes')
    .insert({
      poll_id: parseInt(id),
      user_id: user?.id || null,
      anonymous_id: user ? null : anonymousId,
      option_id: optionId,
    });

  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  // Get updated vote counts
  const { data: votes } = await supabase
    .from('poll_votes')
    .select('option_id')
    .eq('poll_id', id);

  const voteCounts: Record<string, number> = {};
  votes?.forEach((vote) => {
    voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
  });

  return NextResponse.json({
    success: true,
    voteCounts,
    totalVotes: votes?.length || 0
  });
}

// GET /api/polls/[id]/vote - Get vote results
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: votes, error } = await supabase
    .from('poll_votes')
    .select('option_id')
    .eq('poll_id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const voteCounts: Record<string, number> = {};
  votes?.forEach((vote) => {
    voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
  });

  return NextResponse.json({
    voteCounts,
    totalVotes: votes?.length || 0
  });
}
