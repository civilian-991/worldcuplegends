import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

const sanitizeSearch = (search: string) => search.replace(/[%_\\'"(){}[\]]/g, '');

export async function GET(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const limitParam = parseInt(searchParams.get('limit') || '50')
  const offsetParam = parseInt(searchParams.get('offset') || '0')
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100)
  const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    const sanitized = sanitizeSearch(search)
    query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
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

export async function POST(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      price: body.price,
      original_price: body.originalPrice,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      images: body.images || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
      in_stock: body.inStock ?? true,
      stock_quantity: body.stockQuantity || 0,
      featured: body.featured ?? false,
      tags: body.tags || [],
      legend: body.legend,
      team: body.team,
    } as never)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product })
}
