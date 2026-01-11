import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (error || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.slug !== undefined) updateData.slug = body.slug
  if (body.price !== undefined) updateData.price = body.price
  if (body.originalPrice !== undefined) updateData.original_price = body.originalPrice
  if (body.description !== undefined) updateData.description = body.description
  if (body.category !== undefined) updateData.category = body.category
  if (body.subcategory !== undefined) updateData.subcategory = body.subcategory
  if (body.images !== undefined) updateData.images = body.images
  if (body.sizes !== undefined) updateData.sizes = body.sizes
  if (body.colors !== undefined) updateData.colors = body.colors
  if (body.inStock !== undefined) updateData.in_stock = body.inStock
  if (body.stockQuantity !== undefined) updateData.stock_quantity = body.stockQuantity
  if (body.featured !== undefined) updateData.featured = body.featured
  if (body.tags !== undefined) updateData.tags = body.tags
  if (body.legend !== undefined) updateData.legend = body.legend
  if (body.team !== undefined) updateData.team = body.team

  const { data: product, error } = await supabase
    .from('products')
    .update(updateData as never)
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Product deleted' })
}
