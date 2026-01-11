import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (error) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Get related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .eq('in_stock', true)
    .limit(4)

  return NextResponse.json({
    product,
    relatedProducts: relatedProducts || [],
  })
}
