import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

/**
 * Server-side login endpoint with rate limiting
 * Rate limit: 5 attempts per 15 minutes per IP
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting - 5 attempts per 15 minutes per IP
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.login.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 401,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetAt / 1000).toString(),
        },
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    },
    {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetAt / 1000).toString(),
      },
    }
  )
}
