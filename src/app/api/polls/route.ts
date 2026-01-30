import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/polls - Get all active polls
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const category = searchParams.get('category');

  const supabase = await createClient();

  let query = supabase
    .from('polls')
    .select('*')
    .eq('is_active', true)
    .or('ends_at.is.null,ends_at.gt.now()')
    .order('created_at', { ascending: false });

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
