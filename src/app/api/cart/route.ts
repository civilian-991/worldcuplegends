import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addToCartSchema, formatZodError } from '@/lib/validations'
import { sanitizeText } from '@/lib/sanitize'

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

  return NextResponse.json({ items: cartItems || [] })
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse and validate request body
  const body = await request.json()
  const validationResult = addToCartSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
  }

  const { productId, quantity, size, color } = validationResult.data

  // Sanitize user input to prevent XSS
  const sanitizedSize = size ? sanitizeText(size) : null
  const sanitizedColor = color ? sanitizeText(color) : null

  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('size', sanitizedSize || '')
    .eq('color', sanitizedColor || '')
    .single()

  if (existing) {
    // Update quantity (ensure total doesn't exceed 99)
    const newQuantity = Math.min(existing.quantity + quantity, 99)
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
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
        quantity: quantity,
        size: sanitizedSize,
        color: sanitizedColor,
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
