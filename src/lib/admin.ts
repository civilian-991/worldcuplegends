import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { NextRequest, NextResponse } from 'next/server'
import { validateCsrfToken, CSRF_HEADER_NAME } from '@/lib/csrf'

type TypedSupabaseClient = SupabaseClient<Database>

export async function checkAdmin(): Promise<{
  supabase: TypedSupabaseClient
  user: { id: string; email?: string } | null
  isAdmin: boolean
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { supabase, user: null, isAdmin: false }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    return { supabase, user: null, isAdmin: false }
  }

  return { supabase, user, isAdmin: true }
}

/**
 * Validates CSRF token for admin API requests
 * Returns an error response if validation fails, null if valid
 */
export function validateAdminCsrf(request: NextRequest): NextResponse | null {
  const validation = validateCsrfToken(request)

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'CSRF validation failed' },
      { status: 403 }
    )
  }

  return null
}

// Re-export for convenience
export { CSRF_HEADER_NAME }
