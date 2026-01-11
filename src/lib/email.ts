import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const itemsList = data.items
    .map((item) => `${item.name} x${item.quantity} - $${item.price.toFixed(2)}`)
    .join('\n')

  try {
    const result = await resend.emails.send({
      from: 'World Legends Cup <orders@worldlegendscup.com>',
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); padding: 30px; text-align: center;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">World Legends Cup 2026</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Thank you for your order, ${data.customerName}!</h2>

            <p style="color: #666;">Your order <strong>${data.orderId}</strong> has been confirmed and is being processed.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1a1a2e; margin-top: 0;">Order Details</h3>
              <pre style="font-family: monospace; white-space: pre-wrap;">${itemsList}</pre>

              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">

              <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Shipping:</strong> $${data.shipping.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Tax:</strong> $${data.tax.toFixed(2)}</p>
              <p style="margin: 5px 0; font-size: 18px;"><strong>Total:</strong> $${data.total.toFixed(2)}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1a1a2e; margin-top: 0;">Shipping Address</h3>
              <p style="color: #666; margin: 0;">
                ${data.shippingAddress.street}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
                ${data.shippingAddress.country}
              </p>
            </div>
          </div>

          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;">© 2026 World Legends Cup. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    const result = await resend.emails.send({
      from: 'World Legends Cup <welcome@worldlegendscup.com>',
      to: email,
      subject: 'Welcome to World Legends Cup 2026!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); padding: 30px; text-align: center;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">World Legends Cup 2026</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Welcome, ${firstName}!</h2>

            <p style="color: #666;">Thank you for joining the World Legends Cup community! You're now part of an exclusive group of football enthusiasts celebrating the greatest legends of the game.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: #1a1a2e; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Shop Now
              </a>
            </div>

            <p style="color: #666;">As a welcome gift, use code <strong>LEGEND10</strong> for 10% off your first order!</p>
          </div>

          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;">© 2026 World Legends Cup. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

export async function sendNewsletterWelcome(email: string) {
  try {
    const result = await resend.emails.send({
      from: 'World Legends Cup <newsletter@worldlegendscup.com>',
      to: email,
      subject: 'Welcome to the Legends Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); padding: 30px; text-align: center;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">World Legends Cup 2026</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a1a2e; margin-top: 0;">You're In!</h2>

            <p style="color: #666;">Thank you for subscribing to the World Legends Cup newsletter. You'll be the first to know about:</p>

            <ul style="color: #666;">
              <li>Exclusive merchandise drops</li>
              <li>Tournament updates and match schedules</li>
              <li>Special offers and discounts</li>
              <li>Behind-the-scenes content with football legends</li>
            </ul>

            <p style="color: #666;">As a thank you, here's <strong>10% off</strong> your next purchase. Use code: <strong style="color: #D4AF37;">NEWSLETTER10</strong></p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: #1a1a2e; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Shop Now
              </a>
            </div>
          </div>

          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;">© 2026 World Legends Cup. All rights reserved.</p>
            <p style="color: #666; margin-top: 10px; font-size: 12px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${email}" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error)
    return { success: false, error }
  }
}

export async function sendContactConfirmation(email: string, firstName: string, subject: string) {
  try {
    const result = await resend.emails.send({
      from: 'World Legends Cup <support@worldlegendscup.com>',
      to: email,
      subject: `We received your message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); padding: 30px; text-align: center;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">World Legends Cup 2026</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Hi ${firstName},</h2>

            <p style="color: #666;">Thank you for contacting us. We've received your message regarding "${subject}" and our team will get back to you within 24-48 hours.</p>

            <p style="color: #666;">In the meantime, you might find answers to common questions in our <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq" style="color: #D4AF37;">FAQ section</a>.</p>
          </div>

          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;">© 2026 World Legends Cup. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendShippingNotification(
  email: string,
  customerName: string,
  orderId: string,
  trackingNumber: string
) {
  try {
    const result = await resend.emails.send({
      from: 'World Legends Cup <shipping@worldlegendscup.com>',
      to: email,
      subject: `Your order ${orderId} has shipped!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); padding: 30px; text-align: center;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">World Legends Cup 2026</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Great news, ${customerName}!</h2>

            <p style="color: #666;">Your order <strong>${orderId}</strong> is on its way!</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0 0 10px;">Tracking Number:</p>
              <p style="color: #1a1a2e; font-size: 24px; font-weight: bold; margin: 0;">${trackingNumber}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order?order=${orderId}" style="background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: #1a1a2e; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Track Your Order
              </a>
            </div>
          </div>

          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;">© 2026 World Legends Cup. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send shipping notification email:', error)
    return { success: false, error }
  }
}
