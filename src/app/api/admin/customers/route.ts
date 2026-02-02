import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'
import { toCustomerDTOList, CUSTOMER_SELECT_FIELDS, CustomerListResponse } from '@/lib/dto/customer.dto'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { handleDatabaseError, CommonErrors } from '@/lib/api-errors'

const sanitizeSearch = (search: string) => search.replace(/[%_\\'"(){}[\]]/g, '');

interface ProfileRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
}

interface OrderRow {
  total: number
  created_at: string
}

export async function GET(request: NextRequest) {
  // Apply rate limiting for admin read operations - 100 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminRead.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin } = await checkAdmin()

  if (!isAdmin) {
    return CommonErrors.unauthorized()
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const limitParam = parseInt(searchParams.get('limit') || '50')
  const offsetParam = parseInt(searchParams.get('offset') || '0')
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100)
  const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam

  // Use explicit field selection instead of '*' to avoid exposing phone, avatar_url, etc.
  let query = supabase
    .from('profiles')
    .select(CUSTOMER_SELECT_FIELDS, { count: 'exact' })
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (search) {
    const sanitized = sanitizeSearch(search)
    query = query.or(`email.ilike.%${sanitized}%,first_name.ilike.%${sanitized}%,last_name.ilike.%${sanitized}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: customers, error, count } = await query

  if (error) {
    return handleDatabaseError(error, 'customers')
  }

  const customersList = (customers || []) as ProfileRow[]

  // Fetch order stats for these customers in a single query (fixes N+1 problem)
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
  const ordersByUserId = new Map<string, { total: number; created_at: string }[]>()
  for (const order of (allOrders || []) as (OrderRow & { user_id: string })[]) {
    const existing = ordersByUserId.get(order.user_id) || []
    existing.push({ total: order.total, created_at: order.created_at })
    ordersByUserId.set(order.user_id, existing)
  }

  // Transform to safe DTOs - only includes necessary fields
  const customersWithStats = toCustomerDTOList(customersList, ordersByUserId)

  const response: CustomerListResponse = {
    customers: customersWithStats,
    total: count,
    limit,
    offset,
  }

  return NextResponse.json(response)
}
