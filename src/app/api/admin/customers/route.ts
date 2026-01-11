import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: customers, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get order stats for each customer
  const customersWithStats = await Promise.all(
    (customers || []).map(async (customer) => {
      const { data: orders } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('user_id', customer.id)
        .eq('payment_status', 'paid')

      const totalOrders = orders?.length || 0
      const totalSpent = orders?.reduce((sum, order) => sum + order.total, 0) || 0
      const lastOrderAt = orders?.length ? orders[orders.length - 1].created_at : null

      return {
        ...customer,
        totalOrders,
        totalSpent,
        lastOrderAt,
      }
    })
  )

  return NextResponse.json({
    customers: customersWithStats,
    total: count,
    limit,
    offset,
  })
}
