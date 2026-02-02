import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import {
  generateCsrfToken,
  validateCsrfToken,
  requiresCsrfValidation,
  CSRF_COOKIE_NAME,
} from '@/lib/csrf'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle API routes with CSRF validation
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request)
  }

  // Handle page requests with session management and CSRF token generation
  const response = await updateSession(request)

  // Generate and set CSRF token for authenticated sessions
  return ensureCsrfToken(request, response)
}

/**
 * Handle API requests - validate CSRF for admin routes
 */
async function handleApiRequest(request: NextRequest): Promise<NextResponse> {
  // Check if this request requires CSRF validation
  if (requiresCsrfValidation(request)) {
    const validation = validateCsrfToken(request)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'CSRF validation failed' },
        { status: 403 }
      )
    }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

/**
 * Ensure CSRF token exists in cookies for the response
 */
function ensureCsrfToken(request: NextRequest, response: NextResponse): NextResponse {
  // Check if CSRF token already exists
  const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (!existingToken) {
    // Generate a new CSRF token
    const csrfToken = generateCsrfToken()

    // Set the CSRF token cookie
    // httpOnly: false so JavaScript can read it for AJAX requests
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // Token expires in 24 hours
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder images
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
