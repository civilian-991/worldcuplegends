import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`id.ilike.%${search}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: orders, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    orders,
    total: count,
    limit,
    offset,
  })
}
