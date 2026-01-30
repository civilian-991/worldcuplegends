import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

const sanitizeSearch = (search: string) => search.replace(/[%_\\'"(){}[\]]/g, '');

interface ProfileRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

interface OrderRow {
  total: number
  created_at: string
}

export async function GET(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const limitParam = parseInt(searchParams.get('limit') || '50')
  const offsetParam = parseInt(searchParams.get('offset') || '0')
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100)
  const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (search) {
    const sanitized = sanitizeSearch(search)
    query = query.or(`email.ilike.%${sanitized}%,first_name.ilike.%${sanitized}%,last_name.ilike.%${sanitized}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: customers, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const customersList = (customers || []) as ProfileRow[]

  // Fetch all orders for these customers in a single query (fixes N+1 problem)
  const customerIds = customersList.map((c) => c.id)

  const { data: allOrders } = customerIds.length > 0
    ? await supabase
        .from('orders')
        .select('user_id, total, created_at')
        .in('user_id', customerIds)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: true })
    : { data: [] }

  // Group orders by user_id in memory
  const ordersByUserId = new Map<string, OrderRow[]>()
  for (const order of (allOrders || []) as (OrderRow & { user_id: string })[]) {
    const existing = ordersByUserId.get(order.user_id) || []
    existing.push({ total: order.total, created_at: order.created_at })
    ordersByUserId.set(order.user_id, existing)
  }

  // Map customers with their aggregated order stats
  const customersWithStats = customersList.map((customer) => {
    const ordersList = ordersByUserId.get(customer.id) || []
    const totalOrders = ordersList.length
    const totalSpent = ordersList.reduce((sum, order) => sum + Number(order.total), 0)
    const lastOrderAt = ordersList.length > 0 ? ordersList[ordersList.length - 1].created_at : null

    return {
      ...customer,
      totalOrders,
      totalSpent,
      lastOrderAt,
    }
  })

  return NextResponse.json({
    customers: customersWithStats,
    total: count,
    limit,
    offset,
  })
}
