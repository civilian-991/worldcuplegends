import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendContactConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { firstName, lastName, email, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Save contact message
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        subject,
        message,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send confirmation email
    await sendContactConfirmation(email, firstName, subject)

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
