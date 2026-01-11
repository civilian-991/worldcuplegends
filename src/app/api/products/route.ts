import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: products, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    products,
    total: count,
    limit,
    offset,
  })
}
