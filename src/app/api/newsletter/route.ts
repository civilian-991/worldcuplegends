import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendNewsletterWelcome } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
      }

      // Reactivate subscription
      await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true })
        .eq('id', existing.id)

      return NextResponse.json({ message: 'Subscription reactivated' })
    }

    // Create new subscription
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase() })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send welcome email
    await sendNewsletterWelcome(email)

    return NextResponse.json({ message: 'Successfully subscribed' })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
