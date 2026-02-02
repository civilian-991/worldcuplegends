import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendContactConfirmation } from '@/lib/email'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { contactFormSchema, formatZodError } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per hour per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimiters.contact.check(ip)
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate request body
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
    }

    const { firstName, lastName, email, subject, message } = validationResult.data

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
