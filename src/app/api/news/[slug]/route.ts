import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .is('deleted_at', null)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    console.error('Error fetching news article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform snake_case to camelCase for frontend
  const article = {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: data.content || '',
    image: data.image || '',
    category: data.category || 'general',
    author: data.author || '',
    publishedAt: data.published_at || data.created_at || '',
    sourceUrl: data.source_url || null,
    sourceName: data.source_name || null,
    tags: data.tags || [],
    locale: data.locale || 'en',
  };

  return NextResponse.json(article);
}
