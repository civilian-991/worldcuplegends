import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
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

  const body = await request.json()

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
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product })
}
