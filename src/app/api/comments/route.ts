import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import { createCommentSchema, formatZodError } from '@/lib/validations';

// GET /api/comments - Get comments for an entity
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entityType');
  const entityId = searchParams.get('entityId');
  const sort = searchParams.get('sort') || 'newest';

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: 'entityType and entityId are required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  let query = supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .is('parent_id', null); // Only top-level comments

  // Apply sorting
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'most_liked':
      query = query.order('likes_count', { ascending: false });
      break;
    default: // newest
      query = query.order('created_at', { ascending: false });
  }

  const { data: comments, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch replies for each comment
  const commentsWithReplies = await Promise.all(
    (comments || []).map(async (comment) => {
      const { data: replies } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      return { ...comment, replies: replies || [] };
    })
  );

  return NextResponse.json(commentsWithReplies);
}

// POST /api/comments - Create a comment
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Rate limit: 10 requests per minute per user
  const rateLimitResult = rateLimiters.comments.check(user.id)
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const body = await request.json();

  // Validate request body
  const validationResult = createCommentSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(formatZodError(validationResult.error), { status: 400 });
  }

  const { entityType, entityId, content, parentId } = validationResult.data;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      content,
      parent_id: parentId || null,
    })
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
