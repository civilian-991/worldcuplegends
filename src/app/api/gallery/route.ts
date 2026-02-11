import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const images = (data || []).map(row => ({
    id: row.id,
    title: row.title,
    category: row.category || 'general',
    url: `${supabaseUrl}/storage/v1/object/public/gallery/${row.image_path}`,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }));

  return NextResponse.json(images);
}
