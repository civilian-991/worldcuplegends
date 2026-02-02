import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { checkoutSchema, formatZodError, type CheckoutInput } from '@/lib/validations'
import { sanitizeText } from '@/lib/sanitize'

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'WLC-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate request body
    const validationResult = checkoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
    }

    const { items, shippingAddress, email, couponCode }: CheckoutInput = validationResult.data

    // Sanitize shipping address to prevent XSS
    const sanitizedShippingAddress = {
      firstName: sanitizeText(shippingAddress.firstName),
      lastName: sanitizeText(shippingAddress.lastName),
      street: sanitizeText(shippingAddress.street),
      city: sanitizeText(shippingAddress.city),
      state: sanitizeText(shippingAddress.state),
      zipCode: sanitizeText(shippingAddress.zipCode),
      country: sanitizeText(shippingAddress.country),
      phone: shippingAddress.phone ? sanitizeText(shippingAddress.phone) : undefined,
    }

    // Sanitize order items
    const sanitizedItems = items.map(item => ({
      ...item,
      productName: sanitizeText(item.productName),
      size: item.size ? sanitizeText(item.size) : undefined,
      color: item.color ? sanitizeText(item.color) : undefined,
    }))

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 9.99
    const taxRate = 0.08 // 8% tax
    let discount = 0

    // Validate coupon if provided
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (coupon) {
        const now = new Date()
        const isExpired = coupon.expires_at && new Date(coupon.expires_at) < now
        const isMaxedOut = coupon.max_uses && coupon.used_count >= coupon.max_uses
        const meetsMinimum = !coupon.min_order_amount || subtotal >= coupon.min_order_amount

        if (!isExpired && !isMaxedOut && meetsMinimum) {
          if (coupon.type === 'percentage') {
            discount = subtotal * (coupon.value / 100)
          } else {
            discount = coupon.value
          }

          // Increment coupon usage
          await supabase
            .from('coupons')
            .update({ used_count: coupon.used_count + 1 })
            .eq('id', coupon.id)
        }
      }
    }

    const taxableAmount = subtotal - discount
    const tax = taxableAmount * taxRate
    const total = taxableAmount + shipping + tax

    // Get current user (optional - guest checkout allowed)
    const { data: { user } } = await supabase.auth.getUser()

    // Get Stripe client
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        email,
        items: JSON.stringify(items.map(i => ({ id: i.productId, qty: i.quantity }))),
      },
      receipt_email: email,
    })

    // Generate order ID
    const orderId = generateOrderId()

    // Create order in database with sanitized data
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user?.id || null,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        shipping,
        tax,
        total,
        shipping_address: {
          ...sanitizedShippingAddress,
          email,
        },
        stripe_payment_intent_id: paymentIntent.id,
      })

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items with sanitized data
    const orderItems = sanitizedItems.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Failed to create order items:', itemsError)
    }

    return NextResponse.json({
      orderId,
      clientSecret: paymentIntent.client_secret,
      total,
      subtotal,
      shipping,
      tax,
      discount,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
