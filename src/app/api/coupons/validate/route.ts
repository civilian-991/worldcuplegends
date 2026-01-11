import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { code, orderTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
      return NextResponse.json({
        error: `Minimum order amount of $${coupon.min_order_amount.toFixed(2)} required`,
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (coupon.type === 'percentage') {
      discount = orderTotal * (coupon.value / 100)
    } else {
      discount = Math.min(coupon.value, orderTotal)
    }

    return NextResponse.json({
      valid: true,
      discount,
      type: coupon.type,
      value: coupon.value,
      code: coupon.code,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
