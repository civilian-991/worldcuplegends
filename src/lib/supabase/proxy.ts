import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function updateSession(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)

  // If intl middleware wants to redirect, do that first
  if (intlResponse.headers.get('x-middleware-rewrite') || intlResponse.status !== 200) {
    return intlResponse
  }

  let supabaseResponse = intlResponse

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          // Copy intl headers
          intlResponse.headers.forEach((value, key) => {
            supabaseResponse.headers.set(key, value)
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get the pathname without the locale prefix for route checking
  const pathname = request.nextUrl.pathname
  const localeMatch = pathname.match(/^\/(en|br)/)
  const locale = localeMatch ? localeMatch[1] : 'en'
  const pathWithoutLocale = localeMatch ? pathname.replace(/^\/(en|br)/, '') || '/' : pathname

  // Protected routes
  const protectedPaths = ['/account', '/checkout']
  const adminPaths = ['/admin']
  const authPaths = ['/login', '/register', '/forgot-password']

  // Check if trying to access protected route without auth
  if (!user && protectedPaths.some(p => pathWithoutLocale.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    url.searchParams.set('redirect', pathWithoutLocale)
    return NextResponse.redirect(url)
  }

  // Check if trying to access admin route
  if (adminPaths.some(p => pathWithoutLocale.startsWith(p))) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('redirect', pathWithoutLocale)
      return NextResponse.redirect(url)
    }

    // Check admin role (we'll fetch from profiles table)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && authPaths.some(p => pathWithoutLocale.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/account`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
