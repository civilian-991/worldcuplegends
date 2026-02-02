import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .is('deleted_at', null)
    .eq('published', true)
    .eq('locale', locale)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform snake_case to camelCase for frontend
  const news = (data || []).map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    image: row.image || '',
    category: row.category || 'general',
    author: row.author || '',
    publishedAt: row.published_at || row.created_at || '',
    sourceUrl: row.source_url || null,
    sourceName: row.source_name || null,
    tags: row.tags || [],
  }));

  return NextResponse.json(news);
}
