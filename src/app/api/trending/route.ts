import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/trending - Get trending items
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('type') || 'legend';
  const period = searchParams.get('period') || 'today';
  const limit = parseInt(searchParams.get('limit') || '10');

  const supabase = await createClient();

  let orderColumn = 'views_today';
  if (period === 'week') orderColumn = 'views_week';
  if (period === 'all') orderColumn = 'views_total';

  const { data: trending, error } = await supabase
    .from('trending_stats')
    .select('*')
    .eq('entity_type', entityType)
    .order(orderColumn, { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch actual entity data based on type
  const entityIds = (trending || []).map(t => t.entity_id);

  if (entityIds.length === 0) {
    return NextResponse.json([]);
  }

  let entityData: Record<number, unknown> = {};

  if (entityType === 'legend') {
    const { data } = await supabase
      .from('legends')
      .select('*')
      .in('id', entityIds);
    data?.forEach(item => { entityData[item.id] = item; });
  } else if (entityType === 'product') {
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('id', entityIds);
    data?.forEach(item => { entityData[item.id] = item; });
  } else if (entityType === 'news') {
    const { data } = await supabase
      .from('news')
      .select('*')
      .in('id', entityIds);
    data?.forEach(item => { entityData[item.id] = item; });
  }

  // Combine trending stats with entity data
  const result = (trending || [])
    .filter(t => entityData[t.entity_id])
    .map((t, index) => ({
      ...t,
      entity: entityData[t.entity_id],
      rank: index + 1,
    }));

  return NextResponse.json(result);
}

// POST /api/trending - Track a page view
export async function POST(request: Request) {
  const body = await request.json();
  const { entityType, entityId, sessionId } = body;

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: 'entityType and entityId are required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Call the increment function
  const { error } = await supabase.rpc('increment_page_view', {
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_user_id: user?.id || null,
    p_session_id: sessionId || null,
  });

  if (error) {
    // Silently fail for tracking - don't break user experience
    console.error('Failed to track view:', error);
  }

  return NextResponse.json({ success: true });
}
