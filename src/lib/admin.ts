import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

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
