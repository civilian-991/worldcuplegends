import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, validateAdminCsrf } from '@/lib/admin'
import { sendShippingNotification } from '@/lib/email'
import { updateOrderSchema, formatZodError } from '@/lib/validations'
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import { handleDatabaseError, CommonErrors } from '@/lib/api-errors'
import { logAdminAction, sanitizeForAudit } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting for admin read operations - 100 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminRead.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin } = await checkAdmin()
  const { id } = await params

  if (!isAdmin) {
    return CommonErrors.unauthorized()
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    return CommonErrors.notFound('Order')
  }

  return NextResponse.json({ order })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate CSRF token for state-changing operations
  const csrfError = validateAdminCsrf(request)
  if (csrfError) {
    return csrfError
  }

  // Apply rate limiting for admin write operations - 30 requests per minute
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.adminWrite.check(ip)

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const { supabase, isAdmin, user } = await checkAdmin()
  const { id } = await params

  if (!isAdmin || !user) {
    return CommonErrors.unauthorized()
  }

  // Fetch the existing order for audit logging
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return CommonErrors.invalidJson()
  }

  // Validate request body with Zod
  const validationResult = updateOrderSchema.safeParse(body)
  if (!validationResult.success) {
    return NextResponse.json(formatZodError(validationResult.error), { status: 400 })
  }

  const validatedData = validationResult.data
  const { status, tracking_number, notes } = validatedData

  // Only include fields that were actually provided
  const updateData: Record<string, unknown> = {}
  if (status !== undefined) updateData.status = status
  if (tracking_number !== undefined) updateData.tracking_number = tracking_number
  if (notes !== undefined) updateData.notes = notes

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return CommonErrors.badRequest('No valid fields provided for update')
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData as never)
    .eq('id', id)
    .select('*, order_items (*)')
    .single()

  if (error) {
    return handleDatabaseError(error, 'order')
  }

  // Log the update action to audit logs
  await logAdminAction(
    supabase,
    user.id,
    'update',
    'order',
    id,
    sanitizeForAudit(existingOrder),
    sanitizeForAudit(order),
    request
  )

  // Send shipping notification if status changed to shipped
  const orderData = order as { id: string; shipping_address: { firstName: string; lastName: string; email: string } } | null
  if (status === 'shipped' && tracking_number && orderData) {
    const shippingAddress = orderData.shipping_address

    try {
      await sendShippingNotification(
        shippingAddress.email,
        `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        orderData.id,
        tracking_number
      )
    } catch (emailError) {
      // Log error but don't fail the request - order was already updated
      console.error('Failed to send shipping notification:', emailError)
    }
  }

  return NextResponse.json({ order })
}
