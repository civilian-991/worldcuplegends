import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch user's cart
export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ items: [] })
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: cartItems })
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId, quantity, size, color } = await request.json()

  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('size', size || '')
    .eq('color', color || '')
    .single()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + (quantity || 1) })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    // Insert new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: quantity || 1,
        size: size || null,
        color: color || null,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Added to cart' })
}

// DELETE - Clear cart
export async function DELETE() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Cart cleared' })
}
