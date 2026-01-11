import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Update order status
      const { data: order, error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .select(`
          *,
          order_items (*)
        `)
        .single()

      if (error) {
        console.error('Failed to update order:', error)
        break
      }

      // Send confirmation email
      if (order) {
        const shippingAddress = order.shipping_address as {
          firstName: string
          lastName: string
          email: string
          street: string
          city: string
          state: string
          zipCode: string
          country: string
        }

        await sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          customerEmail: shippingAddress.email,
          items: order.order_items.map((item: { product_name: string; quantity: number; price: number }) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          shippingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
          },
        })
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          status: 'cancelled',
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge

      if (charge.payment_intent) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'refunded',
          })
          .eq('stripe_payment_intent_id', charge.payment_intent)
      }

      break
    }
  }

  return NextResponse.json({ received: true })
}
