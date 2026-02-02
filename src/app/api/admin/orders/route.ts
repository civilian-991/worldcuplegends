import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin'
import {
  toOrderDTOList,
  ORDER_SELECT_FIELDS,
  ORDER_ITEMS_SELECT_FIELDS,
  OrderListResponse
} from '@/lib/dto/order.dto'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { handleDatabaseError, CommonErrors } from '@/lib/api-errors'

const sanitizeSearch = (search: string) => search.replace(/[%_\\'"(){}[\]]/g, '');

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
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const limitParam = parseInt(searchParams.get('limit') || '50')
  const offsetParam = parseInt(searchParams.get('offset') || '0')
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100)
  const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam

  // Use explicit field selection instead of '*' to control data exposure
  // Order items also use explicit fields to avoid exposing unnecessary data
  let query = supabase
    .from('orders')
    .select(`
      ${ORDER_SELECT_FIELDS},
      order_items (${ORDER_ITEMS_SELECT_FIELDS})
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`id.ilike.%${sanitizeSearch(search)}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data: orders, error, count } = await query

  if (error) {
    return handleDatabaseError(error, 'orders')
  }

  // Transform to safe DTOs - masks payment IDs and addresses
  const safeOrders = toOrderDTOList(orders || [])

  const response: OrderListResponse = {
    orders: safeOrders,
    total: count,
    limit,
    offset,
  }

  return NextResponse.json(response)
}
