import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/comments/[id]/like - Like a comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', id)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    return NextResponse.json({ error: 'Already liked' }, { status: 400 });
  }

  const { error } = await supabase
    .from('comment_likes')
    .insert({
      comment_id: parseInt(id),
      user_id: user.id,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/comments/[id]/like - Unlike a comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('comment_id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
